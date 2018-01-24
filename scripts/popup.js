var currentTab;
var global_button_links;
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
	$("button").click(function() { //This will attach the function to all the input elements
	   console.log($(this).attr('id')); //This will grab the id of the element and alert. Although $(this).id also work, I like this way.
	});
	String.prototype.trunc = String.prototype.trunc ||
      function(n){
          return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this;
		};
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
	$("#startProcess").hide();
}
function request_download(down_id){
	for(i=0;i<global_button_links[down_id].length;i++){
		console.log(global_button_links[down_id][i].link_next.download_link);
	}
}

function dummy(){
	console.log("dummy called");

	for(i=0;i<3;i++){
		$('body').append('<div style="margin: auto;width: 50%;"><button type="button" id="'+String(i)+'" class="btn btn-info" style="margin-top:10px;">Primary</button></div>');
	}
	$("button").click(function() {
		request_download(this.id); // or alert($(this).attr('id'));
	});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	  if(request.receiver!="background"){
		//console.log(request)
		//console.log(request.data[currentTab.id])
		var button_titles = [];
		var button_links = [];
		make_popup_free();
		if(request.data[currentTab.id].type == "batch"){				
			Object.entries(request.data[currentTab.id].download).forEach(([key, val]) => {
				if(val.topics.length>0){
						button_titles.push(key);          // the name of the current key.
						button_links.push(val.topics);          // the value of the current key.
				}
			});
			global_button_links = button_links;
			for(i=0;i<button_titles.length;i++){
				$('body').append('<div style="margin: auto;width: 70%;"><button type="button" id="'+String(i)+'" class="btn btn-info" style="margin-top:10px;">'+button_titles[i].trunc(22)+'</button></div>');
			}
			$("button").click(function() {
				request_download(this.id); // or alert($(this).attr('id'));
			});
		}else if(request.data[currentTab.id].type == "file"){
		//
		}
		//$('body').append('<div>Download link</div>');
	  }
});
