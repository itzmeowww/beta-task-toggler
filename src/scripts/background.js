chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(
    {
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
        pg: true,
        codecube: true,
        ipst: true,
        toi: true,
        tumso: true,
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

chrome.tabs.onActivated.addListener(async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
    url: "https://beta.programming.in.th/tasks",
  });
  if (tab != undefined) {
    await updateByTypes();
  }
});
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
    url: "https://beta.programming.in.th/tasks",
  });
  if (tab != undefined && changeInfo.status == "complete") {
    await delay(2500);
    await updateByTypes();
  }
});
