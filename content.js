const EVENTS = {
  "SELECTION":'SELECTION',
  'SHAREDNOTE':'SHARED_NOTE'
}

const MAIN_URL  = "https://notesit.netlify.app";

(async function(){

    const {origin} = window.location;

    if(origin == MAIN_URL){

      const url = new URLSearchParams(window.location.search);
      var q = url.get("q");
      browser.runtime.sendMessage({event:EVENTS['SHAREDNOTE'],data:q},function(response){
      let className = response ? ".success" : ".error";
      let el = document.querySelector(className);
      el.style.display = 'block';
          setTimeout(() => {
            el.style.display = 'none';
          },3000)
        
      });
      

    }

    browser.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.event === EVENTS['SELECTION']){
        let selection = window.getSelection();
        sendResponse(selection.toString());
      }
        
    }
  );

  
})();