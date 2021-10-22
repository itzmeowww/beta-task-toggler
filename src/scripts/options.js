const randomCompletedOption = document.getElementById("completed");
const randomUncompletedOption = document.getElementById("uncompleted");
const randomAttemptedOption = document.getElementById("attempted");

const allOptions = document.getElementsByClassName("options");

for (let idx = 0; idx < allOptions.length; idx++) {
  allOptions[idx].addEventListener("change", onRandomOptionsChanged);
}

let randomOptions = {};
chrome.storage.sync.get("randomOptions", function (res) {
  randomOptions = res["randomOptions"];
  randomCompletedOption.checked = randomOptions.randomCompleted;
  randomUncompletedOption.checked = randomOptions.randomUncompleted;
  randomAttemptedOption.checked = randomOptions.randomAttempted;
});

function onRandomOptionsChanged() {
  randomOptions["randomCompleted"] = randomCompletedOption.checked;
  randomOptions["randomUncompleted"] = randomUncompletedOption.checked;
  randomOptions["randomAttempted"] = randomAttemptedOption.checked;
  chrome.storage.sync.set({ randomOptions });
}
