import CACHE from './cache.js';

//All the DOM functionality and control of the application happens in this file
//All the code dealing with the Cache is in the cache.js file.
const APP = {
  itemList: [],
  activeLI: '',
  displayFileName: '',
  deleteFileName: '',
  cachename: CACHE.init(),

  init() {
    //page loaded

    document.getElementById('itemForm').addEventListener('submit', APP.addItem);
    document.getElementById('btnItem').addEventListener('click', APP.addItem);
    document.getElementById('btnList').addEventListener('click', APP.saveListAsFile);

    // Review if exist files stored in the cache and display in a list if exist
    APP.generalReview();
  },
  generalReview() {
    // In this function are created the listeners of the items inside the list (li tag)
    // Also, is created the listener for the button 'Delete'

    let fileList = document.getElementById('file_list');
    fileList.addEventListener('click', function(e) {
      if (e.target.tagName === 'LI'){
        APP.displayFileName = e.target.id;
        APP.displayFileContents();
      }
      if (e.target.tagName === 'BUTTON'){
        APP.deleteFileName =  e.target.id;
        APP.deleteFileName = APP.deleteFileName.replace("btn_","");
        APP.deleteFile();
      }
    });

    fileList.innerHTML = "";

    CACHE.listKeys()
    .then((listOfRequests)=>{
        listOfRequests.forEach((request) => {
          let url = new URL(request.url);
          fileList.innerHTML += `<li id="${url.pathname}">${url.pathname} <button id="${url.pathname}">Delete</button></li>`;
        });

        APP.updateListeners();
    });

    // Clean items and restore to default values
    APP.cleanItems();

  },
  updateListeners(){
    let fileList = document.getElementById('file_list');
    fileList.addEventListener('click', function(e) {
      if (e.target.tagName === 'LI'){
        // let cacheFile = e.target.id;
        APP.displayFileName = e.target.id;
        APP.displayFileContents();
      }
      if (e.target.tagName === 'BUTTON'){
        APP.deleteFileName =  e.target.id;
        APP.deleteFileName = APP.deleteFileName.replace("btn_","");
        APP.deleteFile();
      }
    });
  },
  cleanItems(){
    // Clean the list of items in the interface

    // Clean item_list
    let list = document.getElementById('item_list');
    list.innerHTML = "";

    // Clean file_list
    let fileList = document.getElementById('file_list');
    fileList.innerHTML = "";

    // Clean any previuos content displayed into the section 'File Contents'
    let mContent = document.getElementById('content');
    mContent.innerHTML = "";

    // Clean the file to delete
    APP.deleteFileName = "";

    // Empty the array of items
    APP.itemList = [];
  },
  addItem(ev) {
    //add an item to the list

    ev.preventDefault();
    let item = document.getElementById('gItem').value;
    item = item.trim();
    if (!item) return;
    APP.itemList.push(item);
    APP.displayList();
  },
  displayList() {
    //populate the list of items

    let list = document.getElementById('item_list');
    if (APP.itemList.length === 0) {
      list.innerHTML = 'No Items currently.';
    } else {
      list.innerHTML = APP.itemList
        .map((txt) => {
          return `<li>${txt}</li>`;
        })
        .join('');
    }
    document.getElementById('gItem').value = '';
  },
  saveListAsFile(ev) {
    ev.preventDefault();
    //turn the data from the list into the contents for a json file
    //and then create a file with the json
    //and then create a response object to hold the file
    //and then save the response in the cache

    // Generate the file name to be stored
    let fileName = Date.now();
    fileName = fileName + ".json";
    
    if (APP.itemList.length != 0) {

      // Format the itemList into a JSON format
      let itemListJSON = JSON.stringify(APP.itemList);

      // Prepare the file as application/json
      let fileJson = new File([itemListJSON], fileName, { type: 'application/json' });

      CACHE.put(fileName,fileJson)
        .then((res) => {
          // Clean items and restore to default values
          APP.cleanItems();

          // Finally reload the files stored into the cachename 
          APP.getFiles(); 
        })
        .catch( (err) => {
          console.log('Error',err);
        });
    }

  },
  getFiles() {
    //Display all files stored in the 'Cache Storage' inside the cachename 
    //loop through response matches and display the file names

    // FILE LIST
    let fileList = document.getElementById('file_list');
    fileList.innerHTML = "";
    
    // List the files stored in the cache and show them as a list inside li tag
    CACHE.listKeys()
      .then((listOfRequests)=>{
          listOfRequests.forEach((request) => {
            let url = new URL(request.url);
            fileList.innerHTML += `<li id="${url.pathname}">${url.pathname} <button id="${url.pathname}">Delete</button></li>`;
          })
      });

  },
  displayFileContents() {
    // Show the file names from the cache as a list.
    // each list item contains a span for the file name plus a button for deleting the file from the cache
    let requestDisplay = APP.displayFileName;

    let mContent = document.getElementById('content');
    
    CACHE.openCache(requestDisplay)
    .then((obj) => {
      mContent.innerHTML = "Content: " + JSON.parse(obj);
    });
    
  },
  deleteFile() {
    //user has clicked on a button in the file list
    //delete the file from the cache using the file name
    //remove the list item from the list if successful
    //clear the code contents

    CACHE.deleteCache(APP.deleteFileName)
    .then((res) => {
       //delete is complete
       location.reload();
    })
    .catch( (err) => {
      console.log('Error',err);
    });

  },
};

document.addEventListener('DOMContentLoaded', APP.init);
