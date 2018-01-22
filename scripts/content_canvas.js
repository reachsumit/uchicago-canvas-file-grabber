console.log("This is canvas!");

if ("files".indexOf(window.location.href.replace(/\//g, '') > -1))
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
	var response = {};
	response.type = "file";
	response.title = file_url
	response.link = download_link
	//console.log(response)
	chrome.runtime.sendMessage(response);
}
else{
	//This is not course page
	// below code fetches all the list of modules and their urls
	var modules = [];
	var module_urls = [];
	$("div.item-group-condensed").each(function(){
			modules.push($(this).attr("aria-label"));
			module_urls.push($(this).attr("data-module-url"));
	 });
	//console.log(modules.join('\r\n'));
	//console.log(module_urls.join('\r\n'));

	var topics = [];
	var topic_urls = [];
	//var test=$("div.item-group-condensed div.content ul.ig-list li div.ig-row a").attr("href");
	//console.log(test);
	$("div.item-group-condensed div.content ul.ig-list li div.ig-row a").each(function(){
			topics.push($(this).attr("aria-label"));
			topic_urls.push($(this).attr("href"));
	 });
	//console.log(topics.join('\r\n'));
	//console.log(topic_urls.join('\r\n'));
	//console.log(topics.length)
	//console.log(topic_urls.length)

}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	console.log("Whoa!");
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
	console.log(request)
  });
