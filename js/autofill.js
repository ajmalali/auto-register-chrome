// TODO: send message after limit is reached to stop listening
function executeAutofill() {
    /*
    submit - To check how many times the page has been submitted
     */
    chrome.storage.sync.get(function (storage) {
        let limit = Object.keys(storage).length;
        let submit = storage.submit;
        if (submit <= limit) {
            let list = storage['sub-' + submit];
            autoFill(list, submit, false);
        }
    });
}

function autoFill(list, submit, resubmit) {
    // Check if list is not undefined and not empty
    if (list && list.length > 0) {
        let id = "";
        for (let i = 0; i < list.length; i++) {
            id = 'crn_id' + (i + 1);
            document.getElementById(id).value = list[i];
        }

        autoSubmit(submit, resubmit);
    }
}

function autoSubmit(submit, resubmit) {
    submit++; // Update submit
    chrome.storage.sync.set({'submit': submit}, function () {
        if (submit === 2 || resubmit) {
            document.getElementById('id____UID3').click();
        }
    });
}

function clearEntries() {
    let id = "";
    for (let i = 1; i <= 10; i++) {
        id = 'crn_id' + i;
        document.getElementById(id).value = "";
    }
}

function resubmit(key) {
    chrome.storage.sync.get(function (storage) {
        let list = storage['sub-' + key];
        clearEntries();
        autoFill(list, key, true);
    });
}

window.addEventListener('keydown', function (e) {
    let key = e.keyCode;

    // Resubmit a particular submission
    if (key >= 49 && key <= 53) {
        key -= 48;
        resubmit(key)
    }

    // Submit if user presses enter key
    if (key === 13) {
        document.getElementById('id____UID3').click();
    }
});

executeAutofill();