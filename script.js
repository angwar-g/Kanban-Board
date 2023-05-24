const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const itemLists = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updateOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging=false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}

function filterArray(array){
  const filteredArray = array.filter(item=>item!==null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  console.log('columnEl:', columnEl);
  console.log('column:', column);
  console.log('item:', item);
  console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable=true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable=true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  //append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {

  // Check localStorage once
  if (!updateOnLoad){
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent='';
  backlogListArray.forEach((backlogItem, index)=>{
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent='';
  progressListArray.forEach((progressItem, index)=>{
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent='';
  completeListArray.forEach((completeItem, index)=>{
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent='';
  onHoldListArray.forEach((onholdItem, index)=>{
    createItemEl(onHoldList, 3, onholdItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updateOnLoad = true;
  updateSavedColumns();
}

function updateItem(id, column){
  const selectedArray = listArrays[column];
  const selectedColumnEl = itemLists[column].children;
  if(!dragging){
    if(!selectedColumnEl[id].textContent){
      delete selectedArray[id];
    }
    else{
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

function addToColumn(column){
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent='';
  updateDOM();
}

function showInputBox(column){
  addBtns[column].style.visibility='hidden';
  saveItemBtns[column].style.display='flex';
  addItemContainers[column].style.display='flex';
}

function hideInputBox(column){
  addBtns[column].style.visibility='visible';
  saveItemBtns[column].style.display='none';
  addItemContainers[column].style.display='none';
  addToColumn(column);
}

function rebuildArrays(){
  backlogListArray = [];
  for(let i=0; i<backlogList.children.length; i++){
    backlogListArray.push(backlogList.children[i].textContent);
  }

  progressListArray = [];
  for(let i=0; i<progressList.children.length; i++){
    progressListArray.push(progressList.children[i].textContent);
  }

  completeListArray = [];
  for(let i=0; i<completeList.children.length; i++){
    completeListArray.push(completeList.children[i].textContent);
  }

  onHoldListArray = [];
  for(let i=0; i<onHoldList.children.length; i++){
    onHoldListArray.push(onHoldList.children[i].textContent);
  }

  updateDOM();
}

function drag(e){
  draggedItem = e.target;
  dragging=true;
}

function allowDrop(e){
  e.preventDefault();
}

function drop(e){
  e.preventDefault();
  itemLists.forEach((column)=>{
    column.classList.remove('over');
  });
  const parent = itemLists[currentColumn];
  parent.appendChild(draggedItem);
  rebuildArrays();
  dragging=false;
}

function dragEnter(column){
  itemLists[column].classList.add('over');
  currentColumn = column;
}
updateDOM();