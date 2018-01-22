var info;

function changeText() {
document.getElementById('pText').innerHTML = "World is changing!";
console.log("sending request")
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {method: "get"}, function(response) {
    console.log(response);
  });
});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
	
	info = request.title;
  });

document.getElementById('d1').innerHTML = info;
