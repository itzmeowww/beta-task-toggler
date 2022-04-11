chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(
    {
      darkMode: false,
      hiding: {
        completed: false,
        uncompleted: false,
        attempted: false,
      },
      randomOptions: {
        randomCompleted: false,
        randomAttempted: true,
        randomUncompleted: true,
      },
      randomSources: {
        all: true,
        pg: true,
        pgEasy: true,
        pgMedium: true,
        pgHard: true,
        codecube: true,
        ipst: true,
        toi: true,
        tumso: true,
        tumso15: true,
        tumso16: true,
        tumso17: true,
        tumso18: true,
      },
    },
    () => {}
  );
});
function toggleByClassNames(hide, classes) {
  classes.forEach((className) => {
    let completeTasks = document.getElementsByClassName(className);
    for (let i = 0; i < completeTasks.length; i++) {
      completeTasks[i].style.display = hide ? "none" : "table-row";
    }
  });
}
const updateByTypes = async () => {
  const classNames = {
    completed: "css-ekrsfg",
    uncompleted: "css-mxmbtq",
    attempted: "css-1ifyzb",
  };
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab == undefined) return;

  let types = ["completed", "uncompleted", "attempted"];
  chrome.storage.sync.get("hiding", function (res) {
    types.forEach((type) => {
      let status = res["hiding"][type];
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleByClassNames,
        args: [status, [classNames[type]]],
      });

      res["hiding"][type] = status;
    });
  });
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

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: updateTheme,
      args: [darkMode],
    });
  });
};

chrome.tabs.onActivated.addListener(async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
    url: "https://beta.programming.in.th/*",
  });
  if (tab != undefined) {
    await toggleTheme();
    await delay(2500);
    await updateByTypes();
    await toggleTheme();
  }
});
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
    url: "https://beta.programming.in.th/*",
  });
  if (tab != undefined && changeInfo.status == "complete") {
    await toggleTheme();
    await delay(2500);

    await updateByTypes();
    await toggleTheme();
  }
});
