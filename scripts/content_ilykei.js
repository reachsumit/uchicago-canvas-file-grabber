console.log("This is ilykei!");
var injected = false;
var download_side = [];
var download_main = [];
var directoryName = "";

function download_all(){
	console.log("Going to download all!!!!");
	var msg = {};
	msg.sender = "content_ilykei";
	msg.receiver = "background";
	msg.destination = "background";
	msg.type = "download_main";
	msg.download = download_main;
	msg.folder = directoryName;
	chrome.runtime.sendMessage(msg, function(response) {
	  console.log(response.received_by.concat(" heard me."));
	});
}

function download_single(){
	console.log("Just download the side bar!!!!");
	var msg = {};
	msg.sender = "content_ilykei";
	msg.receiver = "background";
	msg.destination = "background";
	msg.type = "download_side";
	msg.download = download_side;
	msg.folder = directoryName;
	chrome.runtime.sendMessage(msg, function(response) {
	  console.log(response.received_by.concat(" heard me."));
	});
}

function scrapeThePage(){
	console.log("Scraping ilykei!");
	if (window.location.href.search(/lectures/) != -1){
		/*TODO: Figure out a way to get lecture content without having to go to the tab*/
		title = $("tbody a.ng-binding").html();
		url = $("tbody a.ng-binding").attr("href");
		console.log(title);
		full_url = "https://ilykei.com".concat(url);
		console.log(full_url);
		$.get(url, function(response) {
			  console.log(response);
		});
	}
	else if (window.location.href.search(/lecture/) != -1){
		if(injected == false){
			$("ol.breadcrumb").append('<li><a ui-sref="#" class="ng-binding" href="#" id="downloadAll">Download All Lecture Material</a></li>');
			$( "#downloadAll" ).unbind( "click" );
			document.getElementById("downloadAll").addEventListener("click", download_all, false);
			$("ul.list-group").prepend('<li ng-repeat="document in lecture.documents" ng-hide="document.hide" class="list-group-item ng-scope" style=""><a id="downloadSide" ng-href="#" href="#"><div class="filename ng-binding">Download All Sidebar Documents</div><span class="glyphicon glyphicon-download-alt pull-right"></span></a></li>');
			$( "#downloadSide" ).unbind( "click" );
			document.getElementById("downloadSide").addEventListener("click", download_single, false);
			injected = true;
		}
		
		$("ul.list-group a").each(function(){
			download_side.push({link:$(this).attr("href"),name:$(this).find("div").text().replace(/[^a-z0-9.(),';{}+&^%\[\]$#@!~`+-]/gi, '_')});
		});
		$("div#lectureDoc").find("a").each(function(){
			link = $(this).attr("href");
			title = $(this).text().replace(/[^a-z0-9.(),';{}+&^%\[\]$#@!~`+-]/gi, '_');
			if(link.search(/fileProxy/) != -1){
				download_main.push({link:link,name:title});
			}
		});
		directoryName = $("h1.title p").text().replace(/(\r\n|\n|\r)/gm,"_");
		var msg = {};
		msg.sender = "content_ilykei";
		msg.receiver = "background"; // we don't want content to directly pick it up as events has to do certain adjustments to this data
		msg.destination = "popup";
		msg.type = "scraping_done";
		
		chrome.runtime.sendMessage(msg, function(response) {
		  console.log(response.received_by.concat(" heard me."));
		});
	}
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if(request.data.destination=="content_ilykei"){
		console.log(request);
		if(request.action=="scrape"){
			scrapeThePage();
		}
	}
  }
);