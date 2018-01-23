var currTab;
function changeText() {
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var currentTab = tabs[0]; // there will be only one in this array
  console.log(currentTab.id); // also has properties like currentTab.id
});
document.getElementById('pText').innerHTML = "World is changing!";
console.log("sending request to background")
var msg = {};
msg.sender = "popup";
msg.receiver = "background";
msg.type = "test";

	chrome.runtime.sendMessage(msg, function(response) {
	  console.log(response.hello.concat(" heard me."));
	  console.log(response.data);
	});

//chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//  chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
//	console.log("events received at popup from background with payload:");
//    console.log(response.hello);
//  });
//});
}

document.getElementById('b1').onclick = changeText;
