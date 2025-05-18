import { reportEvent } from "./analytics.js";

chrome.runtime.onMessage.addListener(async function (request, _0, _1) {
  let [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  switch (request["type"]) {
    case "ELEMENT_LINK_CLICKED":
      reportEvent("just_this_one");
      handleElementClicked(request, tab);
      break;
    case "NEVER_SHOW_THANK_YOU":
      reportEvent("set_never_show_thank_you");
      chrome.storage.local.set({ neverShowThankYou: true });
      break;
    case "BUY_COFFEE":
      chrome.tabs.create(
        {
          url: "https://buymeacoffee.com/yoniaug",
          openerTabId: tab?.id || 0,
          index: 1 + (tab?.index || - 1),
          active: false,
        },
        (newTab) => {
          chrome.tabs.update(newTab.id, { active: true });
        }
      );
      break;
    default:
  }
});

function updateUsageHistory(daysNotShown, lastUsed) {
  daysNotShown = daysNotShown != null ? daysNotShown : 1;
  const currentDate = new Date().toISOString().split("T")[0];
  if (lastUsed === currentDate) {
    return;
  }
  chrome.storage.local.set({
    lastUsed: currentDate,
    daysNotShown: (daysNotShown + 1) % 3,
  });
}

async function maybeShowThankYou(openerTab, cb) {
  let { daysNotShown, lastUsed, neverShowThankYou } =
    await chrome.storage.local.get([
      "daysNotShown",
      "lastUsed",
      "neverShowThankYou",
    ]);
  updateUsageHistory(daysNotShown, lastUsed);
  if (neverShowThankYou || daysNotShown < 2) {
    cb(openerTab);
    return;
  }
  chrome.tabs.create(
    {
      url: chrome.runtime.getURL("thank-you.html"),
      openerTabId: openerTab?.id || 0,
      index: 1 + (openerTab?.index || 0),
      active: false,
    },
    cb
  );
}

async function handleElementClicked(request, openerTab) {
  await maybeShowThankYou(openerTab, (tabToGoAfter) => {
    chrome.tabs.create({
      url: request["new_url"],
      openerTabId: tabToGoAfter?.id,
      index: 1 + (tabToGoAfter?.index || 0),
      active: true,
    });
  });
}
