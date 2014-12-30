"use strict";

$(function() {
    
    var node = require('./main-node');
    var nwGui = require('nw.gui');
    node.init(nwGui);

    
    var showKeyboard = function() {
        var spawn = require('child_process').spawn;
        var child = spawn('cmd',['/c','C:\\Program Files\\Common Files\\microsoft shared\\ink\\TabTip.exe']);
    };
    
    var win = nwGui.Window.get();
    //win.isFullscreen = true;
    win.enterKioskMode();

    var mySound = new buzz.sound( "guide-sound", {
        formats: [ "ogg", "mp3"/*, "aac" */]
    });

    //mySound.play()
    //    .fadeIn()
    //    .loop()
    //    .bind( "timeupdate", function() {
    //        var timer = buzz.toTimer( this.getTime() );
    //        document.getElementById( "timer" ).innerHTML = timer;
    //    });

    window.playGuideSound = function playGuideSound(cb) {
        mySound.play();
        setTimeout(function() {
            cb();
        }, 3700);
    }
    
    function getQuery() {
        return $('.search-box').val();
    }
    
    $('.search-box').on('click', function() {
        showKeyboard();
    });
    
    $('.search-form').on('submit', function() {
        var query = getQuery();
        var soundDone = $.Deferred();
        var definitionFound = $.Deferred();
        var definition = null;
        resetAnimation();
        node.setClipboard(' ');
        playGuideSound(soundDone.resolve);
        node.getDefinition(query, function(err, result) {
            definition = result;
            definitionFound.resolve();
        });
        $.when(soundDone, definitionFound).done(function() {
            var textToShow;
            if(!definition) textToShow = 'Not found.';
            else textToShow = '\n' + definition.title + '\n\n' + definition.definition;
            // start the animated reveal of the definition
            resetAnimation();
            startAnimation(textToShow);
            // set the clipboard to read the definition
            node.setClipboard(textToShow);
        });
    });
    
    $('.stop-reading').on('click', function() {
        resetAnimation();
        node.setClipboard(' ');
    })

    var isAnimating = false;
    var definitionText = '';
    var fullText = '';
    var shownLength = 0;
    
    function resetAnimation() {
        isAnimating = false;
        definitionText = '';
        shownLength = 0;
    }
    
    function startAnimation(text) {
        fullText = text;
        isAnimating = true;
        requestAnimationFrame(doAnim);
    }
    
    function htmlEncode(value){
        //create a in-memory div, set it's inner text(which jQuery automatically encodes)
        //then grab the encoded contents back out.  The div never exists on the page.
        return $('<div/>').text(value).html();
    }

    function doAnim() {
        if(!isAnimating) return;
        
        shownLength++;
        var substring = fullText.slice(0, shownLength);
        $('.result-display').html(htmlEncode(substring).replace(/\n/g, '<br>'));
        if(shownLength >= fullText.length) isAnimating = false;
        
        if(isAnimating) requestAnimationFrame(doAnim);
    }
});
