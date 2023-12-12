// ** Begin: Query Selectors **
var todoDiv = document.querySelector("#todo-div")
var todoInput = document.querySelector("#todo-text");
var todoForm = document.querySelector("#todo-form");
var unsortedList = document.querySelector("#unsorted");
var todoCountSpan = document.querySelector("#todo-count");
var modalFormEl = document.querySelector("#new-project-modal")
// ** End: Query Selectors **

// ** Begin: Initializations **
var textEl, text;
// ** End: Initializations **



// ** Begin: Functions **
// The following function renders Items from Local Storage as <li> elements
function renderTodos() {
  // Relogs Last HTML Layout of TodoDiv and Calendar
  todoDiv.innerHTML = localStorage.getItem("todos");
  document.querySelector("#calendarBox").innerHTML = localStorage.getItem("calendar");

  // Creates Event Listener On Uls
  $("ul").on("mouseup", "li", function (event) {
    // Did the User Click on a Button? 
    if (event.target.matches("button") === true) {
      // Did the User Click On the Delete Button?
      if (event.target.classList.contains("delete-btn")) {
        // Get its data-index value and remove the todo element from the list
        $(event.target).parent().remove();
      }
      // If it isn't the Delete Button, It is the Edit Button
      else {
        // Grab Last Text Input
        text = event.target.parentNode.firstChild.innerText;
        // Grabs What Li The Edit Button Corresponds to
        textEl = event.target.parentNode.firstChild;
        // Populates The Modal With Previous Text
        $("#project-name-input").val(text);
        // Shows the Modal
        $("#new-project-modal").modal('show');
      }
    }
    // If The User Didn't Click On a Button
    else {
      // Give jQuery UI time to finish reorder if necessary
      setTimeout(() => {
        let newTarget;
        // Make sure newTarget is grabbing the li, NOT the span
        // If the User clicked on the span grab the parent
        if (event.target.matches("span") === true) {
          newTarget = event.target.parentNode;
        }
        // If the User didn't grab the span, we are good. 
        else {
          newTarget = event.target;
        }
        // Grab Parent Data Attributes date and type
        let pDate = $(newTarget).parent().data("date");
        let pType = $(newTarget).parent().data("type");
        // Reset date Attribute for li
        $(newTarget).attr("date", pDate);
        // If There is an update for type Attribute, update it
        if (pType != null) {
          $(newTarget).attr("type", pType);
        }
        // Relog Data
        storeTodos();
      }, 100);
    }
    // Relog Data
    setTimeout(storeTodos, 120);
  })

  // Function Makes Li sortable (src = https://jqueryui.com/sortable/)
  $(function () {
    $("#unsorted, #must-do, #should-do, #could-do, #SunUl, #MonUl, #TuesUl, #WedUl, #ThuUl, #FriUl, #SatUl").sortable({
      connectWith: ".connectedSortable"
    }).disableSelection();
  });
  // Sets todoCount: Note the 3 is to make sure it isn't overcounting from the instruction lis
  todoCount = document.querySelectorAll("li").length - 3;
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
  // Stringify and set key in localStorage to store todos and calendar state
  localStorage.setItem("todos", todoDiv.innerHTML);
  localStorage.setItem("calendar", document.querySelector("#calendarBox").innerHTML);
  // Reset todoCount
  todoCount = document.querySelectorAll("li").length - 3;
  todoCountSpan.textContent = todoCount;
}

// ----- Event Listener For "Add a Todo" -----
todoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var todoText = todoInput.value.trim();
  // Return from function early if submitted todoText is blank
  if (todoText === "") {
    return;
  }
  // Clear the input
  todoInput.value = "";

  // Make todo element
  var li = document.createElement("li");
  li.classList.add("ui-state-default", "rounded", "border-2");

  // Makes Span for Todo Text
  var spanEl = document.createElement("span");
  spanEl.textContent = todoText;

  // Makes Delete Button
  var button2 = document.createElement("button");
  button2.textContent = "🗹"; // ✔ ✔️ ☑️ ✅ 
  button2.classList.add("rounded-full", "delete-btn");

  // Makes Edit Button
  var button = document.createElement("button");
  button.textContent = "✏️";
  button.classList.add("rounded-full", "edit-btn");

  // Appends Span and Buttons to Li
  li.appendChild(spanEl);
  li.appendChild(button2);
  li.appendChild(button);
  unsortedList = document.querySelector("#unsorted");

  // Adds Attributes to li, and appends it to page
  $(li).attr("type", "Unsorted");
  $(li).attr("date", "Undated");
  unsortedList.appendChild(li)

  // Does another Check for Unsorted List Pill Preview
  let numLi = $(unsortedList).children().length;
  $(unsortedList).prev().children().eq(0).text(numLi);

  // Checks if Accordion is Closed and There are Positive number of Lis
  if (numLi > 0 && !($("#unsorted-btn").hasClass("active"))) {
    $(unsortedList).prev().children().eq(0).removeClass("hidden");
  }
  // Relogs Todos After Change
  storeTodos();
});

// Event Listener for Modal
$("#new-project-modal").on("submit", function (event) {
  event.preventDefault();
  text = $("#project-name-input").val().trim();
  textEl.innerText = text;
  storeTodos();
})

// Initializes Page
init()