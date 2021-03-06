// TODO: send message after limit is reached to stop listening
function runAutofill() {
    /*
     submissionNumber - number of times registration page has to be submitted
     */
    chrome.storage.sync.get(function (storage) {
        let limit = Object.keys(storage).length;
        let submissionNumber = storage.submit;
        if (submissionNumber <= limit) {
            let crnList = storage['sub-' + submissionNumber];
            autoFill(crnList, submissionNumber, false);
        } else {
            // Send message to background.js
        }
    });
}

function autoFill(crnList, submissionNumber, resubmit) {
    // Check if list is not undefined and not empty
    if (crnList && crnList.length > 0) {
        let id = "";
        for (let i = 0; i < crnList.length; i++) {
            id = 'crn_id' + (i + 1);
            document.getElementById(id).value = crnList[i];
        }

        autoSubmit(submissionNumber, resubmit);
    }
}

function autoSubmit(submissionNumber, resubmit) {
    submissionNumber++; // Update submit
    chrome.storage.sync.set({ 'submit': submissionNumber }, function () {
        if (submissionNumber === 2 || resubmit) {
            document.getElementById('id____UID2').click();
        }
    });
}

function clearEntries() {
    let id = "";
    for (let i = 1; i <= 10; i++) {
        id = 'crn_id' + i;
        let value = document.getElementById(id).value;
        if (value) {
            document.getElementById(id).value = "";
        }
    }
}

function resubmit(submissionNumber) {
    chrome.storage.sync.get(function (storage) {
        let crnList = storage['sub-' + submissionNumber];
        clearEntries();
        autoFill(crnList, submissionNumber, true);
    });
}

window.addEventListener('keydown', function (e) {
    let pressedKey = e.keyCode;

    // Resubmit a particular submission
    // if (pressedKey >= 49 && pressedKey <= 53) {
    //     pressedKey -= 48;
    //     resubmit(pressedKey);
    // }

    // Submit if user presses enter key
    if (pressedKey === 13) {
        document.getElementById('id____UID2').click();
    }
});

runAutofill();