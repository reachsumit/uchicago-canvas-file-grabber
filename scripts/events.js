var data = {}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if(request.receiver == "background"){
		if(request.sender == "content"){
			console.log("content has finished scraping");
			//sendResponse({hello: "background events"});
			data[sender.tab.id] = {};
			data[sender.tab.id].tab = sender.tab.id;
			data[sender.tab.id].type = request.type;
			data[sender.tab.id].download = [];
			if(request.type=="file"){
				data[sender.tab.id].download.push({title:request.title,link:request.link});
			}else{
				data[sender.tab.id].download = request.download;
			}
			sendResponse({hello: "background events"}); // though no response is required to be sent to content script
			console.log("sending scraped data to popup");
			console.log(data);
			chrome.runtime.sendMessage({data:data});
		}
		else if(request.sender == "popup"){
			console.log("asking content to start scraping");
			  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
					chrome.tabs.sendMessage(tabs[0].id, {action: request.action}, function(response) {});  
			  });
			  console.log("Sending back dummy ack to popup in response to start scraping.");
			sendResponse({hello: "background events"});
		}
		
	}
  });