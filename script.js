"use strict";

const link = "https://frontendseptember-f268.restdb.io/rest/shopping-list";
const key = "5d887447fd86cb75861e25f9";

window.addEventListener("DOMContentLoaded", get);

function get() {
  fetch(link, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": key,
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(data => display(data));
}

function display(items) {
  items.forEach(item => {
    const template = document.querySelector("template").content;
    const clone = template.cloneNode(true);
    const parent = document.querySelector("ul.listings");
    clone.querySelector("h3.name").textContent = item.item_name;
    clone.querySelector("h3.quantity").textContent =
      item.quantity + item.quantity_prefix;
    clone.querySelector("li").dataset.itemid = item._id;

    if (item.bought) {
      clone.querySelector(".bought").checked = true;
    }
    parent.appendChild(clone);
  });
}
