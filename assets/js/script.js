// ** Begin:  Query Selectors **
const currentCity = document.querySelector("#current-city");
const currentTemp = document.querySelector("#current-temp");
const currentWind = document.querySelector("#current-wind");
const currentHumidity = document.querySelector("#current-humidity");
const currentCondition = document.querySelector("#current-condition");
const weatherIcon = document.querySelector("#icon");
var day = $(".day");
console.log(day)
var accElArray = $(".accordion");
// ** End: Query Selectors **


// ** Start:  Initializations **
// ----- Date Format Styling -----
var currWkDay = dayjs().format("ddd");
var currDay = dayjs().format("D");
var currMonth = dayjs().format("MM");
var curYear = dayjs().format("YYYY");
var currentDate = dayjs().format('dddd, MMMM D, YYYY');
var currentTime = dayjs().format('hh:mm:ss a');
//   --> HTML Date and Time Initialization
$("#currentDay").html(currentDate);
$("#currentTime").html(currentTime);

// ----- Initialize currDayIndex -----
var currDayIndex;
var daysArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
for (var i = 0; i < daysArray.length; i++) {
  if (currWkDay === daysArray[i]) {
    currDayIndex = i;
  }
}

// ----- Initialize Month Length Array -----
var monthArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
//   --> Leap Year Logic
if (curYear % 400 == 0 || (curYear % 4 == 0 && curYear % 100 != 0)) {
  monthArr[1] = 29;
}
//   --> Index at 0 vs 1
var monthLen = monthArr[currMonth - 1];

// ----- Initialize Location Variables -----
let latitude;
let longitude;
// ** End: Initializations **


// ** Begin: Functions **

// ----- Function Makes Clock Tick -----
function setTime() {
  var timerInterval = setInterval(function () {
    $("#currentTime").html(dayjs().format('hh:mm:ss a'));
  }, 1000)
}
setTime();

// ----- Function Grabs Current Location -----
//   --> Note: Uses Browser Location Services
async function getGeo() {
  // Prints Waiting Message And Spinner Styling
  $(currentCity)[0].textContent = "Please Wait: Finding Location..."
  $(weatherIcon).attr("src", "https://cdn.360-value.com/iv360/21.1.50/resources/images/spinner.gif");
  $(weatherIcon).attr("height", "64px");
  $(weatherIcon).attr("width", "64px");
  // Promise Asks User To Share Location
  let geo = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
  // Returns User's Coordinates
  return {
    latitude: geo.coords.latitude,
    longitude: geo.coords.longitude
  }
}
// ----- Function Uses Current Location to Get Weather Data -----
//   --> Note: Uses Weather API 
async function searchWeather() {
  // Waits for Location from getGeo()
  let geo = await getGeo()
  // Changes Wait Message to "Weather Loading" Message + Spinner
  $(currentCity)[0].textContent = "Please Wait: Weather Loading..."
  $(weatherIcon).attr("src", "https://cdn.360-value.com/iv360/21.1.50/resources/images/spinner.gif");
  
  // Weather API Call Uses Geo Location from getGeo()
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

    // Display Current Weather
    .then((data) => {
      currentCity.textContent = `City: ${data.location.name}`;
      currentTemp.textContent = `Temp: ${data.current.temp_f} °F`;
      currentWind.textContent = `Wind: ${data.current.wind_mph} mph`;
      currentHumidity.textContent = `Humidity: ${data.current.humidity}%`;
      currentCondition.textContent = `${data.current.condition.text}`;
      weatherIcon.setAttribute("src", `https:${data.current.condition.icon}`);
    });
};

// ----- Function Rechecks Weather Every 5 Minutes
//   --> Note: 5 Minutes is 300000 milliseconds
setInterval(searchWeather, 300000);
//   --> Does First Weather Call
searchWeather();

// ----- Function Gets Quote Data from Forismatic API -----
function getQuote() {
  var url = "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?";
  $.getJSON(url, function (data) {
    $("#quote").html('"' + data.quoteText + '"');
    $("#author").html('-' + data.quoteAuthor);
  });
}
//   --> Waits Until Document Is Loaded To Grab the Quote
$(document).ready(function () {
  getQuote();
});

// ----- Function Populates Weekly-View Dates -----
day.each(function () {
  // Uses Current Day and Finds Appropriate Offset
  var dateIndex = Number($(this).attr("index"));
  var indexDiff = currDayIndex - dateIndex;
  var dayVal = currDay - indexDiff;
  // MonthVal is initialized to currMonth;
  var monthVal = currMonth;
  if (dateIndex < currDayIndex) {
    //To do handle for when day is in previous month
    indexDiff = currDayIndex - dateIndex;
    dayVal = currDay - indexDiff;
    // Handles if the week has days in 2 months
    if (dayVal < 1) {
      // Makes MonthVal -> Prev Month
      // --> Note: 1 -> 12, Hence Below Logic
      monthVal = ((monthVal + 10) % 12) + 1;
      // Prior Month Has 31 Days
      if (currMonth === "01" || currMonth === "02" || currMonth === "04" || currMonth === "06" || currMonth === "08" || currMonth === "09" || currMonth === "11") {
        var monthIndex = [31, 30, 29, 28, 27, 26];
        dayVal = monthIndex[Math.abs(dayVal)];
      }
      // Prior Month Has 30 Days
      else if (currMonth === "05" || currMonth === "07" || currMonth === "10" || currMonth === "12") {
        var monthIndex = [30, 29, 28, 27, 26, 25];
        dayVal = monthIndex[Math.abs(dayVal)];
      }
      // Prior Month is February -> Note: No currMonth === "03" Condition Above
      else {
        // Leap Year Logic 
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
    let dateText = `(${monthVal}/${dayVal})`
    $(this).text(dateText);

  }
  else if (dateIndex > currDayIndex) {
    // Day Is In Next Month
    indexDiff = dateIndex - currDayIndex;
    dayVal = Number(currDay) + indexDiff;
    if (dayVal > monthLen) {
      // Needs to Map to Next Month: 12 -> 1, 1 -> 2, etc.
      monthVal = (monthVal % 12) + 1;
      dayVal = (dayVal - monthLen);
    }
    let dateText = `(${monthVal}/${dayVal})`
    $(this).text(dateText);
  }
  else {
    // Day Is In Current Month
    let dateText = `(${currMonth}/${dayVal})`
    $(this).text(dateText);
  }
});

// ----- Function Styles Current Day of the Week -----
day.each(function () {
  console.log(currWkDay)
  console.log("Loop", $(this).attr("id"))
  if ($(this).attr("id") === currWkDay) {
    $(this).parent().addClass("curDay")
  }
  else {
    $(this).parent().removeClass("curDay")
  }
});
// ** End: Functions **

// ** Start: Event Listeners **
// ----- Accordion Event Listeners -----

for (let i = 0; i < accElArray.length; i++) {
  // Makes Event Listener for Each Accordion
  $(accElArray[i]).on("click", function () {
    // Toggles Accordion Activation
    this.classList.toggle("active");
    // Does Rounded Style Toggle on Bottom Elements
    if (i == 4 || i == 11) {
      this.classList.toggle("rounded-b-lg")
    }
    let numLi;
    // Targets the Panel Associated With the Accordion
    //   --> Note: When Accordion Is Active, Panel is display: block
    //              Otherwise Panel is display: none
    var panel = this.nextElementSibling;
    if (!this.classList.contains("active")) {
      panel.style.display = "none";
    }
    else {
      panel.style.display = "block";
    }
    // Handles Pill Preview Logic
    //   --> Handles Logic In Todo-div
    if ($(this).parent().attr("id") == "todo-div") {
      // In todo-div, Preview is just number of lis inside ul
      numLi = $(this).next().children().length;
      if (panel.style.display === "none") {
        // If Panel Is Collapsed, Show Preview
        $(this).children().eq(0).text(numLi);
        // Only Show if Pill if there are todos of that Specific Type
        if (numLi > 0) {
          $(this).children().eq(0).removeClass("hidden");
        }
      } else {
        $(this).children().eq(0).text(numLi);
        $(this).children().eq(0).addClass("hidden");
      }
    }
    //   --> Handles Logic In Weekly Div
    else {
      //  Note: Because there are multiple Pill Previews, Need to Count Number
      let typeArr = ["Unsorted", "Must-do", "Should-do", "Could-do"];
      let spanArr = [1, 2, 3, 4];
      let numLiArr = [0, 0, 0, 0];
      var panel = this.nextElementSibling;
      // For Loop Handles Counting
      for (let i = 0; i < $(panel).children().length; i++) {
        let j = typeArr.findIndex((element) => element == $(panel).children().eq(i).attr("type"));
        numLiArr[j]++;
      }
      // For Loop Hanges Displaying
      for (let i = 0; i < 4; i++) {
        // Only Display if panel display: none and numLi > 0 for specific pill
        if (panel.style.display === "none") {
          $(this).children().eq(spanArr[i]).text(numLiArr[i]);
          if (numLiArr[i] > 0) {
            $(this).children().eq(spanArr[i]).removeClass("hidden");

          }
        } else {
          // Update Number But keep it hidden
          $(this).children().eq(spanArr[i]).text(numLiArr[i]);
          $(this).children().eq(spanArr[i]).addClass("hidden");

        }
      }
    }
    // Relog Todos
    storeTodos();
  });
};

// ** End: Event Listeners **