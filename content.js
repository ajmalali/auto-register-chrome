window.onload = function() {
    console.log("Window loaded");
    chrome.storage.sync.get(['reload', 'mainList', 'backupList'], function (storage) {
        console.log("In storage get");
        let mainList = storage.mainList;
        let backupList = storage.backupList;
        let reload = storage.reload;
        // 1 == main CRNs
        if(reload === 1) {
            console.log("reload 1");
            autoFill(mainList, reload);
        }
        // 2 == backup CRNs
        else if (reload === 2) {
            console.log("reload 2");
            autoFill(backupList, reload);
        }
    });
};

function autoFill(list, reload) {
    // Check if list is not undefined and not empty
    if(list && list.length > 0) {
        let id = "";
        for(let i = 0; i < list.length; i++) {
            id = 'crn_id' + (i+1);
            document.getElementById(id).value = list[i];
        }
        
        autoSubmit(reload);
    }
}

function autoSubmit(reload) {
    reload++; // Update reload
    chrome.storage.sync.set({'reload': reload}, function () {
        alert((reload-1) + " times submitted");
        document.getElementById('REG_BTN').click();
    });
}

// document.addEventListener("DOMContentLoaded", function() {
//     var script = document.createElement('script');
//     script.src = chrome.extension.getURL('script.js');
//     (document.head||document.documentElement).appendChild(script);
//     script.parentNode.removeChild(script);
// });