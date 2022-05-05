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
      bookmarkFeatureOn: false,
      bookmarked: [],
      showOnlyBookmarked: false,
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

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function addBookmarkIcon() {
  // Experimental Feature, require user to activate it in settings
  if (
    !(await new Promise((resolve, _) => {
      chrome.storage.sync.get("bookmarkFeatureOn", (result) => {
        resolve(result["bookmarkFeatureOn"]);
      });
    }))
  )
    return;

  /** @type {HTMLTableSectionElement} */
  const tableHead = document.querySelector("table.css-1rwqhj9 > thead");

  if (!tableHead?.children[0]?.children[0]?.textContent?.includes("PROBLEM"))
    return;

  /** @type {HTMLTableRowElement} */
  const theadrow = tableHead.children[0];

  // * Add Third Column in thead if not exist
  if (theadrow.children.length < 3) {
    const thirdHeadColumn = document.createElement("th");
    thirdHeadColumn.textContent = "BOOKMARK";
    thirdHeadColumn.className = theadrow.children[0].className;
    thirdHeadColumn.style.textAlign = "center";
    theadrow.appendChild(thirdHeadColumn);
  }

  /** @type {HTMLTableSectionElement} */
  const tableBody = document.querySelector("table.css-1rwqhj9 > tbody");

  // * From Bootstrap Icons
  window.bookmarkOffSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bookmark" viewBox="0 0 16 16">
  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/></svg>`;

  window.bookmarkOnSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/></svg>`;

  /** @type {(tr: HTMLTableRowElement) => string} */
  window.getTaskIDFromTR = (tr) =>
    tr.children[0] /* td */.children[0] /* a */.children[0] /* div */
      .textContent;

  // * On Bookmark Button Toggle
  window.bookmarkClickHandler = (e) => {
    /** @type {HTMLButtonElement} */
    const t = e.currentTarget;
    const tr = t.parentNode /* td */.parentNode;

    const taskId = window.getTaskIDFromTR(tr);

    chrome.storage.sync.get("bookmarked", (res) => {
      // By GitHub Copilot
      /** @type {string[]} */
      let bookmarked = res["bookmarked"];
      const isBookmarked = bookmarked.includes(taskId);
      if (isBookmarked) {
        bookmarked = bookmarked.filter((x) => x != taskId);
      } else {
        bookmarked.push(taskId);
      }
      t.innerHTML = !isBookmarked
        ? window.bookmarkOnSVG
        : window.bookmarkOffSVG;

      t.children[0].style.color = !isBookmarked ? "#f3da35" : "";

      chrome.storage.sync.set({ bookmarked }, () => {});
    });
  };

  // * Initialization
  chrome.storage.sync.get(["bookmarked", "showOnlyBookmarked"], (res) => {
    /** @type {string[]} */
    const bookmarked = res["bookmarked"];
    /** @type {boolean} */
    const showOnlyBookmarked = res["showOnlyBookmarked"];

    for (const tr of tableBody.children) {
      if (tr.children.length < 3) {
        const bookmarktd = document.createElement("td");
        bookmarktd.style.display = "flex";
        bookmarktd.style.flexDirection = "row";
        bookmarktd.style.justifyContent = "center";
        const isBookmarked = bookmarked.includes(window.getTaskIDFromTR(tr));
        bookmarktd.innerHTML = `<button>
        ${
          isBookmarked ? window.bookmarkOnSVG : window.bookmarkOffSVG
        }</button>`;

        /** @type {HTMLButtonElement} */
        const btn = bookmarktd.children[0];

        btn.addEventListener("click", window.bookmarkClickHandler);

        btn.children[0].style.color = isBookmarked ? "#f3da35" : "";
        btn.style.padding = "0.3em";

        tr.appendChild(bookmarktd);
      }

      tr.style.display =
        !bookmarked.includes(window.getTaskIDFromTR(tr)) && showOnlyBookmarked
          ? "none"
          : "table-row";
    }
  });
}

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
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: addBookmarkIcon,
    });
  }
});

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
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: addBookmarkIcon,
    });
  }
});
