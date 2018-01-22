console.log("This is canvas!");

if ("files".indexOf(window.location.href.replace(/\//g, '')) > -1)
{
	// This is a files page
	var file = $("div#content div span a").attr("href");
	var file_url = $("div#content div span a").html();
	console.log(file);
	console.log(file_url);
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
	//console.log(msg)
	//chrome.runtime.sendMessage(msg);
	chrome.runtime.sendMessage(msg, function(response) {
	  console.log(response.hello.concat(" heard me."));
	});
}
else{
	//This is not course page
	// below code fetches all the list of modules and their urls

	download = {}
	$("div.item-group-condensed").each(function(){
			modules_name = $(this).attr("aria-label");
			module_url = $(this).attr("data-module-url");
			module_id = $(this).attr("id");
			download[modules_name] = {};
			download[modules_name].module = modules_name;
			download[modules_name].module_url = module_url;
			download[modules_name].topics = []
			
			var link_next;
			jQuery.ajaxSetup({async:false});
			$("div".concat("#",module_id)).find("div.content ul.ig-list li div.ig-row div.ig-info div.module-item-title span.item_name a").each(function(){
				$.get($(this).attr("href"), function(response) {
				  console.log( {title:$(response).find("div#content div span a").attr("href"),link:$(response).find("div#content div span a").html().trim()});
				});
				download[modules_name].topics.push({title:$(this).text().trim(),link:$(this).attr("href"),link_next:link_next});
			});
			jQuery.ajaxSetup({async:true});
	 });
	 console.log(download);
	
	
	/*jQuery.ajaxSetup({async:false});
	for(i=0;i<4;i++){
		$.get(topic_urls[i], function(response) {
		  download.push({title:$(response).find("div#content div span a").attr("href"),link:$(response).find("div#content div span a").html().trim()});
		});
	}
	jQuery.ajaxSetup({async:true});
	*/
	
	//var msg = {};
	//msg.sender = "content";
	//msg.receiver = "background";
	//msg.type = "batch";
	//msg.download = download;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	console.log("Whoa!");
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
	console.log(request)
  });
