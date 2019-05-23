//  This is done when selecting the term. Reset 'submit' whenever the term is changed.
const continueButton = document.getElementById('term-go');
if (continueButton) {
    continueButton.addEventListener('click', function () {
        chrome.storage.sync.set({'submit': 1});
    });
}