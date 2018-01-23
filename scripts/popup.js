var currentTab;
function startProcess() {
	make_popup_busy();
	console.log("sending request to background")
	var msg = {};
	msg.sender = "popup";
	msg.receiver = "background";
	msg.action = "scrape";
	msg.tab = currentTab;

	chrome.runtime.sendMessage(msg, function(response) {
	  console.log(response);
	  //console.log(response.hello.concat(" heard me."));
	  //console.log(response.data);
	  //make_popup_free();
	});
	//chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	//  chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
	//	console.log("events received at popup from background with payload:");
	//    console.log(response.hello);
	//  });
	//});
}

document.getElementById('startProcess').onclick = startProcess;

$(document).ready(function(){
	$("#waiting").hide();
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  currentTab = tabs[0]; // there will be only one in this array
	  tab_id = currentTab.id;	  // also has properties like currentTab.id
	  tab_url = currentTab.url;
	  indicate_start(tab_id,tab_url);
	});
});

function indicate_start(tab_id,tab_url){
	console.log(tab_id,tab_url);
	if ((tab_url.search(/canvas.uchicago.edu/) != -1)&&((tab_url.search(/modules/) != -1) || (tab_url.search(/files/)!=-1))){
		document.getElementById('pText').innerHTML = "Hello! Please use the process button to parse this page.";
	}
	else{
		document.getElementById('pText').innerHTML = "Sorry! This webpage is currently not supported :(";
		$("#startProcess").hide();
		$("#notSupported").show();
	}
}

function make_popup_busy(){
	$("#startProcess").hide();
	$("#waiting").show();
	$("#pText").text("Please wait! This might take a few seconds.");
}

function make_popup_free(){
	$("#waiting").hide();
	$("#pText").text("Your downloads are ready! :)");
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	  if(request.receiver!="background"){
		console.log(request)
		console.log(request.data[currentTab.id])
		make_popup_free();
		//$('body').append('<div>Download link</div>');
	  }
});
