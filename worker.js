chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  const storageValue = await chrome.storage.local.get(["click_count"]);
  const clickCount = parseInt(storageValue["click_count"] || "0");
  chrome.storage.local.set({ click_count: clickCount + 1 });
  let logResult = Math.log(clickCount / 10) / Math.log(2);
  logResult = Math.round(logResult * 10000) / 10000;
  if (logResult >= 0 && Number.isInteger(logResult)) {
    chrome.tabs.create({
      url: chrome.runtime.getURL("popup.html"),
    });
  }
});
