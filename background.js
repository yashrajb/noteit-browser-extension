import { CryptoJS } from './cryptojs/aes.min.js';
import { EVENTS,MAIN_URL } from './constants.js';

chrome.runtime.onInstalled.addListener(onInstalled);

chrome.contextMenus.onClicked.addListener(onClickedContext);

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if(msg.event == EVENTS['SHAREDNOTE']){
    sharedNote(msg.data,sendResponse);
  }
  return true;
});


async function onInstalled(details){
  if(details.reason == "install"){
          await chrome.storage.local.set({data:{}}).catch((e) => console.log('Error on onInstalled Function in background.js',e))
  }
  chrome.contextMenus.create({
    id: EVENTS['SELECTION'],
    title: "Note It",
    contexts:["selection"]
  });
}

async function sharedNote(data,sendResponse){
    try {
      let decryptedContent = CryptoJS.AES.decrypt(data,'');
      decryptedContent = decryptedContent.toString(CryptoJS.enc.Utf8);
      let res = await addNote(JSON.parse(decryptedContent));
      return sendResponse(res)
    }catch(e){
      return sendResponse(false);
    }

}

async function onClickedContext(info, tab) {

  if (info.menuItemId != EVENTS['SELECTION']) {
    return;
  }
      const response = await chrome.tabs.sendMessage(tab.id, {event: info.menuItemId});
      await addNote({
        title:tab.title,
        content:response,
        url:tab.url
      })
}


function addNote({
  title,
  content,
  url
}){

  return new Promise(async (resolve,reject) => {
          try {
            const result = await chrome.storage.local.get(['data']);
            let data = JSON.parse(JSON.stringify(result)).data; 
            let encryptedContent = CryptoJS.AES.encrypt(JSON.stringify({title,content,url}),'').toString(); 
            let shareurl = `${MAIN_URL}/notes/?q=${encodeURIComponent(encryptedContent)}`;
            if(data[`${title}`]){
          
                          data[`${title}`]['content'].push({
                            content,
                            shareurl
                          });
            }else{
          
                          data[`${title}`] = {
                                          title,
                                          url,
                                          content:[{
                                            content,
                                            shareurl
                                          }]
                          }
            }
          
          await chrome.storage.local.set({data});
          resolve(true);
        }catch(e){

            reject(false);

        }
  })

 
  
      
}
