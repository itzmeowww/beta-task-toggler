let toggleCompleteButton = document.getElementById("toggleComplete");
let hidingCompleteTasks = false;
toggleCompleteButton.innerHTML = `Hide Complete Task`;

toggleCompleteButton.addEventListener("click", async () => {
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
let hidingIncompleteTasks = false;
toggleIncompleteButton.innerHTML = `Hide Incomplete Task`;

toggleIncompleteButton.addEventListener("click", async () => {
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
let hidingAttemptTasks = false;
toggleAttemptButton.innerHTML = `Hide Attempt Task`;

toggleAttemptButton.addEventListener("click", async () => {
  hidingAttemptTasks = !hidingAttemptTasks;
  if (hidingAttemptTasks) toggleAttemptButton.innerHTML = `Show Attempt Task`;
  else toggleAttemptButton.innerHTML = `Hide Attempt Task`;

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: toggleAttempt,
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
