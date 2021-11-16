const randomCompletedOption = document.getElementById("completed");
const randomUncompletedOption = document.getElementById("uncompleted");
const randomAttemptedOption = document.getElementById("attempted");

const randomPgOption = document.getElementById("programming.in.th");
const randomCodecubeOption = document.getElementById("codecube");
const randomIpstOption = document.getElementById("ipstcamp");
const randomToiOption = document.getElementById("toi");
const randomTumsoOption = document.getElementById("tumso");
const randomAllOption = document.getElementById("selectAll");

const allOptions = document.getElementsByClassName("options");

const selectAllSource = document.getElementsByClassName("selectallsource");
const allSources = document.getElementsByClassName("sources");

for (let idx = 0; idx < allOptions.length; idx++) {
  allOptions[idx].addEventListener("change", onRandomOptionsChanged);
}

for (let idx = 0; idx < allSources.length; idx++) {
  allSources[idx].addEventListener("change", onRandomSourcesChanged);
}

selectAllSource[0].addEventListener("change", onAllSourcesChanged);

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
  randomAllOption.checked = randomSources.all;
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
  randomSources["all"] =
    randomTumsoOption.checked &&
    randomPgOption.checked &&
    randomIpstOption.checked &&
    randomCodecubeOption.checked &&
    randomToiOption.checked;
	var allOpt = document.getElementsByClassName("selectallsource")[0];
  allOpt.checked = randomSources["all"];
  chrome.storage.sync.set({ randomSources });
}

function onAllSourcesChanged() {
  randomSources["all"] = randomAllOption.checked;
  randomSources["pg"] = randomAllOption.checked;
  randomSources["codecube"] = randomAllOption.checked;
  randomSources["ipst"] = randomAllOption.checked;
  randomSources["toi"] = randomAllOption.checked;
  randomSources["tumso"] = randomAllOption.checked;

  var chbx = document.getElementsByClassName("sources");
  for (var i = 0; i < chbx.length; ++i) {
    chbx[i].checked = randomAllOption.checked;
  }

  chrome.storage.sync.set({ randomSources });
}
