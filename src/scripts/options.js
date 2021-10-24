const randomCompletedOption = document.getElementById("completed");
const randomUncompletedOption = document.getElementById("uncompleted");
const randomAttemptedOption = document.getElementById("attempted");

const randomPgOption = document.getElementById("programming.in.th");
const randomCodecubeOption = document.getElementById("codecube");
const randomIpstOption = document.getElementById("ipstcamp");
const randomToiOption = document.getElementById("toi");
const randomTumsoOption = document.getElementById("tumso");

const allOptions = document.getElementsByClassName("options");

const allSources = document.getElementsByClassName("sources");

for (let idx = 0; idx < allOptions.length; idx++) {
  allOptions[idx].addEventListener("change", onRandomOptionsChanged);
}

for (let idx = 0; idx < allSources.length; idx++) {
  allSources[idx].addEventListener("change", onRandomSourcesChanged);
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

let randomSources = {};
chrome.storage.sync.get("randomSources", function (res) {
  randomSources = res["randomSources"];
  randomPgOption.checked = randomSources.pg;
  randomCodecubeOption.checked = randomSources.codecube;
  randomIpstOption.checked = randomSources.ipst;
  randomToiOption.checked = randomSources.toi;
  randomTumsoOption.checked = randomSources.tumso;
});

function onRandomSourcesChanged() {
  randomSources["pg"] = randomPgOption.checked;
  randomSources["codecube"] = randomCodecubeOption.checked;
  randomSources["ipst"] = randomIpstOption.checked;
  randomSources["toi"] = randomToiOption.checked;
  randomSources["tumso"] = randomTumsoOption.checked;
  chrome.storage.sync.set({ randomSources });
}
