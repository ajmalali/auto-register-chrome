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
        for (let i = 0; i < crnList.length; i++) {
            document.getElementById('txt_crn' + (i + 1)).value = crnList[i]
            if (i < crnList.length - 1)
                document.getElementById('addAnotherCRN').click()
        }
  
        const MutationObserver = window.MutationObserver
                              || window.WebKitMutationObserver
                              || window.MozMutationObserver
        
        // Submit after all crns loaded
        const button = document.getElementById('saveButton')
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === "disabled") {
                    button.click()
                    observer.disconnect()
                }
            })
        })
        observer.observe(button, { attributes: true })
        // Click Add to Summary button
        document.getElementById('addCRNbutton').click()
    }
}

function autoSubmit(submissionNumber, resubmit) {
    document.getElementById('saveButton').click();
    // submissionNumber++; // Update submit
    // chrome.storage.sync.set({'submit': submissionNumber}, function () {
    //     if (submissionNumber === 2 || resubmit) {
    //         document.getElementById('saveButton').click();
    //     }
    // });
}

function initListeners() {
    window.addEventListener('keydown', function (e) {
        let pressedKey =  e.key;
        // Submit if user presses enter key
        if (pressedKey === 'Enter') {
            document.getElementById('saveButton').click();
        }
    });
}

initListeners();
runAutofill();
