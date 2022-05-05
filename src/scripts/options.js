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
const difficulty = document.getElementsByClassName("pgm");

const easy = document.getElementById("pgEasy");
const medium = document.getElementById("pgMedium");
const hard = document.getElementById("pgHard");

const tumsos = document.getElementsByClassName("tumsotype");
const tumso15 = document.getElementById("tumso15");
const tumso16 = document.getElementById("tumso16");
const tumso17 = document.getElementById("tumso17");
const tumso18 = document.getElementById("tumso18");

/** @type {HTMLInputElement} */
const bookmarkFeature = document.getElementById("bookmark-feature");

randomTumsoOption.addEventListener("change", onAllTumsosChanged);

for (let idx = 0; idx < allOptions.length; idx++) {
  allOptions[idx].addEventListener("change", onRandomOptionsChanged);
}

for (let idx = 0; idx < allSources.length; idx++) {
  allSources[idx].addEventListener("change", onRandomSourcesChanged);
}

for (let idx = 0; idx < difficulty.length; idx++) {
  difficulty[idx].addEventListener("change", onDifficultyChanged);
}

for (let idx = 0; idx < tumsos.length; idx++) {
  tumsos[idx].addEventListener("change", onTumsosChanged);
}

bookmarkFeature.addEventListener("change", () => {
  chrome.storage.sync.set({ bookmarkFeatureOn: bookmarkFeature.checked });
});

randomPgOption.addEventListener("change", onPgChanged);
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
  easy.checked = randomSources.pgEasy;
  medium.checked = randomSources.pgMedium;
  hard.checked = randomSources.pgHard;
  randomCodecubeOption.checked = randomSources.codecube;
  randomIpstOption.checked = randomSources.ipst;
  randomToiOption.checked = randomSources.toi;
  randomTumsoOption.checked = randomSources.tumso;
  tumso15.checked = randomSources.tumso15;
  tumso16.checked = randomSources.tumso16;
  tumso17.checked = randomSources.tumso17;
  tumso18.checked = randomSources.tumso18;
});
chrome.storage.sync.get("bookmarkFeatureOn", (res) => {
  /** @type {boolean} */
  const bookmarkFeatureOn = res["bookmarkFeatureOn"];

  bookmarkFeature.checked = bookmarkFeatureOn;
});

function onRandomSourcesChanged() {
  randomSources["pg"] = easy.checked && medium.checked && hard.checked;
  randomSources["pgEasy"] = easy.checked;
  randomSources["pgMedium"] = medium.checked;
  randomSources["pgHard"] = hard.checked;
  randomSources["ipst"] = randomIpstOption.checked;
  randomSources["toi"] = randomToiOption.checked;
  randomSources["tumso"] = randomTumsoOption.checked;
  randomSources["tumso15"] = tumso15.checked;
  randomSources["tumso16"] = tumso16.checked;
  randomSources["tumso17"] = tumso17.checked;
  randomSources["tumso18"] = tumso18.checked;
  randomSources["codecube"] = randomCodecubeOption.checked;
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

  var sbc = document.getElementsByClassName("subSource");
  for (var i = 0; i < sbc.length; ++i) {
    sbc[i].checked = randomAllOption.checked;
  }
  chrome.storage.sync.set({ randomSources });
}

function onPgChanged() {
  randomSources["pgEasy"] = randomPgOption.checked;
  randomSources["pgMedium"] = randomPgOption.checked;
  randomSources["pgHard"] = randomPgOption.checked;

  var chbx = document.getElementsByClassName("pgm");
  for (var i = 0; i < chbx.length; ++i) {
    chbx[i].checked = randomPgOption.checked;
  }

  chrome.storage.sync.set({ randomSources });
}

function onDifficultyChanged() {
  randomSources["pgEasy"] = easy.checked;
  randomSources["pgMedium"] = medium.checked;
  randomSources["pgHard"] = hard.checked;

  randomSources["pg"] = easy.checked && medium.checked && hard.checked;

  var ez = document.getElementById("pgEasy");
  ez.checked = easy.checked;
  var med = document.getElementById("pgMedium");
  med.checked = medium.checked;
  var ha = document.getElementById("pgHard");
  ha.checked = hard.checked;

  var pg = document.getElementById("programming.in.th");
  pg.checked = randomSources["pg"];

  randomSources["all"] =
    randomSources["toi"] &&
    randomSources["pg"] &&
    randomSources["tumso"] &&
    randomSources["codecube"] &&
    randomSources["ipst"];
  var all = document.getElementById("selectAll");
  all.checked = randomSources["all"];

  chrome.storage.sync.set({ randomSources });
}

function onTumsosChanged() {
  randomSources["tumso15"] = tumso15.checked;
  randomSources["tumso16"] = tumso16.checked;
  randomSources["tumso17"] = tumso17.checked;
  randomSources["tumso18"] = tumso18.checked;

  randomSources["tumso"] =
    tumso15.checked && tumso16.checked && tumso17.checked && tumso18.checked;

  var t15 = document.getElementById("tumso15");
  var t16 = document.getElementById("tumso16");
  var t17 = document.getElementById("tumso17");
  var t18 = document.getElementById("tumso18");
  t15.checked = tumso15.checked;
  t16.checked = tumso16.checked;
  t17.checked = tumso17.checked;
  t18.checked = tumso18.checked;

  var tum = document.getElementById("tumso");
  tum.checked = randomSources["tumso"];

  randomSources["all"] =
    randomSources["toi"] &&
    randomSources["pg"] &&
    randomSources["tumso"] &&
    randomSources["codecube"] &&
    randomSources["ipst"];
  var all = document.getElementById("selectAll");
  all.checked = randomSources["all"];

  chrome.storage.sync.set({ randomSources });
}

function onAllTumsosChanged() {
  randomSources["tumso15"] = randomTumsoOption.checked;
  randomSources["tumso16"] = randomTumsoOption.checked;
  randomSources["tumso17"] = randomTumsoOption.checked;
  randomSources["tumso18"] = randomTumsoOption.checked;

  var chbx = document.getElementsByClassName("tumsotype");
  for (var i = 0; i < chbx.length; ++i) {
    chbx[i].checked = tumso.checked;
  }

  chrome.storage.sync.set({ randomSources });
}
