let last_run = 0;
let first_run = 0;
function addLinks() {
  now = Date.now() / 1000;
  if (first_run == 0) first_run = now;
  if (now - first_run > 45) {
    return;
  }
  if (now - last_run < Math.min(7, (now - first_run) / 2.5)) {
    return;
  }
  last_run = now;
  reg = /(.*aliexpress.com).*productIds=([0-9]*).*$/;
  Array.from(document.querySelectorAll("[href*=BundleDeals]"))
    .map((e) =>
      e.querySelector(".comet-icon")?.parentNode.querySelector("span")
    )
    .filter((e) => e && !e.parentNode.classList.contains("jtw-link"))
    .forEach((e) => {
      e.parentNode.classList.add("jtw-link");
      p1 = e.parentElement.cloneNode(true);
      current_url = e.closest("a").href;
      match = current_url.match(reg);
      if (!match) {
        return;
      }
      new_url = match[1] + "/item/" + match[2] + ".html";
      p1.querySelector("span").innerHTML =
        '<a href="' +
        new_url +
        '">' +
        chrome.i18n.getMessage("linkcta") +
        "</a>";
      e.parentElement.after(p1);
    });
}
setTimeout(function () {
  (async () => {
    addLinks();
  })();
}, 200);

addEventListener("scroll", function (event) {
  setTimeout(function () {
    (async () => {
      addLinks();
    })();
  }, 1500);
});
