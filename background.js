import { CryptoJS } from './cryptojs/aes.min.js';

const MAIN_URL  = "https://notesit.netlify.app/notes/"
chrome.runtime.onInstalled.addListener(function(details){
               if(details.reason == "install"){
   
                       chrome.storage.local.set({data:{}},function(resultOfData){})
               }
               chrome.contextMenus.create({
                id: "main",
                title: "Note It",
                contexts:["selection"]
              });
              
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "main") {
    chrome.storage.local.get(['data'], function(result) {
      

      let data = JSON.parse(JSON.stringify(result)).data;
      let encryptedContent = CryptoJS.AES.encrypt(JSON.stringify({title:tab.title,content:info.selectionText,url:tab.url}),'').toString();
      if(data[`${tab.title}`]){

                     data[`${tab.title}`]['content'].push({
                       content:info.selectionText,
                       shareurl:`${MAIN_URL}?q=${encodeURIComponent(encryptedContent)}`
                     });
      }else{

                     data[`${tab.title}`] = {
                                    title:tab.title,
                                    url:tab.url,
                                    content:[{
                                      content:info.selectionText,
                                      shareurl:`${MAIN_URL}?q=${encodeURIComponent(encryptedContent)}`
                                     }]
                     }
      }
 
      chrome.storage.local.set({data:data})
 
   });
  }
});