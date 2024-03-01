// ********* SELECIONANDO ITENS ********* 
const alertMessage = document.querySelector('.alert');
const form = document.querySelector('.shop-form');
const input = document.getElementById('input');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.shop-container');
const list = document.querySelector('.shop-list');
const clearBtn = document.querySelector('.clear-btn');

// ********* OPCOES PARA EDITAR ********* 
let editElement;
let editFlag = false;
let editID = "";

// ********* EVENTOS *********
//submit form
form.addEventListener("submit", addItem);
//limpando a lista
clearBtn.addEventListener("click", clearItems);
//carregando itens
window.addEventListener("DOMContentLoaded", setupItems);

// ********* FUNCOES *********
//adicionando item
function addItem(event){
  event.preventDefault();
  const value = input.value;
  const id = new Date().getTime().toString();

  if(value !== "" && !editFlag){
    const element = document.createElement('article');
    let attr = document.createAttribute('data-id');
    attr.value = id;
    //add class
    element.classList.add("shop-item");
    //add id
    element.setAttributeNode(attr);
    element.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>`;

    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    //adicionando ao pai
    list.appendChild(element);

    //mostrando o alerta
    displayAlert("Item adicionado na lista", "success");
    //mostrando container
    container.classList.add("show-container");
    //adicionando ao local storage
    addToLocalStorage(id, value);
    //de volta ao padrao
    setBackToDefault();
  }else if(value !== "" && editFlag){
    editElement.innerHTML = value;
    displayAlert("Item editado", "success");

    //editando no localstorage
    editLocalStorage(editID, value);

    //de volta ao padrao
    setBackToDefault();
  }else {
    displayAlert("por favor, insira um item", "danger");
  }
}
//alerta
function displayAlert(text, action){
  alertMessage.textContent = text;
  alertMessage.classList.add(`alert-${action}`);

  //removento o alerta com setTimeout
  setTimeout(function(){
    alertMessage.textContent = "";
    alertMessage.classList.remove(`alert-${action}`);
  }, 1300);
}

//deletando item
function deleteItem(event){
  const element = event.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if(list.children.length === 0){
    container.classList.remove('show-container');
  }
  displayAlert("item removido", "danger");
  //de volta ao padrao
  setBackToDefault();
  //remover do local storage
  removeFromLocalStorage(id);
}

//editando item
function editItem(event){
  const element = event.currentTarget.parentElement.parentElement;
  //pegando o item
  editElement = event.currentTarget.parentElement.previousElementSibling;
  //definir o valor do form
  input.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit";
}

//limpar items
function clearItems(){
  const items = document.querySelectorAll(".shop-item");

  if(items.length > 0){
    items.forEach(function(item){
      list.removeChild(item);
    })
  }

  container.classList.remove("show-container");
  displayAlert("lista vazia", "danger");
  setBackToDefault();
  //removendo a lista do localStorage
  localStorage.removeItem("list");
}

// ********* DE VOLTA AO PADRAO *********
function setBackToDefault(){
  input.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Enviar";
  input.focus();
}

// ********* LOCAL STORAGE *********
function addToLocalStorage(id, value){
  const input = {id, value};
  let items = getLocalStorage();

  items.push(input);
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage(){
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function removeFromLocalStorage(id){
  let items = getLocalStorage();

  items = items.filter(function(item){
    if(item.id !== id){
      return item
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value){
  let items = getLocalStorage();
  items = items.map(function(item){
    if(item.id === id){
      item.value = value;
    }
    return item;
  })
  localStorage.setItem("list", JSON.stringify(items));
}

// ********* SETUP DOS ITENS *********
function setupItems(){
  let items = getLocalStorage();

  if(items.length > 0){
    items.forEach(function(item){
      createListItems(item.id, item.value)
    })
    container.classList.add("show-container");
  }
}

function createListItems(id, value){
  const element = document.createElement('article');
  let attr = document.createAttribute('data-id');
  attr.value = id;
  //add class
  element.classList.add("shop-item");
  //add id
  element.setAttributeNode(attr);
  element.innerHTML = `
  <p class="title">${value}</p>
  <div class="btn-container">
    <button type="button" class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>
  </div>`;

  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  //adicionando ao pai
  list.appendChild(element);
}