// TODO: add registration website to manifest.json
function executeScript() {
    console.log("Window loaded");
    /*
    submit - To check how many times the page has been submitted/reloaded
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
}

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
        $.bootstrapGrowl((submit - 1) + " times submitted");
        document.getElementById('id____UID3').click();
    });
}

executeScript();

window.addEventListener("keydown", function () {
    $.bootstrapGrowl("testing");
});