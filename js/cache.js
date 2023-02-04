//file for all the cache functionality
// caches.open()
// caches.keys()
// caches.delete()
// caches.matchAll()
// cache.put()
// cache.match()

const CACHE = {
  cacheVersion: 1,
  cacheName: null, //this gets set in the init() method
  userName: 'regu0005', //replace this with your own username
  init() {
    //
    CACHE.cacheName = `filecache-${CACHE.userName}-${CACHE.cacheVersion}`;
  },
  put(name, filetype){
    return(caches
    .open(CACHE.cacheName)
    .then( (cache) => {
        
        let request = new Request(`./data/${name}`);
        let response = new Response(filetype, {
            status: 200,
            statusText: 'ok'
        });

        console.log("PUT: "+name + " file: " + filetype);

        // Put the file into 'Cache Storage' into the cachename 'cache-exercise.v1'
        cache.put(request,response);

        console.log("Response: "+response);
        // // Clean items and restore to default values
        // APP.cleanItems();

        // // Finally reload the files stored into the cachename 'cache-exercise.v1'
        // APP.getFiles();
        // return response;
        
    })
    .catch(console.warn));
  },
  listKeys(){
    return (
      caches
      .open(CACHE.cacheName)
      .then((cache) => {
          return cache.keys()
      }));
  },
  openCache(requestDisplay){
    let options = {
      ignoreSearch: true, //ignore the queryString
      ignoreMethod: true, //ignore the method - POST, GET, etc
      ignoreVary: false,  //ignore if the response has a VARY header
    };

    return (
      caches
      .open(CACHE.cacheName)
      .then(cache => {
        console.log("requestDisplay: ",requestDisplay);
          return(
            cache
            .match(requestDisplay, options)
            .then((response) => {
              // console.log("response text: ",response.text());
              return response.text();
            })
          )
      })
      .catch((err) => {
        console.log("Error: ",err)
      })

    );
  },
  deleteCache(deletefile){
    return (
      caches
      .open(CACHE.cacheName)
      .then((cache) => {
        return cache.delete(deletefile);
      })
      // .then(() => {
      //   //delete is complete
      //   APP.cleanItems();
      //   APP.getFiles();
      // })
    );
  }
};

export default CACHE;
