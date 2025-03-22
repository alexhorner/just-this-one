let last_run = 0;
let first_run = 0;
function addListener(element, url) {
  element.addEventListener("click", async (event) => {
    chrome.runtime.sendMessage(
      (message = {
        type: "ELEMENT_LINK_CLICKED",
        new_url: url,
      })
    );
    event.stopPropagation();
  });
}

function handleWishList() {
  Array.from(
    document.querySelectorAll("[class|='editItemWrap'] div[class|='nnEntry']")
  )
    .filter((e) => e && !e.parentNode.classList.contains("jto-link"))
    .forEach((e) => {
      productId = e
        .closest("[class|='productCardV2--productCard']")
        .id.substring(12);
      const jtoAnchor = document.createElement("a");
      jtoAnchor.classList = e.classList;
      jtoAnchor.innerHTML = e.innerHTML;
      jtoAnchor.querySelector("span").innerText = chrome.i18n.getMessage("linkcta");
      jtoAnchor.setAttribute("href", "javascript:void(0)");
      e.innerHTML = e.outerHTML;
      e.classList = "jto-link";
      e.children[0].after(jtoAnchor);
      addListener(jtoAnchor, "https://www.aliexpress.com/item/" + productId + ".html");
    });
}

function handleSearchResults() {
  reg = /(.*aliexpress.com).*productIds=([0-9]*).*$/;
  Array.from(document.querySelectorAll("[href*=BundleDeals]"))
    .map((e) =>
      e.querySelector(".comet-icon")?.parentNode
    )
    .filter((e) => e && !e.classList.contains("jto-link")).forEach((e) => {
      e.classList.add("jto-link");
      current_url = e.closest("a").href;
      match = current_url.match(reg);
      if (!match) {
        return;
      }
      const newURL = match[1] + "/item/" + match[2] + ".html";
      const jtoAnchor = document.createElement("a");
      jtoAnchor.classList = e.classList;
      jtoAnchor.innerHTML = e.innerHTML;
      jtoAnchor.setAttribute("href", "javascript:void(0)");
      jtoAnchor.querySelector("span").innerText = chrome.i18n.getMessage("linkcta");
      e.after(jtoAnchor);
      addListener(jtoAnchor, newURL);
    });
}

function run() {
  now = Date.now() / 1000;
  if (first_run == 0) first_run = now;
  if (
    now - first_run > 2 &&
    now - last_run < Math.min(7, (now - first_run) / 2.5)
  ) {
    return;
  }
  last_run = now;
  handleWishList();
  handleSearchResults();
}

setTimeout(run, 100);
setTimeout(run, 1000);
addEventListener("scroll", run);
