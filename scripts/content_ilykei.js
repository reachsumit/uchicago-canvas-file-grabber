console.log("This is ilykei!");
var injected = false;

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
		/*
		$("tbody a.ng-binding").each(function(){
			lecture_title = $(this).html();
			lecture_url = $(this).attr("href");
			$.get(lecture_url, function(response) {
			  console.log($(response).html());
			});
		});
		*/
	}
	else if (window.location.href.search(/lecture/) != -1){
		download = [];
		if(injected == false){
			$("ol.breadcrumb").append('<li><a ui-sref="test_match()" class="ng-binding" href="test_match()">Download All Lecture Material</a></li>');
			$("ul.list-group").prepend('<li ng-repeat="document in lecture.documents" ng-hide="document.hide" class="list-group-item ng-scope" style=""><a ng-href="#" target="_blank" href="#" onclick="sidebar_download()"><div class="filename ng-binding">Download All Sidebar Items</div></a></li>');
			injected = true;
		}
		return;
		$("ul.list-group").append('<li ng-repeat="document in lecture.documents" ng-hide="document.hide" class="list-group-item ng-scope" style=""><a ng-href="#" target="_blank" href="#" onclick="sidebar_download()"><div class="filename ng-binding">Download All</div><span class="glyphicon glyphicon-list-alt pull-right"></span></a></li>');
		$("ul.list-group a").each(function(){
			download.push({link:$(this).attr("href"),name:$(this).find("div").text()});
		});
		var msg = {};
		msg.sender = "content_ilykei";
		msg.receiver = "background";
		msg.destination = "background";
		msg.type = "save_lecture";
		msg.download = download;
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

function test_match(){
	console.log("WORKSSSSSSSSSSSSSSSS!!!!");
}