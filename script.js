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
      clone.querySelector("h3.name").classList.add("item_bought");
    } else {
      clone.querySelector(".bought").checked = false;
      clone.querySelector("h3.name").classList.remove("item_bought");
    }

    clone.querySelector(".bought").addEventListener("change", () => {
      itemStatus(item._id);
    });
    parent.appendChild(clone);
  });
}

function itemStatus(id) {
  let status = document.querySelector(`li[data-itemid="${id}"] > div > input`)
    .checked;
  if (status) {
    document
      .querySelector(`li[data-itemid="${id}"] > div > h3.name`)
      .classList.add("item_bought");
  } else {
    document
      .querySelector(`li[data-itemid="${id}"] > div > h3.name`)
      .classList.remove("item_bought");
  }
  boughtUpdate(id, status);
}

function boughtUpdate(id, status) {
  console.log(id, status);

  let data = {
    bought: status
  };
  let postData = JSON.stringify(data);

  fetch(link + "/" + id, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": key,
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(d => d.json())
    .then(t => console.log(t));
}
