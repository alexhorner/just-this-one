document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("closeTab").addEventListener("click", function () {
    window.close();
  });

  document.getElementById("neverShow").addEventListener("click", function () {
    chrome.runtime.sendMessage(
      (message = {
        type: "NEVER_SHOW_THANK_YOU",
      })
    );
    window.close();
  });
  
  document.getElementById("coffeeButton").addEventListener("click", function () {
    chrome.runtime.sendMessage(
      (message = {
        type: "BUY_COFFEE",
      })
    );
    window.close();
  });
});
