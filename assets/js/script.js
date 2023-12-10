const currentCity = document.querySelector("#current-city");
const currentTemp = document.querySelector("#current-temp");
const currentWind = document.querySelector("#current-wind");
const currentHumidity = document.querySelector("#current-humidity");
const currentCondition = document.querySelector("#current-condition")
const weatherIcon = document.querySelector("#icon")


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
//Set month length
var monthArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// console.log(currMonth);
var monthLen = monthArr[currMonth - 1];




var currentDate = dayjs().format('dddd, MMMM D, YYYY');
var currentTime = dayjs().format('hh:mm:ss a');

// display current date and time 
$("#currentDay").html(currentDate);
$("#currentTime").html(currentTime);
// Clock Ticks
function setTime() {
  var timerInterval = setInterval(function () {
    $("#currentTime").html(dayjs().format('hh:mm:ss a'));
  }, 1000)
}
setTime();
let latitude;
let longitude;


async function getGeo() {


  let geo = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })

  return {
    latitude: geo.coords.latitude,
    longitude: geo.coords.longitude
  }
}
// Search Weather function pulling weather data from weather API 
async function searchWeather() {
  let geo = await getGeo()
  // console.log(geo);
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
      // console.log(data);
      currentCity.textContent = `City: ${data.location.name}`;
      currentTemp.textContent = `Temp: ${data.current.temp_f} °F`;
      currentWind.textContent = `Wind: ${data.current.wind_mph} mph`;
      currentHumidity.textContent = `Humidity: ${data.current.humidity}%`;
      currentCondition.textContent = `${data.current.condition.text}`;
      // console.log(data.current.condition.icon)
      weatherIcon.setAttribute("src", `https:${data.current.condition.icon}`);
    });
};


searchWeather();

function getQuote() {
  var url = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?";
  $.getJSON(url, function (data) {
    $("#quote").html('"' + data.quoteText + '"');
    $("#author").html('-' + data.quoteAuthor);
  });
}
$(document).ready(function () {
  getQuote();
}
)


// This function is being called below and will run when the page loads.

// Add click event to todoList element



// To Do update the date for each day

day.each(function () {
  var dateIndex = Number($(this).attr("index"));
  var indexDiff = currDayIndex - dateIndex;
  var dayVal = currDay - indexDiff;
  // console.log(currMonth);
  if (dateIndex < currDayIndex) {
    //To do handle for when day is in previous month
    indexDiff = currDayIndex - dateIndex;
    dayVal = currDay - indexDiff;
    // Handles if the week has days in 2 months
    if (dayVal < 1) {
      if (currMonth === "01" || currMonth === "02" || currMonth === "04" || currMonth === "06" || currMonth === "08" || currMonth === "09" || currMonth === "11") {
        var monthIndex = [31, 30, 29, 28, 27, 26];
        dayVal = monthIndex[Math.abs(dayVal)];
      }
      else if (currMonth === "05" || currMonth === "07" || currMonth === "10" || currMonth === "12") {
        var monthIndex = [30, 29, 28, 27, 26, 25];
        dayVal = monthIndex[Math.abs(dayVal)];
      }
      //To Do handle leap years(dayVal = 29)
      else {
        if (curYear % 400 == 0 || (curYear % 4 == 0 && curYear % 100 != 0)) {
          var monthIndex = [29, 28, 27, 26, 25, 24];
          dayVal = monthIndex[Math.abs(dayVal)];
        }
        else {
          var monthIndex = [28, 27, 26, 25, 24, 23];
          dayVal = monthIndex[Math.abs(dayVal)];
        }
      }
    }

    $(this).text(dayVal);

  }
  else if (dateIndex > currDayIndex) {
    //To Do handle what happens if day is in next month
    indexDiff = dateIndex - currDayIndex;
    //console.log(indexDiff);
    dayVal = Number(currDay) + indexDiff;
    //console.log(dayVal);
    if (dayVal > monthLen) {
      dayVal = (dayVal - monthLen);
      // console.log(dayVal);
    }
    $(this).text(dayVal);
  }
  else {
    $(this).text(currDay);
  }
})
//console.log(currWkDay);


// Highlights the current day of the week
day.each(function () {
  // console.log($(this).attr("id"));
  if ($(this).attr("id") === currWkDay) {
    $(this).parent().addClass("curDay")
  }
});

// Accordion 
var accElArray = $(".accordion");

for (let i = 0; i < accElArray.length; i++) {
  accElArray[i].addEventListener("click", function () {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    this.classList.toggle("active");
    console.log("click");
    let numLi = $(this).next().children().length;
    let spanNum;
    console.log("Number of Elements:", numLi)
    if($(this).parent().attr("id") == "todo-div") {
      spanNum = 0;
    }
    else {
      spanNum = 1;
    }
    /* Toggle between hiding and showing the active panel */
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
      $(this).children().eq(spanNum).text(numLi);
      if (numLi > 0) {
      $(this).children().eq(spanNum).removeClass("hidden");
      storeTodos();
      }
    } else {
      panel.style.display = "block";
      // console.log( $(this).children().eq(1))
      $(this).children().eq(spanNum).text(numLi);
      $(this).children().eq(spanNum).addClass("hidden");
      storeTodos();
    }
  });
};

// Make the day event list sortable and connected to the todo lists


// $(function() {
//   $("#Mon, #Tues, #Wed, #Thu, #Fri, #Sat, #Sun, .connectedSortable").sortable({
//     connectWith: ".connectedSortable, #Mon, #Tues, #Wed, #Thu, #Fri, #Sat, #Sun"
//   }).disableSelection();
// });

//To Do- refresh the calendar days for this week
