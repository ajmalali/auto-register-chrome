function init() {
    // Display entered CRNs
    chrome.storage.sync.get(['mainList', 'backupList'], function (storage) {
        let mainNode = document.getElementById('main');
        let backupNode = document.getElementById('backup');
        let mainList = storage.mainList;
        let backupList = storage.backupList;
        displayCRNS(mainList, mainNode);
        displayCRNS(backupList, backupNode);
    });

    // Initialize reload
    chrome.storage.sync.set({'reload': 1});

    document.getElementById('add-main').addEventListener('click', function () {
        // Save to chrome storage
        let mainNode = document.getElementById('main');
        saveCRNS('mainList', mainNode);
    });

    document.getElementById('add-backup').addEventListener('click', function () {
        // Save to chrome storage
        let backupNode = document.getElementById('backup');
        saveCRNS('backupList', backupNode);
    });

    // Clear all for modal button
    document.querySelector('#confirm-modal button.btn-outline-danger').addEventListener('click', clearAll);
}

function createListItem(crn) {
    let li = document.createElement('li');
    li.setAttribute('class', 'list-group-item');
    let text = document.createTextNode(crn);
    li.appendChild(text);
    return li;
}

function updateCRNS(list, node) {
    let index = node.children.length;
    for (let i = index; i < list.length; i++) {
        node.appendChild(createListItem(list[i]));
    }
}

function hasNumber(string) {
    return /\d/.test(string);
}

function displayCRNS(list, node) {
    // check if list is defined
    if (list) {
        // check if node is empty by checking its first child
        if (!hasNumber(node.children[0].textContent)) {
            removeChildren(node);
            // append all crns to the node
            list.forEach(function (crn) {
                node.appendChild(createListItem(crn));
            });
        } else {
            // append only the new crns to the node
            updateCRNS(list, node);
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
    // Set reload to 1
    chrome.storage.sync.set({'reload': 1});
    // Clear chrome storage
    chrome.storage.sync.clear(function () {
        notify("Everything cleared", {type: 'danger', delay: 2000})
    });
}

function clearInput() {
    document.getElementById('crn-input').value = "";
}

function notify(message, options) {
    $.bootstrapGrowl(message, options);
}

function isValid(value) {
    // check if the string contains one or more of the below characters
    // (using regex will slow down performance)
    let regex = /[a-zA-Z!@#$%^&*.]+/g;
    return !regex.test(value);
}

// TODO: refactor
function saveCRNS(list, node) {
    let input = document.getElementById('crn-input');
    let newList;
    // If there is input
    if (input.value) {
        // Check if input is valid
        if(isValid(input.value)) {
            let newList = input.value.match(/\S+/g);
            if (list === 'mainList') {
                newList.forEach(function (crn) {
                    notify(crn + " added to main", {type: 'success', delay: 2000});
                });
                chrome.storage.sync.get('mainList', function (storage) {
                    // If list is not empty
                    if (storage.mainList) {
                        newList = storage.mainList.concat(newList);
                        notify('Main CRNs updated', {type: 'info', delay: 2000});
                    }
                    //Store new lists
                    chrome.storage.sync.set({'mainList': newList}, function () {
                        displayCRNS(newList, node);
                    });
                });
            } else {
                newList.forEach(function (crn) {
                    notify(crn + " added to backup", {type: 'success', delay: 2000, width: 260});
                });
                chrome.storage.sync.get('backupList', function (storage) {
                    // If list is not empty
                    if (storage.backupList) {
                        newList = storage.backupList.concat(newList);
                        notify('Backup CRNs updated', {type: 'info', delay: 2000, width: 260});
                    }
                    //Store new lists
                    chrome.storage.sync.set({'backupList': newList}, function () {
                        displayCRNS(newList, node);
                    });
                });
            }
        } else {
            // Invalid input notification
            clearInput();
            notify('Please enter a valid CRN', {type: 'danger', delay: 2000, width: 'auto'});
        }
    } else {
        // No input notification
        notify('Please enter a CRN', {type: 'info', delay: 2000, width: 'auto'});
    }
    // Clear input
    clearInput();
}

init();