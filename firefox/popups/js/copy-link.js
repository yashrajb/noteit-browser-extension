var copyLink = new ClipboardJS('.share__link');
var copyContent = new ClipboardJS('.copy__content');

copyLink.on('success',(e) => onSuccess(e,"copied link!"));
copyContent.on('success',(e) => onSuccess(e,"copied note!"));

function onSuccess(e,message) {
    

    (function(){


        
        $("#copied-text").html(message).css({"display":"block"});

        setTimeout(function(){ 
            $("#copied-text").html('').css({"display":"none"}); 
        }, 1000);


    })()   

    
}
