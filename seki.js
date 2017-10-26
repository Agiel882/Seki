function BuildURL(Kanji){
	return "http://jisho.org/search/" + Kanji + "%23kanji";
}

chrome.runtime.onMessage.addListener(
  function KanjiReceive(message, sender, sendResponse) {
	var URL = BuildURL(message);
	fetch(URL).then(function(response){
		response.text().then(function(result) {
			//parse the document and pull relevant info from it.
			var parser = new DOMParser()
			var d = parser.parseFromString(result, "text/html");
			var RadicalClass = d.getElementsByClassName('radicals');
			var Radicals = RadicalClass[1].getElementsByTagName('A');
			var NumRads = Radicals.length;
			//create radical list
			var RadReturn = [];
			for(i = 0; i < NumRads; i++){
				RadReturn.push(Radicals[i].text)
			}
			var RadicalList = document.getElementsByClassName("radical_table clearfix")[0].childNodes;
			var length = RadicalList.length;
			var Rads = RadReturn.length;
			//open the radical table and iterate through it to activate the radicals in the list
			for(i = 0; i < RadicalList.length; i++){
				for(j = 0; j < Rads; j++){
					(function (i, j, RadicalList, RadReturn){
						if(RadicalList[i].textContent == RadReturn[j]){
							setTimeout(function(){
								RadicalList[i].click();
							},　j*500);
						}
					})(i, j, RadicalList, RadReturn);
				}
			}
		})
	})
	chrome.runtime.onMessage.removeListener(arguments.callee);
 });
