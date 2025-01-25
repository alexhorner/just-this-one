(async () => {
  reg = /(.*aliexpress.com).*productIds=([0-9]*).*$/;

  Array.from(document.querySelectorAll("div div div a div div span"))
    .filter((e) => e.innerText == "Bundle deals")
    .forEach((e) => {
      p1 = e.parentElement.cloneNode(true);
      current_url = e.closest("a").href;
      match = current_url.match(reg);
      if (!match) {
        return;
      }
      new_url = match[1] + "/item/" + match[2] + ".html";
      p1.querySelector("span").innerHTML =
        '<a href="' + new_url + '">Just this one!</a>';
      e.parentElement.after(p1);
    });
})();
