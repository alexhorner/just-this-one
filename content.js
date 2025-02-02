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
  last_run = now;https://he.aliexpress.com/item/1005007989269793.html?spm=a2g0o.productlist.main.56.a16a2Cgl2CglaG&algo_pvid=5975c1e1-1aba-4adc-93b6-2b35d3a83f2b&aem_p4p_detail=2025020202423810781574434361840024450278&algo_exp_id=5975c1e1-1aba-4adc-93b6-2b35d3a83f2b-55&pdp_npi=4%40dis%21ILS%21123.99%21123.99%21%21%2133.76%2133.76%21%402141001d17384929585087981e4be2%2112000043174346671%21sea%21IL%21718705313%21X&curPageLogUid=uzKZ53tJ3Fxf&utparam-url=scene%3Asearch%7Cquery_from%3A&search_p4p_id=2025020202423810781574434361840024450278_14
  reg = /(.*aliexpress.com).*productIds=([0-9]*).*$/;
  Array.from(document.querySelectorAll("div div div a div div [class|=us--title]"))
    .filter(
      (e) => {
        console.log(e.parentNode.classList);return !e.parentNode.classList.contains("jtw-link")}
    )
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
        '<a href="' + new_url + '">'+chrome.i18n.getMessage('linkcta')+'</a>';
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
