document.addEventListener('DOMContentLoaded', function() {
    //Wait for the button press
    var button = document.getElementById("KanjiButton");
    var Kanji = document.getElementById('KanjiBox');
    button.addEventListener('click', function() {
        start_script(Kanji.value);
    }, false);
    Kanji.addEventListener('keypress', function(e){
        var key = e.which || e.keyCode;
        if (key == 13){
            start_script(Kanji.value);
        }
    }, false);
}, false);

function start_script(Kanji){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {file: 'seki.js'}, function() {
            chrome.tabs.sendMessage(tabs[0].id, Kanji);
        });
    });
}
