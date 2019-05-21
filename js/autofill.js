// TODO: send message after limit is reached to stop listening
function runAutofill() {
    /*
     submissionNumber - number of times registration page has to be submitted
     */
    chrome.storage.sync.get(function (storage) {
        let limit = Object.keys(storage).length;
        let submissionNumber = storage.submit;
        if (submissionNumber <= limit) {
            // Click ENTER CRNs Tab
            document.getElementById('enterCRNs-tab').click();
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
            id = 'txt_crn' + (i + 1);
            document.getElementById(id).value = crnList[i];
            document.getElementById('addAnotherCRN').click();
        }

        // Click Add to Summary button
        document.getElementById('addCRNbutton').click();
        // Submit after 1 second to ensure all CRNs are added
        setTimeout(function () {
            autoSubmit(submissionNumber, resubmit);
        }, 1000)
    }
}

function autoSubmit(submissionNumber, resubmit) {
    submissionNumber++; // Update submit
    chrome.storage.sync.set({'submit': submissionNumber}, function () {
        if (submissionNumber === 2 || resubmit) {
            document.getElementById('saveButton').click();
        }
    });
}

function initListeners() {
    window.addEventListener('keydown', function (e) {
        let pressedKey =  e.key;
        // Submit if user presses enter key
        if (pressedKey === 'Enter') {
            document.getElementById('saveButton').click();
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

initListeners();
runAutofill();