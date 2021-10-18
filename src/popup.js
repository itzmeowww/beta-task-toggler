let toggleCompleteButton = document.getElementById("toggleComplete");
toggleCompleteButton.innerHTML = `Toggle Completed Tasks`;

toggleCompleteButton.addEventListener("click", async() => {
    hidingCompleteTasks = !hidingCompleteTasks;
    if (hidingCompleteTasks)
        toggleCompleteButton.innerHTML = `Show Complete Task`;
    else toggleCompleteButton.innerHTML = `Hide Complete Task`;

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleComplete,
    });
});

let toggleIncompleteButton = document.getElementById("toggleIncomplete");
toggleIncompleteButton.innerHTML = `Toggle Incompleted Tasks`;

toggleIncompleteButton.addEventListener("click", async() => {
    hidingIncompleteTasks = !hidingIncompleteTasks;
    if (hidingIncompleteTasks)
        toggleIncompleteButton.innerHTML = `Show Incomplete Task`;
    else toggleIncompleteButton.innerHTML = `Hide Incomplete Task`;

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleIncomplete,
    });
});

let toggleAttemptButton = document.getElementById("toggleAttempt");
toggleAttemptButton.innerHTML = `Toggle Attempted Tasks`;

toggleAttemptButton.addEventListener("click", async() => {
    hidingAttemptTasks = !hidingAttemptTasks;
    if (hidingAttemptTasks) toggleAttemptButton.innerHTML = `Show Attempt Task`;
    else toggleAttemptButton.innerHTML = `Hide Attempt Task`;

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleAttempt,
    });
});

let randomIncompleteButton = document.getElementById("randomIncomplete");
randomIncompleteButton.innerHTML = `Random`;

randomIncompleteButton.addEventListener("click", async() => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: randomIncomplete,
    });
});

function toggleComplete() {
    let completeTasks = document.getElementsByClassName("css-ekrsfg");
    for (let i = 0; i < completeTasks.length; i++) {
        if (completeTasks[i].style.display !== "none") {
            completeTasks[i].style.display = "none";
        } else {
            completeTasks[i].style.display = "table-row";
        }
    }
}

function toggleIncomplete() {
    let incompleteTasks = document.getElementsByClassName("css-mxmbtq");
    for (let i = 0; i < incompleteTasks.length; i++) {
        if (incompleteTasks[i].style.display !== "none") {
            incompleteTasks[i].style.display = "none";
        } else {
            incompleteTasks[i].style.display = "table-row";
        }
    }
}

function toggleAttempt() {
    let attemptTasks = document.getElementsByClassName("css-1ifyzb");
    for (let i = 0; i < attemptTasks.length; i++) {
        if (attemptTasks[i].style.display !== "none") {
            attemptTasks[i].style.display = "none";
        } else {
            attemptTasks[i].style.display = "table-row";
        }
    }
}

function randomIncomplete() {
    let incompleteTasks = document.getElementsByClassName("css-mxmbtq")
    let attemptTasks = document.getElementsByClassName("css-1ifyzb");
    var arr = []
    for (let i = 0; i < incompleteTasks.length; ++i) {
        var str = incompleteTasks[i].innerHTML
        var tmp = str.split("<")[2].split('a href="')[1].split('">')[0];
        arr.push(tmp);
    }
    for (let i = 0; i < attemptTasks.length; ++i) {
        var str = attemptTasks[i].innerHTML
        var tmp = str.split("<")[2].split('a href="')[1].split('">')[0];
        arr.push(tmp);
    }
    var item = arr[Math.floor(Math.random() * arr.length)];
    window.location.href = item;
}