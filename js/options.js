function init() {
    // Display saved CRNs
    chrome.storage.sync.get(function (storage) {
        console.log(storage);
        let list, node;
        let nodeList = Object.keys(storage);
        for (let i = 0; i < nodeList.length - 1; i++) {
            list = storage[nodeList[i]];
            node = document.getElementById(nodeList[i]);
            node.closest('div.card').classList.remove('hidden');
            displayCRNS(list, node);
        }
    });

    // Submit - number of times registration page has to be submitted
    chrome.storage.sync.set({'submit': 1});

    // Add CRN button
    let addButtons = document.querySelectorAll('.add-btn');
    addButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            let ol = button.previousElementSibling;
            saveCRNS(ol.id, ol);
        });
    });

    // Add backups
    document.getElementById('add-backup').addEventListener('click', addBackup);

    // Initialize hide/show buttons
    initHideButtons();

    // Initialize delete/trash buttons
    initDeleteButtons();

    // Clear all for modal button
    document.querySelector('#confirm-modal button.btn-outline-danger').addEventListener('click', clearAll);
}

function initHideButtons() {
    // Hide/Show buttons
    let hideButtons = document.querySelectorAll(".hide-btn");
    hideButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            let div = this.closest('div.card-body').querySelector('.crn-list');
            div.classList.toggle('hide');
            this.classList.toggle('rotate');
        });
    });
}

function initDeleteButtons() {
    let deleteButtons = document.querySelectorAll('.remove-btn');
    deleteButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            let card = this.closest('div.card');
            card.classList.add('remove-card-animate');
            card.classList.remove('add-card-animate');
            card.addEventListener('animationend', handleCardAnimation);
        });
    });
}

function handleCardAnimation(e) {
    if(e.animationName === 'slide-down') {
        this.classList.add('hidden');
        this.classList.remove('remove-card-animate');
        let ol = this.querySelector('ol.list-group');
        removeChildren(ol);
        removeList(ol.id, ol);
        notify(this.querySelector('h2').textContent + " deleted", {type: 'danger', delay: 1000, width: 'auto'});
        updateAddButton();
        this.removeEventListener('animationend', handleCardAnimation);
    }
}

function addBackup() {
    // Check if previous nodes have children
    let divs = document.querySelectorAll('div.card:not(.hidden)');
    let previousDiv = divs[divs.length - 1];
    let content = previousDiv.querySelector('.list-group').firstElementChild.textContent;
    if (hasNumber(content)) {
        // get the first hidden div
        let newBackup = document.querySelector('.hidden');
        newBackup.classList.remove('hidden');
        newBackup.classList.add('add-card-animate');
        newBackup.scrollIntoView({behavior: 'smooth'});
        notify(newBackup.querySelector('h2').textContent + " added", {type: 'success', delay: 1000, width: 'auto'});
    } else {
        let title = previousDiv.querySelector('h2').textContent.bold();
        notify('Fill ' + title + ' before adding a backup', {type: 'danger', delay: 4000, width: 'auto'});
    }
    //Check to disable add backup button
    updateAddButton();
}

function updateAddButton() {
    // Check how many backup are shown
    let hiddenNodes = document.querySelectorAll('.hidden').length;
    document.getElementById('add-backup').disabled = hiddenNodes === 0;
}

function createListItem(content) {
    let li = document.createElement('li');
    li.setAttribute('class', 'list-group-item add-crn-animate');
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

// Used when checking whether the first child is a number
function hasNumber(string) {
    return /\d/.test(string);
}

function addRemoveButton(element) {
    let removeButton = document.createElement('img');
    removeButton.setAttribute('src', 'icons/clear-button.png');
    removeButton.setAttribute('title', 'Remove CRN');
    removeButton.addEventListener('click', function () {
        element.classList.add('remove-crn-animate');
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
    removeFromList(parent, element, parent.id, index);
}

function removeFromList(parent, element, list, index) {
    let options = {type: 'danger', delay: 1300};
    chrome.storage.sync.get(list, function (storage) {
        let updatedList = storage[list];
        // Remove that specific element from the list
        updatedList.splice(index, 1);
        // Update chrome storage
        chrome.storage.sync.set({[list]: updatedList}, function () {
            parent.removeChild(element);
            notify(element.textContent + " removed", options);
            if (!parent.hasChildNodes()) {
                removeList(list, parent);
            }
        });
    });
}

function removeList(list, node) {
    chrome.storage.sync.remove(list);
    node.appendChild(createListItem('This list is empty'));
}

function displayCRNS(list, node) {
    // check if list is defined
    if (list && list.length > 0) {
        // check if node is empty by checking its first child
        if (!hasNumber(node.firstElementChild.textContent)) {
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
    }
}

function removeChildren(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

function clearAll() {
    // Clear input
    clearInput();

    // Clear list group
    let nodeID, node;
    for (let i = 1; i <= 5; i++) {
        nodeID = 'sub-' + i;
        node = document.getElementById(nodeID);
        // Add hidden class to all except first
        if (nodeID !== 'sub-1') {
            node.closest('div.card').classList.add('hidden');
        }
        removeChildren(node);
        // Set empty list message
        node.appendChild(createListItem('This list is empty'));
    }

    // Enable add more backups button
    document.getElementById('add-backup').disabled = false;

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
    let regex = /[a-zA-Z!@#$%^&*`.]+/;
    let invalidOption = {type: 'danger', delay: 2000, width: 'auto'};
    let noInputOption = {type: 'info', delay: 2000, width: 'auto'};

    // check if there is input
    if (value) {
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