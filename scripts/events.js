var data = {}
var data_ilykei_lecture = []
var data_ilykei_lectures = []

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
	if(request.receiver == "background"){
		if(request.sender == "content_ilykei"){
			if(request.type == "save_lecture"){
				console.log(request);
				data_ilykei_lecture = request.download;
			}
			sendResponse({received_by: "background events"});
		}
		
		if(request.destination.startsWith('content')){
			console.log("asking content to start scraping/download");
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
					chrome.tabs.sendMessage(tabs[0].id, {action: request.action,data:request}, function(response) {});  
			});
			sendResponse({received_by: "background events"});
		}
		else if(request.destination == "popup"){
			console.log("content has finished scraping");
			data[sender.tab.id] = {};
			data[sender.tab.id].tab = sender.tab.id;
			data[sender.tab.id].type = request.type;
			data[sender.tab.id].download = [];
			if(request.type=="file"){
				data[sender.tab.id].download.push({title:request.title,link:request.link});
			}else{
				data[sender.tab.id].download = request.download;
			}
			sendResponse({received_by: "background events"}); // though no response is required to be sent to content script
			console.log("sending scraped data to popup");
			console.log(data);
			chrome.runtime.sendMessage({receiver:request.destination,data:data});
		}
	}
}
);