function init() {
    let mainNode = document.getElementById('main');
    let backupNode = document.getElementById('backup');
    // Display saved CRNs
    chrome.storage.sync.get(['mainList', 'backupList'], function (storage) {
        let mainList = storage.mainList;
        let backupList = storage.backupList;
        displayCRNS(mainList, mainNode);
        displayCRNS(backupList, backupNode);
    });

    // Submit - number of times registration page has to be submitted
    chrome.storage.sync.set({'submit': 1});

    document.getElementById('add-main').addEventListener('click', function () {
        // Save to chrome storage
        saveCRNS('mainList', mainNode);
    });

    document.getElementById('add-backup').addEventListener('click', function () {
        // Save to chrome storage
        saveCRNS('backupList', backupNode);
    });

    // Clear all for modal button
    document.querySelector('#confirm-modal button.btn-outline-danger').addEventListener('click', clearAll);
}

function createListItem(content) {
    let li = document.createElement('li');
    li.setAttribute('class', 'list-group-item add');
    let text = document.createTextNode(content);
    li.appendChild(text);
    return li;
}

function appendCRN(list, node) {
    let index = node.children.length;
    let listItem;
    for (let i = index; i < list.length; i++) {
        listItem = createListItem(list[i]);
        addRemoveButton(listItem);
        node.appendChild(listItem);
    }
}

function hasNumber(string) {
    return /\d/.test(string);
}

function addRemoveButton(element) {
    let removeButton = document.createElement('img');
    removeButton.setAttribute('src', 'icons/clear-button.png');
    removeButton.setAttribute('title', 'Remove CRN');
    removeButton.addEventListener('click', function () {
        element.classList.add('remove');
        // remove element after the animation ends
        element.addEventListener('animationend', function () {
            removeFromNode(element);
        });
    });
    element.appendChild(removeButton);
}

function removeFromNode(element) {
    let parent = element.parentNode;
    let index = Array.prototype.indexOf.call(parent.childNodes, element);

    if (parent.id === 'main') {
        removeFromList(parent, element, 'mainList', index);
    } else {
        removeFromList(parent, element, 'backupList', index);
    }
}

function removeFromList(parent, element, list, index) {
    let options = {type: 'danger', delay: 1300};
    chrome.storage.sync.get(list, function (storage) {
        let updatedList = storage[list];
        updatedList.splice(index, 1);
        chrome.storage.sync.set({[list]: updatedList}, function () {
            parent.removeChild(element);
            notify(element.textContent + " removed", options);
            if (!parent.hasChildNodes()) {
                parent.appendChild(createListItem('This list is empty'));
            }
        });
    });
}

function displayCRNS(list, node) {
    // check if list is defined
    if (list && list.length > 0) {
        // check if node is empty by checking its first child
        if (!hasNumber(node.children[0].textContent)) {
            removeChildren(node);
            // append all crns to the node
            let listItem;
            list.forEach(function (crn) {
                // add remove button to each CRN li
                listItem = createListItem(crn);
                addRemoveButton(listItem);
                node.appendChild(listItem);
            });
        } else {
            // append only the new crns to the node
            appendCRN(list, node);
        }
    } else {
        removeChildren(node);
        node.appendChild(createListItem("This list is empty"));
    }
}

function removeChildren(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

function clearAll() {
    // Clear inputs
    document.getElementById('crn-input').value = "";
    document.getElementById('crn-input').value = "";
    // Clear list group
    let main = document.getElementById('main');
    let backup = document.getElementById('backup');
    removeChildren(main);
    removeChildren(backup);
    // Set empty list message
    main.appendChild(createListItem('This list is empty'));
    backup.appendChild(createListItem('This list is empty'));
    // Clear chrome storage
    chrome.storage.sync.clear(function () {
        notify("Everything cleared", {type: 'danger', delay: 2000})
    });

    // Set submit to 1
    chrome.storage.sync.set({'submit': 1});
}

function clearInput() {
    document.getElementById('crn-input').value = "";
}

function notify(message, options) {
    $.bootstrapGrowl(message, options);
}

function isValid(value) {
    let valid = false;
    let regex = /[a-zA-Z!@#$%^&*.]+/;
    let invalidOption = {type: 'danger', delay: 2000, width: 'auto'};
    let noInputOption = {type: 'info', delay: 2000, width: 'auto'};

    // check if there is input
    if(value) {
        // check if the string contains one or more of the above characters
        // (using regex will slow down performance a bit)
        if (!regex.test(value)) {
            valid = true;
        } else {
            // Invalid input notification
            clearInput();
            notify('Please enter a valid CRN', invalidOption);
            valid = false;
        }
    } else {
        // No input notification
        notify('Please enter a CRN', noInputOption);
        valid = false;
    }

    return valid;
}

// TODO: update max list length
function addToList(oldList = [], newList) {
    let addedOption = {type: 'success', delay: 1000};
    let invalidOption = {type: 'danger', delay: 3000, width: 'auto'};
    let maxLength = 10;

    for (let i = 0; i < newList.length; i++) {
        if (oldList.length < maxLength) {
            oldList.push(newList[i]);
            notify(newList[i] + ' added', addedOption);
        } else {
            notify('You cannot register more than ' + maxLength + ' CRNs', invalidOption);
            return oldList;
        }
    }

    // changes are made to oldList
    return oldList;
}

function saveCRNS(list, node) {
    let input = document.getElementById('crn-input').value;

    if (isValid(input)) {
        // match everything that is not whitespace and convert to array
        let newList = input.match(/\S+/g);

        chrome.storage.sync.get(list, function (storage) {
            // update existing list if any
            if (storage[list] && storage[list].length > 0) {
                newList = addToList(storage[list], newList);
            } else {
                // add to new list
                newList = addToList(undefined, newList);
            }
            // Store new/updated lists
            chrome.storage.sync.set({[list]: newList}, function () {
                displayCRNS(newList, node);
            });
        });
    }
    // Clear input
    clearInput();
}

init();