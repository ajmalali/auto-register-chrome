// TODO: send message after limit is reached to stop listening
function runAutofill() {
    /*
     submissionNumber - number of times registration page has to be submitted
     */
    chrome.storage.sync.get(function (storage) {
        let limit = Object.keys(storage).length;
        let submissionNumber = storage.submit;
        if (submissionNumber <= limit) {
            document.getElementById('enterCRNs-tab').click();
            let crnList = storage['sub-' + submissionNumber];
            autoFill(crnList, submissionNumber, false);
        }
    });
}

function autoFill(crnList, submissionNumber, resubmit) {
    // Check if list is not undefined and not empty
    if (crnList && crnList.length > 0) {
        let id = "";
        for (let i = 0; i < crnList.length; i++) {
            id = 'txt_crn' + (i + 1);
            document.getElementById(id).value = crnList[i];
            document.getElementById('addAnotherCRN').click();
        }

        document.getElementById('addCRNbutton').click();
        setTimeout(function () {
            autoSubmit(submissionNumber, resubmit);
        }, 1000)
    }
}

function autoSubmit(submissionNumber, resubmit) {
    document.getElementById('saveButton').click();
    //submissionNumber++; // Update submit
    // chrome.storage.sync.set({'submit': submissionNumber}, function () {
    //     if (submissionNumber === 2 || resubmit) {
    //         document.getElementById('id____UID3').click();
    //     }
    // });
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

function initListeners() {
    window.addEventListener('keydown', function (e) {
        let pressedKey =  e.key;
        // Resubmit a particular submission
        if (Number(pressedKey) >= 1 && Number(pressedKey) <= 5) {
            resubmit(pressedKey);
        }

        // Submit if user presses enter key
        if (pressedKey === 'Enter') {
            document.getElementById('id____UID3').click();
        }
    });

    //  This is done when selecting the term. Reset 'submit' whenever the term is changed.
    const continueButton = document.getElementById('term-go');
    if (continueButton) {
        continueButton.addEventListener('click', function () {
            chrome.storage.sync.set({'submit': 1});
        });
    }
}

//initListeners();
runAutofill();