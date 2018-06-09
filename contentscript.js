var frame = document.createElement('iframe');
frame.src = chrome.extension.getURL('frame.html');
frame.id = "SekiFrame";
frame.frameBorder = "0";
frame.height = "100";
document.getElementById('radical_area').appendChild(frame);
