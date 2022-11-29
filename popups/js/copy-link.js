var clipboard = new ClipboardJS('.share__link');

clipboard.on('success', function(e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

    (function(){


        $("#copied-text").css({"display":"block"});

        setTimeout(function(){ $("#copied-text").css({"display":"none"}); }, 3000);


    })()   

    //e.clearSelection();
});


clipboard.on('error', function(e) {
               console.error('Action:', e.action);
               console.error('Trigger:', e.trigger);
});