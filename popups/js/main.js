function deleteNote(element){

               chrome.storage.local.get(['data'], function(result) {

                              $(`div[data-title="${element}"]`).remove();
                              let data = result.data;
                              delete data[element];
          

                 chrome.storage.local.set({data:data})




               })


}

chrome.storage.onChanged.addListener(function(changes, namespace) {
  $("div.note").remove();
  setData();
});

function setData(){

               chrome.storage.local.get(['data'], function(result) {
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
 
  chrome.storage.local.get(['data'], function(result) {

    
    let data = result.data;
    $(node.parentNode).remove();
    data[`${el}`]["content"] = data[`${el}`]['content'].filter((item) => {
      return item.content.trim() !== nodeContent.trim();
    });

    chrome.storage.local.set({data:data});


  })
}

setData();

$("#search").on("keyup",function(e){

  onSearch(e.target.value);

})

function onSearch(e){
  $(".note").remove();
  var val = e.toLowerCase();
  chrome.storage.local.get(['data'], function(result) {
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


$("#exportData").on("click",function(){

  let allNotes = document.querySelectorAll('div.note');

  chrome.storage.local.get(['data'], function(result) {

    let content = result.data;
    let fileContent = '';
    allNotes.forEach((item) => {

      let data_title = item.getAttribute("data-title");
     
      fileContent += `${data_title}\n\n`;
      content[data_title]['content'] && content[data_title]['content'].forEach((text) => {
    
        fileContent += `${text.content}\n\n`
    
      });
    
      fileContent += "\n\n"
    
    
     })

     let blob = new Blob([fileContent],{type: "text/plain"});
     var url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url: url, // The object URL can be used as download URL
        filename:"my-notes.txt"
      });
  
  })


})


