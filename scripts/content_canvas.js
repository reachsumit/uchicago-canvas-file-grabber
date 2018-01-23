console.log("This is canvas!");

if (window.location.href.search(/files/) != -1)
{
	// This is a files page
	var file = $("div#content div span a").attr("href");
	var file_url = $("div#content div span a").html();
	var download_link = window.location.protocol.concat("//",window.location.hostname,"/",file)
	//console.log(download_link)
	//window.open(download_link, "_blank")
	//window.location = download_link;
	var msg = {};
	msg.sender = "content";
	msg.receiver = "background";
	msg.type = "file";
	msg.title = file_url
	msg.link = download_link
	chrome.runtime.sendMessage(msg, function(response) {
	  console.log(response.hello.concat(" heard me."));
	});
}
else if (window.location.href.search(/modules/) != -1){
	//This is not course page
	// below code fetches all the list of modules and their urls

	download = {}
	$("div.item-group-condensed").each(function(){
			modules_name = $(this).attr("aria-label");
			module_url = $(this).attr("data-module-url");
			module_id = $(this).attr("id");
			if($("div".concat("#",module_id)).find("div.ig-header div.ig-header-admin div.completion_status i.icon-lock").attr("title")=="Locked"){
				download[modules_name] = {};
				download[modules_name].module = modules_name;
				download[modules_name].module_url = module_url;
				download[modules_name].topics = []

				var link_next;
				jQuery.ajaxSetup({async:false});
				$("div".concat("#",module_id)).find("div.content ul.ig-list li").each(function(){
					li_id = $(this).attr("id");
					if($(this).attr("class").search(/external_url/)==-1 && $(this).attr("class").search(/assignment/)==-1){
						$("li".concat("#",li_id)).find("div.ig-row div.ig-info div.module-item-title span.item_name a").each(function(){
							//console.log(module_id);
							//console.log($(this).attr("href"));
							$.get($(this).attr("href"), function(response) {
							  link_next = {download_link:$(response).find("div#content div span a").attr("href"),download_title:$(response).find("div#content div span a").html().trim()};
							});
						download[modules_name].topics.push({title:$(this).text().trim(),link:$(this).attr("href"),link_next:link_next});
						});
					}
				});
				jQuery.ajaxSetup({async:true});
			}
	 });
	 //console.log(download);
	
	var msg = {};
	msg.sender = "content";
	msg.receiver = "background";
	msg.type = "batch";
	msg.download = download;
	
	chrome.runtime.sendMessage(msg, function(response) {
	  console.log(response.hello.concat(" heard me."));
	});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
	console.log(request)
  });
