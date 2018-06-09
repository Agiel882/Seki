function BuildURL(Kanji){
	return "https://jisho.org/search/" + Kanji + "%23kanji";
}
function results_timeout (ms, promise){
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            resolve('Timed out in '+ ms + 'ms.')
        }, ms)
    })
    return Promise.race([promise, timeout])
}

chrome.runtime.onMessage.addListener(
async function KanjiReceive(message, sender, sendResponse) {
	var URL = BuildURL(message);
    /* query Jisho for the Kanji info page's DOM, set up relevant variables
     * for the script
     */
    var response = await fetch(URL)
	var result = await response.text()
	var parser = new DOMParser()
	var d = parser.parseFromString(result, "text/html");
	var RadicalClass = d.getElementsByClassName('radicals');
	var Radicals = RadicalClass[1].getElementsByTagName('A');

    /* Set up an observer on the suggetions box for the kanji. When
     * the suggestion box changes, the observer sets the mutflag to 1,
     * signaling to the script that a change has occurred.
     */
    var mutflag = 0;
    var observer = new MutationObserver(function(mutations) {
        for(var mutation of mutations) {
            if (mutation.type == 'subtree'){
                mutflag = 1;
            }
        }
    });
    var suggestions = document.getElementsByClassName('results_wrapper');
    observer.observe(suggestions[0], {attributes: true, subtree: true});

	//create a list of the radicals returned by our GET request
	var RadReturn = [];
    var num_radicals = Radicals.length;
	for(i = 0; i < num_radicals; i++){
		RadReturn.push(Radicals[i].text)
	}
	var RadicalList = document.getElementsByClassName("radical_table clearfix")[0].childNodes;
	var length = RadicalList.length;
	var Rads = RadReturn.length;
	//open the radical table and iterate through it to activate the radicals in the list
	for(i = 0; i < length; i++){
		for(j = 0; j < Rads; j++){
			if(RadicalList[i].textContent == RadReturn[j]){
					RadicalList[i].click();
                    /* Clicking on the radical updates the results at the top of
                     * the box. If the radicals are clicked too quickly the box
                     * can't keep up, so we wait for the mutation to occur.
                     */
                    const results_update = new Promise((resolve, reject) => {
                        if(mutflag == 1){
                            resolve(1);
                        }
                    });
                    var wait = await results_timeout(300, results_update);
                    mutflag = 0;
			}
		}
	}
    observer.disconnect()
    chrome.runtime.onMessage.removeListener(arguments.callee);
})
