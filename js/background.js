// Open options page when extension icon is clicked
// add checks so that it opens only once
chrome.browserAction.onClicked.addListener(function () {
   let optionsURL = chrome.extension.getURL('options.html');
   chrome.tabs.create({url: optionsURL});
});