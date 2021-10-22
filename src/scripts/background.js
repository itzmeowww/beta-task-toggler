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
      randomSources: {},
    },
    () => {}
  );
});
