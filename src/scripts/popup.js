const classNames = {
  completed: "css-ekrsfg",
  uncompleted: "css-mxmbtq",
  attempted: "css-1ifyzb",
};
const buttonTexts = {
  completed: "Completed Tasks",
  uncompleted: "Uncompleted Tasks",
  attempted: "Attempted Tasks",
  bookmarked: "Not Bookmarked Tasks",
};
const buttonIds = {
  completed: "toggleComplete",
  uncompleted: "toggleIncomplete",
  attempted: "toggleAttempt",
  bookmark: "toggleBookmark",
  theme: "toggleTheme",
  setting: "setting",
};

const updateTheme = (darkMode) => {
  ["css-1sdtmh8", "css-3146ur", "css-zf0iqh"].forEach((x) => {
    let elems = document.getElementsByClassName(x);
    for (let i = 0; i < elems.length; i++) {
      elems[i].style.backgroundColor = darkMode
        ? "rgb(26, 32, 44)"
        : "rgb(255, 255, 255)";
    }
  });

  [
    "css-15m6xyz",
    "css-16wmsvm",
    "css-1f6yz4b",
    "css-1w5s30t",
    "css-4wnsd9",
    "title",
    "list",
    "css-2eujvc",
    "css-1lqajip",
    "css-1ee7pjs",
    "css-19lx80r",
    "css-1ybytse",
    "css-f5hoy5",
    "css-1ma5mi3",
    "css-1l725sd",
    "css-o4mft6",
  ].forEach((x) => {
    elems = document.getElementsByClassName(x);
    for (let i = 0; i < elems.length; i++) {
      elems[i].style.color = !darkMode
        ? "rgb(26, 32, 44)"
        : "rgb(255, 255, 255)";
    }
  });

  ["css-ekrsfg", "css-1ifyzb"].forEach((x) => {
    elems = document.getElementsByClassName(x);

    for (let i = 0; i < elems.length; i++) {
      elems[i].getElementsByClassName("css-4wnsd9")[0].style.color =
        "rgb(26, 32, 44)";
      elems[i].getElementsByClassName("css-4wnsd9")[1].style.color =
        "rgb(26, 32, 44)";
    }
  });
};

const toggleTheme = async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
    url: "https://beta.programming.in.th/*",
  });
  if (tab == undefined) return;

  chrome.storage.sync.get("darkMode", function (res) {
    let darkMode = res["darkMode"];

    darkMode = !darkMode;

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: updateTheme,
      args: [darkMode],
    });
    res["darkMode"] = darkMode;
    chrome.storage.sync.set({ darkMode: darkMode });
    document.getElementById(buttonIds.theme).innerHTML = darkMode
      ? "Disable Dark Mode"
      : "Enable Dark Mode";
    document.getElementById(buttonIds.theme).title = darkMode
      ? "Disable Dark Mode"
      : "Enable Dark Mode";
  });
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
    url: "https://beta.programming.in.th/*",
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

const toggleBookmark = async (toggle) => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
    url: "https://beta.programming.in.th/*",
  });
  if (tab == undefined) return;

  chrome.storage.sync.get(["bookmarked", "showOnlyBookmarked"], (res) => {
    /** @type {string[]} */
    const bookmarked = res["bookmarked"];

    /** @type {boolean} */
    let showOnlyBookmarked = res["showOnlyBookmarked"];
    showOnlyBookmarked = toggle ? !showOnlyBookmarked : showOnlyBookmarked;

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (bookmarked, showOnlyBookmarked) => {
        const table = document.querySelector("table.css-1rwqhj9");

        if (
          !table?.children[0] /* thead */?.children[0] /* tr */?.children[0] /* th */?.textContent
            ?.includes("PROBLEM")
        )
          return;

        /** @type {HTMLTableSectionElement} */
        const tbody = table.children[1];

        for (const tr of tbody.children) {
          const taskID = window.getTaskIDFromTR(tr);
          if (!bookmarked.includes(taskID) && showOnlyBookmarked) {
            tr.style.display = "none";
          } else {
            tr.style.display = "table-row";
          }
        }
      },
      args: [bookmarked, showOnlyBookmarked],
    });

    chrome.storage.sync.set({ showOnlyBookmarked });

    updateButtonText(
      buttonIds.bookmark,
      showOnlyBookmarked,
      buttonTexts.bookmarked
    );
  });
};

function updateButtonText(id, hiding, text) {
  let el = document.getElementById(id);
  el.innerHTML = (hiding ? "Show" : "Hide") + " " + text;
  el.title = (hiding ? "Show" : "Hide") + " " + text;
}

updateByTypes(["completed", "uncompleted", "attempted"], false, true);
toggleBookmark(false);

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

let toggleBookmarkButton = document.getElementById(buttonIds.bookmark);
toggleBookmarkButton.innerHTML = `Toggle Bookmarked`;
toggleBookmarkButton.title = `Toggle Bookmarked`;
toggleBookmarkButton.addEventListener(
  "click",
  async () => await toggleBookmark(true)
);

let toggleThemeButton = document.getElementById(buttonIds.theme);
toggleThemeButton.innerHTML = `Toggle Dark Mode`;
toggleThemeButton.title = `Toggle Dark Mode`;
toggleThemeButton.addEventListener("click", async () => await toggleTheme());

let settingButton = document.getElementById(buttonIds.setting);
settingButton.innerHTML = `Setting`;
settingButton.title = `Setting`;
settingButton.addEventListener(
  "click",
  async () => await chrome.runtime.openOptionsPage()
);

let randomIncompleteButton = document.getElementById("randomIncomplete");
randomIncompleteButton.innerHTML = `Random`;
randomIncompleteButton.title = `Random`;

randomIncompleteButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
    url: "https://beta.programming.in.th/*",
  });

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
