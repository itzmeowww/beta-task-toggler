const classNames = {
  completed: "css-ekrsfg",
  uncompleted: "css-mxmbtq",
  attempted: "css-1ifyzb",
};
const buttonTexts = {
  completed: "Completed Tasks",
  uncompleted: "Uncompleted Tasks",
  attempted: "Attempted Tasks",
};
const buttonIds = {
  completed: "toggleComplete",
  uncompleted: "toggleIncomplete",
  attempted: "toggleAttempt",
};

function toggleByClassNames(hide, classes) {
  classes.forEach((className) => {
    let completeTasks = document.getElementsByClassName(className);
    for (let i = 0; i < completeTasks.length; i++) {
      completeTasks[i].style.display = hide ? "none" : "table-row";
    }
  });
}

let randomOptions = {};

chrome.storage.sync.get("randomOptions", function (res) {
  randomOptions = res["randomOptions"];
});

const updateByTypes = async (types, toggle, updateText) => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.storage.sync.get("hiding", function (res) {
    types.forEach((type) => {
      let status = res["hiding"][type];
      if (toggle) status = !status;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleByClassNames,
        args: [status, [classNames[type]]],
      });

      res["hiding"][type] = status;

      if (updateText) updateButtonText(buttonIds[type], res["hiding"][type], buttonTexts[type]);
    });
    chrome.storage.sync.set({ hiding: res["hiding"] });
  });
};

function updateButtonText(id, hiding, text) {
  let el = document.getElementById(id);
  el.innerHTML = (hiding ? "Show" : "Hide") + " " + text;
  el.title = (hiding ? "Show" : "Hide") + " " + text;
}

updateByTypes(["completed", "uncompleted", "attempted"], false, true);

let toggleCompleteButton = document.getElementById(buttonIds.completed);
toggleCompleteButton.innerHTML = `Toggle Completed Tasks`;
toggleCompleteButton.title = `Toggle Completed Tasks`;
toggleCompleteButton.addEventListener(
  "click",
  async () => await updateByTypes(["completed"], true, true)
);

let toggleIncompleteButton = document.getElementById(buttonIds.uncompleted);
toggleIncompleteButton.innerHTML = `Toggle Uncompleted Tasks`;
toggleIncompleteButton.title = `Toggle Uncompleted Tasks`;
toggleIncompleteButton.addEventListener(
  "click",
  async () => await updateByTypes(["uncompleted"], true, true)
);

let toggleAttemptButton = document.getElementById(buttonIds.attempted);
toggleAttemptButton.innerHTML = `Toggle Attempted Tasks`;
toggleAttemptButton.title = `Toggle Attempted Tasks`;
toggleAttemptButton.addEventListener(
  "click",
  async () => await updateByTypes(["attempted"], true, true)
);

let randomIncompleteButton = document.getElementById("randomIncomplete");
randomIncompleteButton.innerHTML = `Random`;
randomIncompleteButton.title = `Random`;

randomIncompleteButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: randomIncomplete,
    args: [[classNames.attempted, classNames.uncompleted]],
  });
});

function randomIncomplete(classes) {
  var arr = [];

  classes.forEach((className) => {
    let el = document.getElementsByClassName(className);
    for (let i = 0; i < el.length; ++i) {
      var str = el[i].innerHTML;
      var tmp = str.split("<")[2].split('a href="')[1].split('">')[0];
      arr.push(tmp);
    }
  });

  var item = arr[Math.floor(Math.random() * arr.length)];
  if (item === undefined) item = "https://beta.programming.in.th/tasks";
  window.location.href = item;
}
