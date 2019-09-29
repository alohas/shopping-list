"use strict";

const link = "https://frontendseptember-f268.restdb.io/rest/shopping-list";
const key = "5d887447fd86cb75861e25f9";
const modal = document.querySelector("div.bg-modal");

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

document.querySelector("button.addBTN").addEventListener("click", () => {
  openModal("add");
});

document.querySelector("button.removeBTN").addEventListener("click", () => {
  openModal("remove");
});

document.querySelector("#close").addEventListener("click", closeModal);

function display(items) {
  items.forEach(item => {
    //console.log(item);
    const template = document.querySelector("template.listing").content;
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

    clone.querySelector("li").addEventListener("click", () => {
      itemStatus(item._id);
    });
    parent.appendChild(clone);
  });
}

function itemStatus(id) {
  let status = document.querySelector(`li[data-itemid="${id}"] > div > input`)
    .checked;
  //console.log(status);
  if (status) {
    status = false;
    document
      .querySelector(`li[data-itemid="${id}"] > div > h3.name`)
      .classList.remove("item_bought");
    document.querySelector(
      `li[data-itemid="${id}"] > div > input`
    ).checked = false;
  } else {
    status = true;
    document
      .querySelector(`li[data-itemid="${id}"] > div > h3.name`)
      .classList.add("item_bought");
    document.querySelector(
      `li[data-itemid="${id}"] > div > input`
    ).checked = true;
  }
  boughtUpdate(id, status);
}

function boughtUpdate(id, status) {
  //console.log(id, status);
  document.querySelector(`li[data-itemid="${id}"]`).style.pointerEvents =
    "none";

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
  setTimeout(function() {
    document.querySelector(`li[data-itemid="${id}"]`).style.pointerEvents = "";
  }, 3000);
}

function openModal(ref) {
  document.querySelector("div.modal-parent").innerHTML = "";
  if (ref == "add") {
    const template = document.querySelector("template.form").content;
    const clone = template.cloneNode(true);
    document.querySelector(".modal-parent").appendChild(clone);

    modal.classList.remove("hide");
    fixForm();
  } else if (ref == "remove") {
    modal.classList.remove("hide");
  }
}

function closeModal() {
  modal.classList.add("hide");
}
function fixForm() {
  //console.log(document.querySelector("form"));
  const form = document.querySelector("form");

  form.setAttribute("novalidate", true);

  form.addEventListener("submit", e => {
    //form.submit.disabled = true;
    e.preventDefault();
    formSubmited();
    modal.classList.add("hide");
  });
}

function formSubmited() {
  const formSub = document.querySelector("body > div > article > div > form");
  const newItem = {
    item_name: "",
    quantity: "",
    quantity_prefix: "",
    bought: "false"
  };

  newItem.item_name = formSub.elements.item_name.value;
  newItem.quantity = formSub.elements.quantity.value;
  newItem.quantity_prefix = formSub.elements.quantity_prefix.value;

  const jsonItem = JSON.stringify(newItem);
  console.log(jsonItem);
  post(jsonItem);
}

function post(json) {
  fetch(link, {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": key,
      "cache-control": "no-cache"
    },
    body: json
  })
    .then(res => res.json())
    .then(item => {
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

      clone.querySelector("li").addEventListener("click", () => {
        itemStatus(item._id);
      });
      //console.log(parent);
      parent.prepend(clone);
    });
}
