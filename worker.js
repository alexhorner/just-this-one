chrome.runtime.onMessage.addListener(async function (request, _0, _1) {
  switch (request["type"]) {
    case "ELEMENT_LINK_CLICKED":
      handleElementClicked(request);
      break;
    case "NEVER_SHOW_THANK_YOU":
      chrome.storage.local.set({
        never_show_thank_you: true,
      });
    default:
  }
});

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
  const storageValue = await chrome.storage.local.get([
    "days_not_shown",
    "last_used",
    "never_show_thank_you",
  ]);
  const daysNotShown = storageValue["days_not_shown"];
  const lastUsed = storageValue["last_used"];
  const currentDate = new Date().toISOString().split("T")[0];
  const neverShowThankYou = storageValue["never_show_thank_you"];
  if (!neverShowThankYou && lastUsed != currentDate) {
    if (daysNotShown == null || parseInt(daysNotShown) >= 3) {
      chrome.storage.local.set({
        last_used: currentDate,
        days_not_shown: 0,
      });
      chrome.tabs.create({
        url: chrome.runtime.getURL("thank-you.html"),
        openerTabId: tab.id,
      });
    } else if (lastUsed != currentDate) {
      chrome.storage.local.set({
        last_used: currentDate,
        days_not_shown: daysNotShown + 1,
      });
    }
  }
}
