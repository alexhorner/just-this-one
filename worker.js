chrome.runtime.onMessage.addListener(async function (request, _0, _1) {
  switch (request["type"]) {
    case "ELEMENT_LINK_CLICKED":
      handleElementClicked(request);
      break;
    case "NEVER_SHOW_THANK_YOU":
      chrome.storage.local.set({
        neverShowThankYou: true,
      });
    default:
  }
});

async function maybeShowThankYou(openerTabId) {
  let { daysNotShown, lastUsed, neverShowThankYou } =
    await chrome.storage.local.get([
      "daysNotShown",
      "lastUsed",
      "neverShowThankYou",
    ]);
  if (neverShowThankYou) {
    return;
  }
  const currentDate = new Date().toISOString().split("T")[0];
  if (lastUsed === currentDate) {
    return;
  }
  daysNotShown = daysNotShown != null ? daysNotShown : 2;
  if (daysNotShown >= 3) {
    chrome.tabs.create({
      url: chrome.runtime.getURL("thank-you.html"),
      openerTabId,
    });
    daysNotShown = 0;
  } else if (lastUsed != currentDate) {
    daysNotShown += 1;
  }
  chrome.storage.local.set({
    lastUsed: currentDate,
    daysNotShown,
  });
}

async function handleElementClicked(request) {
  let [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  chrome.tabs.create(
    {
      url: request["new_url"],
      openerTabId: tab?.id,
      index: (tab?.id || -1) + 1,
      active: false,
    },
    (newTab) => {
      chrome.tabs.update(newTab.id, { active: true });
    }
  );
  maybeShowThankYou(tab?.id);
}
