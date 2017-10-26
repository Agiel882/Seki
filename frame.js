document.addEventListener('DOMContentLoaded', function() {
  //Wait for the button press
  var button = document.getElementById("KanjiButton");
  button.addEventListener('click', function() {
	var Kanji = document.getElementById('KanjiBox').value;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  		chrome.tabs.executeScript(tabs[0].id, {file: 'seki.js'}, function() {
			chrome.tabs.sendMessage(tabs[0].id, Kanji);
  		});
	});
	}, false);
}, false);
