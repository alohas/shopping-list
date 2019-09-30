"use strict";

const link = "https://frontendseptember-f268.restdb.io/rest/shopping-list";
const key = "5d887447fd86cb75861e25f9";
const modal = document.querySelector("div.bg-modal");

window.addEventListener("DOMContentLoaded", get);

document.querySelector("button.addBTN").addEventListener("click", () => {
  openModal("add");
});

document.querySelector("button.editBTN").addEventListener("click", () => {
  openModal("edit");
  document.querySelector("button.editBTN").disabled = true;
});

document.querySelector("#close").addEventListener("click", closeModal);

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
      clone.querySelector("h3.quantity").classList.add("item_bought");
    } else {
      clone.querySelector(".bought").checked = false;
      clone.querySelector("h3.name").classList.remove("item_bought");
      clone.querySelector("h3.quantity").classList.remove("item_bought");
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
    document
      .querySelector(`li[data-itemid="${id}"] > h3.quantity`)
      .classList.remove("item_bought");

    document.querySelector(
      `li[data-itemid="${id}"] > div > input`
    ).checked = false;
  } else {
    status = true;
    document
      .querySelector(`li[data-itemid="${id}"] > div > h3.name`)
      .classList.add("item_bought");
    document
      .querySelector(`li[data-itemid="${id}"] > h3.quantity`)
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

    fixForm();
    modal.classList.remove("hide");
  } else if (ref == "edit") {
    const template = document.querySelector("template.editor").content;
    const clone = template.cloneNode(true);
    document.querySelector(".modal-parent").appendChild(clone);
    fetchForEdit();
  }
}

function closeModal() {
  modal.classList.add("hide");
  document.querySelector("button.editBTN").disabled = false;
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
      prependNew(item);
    });
}

function prependNew(item) {
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
}

function fetchForEdit() {
  fetch(link, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": key,
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(data => displayEdit(data));
}

function displayEdit(items) {
  items.forEach(item => {
    //console.log(item);
    const template = document.querySelector("template.itemForEdit").content;
    const clone = template.cloneNode(true);
    const parent = document.querySelector("ul.list-menu");
    //console.log(clone);
    clone.querySelector("h5").textContent = item.item_name;
    clone.querySelector("li").dataset.itemid = item._id;
    clone.querySelector("button.delete").addEventListener("click", () => {
      deleteMe(item._id);
    });
    clone.querySelector("button.edit").addEventListener("click", () => {
      editMe(item._id);
    });

    parent.appendChild(clone);
    modal.classList.remove("hide");
  });
}

function deleteMe(id) {
  console.log(id);
  fetch(link + "/" + id, {
    method: "delete",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": key,
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(data => {
      document.querySelector(`li[data-itemid="${id}"]`).remove();
      document.querySelector(`li.listingInEdit[data-itemid="${id}"]`).remove();
    });
}

function editMe(id) {
  // console.log(id);
  document.querySelector("div.modal-parent").innerHTML = "";
  const template = document.querySelector("template.form").content;
  const clone = template.cloneNode(true);
  clone.querySelector("h2").textContent = "Edit and Item";
  clone.querySelector("input[type=submit]").value = "Submit & Save";
  document.querySelector(".modal-parent").appendChild(clone);
  document.querySelector(".modal-parent").style.visibility = "hidden";
  fixFormEdit(id);
}

function fixFormEdit(id) {
  const form = document.querySelector("form");
  populateForm(form, id);
  form.setAttribute("novalidate", true);

  form.addEventListener("submit", e => {
    e.preventDefault();

    editInDB(form);
  });
}

function populateForm(myForm, id) {
  fetch(`${link}/${id}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": key,
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(data => {
      //console.log(myForm);
      document.querySelector(".modal-parent").style.visibility = "visible";
      myForm.elements.item_name.value = data.item_name;
      myForm.elements.quantity.value = data.quantity;
      myForm.elements.quantity_prefix.value = data.quantity_prefix;
      myForm.elements.id.value = data._id;

      //myForm.elements.submit.addEventListener("click");
    });
}

function editInDB(form) {
  let data = {
    item_name: form.elements.item_name.value,
    quantity: form.elements.quantity.value,
    quantity_prefix: form.elements.quantity_prefix.value
  };

  let postData = JSON.stringify(data);

  fetch(link + "/" + form.elements.id.value, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": key,
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(d => d.json())
    .then(t => {
      //console.log(t);
      updateDom(t);
      modal.classList.add("hide");
      document.querySelector("button.editBTN").disabled = false;
    });
}

function updateDom(updatedItem) {
  document.querySelector(
    `li.item[data-itemid="${updatedItem._id}"] > div >h3.name`
  ).textContent = updatedItem.item_name;

  document.querySelector(
    `li.item[data-itemid="${updatedItem._id}"] >h3.quantity`
  ).textContent = updatedItem.quantity + updatedItem.quantity_prefix;
}
