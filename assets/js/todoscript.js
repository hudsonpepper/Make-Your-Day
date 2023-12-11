var todoDiv = document.querySelector("#todo-div")
var todoInput = document.querySelector("#todo-text");
var todoForm = document.querySelector("#todo-form");
var unsortedList = document.querySelector("#unsorted");
var todoCountSpan = document.querySelector("#todo-count");
var modalFormEl = document.querySelector("#new-project-modal")


var textEl,text;
// The following function renders items in a todo list as <li> elements
function renderTodos() {
  // Clear unsortedList element and update todoCountSpan
  todoDiv.innerHTML = localStorage.getItem("todos");
  document.querySelector("#calendarBox").innerHTML = localStorage.getItem("calendar");
  $("ul").on("mouseup", "li", function (event) {
    // console.log(event);
    // console.log($(this).parent());
    if (event.target.matches("button") === true) {
      if (event.target.classList.contains("delete-btn")) {
        // event.stopPropagation()
        // Get its data-index value and remove the todo element from the list
        console.log("Delete");
        console.log($(event.target).parent())
        $(event.target).parent().remove();
      }
      else {
        console.log("Edit");
        text = event.target.parentNode.firstChild.innerText;
        console.log(event.target.parentNode);
        console.log("Text(old): ", text);
        textEl = event.target.parentNode.firstChild;
        $("#project-name-input").val(text);
        $("#new-project-modal").modal('show');
        console.log(textEl);
      }
    }
    else {
      console.log("event.target", event.target)
      console.log("Clicked On: ", event.target.innerText.split("\n")[0])
      console.log("Data(raw): ", event.target.dataset);
      console.log("Date: ", $(event.target).attr("date"))
      console.log("Type: ", $(event.target).attr("type"));
      console.log("Parent: ", $(event.target).parent().attr("id"));
      setTimeout(() => {
        let pDate = $(event.target).parent().data("date");
        console.log("Parent Date: ", pDate);
        let pType = $(event.target).parent().data("type");
        console.log("Parent Type: ", pType);
        $(event.target).attr("date", pDate);
        if (pType != null) {
          $(event.target).attr("type", pType);
        }
        console.log("After Move:", $(event.target).attr("date"), $(event.target).attr("type"))
        storeTodos();
      }, 100);
    }
    setTimeout(storeTodos, 120);
  })
  // Makes Li sortable (src = https://jqueryui.com/sortable/)
  $(function () {
    $("#unsorted, #must-do, #should-do, #could-do, #SunUl, #MonUl, #TuesUl, #WedUl, #ThuUl, #FriUl, #SatUl").sortable({
      connectWith: ".connectedSortable"
    }).disableSelection();
  });
  todoCount = document.querySelectorAll("li").length;

  todoCountSpan.textContent = todoCount;
}


// This function is being called below and will run when the page loads.
function init() {
  // Get stored todos from localStorage
  var storedTodos = localStorage.getItem("todos");
  var todoCount = localStorage.getItem("todoCount");
  var storedCalendar = localStorage.getItem("calendar");

  // If todos were retrieved from localStorage, update the todos array to it
  if (storedTodos == null) {
    localStorage.setItem("todos", todoDiv.innerHTML);
  }
  if (todoCount == null) {
    localStorage.setItem("todoCount", "0");
  }
  if (storedCalendar == null) {
    localStorage.setItem("calendar", document.querySelector("#calendarBox").innerHTML);
  }
  // This is a helper function that will render todos to the DOM
  renderTodos();
}

function storeTodos() {
  // Stringify and set key in localStorage to todos array
  // todoDiv = document.querySelector("#todo-div")
  // console.log((todoDiv.innerHTML));
  localStorage.setItem("todos", todoDiv.innerHTML);
  localStorage.setItem("calendar", document.querySelector("#calendarBox").innerHTML);
  todoCount = document.querySelectorAll("li").length;
  todoCountSpan.textContent = todoCount;
  // console.log("Todo Count", todoCount)
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
  li.classList.add("ui-state-default");


  var button2 = document.createElement("button");
  button2.textContent = "🗹";
  button2.classList.add("rounded-full");
  button2.classList.add("delete-btn");

  var p = document.createElement("span");
  p.textContent = todoText;

  var button = document.createElement("button");

  button.textContent = "✔️"; // ✔ ✔️ ☑️ ✅ 
  button.textContent = "✏️"; // ✔ ✔️ ☑️ ✅ 

  button.classList.add("rounded-full")
  button.classList.add("edit-btn");
  
  
  li.appendChild(p);
  li.appendChild(button2);
  li.appendChild(button);
  unsortedList = document.querySelector("#unsorted");

  console.log("Unsorted List: ", unsortedList);
  $(li).attr("type", "Unsorted");
  $(li).attr("date", "Undated");
  unsortedList.appendChild(li)
  // console.log($(unsortedList).children());


  let numLi = $(unsortedList).children().length;
  $(unsortedList).prev().children().eq(0).text(numLi);
  console.log("NumLi", numLi);
  if (numLi > 0) {
    $("Inside the conditional")

    $(unsortedList).prev().children().eq(0).removeClass("hidden");
  }
  // end Make Element
  storeTodos();
});

$("#new-project-modal").on("submit", function (event) {
  event.preventDefault();
  console.log(textEl);
  text = $("#project-name-input").val().trim();
  console.log("Text(new): ",text);
  textEl.innerText = text;
  console.log("TextEl: ", textEl);
  storeTodos();
})

init()