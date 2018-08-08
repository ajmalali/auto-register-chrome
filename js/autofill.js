// TODO: add registration website to manifest.json
window.addEventListener('onload', function () {
    console.log("Window loaded");
    /*
    submit - To check how many times the page has been submitted
     */
    chrome.storage.sync.get(function (storage) {
        console.log("In storage get");
        let limit = Object.keys(storage).length;
        let submit = storage.submit;
        if(submit <= limit) {
            let list = storage['sub-' + submit];
            autoFill(list, submit);
        }
    });
});

function autoFill(list, submit) {
    // Check if list is not undefined and not empty
    if (list && list.length > 0) {
        let id = "";
        for (let i = 0; i < list.length; i++) {
            id = 'crn_id' + (i + 1);
            document.getElementById(id).value = list[i];
        }

        autoSubmit(submit);
    }
}

function autoSubmit(submit) {
    submit++; // Update submit
    chrome.storage.sync.set({'submit': submit}, function () {
        alert((submit - 1) + " times submitted");
        document.getElementById('REG_BTN').click();
    });
}

// document.addEventListener("DOMContentLoaded", function() {
//     var script = document.createElement('script');
//     script.src = chrome.extension.getURL('script.js');
//     (document.head||document.documentElement).appendChild(script);
//     script.parentNode.removeChild(script);
// });