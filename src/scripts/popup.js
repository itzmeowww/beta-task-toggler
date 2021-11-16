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

const updateByTypes = async (types, toggle, updateText) => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
    url: "https://beta.programming.in.th/tasks",
  });
  if (tab == undefined) return;

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

      if (updateText)
        updateButtonText(
          buttonIds[type],
          res["hiding"][type],
          buttonTexts[type]
        );
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

  let randomOptions = {};
  let randomSources = {};
  chrome.storage.sync.get(["randomOptions", "randomSources"], function (res) {
    randomOptions = res["randomOptions"];
    randomSources = res["randomSources"];
    let classes = [];
    if (randomOptions.randomCompleted) classes.push(classNames.completed);
    if (randomOptions.randomUncompleted) classes.push(classNames.uncompleted);
    if (randomOptions.randomAttempted) classes.push(classNames.attempted);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: randomTask,
      args: [classes, randomSources],
    });
  });
});

function randomTask(classes, sources) {
  let arr = [];
  console.log(sources);
  classes.forEach((className) => {
    let el = document.getElementsByClassName(className);
    for (let i = 0; i < el.length; ++i) {
      var str = el[i].innerHTML;

      var tmp = str.split("<")[2].split('a href="')[1].split('">')[0];
      var taskId = tmp.split("/")[2];

      if (taskId.startsWith("o") && sources.ipst) {
        arr.push(tmp);
      } else if (taskId.startsWith("toi") && sources.toi) {
        arr.push(tmp);
      } else if (taskId.startsWith("codecube") && sources.codecube) {
        arr.push(tmp);
      } else if (taskId.startsWith("tumso15") && sources.tumso15) {
        arr.push(tmp);
      } else if (taskId.startsWith("tumso16") && sources.tumso16) {
        arr.push(tmp);
      } else if (taskId.startsWith("tumso17") && sources.tumso17) {
        arr.push(tmp);
      } else if (taskId.startsWith("tumso18") && sources.tumso18) {
        arr.push(tmp);
      } else if (taskId.startsWith("00") && sources.pgEasy) {
        arr.push(tmp);
      } else if (
        (taskId.startsWith("10") || taskId.startsWith("11")) &&
        sources.pgMedium
      ) {
        arr.push(tmp);
      } else if (taskId.startsWith("20") && sources.pgHard) {
        arr.push(tmp);
      }
    }
  });
  // console.log(arr);
  var item = arr[Math.floor(Math.random() * arr.length)];
  if (item === undefined) item = "https://beta.programming.in.th/tasks";
  window.location.href = item;
  // console.log(item);
}
