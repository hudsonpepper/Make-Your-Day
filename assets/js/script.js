const currentCity = document.querySelector("#current-city")
const currentTemp = document.querySelector("#current-temp");
const currentWind = document.querySelector("#current-wind");
const currentHumidity = document.querySelector("#current-humidity");

var todoInput = document.querySelector("#todo-text");
var todoForm = document.querySelector("#todo-form");
var todoList = document.querySelector("#todo-list");
var todoCountSpan = document.querySelector("#todo-count");

var currWkDay = dayjs().format(ddd);
var currDay = dayjs().format(MM/D);
var currMonth = dayjs().format(MM);
var curYear = dayjs().format(YYYY);
var day = $(".day");


var todos = [];

var currentDate = dayjs().format('dddd, MMMM D, YYYY');
var currentTime = dayjs().format('hh:mm:ss a');

// display current date and time 
$("#currentDay").html(currentDate);
$("#currentTime").html(currentTime);

const settings = {
	async: true,
	crossDomain: true,
	url: 'https://weatherapi-com.p.rapidapi.com/current.json?q=53.1%2C-0.13',
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '',
		'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
});

// Search Weather function pulling weather data from open weather 
function searchWeather () {
  fetch(settings)
      .then ((response) => {
      return response.json();
      })
// Display Current weather 
      .then((data) => {
          lat = data.coord.lat;
          lon = data.coord.lon;
          temp = data.main.temp;
          wind = data.wind.speed;
          humidity = data.main.humidity;
          currentCity.textContent = `City: ${cityName}`;
          currentTemp.textContent = `Temp: ${temp} °F`;
          currentWind.textContent = `Wind: ${wind} mph`;
          currentHumidity.textContent = `Humidity: ${humidity}%`;
      });
    searchWeather ();
    };
// The following function renders items in a todo list as <li> elements
function renderTodos() {
  // Clear todoList element and update todoCountSpan
  todoList.innerHTML = "";
  todoCountSpan.textContent = todos.length;

  // Render a new li for each todo
  for (var i = 0; i < todos.length; i++) {
    var todo = todos[i];

    var li = document.createElement("li");
    li.textContent = todo;
    li.setAttribute("data-index", i);
    li.classList.add("ui-state-default");

    var spanEl = document.createElement("span");
    spanEl.classList.add("ui-icon");
    spanEl.classList.add("ui-icon-arrowthick-2-n-s");
    var button = document.createElement("button");
    button.textContent = "Complete ✔️";

    li.appendChild(spanEl);
    li.appendChild(button);
    todoList.appendChild(li);
  }
}

// This function is being called below and will run when the page loads.
function init() {
  // Get stored todos from localStorage
  var storedTodos = JSON.parse(localStorage.getItem("todos"));

  // If todos were retrieved from localStorage, update the todos array to it
  if (storedTodos !== null) {
    todos = storedTodos;
  }

  // This is a helper function that will render todos to the DOM
  renderTodos();
}

function storeTodos() {
  // Stringify and set key in localStorage to todos array
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Add submit event to form
todoForm.addEventListener("submit", function(event) {
  event.preventDefault();

  var todoText = todoInput.value.trim();

  // Return from function early if submitted todoText is blank
  if (todoText === "") {
    return;
  }

  // Add new todoText to todos array, clear the input
  todos.push(todoText);
  todoInput.value = "";

  // Store updated todos in localStorage, re-render the list
  storeTodos();
  renderTodos();
});

// Add click event to todoList element
todoList.addEventListener("click", function(event) {
  var element = event.target;

  // Checks if element is a button
  if (element.matches("button") === true) {
    // Get its data-index value and remove the todo element from the list
    var index = element.parentElement.getAttribute("data-index");
    todos.splice(index, 1);

    // Store updated todos in localStorage, re-render the list
    storeTodos();
    renderTodos();
  }
});

// Calls init to retrieve data and render it to the page on load
init()

// Makes Lis sortable (src = https://jqueryui.com/sortable/)
$( function() {
  $( "#todo-list, #must-do, #should-do, #could-do" ).sortable({
    connectWith: ".connectedSortable"
  }).disableSelection();
} );

// To Do update the date for each day
day.each(function() {
  if ($(this).attr("id") == currWkDay) {
    $(this).text("Today");
  }
})


//To Do- refresh the calendar days for this week

