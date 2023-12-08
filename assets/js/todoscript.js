var todoDiv = document.querySelector("#todo-div")
var todoInput = document.querySelector("#todo-text");
var todoForm = document.querySelector("#todo-form");
var todoList = document.querySelector("#todo-list");
var todoCountSpan = document.querySelector("#todo-count");


// The following function renders items in a todo list as <li> elements
function renderTodos() {
  // Clear todoList element and update todoCountSpan
  todoDiv.innerHTML = localStorage.getItem("todos");
  $("ul").on("mouseup", "li", function (event) {
    console.log(event);
    console.log($(this).parent());
    if (event.target.matches("button") === true) {
      // event.stopPropagation()
      // Get its data-index value and remove the todo element from the list
      console.log($(event.target).parent())
      $(event.target).parent().remove();
    }
    setTimeout(storeTodos, 100);
  })
  // Makes Li sortable (src = https://jqueryui.com/sortable/)
  $(function () {
    $("#todo-list, #must-do, #should-do, #could-do, #Sun, #Mon, #Tues, #Wed, #Thu, #Fri, #Sat").sortable({
      connectWith: ".connectedSortable"
    }).disableSelection();
  });
}


// This function is being called below and will run when the page loads.
function init() {
  // Get stored todos from localStorage
  var storedTodos = (localStorage.getItem("todos"));
  var todoCount = JSON.parse(localStorage.getItem("todoCount"));
  // If todos were retrieved from localStorage, update the todos array to it
  if (storedTodos == null) {
    localStorage.setItem("todos", todoDiv.innerHTML);
  }
  if (todoCount == null) {
    localStorage.setItem("todoCount", "0");
  }
  // This is a helper function that will render todos to the DOM
  renderTodos();
}

function storeTodos() {
  // Stringify and set key in localStorage to todos array
  // todoDiv = document.querySelector("#todo-div")
  console.log((todoDiv.innerHTML));
  localStorage.setItem("todos", todoDiv.innerHTML);
}

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("submit")
  var todoText = todoInput.value.trim();
  console.log(todoText)
  // Return from function early if submitted todoText is blank
  if (todoText === "") {
    console.log("empty input")
    return;
  }

  // Clear the input
  todoInput.value = "";

  // Make todo element

  var li = document.createElement("li");
  li.textContent = todoText;
  li.classList.add("ui-state-default");

  var button = document.createElement("button");
  button.textContent = "Complete ✔️";

  //li.appendChild(spanEl);
  li.appendChild(button);
  todoList = document.querySelector("#todo-list")
  todoList.appendChild(li)
  // console.log(todoDiv);
  console.log(todoList)
  // console.log(li)
  // $("ul").on("mouseup", "li",function (event){
  //   console.log(event);
  //   console.log($(this).parent());
  //   setTimeout(storeTodos, 100);
  // })

  storeTodos();
  renderTodos();
});



// Add click event to todoList element
todoList.addEventListener("click", function (event) {

  var element = event.target;
  console.log("click")
  // Checks if element is a button

});

init()