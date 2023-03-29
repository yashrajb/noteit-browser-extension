import { CryptoJS } from './cryptojs/aes.min.js';
import { EVENTS,MAIN_URL } from './constants.js';

browser.runtime.onInstalled.addListener(onInstalled);

browser.contextMenus.onClicked.addListener(onClickedContext);

browser.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if(msg.event == EVENTS['SHAREDNOTE']){
    sharedNote(msg.data,sendResponse);
  }
  return true;
});


async function onInstalled(details){
  if(details.reason == "install"){
          await browser.storage.local.set({data:{}}).catch((e) => console.log('Error on onInstalled Function in background.js',e))
  }
  browser.contextMenus.create({
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
      const response = await browser.tabs.sendMessage(tab.id, {event: info.menuItemId});
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
            const result = await browser.storage.local.get(['data']);
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
          
          await browser.storage.local.set({data});
          resolve(true);
        }catch(e){

            reject(false);

        }
  })

 
  
      
}
