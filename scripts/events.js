var data = {} // to be sent later to the popup

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
	if(request.receiver == "background"){
		// if the sender is content_ilykei
		if(request.sender == "content_ilykei"){
			// if the request is to download sidebar or main body documents
			if(request.type.startsWith("download_")){
				console.log(request);
				for(i=0;i<request.download.length;i++){
					if(request.download[i].link.length>3){
						if(request.type=="download_side"){
							actual_link = 'http://ilykei.com'.concat(request.download[i].link);
							chrome.downloads.download({url: actual_link,filename:request.folder.concat("/",request.download[i].name)});
						}
						else if(request.type=="download_main"){
							newArr = request.download[i].link.split("%2F");
							if(request.folder.length>3){
								chrome.downloads.download({url: request.download[i].link,filename:request.folder.concat("/",newArr[newArr.length-1])});
							}else{
								chrome.downloads.download({url: request.download[i].link,filename:newArr[newArr.length-1]});
							}
						}
					}
				}
			}
			// scraping is complete; ask popup to remove the waiting screen now
			else if(request.type == "scraping_done"){
				console.log("content has finished scraping");
				data[sender.tab.id] = {};
				data[sender.tab.id].tab = sender.tab.id;
				data[sender.tab.id].type = request.type;
				chrome.runtime.sendMessage({receiver:request.destination,data:data});
			}
			sendResponse({received_by: "background events"});
			return;
		}
		if(request.sender == "popup"){
			// if the sender is popup and destination is content, e.g. request to start scraping the webpage
			if(request.destination.startsWith('content')){
				console.log("asking content to start scraping/download");
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
						chrome.tabs.sendMessage(tabs[0].id, {action: request.action,data:request}, function(response) {
							var lastError = chrome.runtime.lastError;
							if (lastError) {
								console.log(lastError.message);
								sendResponse({received_by: "none"});
								// 'Could not establish connection. Receiving end does not exist.'
								return;
							}
							sendResponse({received_by: "scraper"});
						});  
				});
			}else{
				console.log(request.tab)
				console.log("in")
				if(String(request.tab.id) in data){
					console.log("scraping is alrady done. sending results.");
					chrome.runtime.sendMessage({status:"scraping_done",receiver:"popup",data:data});
				}
				else{
					console.log("scraping needs to be done.");
					chrome.runtime.sendMessage({status:"unknown",receiver:"popup"});			
				}
			}
		}
		// if the sender is content (canvas; for now) and destination is popup, e.g. send scraped data to popup to generate buttons
		else {
			if(request.destination == "popup"){
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
				console.log("saving scraped data in background");
				console.log(data);
				chrome.runtime.sendMessage({status:"scraping_done",receiver:"popup",data:data});
			}
		}
	}
}
);