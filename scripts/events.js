var data = {}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if(request.receiver == "background"){
		if(request.sender == "content"){
			//sendResponse({hello: "background events"});
			data[sender.tab.id] = {};
			data[sender.tab.id].tab = sender.tab.id;
			data[sender.tab.id].type = request.type;
			data[sender.tab.id].download = []
			data[sender.tab.id].download.push({title:request.title,link:request.link});
			sendResponse({hello: "background events"});
		}
		else if(request.sender == "popup"){
			sendResponse({hello: "your background events",data:data});
		}
	}
  });