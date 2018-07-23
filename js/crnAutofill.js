// TODO: add registration website to manifest.json
window.onload = function() {
    console.log("Window loaded");
    /*
    submit - To check how many times the page has been submitted
    mainlist - The main CRN list
    backuplist - The backup CRN list
     */
    chrome.storage.sync.get(['submit', 'mainList', 'backupList'], function (storage) {
        console.log("In storage get");
        let mainList = storage.mainList;
        let backupList = storage.backupList;
        let submit = storage.submit;
        // 1 - main CRNs
        if(submit === 1) {
            autoFill(mainList, submit);
        }
        // 2 - backup CRNs
        else if (submit === 2) {
            autoFill(backupList, submit);
        }
    });
};

function autoFill(list, submit) {
    // Check if list is not undefined and not empty
    if(list && list.length > 0) {
        let id = "";
        for(let i = 0; i < list.length; i++) {
            id = 'crn_id' + (i+1);
            document.getElementById(id).value = list[i];
        }
        
        autoSubmit(submit);
    }
}

function autoSubmit(submit) {
    submit++; // Update submit
    chrome.storage.sync.set({'submit': submit}, function () {
        alert((submit-1) + " times submitted");
        document.getElementById('REG_BTN').click();
    });
}

// document.addEventListener("DOMContentLoaded", function() {
//     var script = document.createElement('script');
//     script.src = chrome.extension.getURL('script.js');
//     (document.head||document.documentElement).appendChild(script);
//     script.parentNode.removeChild(script);
// });