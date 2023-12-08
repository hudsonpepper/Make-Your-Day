

const currentCity = document.querySelector("#current-city")
const currentTemp = document.querySelector("#current-temp");
const currentWind = document.querySelector("#current-wind");
const currentHumidity = document.querySelector("#current-humidity");

var todoInput = document.querySelector("#todo-text");
var todoForm = document.querySelector("#todo-form");
var todoList = document.querySelector("#todo-list");
var todoCountSpan = document.querySelector("#todo-count");

var currWkDay = dayjs().format("ddd");
var currDay = dayjs().format("D");
var currMonth = dayjs().format("MM");
var curYear = dayjs().format("YYYY");
var day = $(".day");
//Set curr day index
var currDayIndex = 0;
var daysArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
for (var i = 0; i < daysArray.length; i++) {
  if (currWkDay === daysArray[i]) {
    currDayIndex = i;
  }
}
//console.log(currDayIndex);



var todos = [];

var currentDate = dayjs().format('dddd, MMMM D, YYYY');
var currentTime = dayjs().format('hh:mm:ss a');

// display current date and time 
$("#currentDay").html(currentDate);
$("#currentTime").html(currentTime);

let latitude;
let longitude;


async function getGeo() {


  let geo = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)})

    return {
      latitude: geo.coords.latitude,
      longitude: geo.coords.longitude
    }
  }
// Search Weather function pulling weather data from weather API 
async function searchWeather() {
  let geo = await getGeo()
  console.log(geo);
  var requestUrl = `https://weatherapi-com.p.rapidapi.com/current.json?q=${geo.latitude},${geo.longitude}`;

  fetch(requestUrl, {
    headers: {
      'X-RapidAPI-Key': 'cbfc516474mshe8f9ce0a07a3f7fp12f71fjsnbb5e4699df4f',
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    }
  })
    .then((response) => {
      return response.json();
    })

    // Display Current weather 
    .then((data) => {
      console.log(data);
      currentCity.textContent = `City: ${data.location.name}`;
      currentTemp.textContent = `Temp: ${data.current.temp_f} °F`;
      currentWind.textContent = `Wind: ${data.current.wind_mph} mph`;
      currentHumidity.textContent = `Humidity: ${data.current.humidity}%`;
    });
};


searchWeather();

function getQuote () {
  var url = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?";
 $.getJSON(url, function(data) {
   $("#quote").html('"' + data.quoteText + '"');
   $("#author").html('-' + data.quoteAuthor);
 });
}
$(document).ready(function() {
  getQuote();
}
)

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
todoForm.addEventListener("submit", function (event) {
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
todoList.addEventListener("click", function (event) {
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
$(function () {
  $("#todo-list, #must-do, #should-do, #could-do").sortable({
    connectWith: ".connectedSortable"
  }).disableSelection();
});


//currDay = 3;
// To Do update the date for each day
day.each(function() {
  var dateIndex = Number($(this).attr("index"));
  var indexDiff = currDayIndex - dateIndex;
  var dayVal = currDay - indexDiff;
  //console.log(dateIndex);
  if ( dateIndex < currDayIndex) {
    //To do handle for when day is in previous month
    indexDiff = currDayIndex - dateIndex;
    dayVal = currDay - indexDiff;
    $(this).text(dayVal + " " + $(this).text());

  }
  else if ( dateIndex > currDayIndex) {
    //To Do handle what happens if day is in next month
    indexDiff = dateIndex - currDayIndex;
    //console.log(indexDiff);
    dayVal = Number(currDay) + indexDiff;
    //console.log(dayVal);
    $(this).text(dayVal + " " + $(this).text());
  }
  else {
    $(this).text(currDay + " " + $(this).text());
  }
})
//console.log(currWkDay);

// Highlights the current day of the week
day.each(function() {
  console.log($(this).attr("id"));
  if ($(this).attr("id") === currWkDay) {
    $(this).css("color","red");
  }
});

// Make the day event list sortable and connected to the todo lists

$(function() {
  $("#Mon, #Tues, #Wed, #Thur, #Fri, #Sat, #Sun, .connectedSortable").sortable({
    connectWith: ".connectedSortable, #Mon, #Tues, #Wed, #Thur, #Fri, #Sat, #Sun"
  }).disableSelection();
});

//To Do- refresh the calendar days for this week
