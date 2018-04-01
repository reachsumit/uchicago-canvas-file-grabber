easter_egg = false;

if(easter_egg==true){
var today = new Date();
// This section is an easter egg for April Fool's day.
if(today.getDate()==1&&today.getMonth()==3){
	if(window.location.href == "https://canvas.uchicago.edu/"){
		$("#DashboardCard_Container").before("<h4 style='display: inline;color:#800000;'><b>Important Notice:</b> MScA course will be a part of Booth School of Business, w.e.f. 01 April 2018.</h4><a href='http://home.uchicago.edu/~sumitk/msca.html' target='_blank'>  Read the Official Announcement Here</a>");
	}
} 
}

function scrapeThePage(){
	console.log("Scraping canvas!");

	if (window.location.href.search(/files/) != -1)
	{
		// This is a files page
		var file_url = $("div#content div span a").attr("href");
		var file = $("div#content div span a").html();
		var download_link = window.location.protocol.concat("//",window.location.hostname,"/",file_url)
		
		var msg = {};
		msg.sender = "content_canvas";
		msg.receiver = "background"; // we don't want content to directly pick it up as events has to do certain adjustments to this data
		msg.destination = "popup";
		msg.type = "file";
		msg.title = file;
		msg.link = download_link
		chrome.runtime.sendMessage(msg, function(response) {
		  console.log(response.received_by.concat(" heard me."));
		});
	}
	else if (window.location.href.search(/modules/) != -1){
		//This is not modules page
		download = {}
		$("div.item-group-condensed").each(function(){
				modules_name = $(this).attr("aria-label");
				module_url = $(this).attr("data-module-url");
				module_id = $(this).attr("id");
				//Find module
				if($(this).find("div.ig-header div.ig-header-admin div.completion_status i.icon-lock").attr("title")=="Locked"){
					download[modules_name] = {};
					download[modules_name].module = modules_name;
					download[modules_name].module_url = module_url;
					download[modules_name].topics = []

					// For each module take out the file details
					var link_next;
					jQuery.ajaxSetup({async:false});
					$(this).find("div.content ul.ig-list li").each(function(){
						li_id = $(this).attr("id");
						if($(this).attr("class").search(/attachment/)!=-1){
							$(this).find("div.ig-row div.ig-info div.module-item-title span.item_name a").each(function(){
								$.get($(this).attr("href"), function(response) {
								  link_next = {download_link:$(response).find("div#content div span a").attr("href"),download_title:$(response).find("div#content div span a").html().trim(),download_filename:$(response).find("h2").text()};
								});
							download[modules_name].topics.push({title:$(this).text().trim(),link:$(this).attr("href"),link_next:link_next});
							});
						}
						// TODO: Add support for scraping assignments module
						/*
						else if($(this).attr("class").search(/assignment/)!=-1){
							$("li".concat("#",li_id)).find("div.ig-row div.ig-info div.module-item-title span.item_name a").each(function(){
								$.get($(this).attr("href"), function(response) {
									$(response).find("div.description").find("a").each(function(){
										link_next = {download_link:$(this).attr("href"),download_title:$(this).attr("title"),download_filename:$(this).text()};
								  });
								});
							download[modules_name].topics.push({title:$(this).text().trim(),link:$(this).attr("href"),link_next:link_next});
							});
						}
						*/
					});
					jQuery.ajaxSetup({async:true});
				}
		 });
		 //console.log(download);
		
		var msg = {};
		msg.sender = "content_canvas";
		msg.receiver = "background"; // we don't want content to directly pick it up as events has to do certain adjustments to this data
		msg.destination = "popup";
		msg.type = "batch";
		msg.download = download;
		
		chrome.runtime.sendMessage(msg, function(response) {
		  console.log(response.received_by.concat(" heard me."));
		});
	}
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	//console.log(request);
	if(request.data.destination=="content_canvas"){
		if(request.action=="scrape"){
			sendResponse({received_by: "scraper"});
			scrapeThePage();
		}
	}
  }
);