function init() {
    // Open/switch to options page when extension icon is clicked
    chrome.browserAction.onClicked.addListener(openOptions);

    // Run autofill after the registration page updates
    chrome.tabs.onUpdated.addListener(runAutofill);
}

function openOptions() {
    let optionsURL = chrome.extension.getURL('options.html');
    let isInWindow = false;
    // Get all tabs in current window
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            // Check if options page is present in the window
            if (tab.url === optionsURL) {
                isInWindow = true;
                // if present, check if active (tab selected)
                if (!tab.active) {
                    // Set options page to active
                    chrome.tabs.update(tab.id, {active: true});
                    // Reset submit
                    chrome.storage.sync.set({'submit': 1});
                }
            }
        });
        // Create new tab if not present
        if (!isInWindow) {
            chrome.tabs.create({url: optionsURL});
        }
    });
}

function runAutofill(tabId, changeInfo, tab) {
    let regURL = 'http://ssbweb.kfupm.edu.sa/PROD8/bwckcoms.P_Regs';
    if (tab.url === regURL && tab.status === 'complete') {
        chrome.tabs.executeScript({file: "js/autofill.js"});
    }
}

init();