
browser.storage.onChanged.addListener(onChanged);
let exportDataBtn = document.getElementById("exportData");
function onChanged(changes, namespace) {
  $("div.note").remove();
  setData();
}

function deleteNote(element){

  browser.storage.local.get(['data'], function(result) {

                 $(`div[data-title="${element}"]`).remove();
                 let data = result.data;
                 delete data[element];


    browser.storage.local.set({data:data})




  })


}

function setData(){

               browser.storage.local.get(['data']).then(function(result) {
                              
                              let notes = Object.keys(result.data);
                              var template = jQuery("#result").html();
                              notes.length?$("#exportData").removeAttr("disabled"):$("#exportData").attr("disabled",true);
                              notes.forEach(element => {

                                             var html = Mustache.render(template,{
                                                            title:element,
                                                            ...result.data[element]
                                             });
                                             $(document.body).append(html);
                                             $(`div[data-title="${element}"] header .row .note__title`).click(function(){
                                                            $(`div[data-title="${element}"] .note_sublist`).toggle();
                                             });
                                             $(`div[data-title="${element}"] header .row .note__delete`).click(function(){
                                                            deleteNote(element)
                                                            
                                             });
                                             $(`div[data-title="${element}"] .note_sublist .content__delete`).click(function(){
                                                            deleteContent(element,this);     
                                             });
                                             $(`div[data-title="${element}"] .note_sublist .content__share`).click(function(){
                                                generateLink(element,this);     
                                            });
                              
                              });
               
               });

}


function deleteContent(el,node){
  let nodeContent = node.getAttribute("data-content");
 
  browser.storage.local.get(['data']).then(function(result) {

    
    let data = result.data;
    $(node.parentNode).remove();
    data[`${el}`]["content"] = data[`${el}`]['content'].filter((item) => {
      return item.content.trim() !== nodeContent.trim();
    });

    browser.storage.local.set({data:data});


  })
}

setData();

$("#search").on("keyup",function(e){

  onSearch(e.target.value);

})

function onSearch(e){
  $(".note").remove();
  var val = e.toLowerCase();
  browser.storage.local.get(['data']).then(function(result) {
    let notes = Object.keys(result.data);
    var template = jQuery("#result").html();
    notes = val?notes.filter((element) => element.toLocaleLowerCase().includes(val)):notes;
    notes.length?$("#exportData").removeAttr("disabled"):$("#exportData").attr("disabled",true);
    notes.forEach(element => {
                   var html = Mustache.render(template,{
                                  title:element,
                                  ...result.data[element]
                   });
                   $(document.body).append(html);
                   $(`div[data-title="${element}"] header .row .note__title`).click(function(){
                                  $(`div[data-title="${element}"] .note_sublist`).toggle();
                   });
                   $(`div[data-title="${element}"] header .row .note__delete`).click(function(){
                                  deleteNote(element);
                                  
                   });
                   $(`div[data-title="${element}"] .note_sublist .content__delete`).click(function(){
                                  deleteContent(element,this);     
                   });
                   $(`div[data-title="${element}"] .note_sublist .content__share`).click(async function(){
                                  shareLink(element,this);
                   })
    
    });

});
}


exportDataBtn.addEventListener("click",async function(){

  this.setAttribute("disabled",true);

  var worker = new Worker('js/worker.js');
  let {data} = await browser.storage.local.get(['data']);
  var self = this;

  worker.postMessage(data);
  
  worker.onmessage = function(e) {

     let {data} = e;
     let blob = new Blob([data.content],{type: "text/plain"});
     let url = URL.createObjectURL(blob);
      browser.downloads.download({
        url: url,
        filename:"my-notes.txt"
      });

      self.removeAttribute("disabled");
   };
   
  

  
   


})


