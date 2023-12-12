const currentCity = document.querySelector("#current-city");
const currentTemp = document.querySelector("#current-temp");
const currentWind = document.querySelector("#current-wind");
const currentHumidity = document.querySelector("#current-humidity");
const currentCondition = document.querySelector("#current-condition");
const weatherIcon = document.querySelector("#icon");


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
if (curYear % 400 == 0 || (curYear % 4 == 0 && curYear % 100 != 0)) {
  monthArr[1] = 29;
}
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
  console.log("Finding Geo");
  $(currentCity)[0].textContent = "Please Wait: Finding Location..."
  $(weatherIcon).attr("src", "https://cdn.360-value.com/iv360/21.1.50/resources/images/spinner.gif");
  $(weatherIcon).attr("height", "64px");
  $(weatherIcon).attr("width", "64px");
  let geo = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
  console.log("Geo: (inside)", geo);
  return {
    latitude: geo.coords.latitude,
    longitude: geo.coords.longitude
  }
}
// Search Weather function pulling weather data from weather API 
async function searchWeather() {
  let geo = await getGeo()
  console.log("Geo Found: ", geo, dayjs());
  var requestUrl = `https://weatherapi-com.p.rapidapi.com/current.json?q=${geo.latitude},${geo.longitude}`;
  $(currentCity)[0].textContent = "Please Wait: Weather Loading..."
  $(weatherIcon).attr("src", "https://cdn.360-value.com/iv360/21.1.50/resources/images/spinner.gif");
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

setInterval(searchWeather, 300000);
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
  var monthVal = currMonth;
  // console.log(currMonth);
  if (dateIndex < currDayIndex) {
    //To do handle for when day is in previous month
    indexDiff = currDayIndex - dateIndex;
    dayVal = currDay - indexDiff;
    // Handles if the week has days in 2 months
    if (dayVal < 1) {
      monthVal--;
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
    let dateText = `(${monthVal}/${dayVal})`
    $(this).text(dateText);

  }
  else if (dateIndex > currDayIndex) {
    //To Do handle what happens if day is in next month
    indexDiff = dateIndex - currDayIndex;
    //console.log(indexDiff);
    dayVal = Number(currDay) + indexDiff;
    //console.log(dayVal);
    if (dayVal > monthLen) {
      monthVal++;
      dayVal = (dayVal - monthLen);
      // console.log(dayVal);
    }
    let dateText = `(${monthVal}/${dayVal})`
    $(this).text(dateText);
  }
  else {
    let dateText = `(${currMonth}/${dayVal})`
    $(this).text(dateText);
  }
})
//console.log(currWkDay);


// Highlights the current day of the week
day.each(function () {
  // console.log($(this).attr("id"));
  if ($(this).attr("id") === currWkDay) {
    $(this).parent().addClass("curDay")
  }
  else {
    $(this).parent().removeClass("curDay")
  }
});

// Accordion 
var accElArray = $(".accordion");

// $('#acchead').on('click', function() {
//   if ($(this).hasClass('clickActive')) {
//     $('.accordion-body').hide();
//     $(this).removeClass('clickActive');
//   } else {
//     $('.accordion-body').show();
//     $(this).addClass('clickActive');
//   }
// }).on('mouseenter', function () {
//   if (!$(this).hasClass('clickActive')) {
//     $('.accordion-body').show();
//   }
// }).on('mouseleave', function () {
//   if (!$(this).hasClass('clickActive')) {
//     $('.accordion-body').hide();
//   }
// });
// });

for (let i = 0; i < accElArray.length; i++) {
  $(accElArray[i]).on("click", function () {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    this.classList.toggle("active");
    if (i == 4 || i == 11) {
      this.classList.toggle("rounded-b-lg")
    }
    console.log("click", this);
    let numLi;
    console.log("Number of Elements:", numLi)
    var panel = this.nextElementSibling;
    if (!this.classList.contains("active")) {
      panel.style.display = "none";
    }
    else {
      panel.style.display = "block";
    }
    if ($(this).parent().attr("id") == "todo-div") {
      numLi = $(this).next().children().length;
      if (panel.style.display === "none") {
        $(this).children().eq(0).text(numLi);
        if (numLi > 0) {
          $(this).children().eq(0).removeClass("hidden");
        }
      } else {
        // console.log( $(this).children().eq(1))
        $(this).children().eq(0).text(numLi);
        $(this).children().eq(0).addClass("hidden");
      }
    }
    else {
      console.log("In else statement");
      let typeArr = ["Unsorted", "Must-do", "Should-do", "Could-do"];
      let spanArr = [1, 2, 3, 4];
      let numLiArr = [0, 0, 0, 0];
      var panel = this.nextElementSibling;
      console.log("Panel Length", $(panel).children().length)
      for (let i = 0; i < $(panel).children().length; i++) {
        console.log("i", i)
        console.log($(panel).children().eq(i).attr("type"));
        let j = typeArr.findIndex((element) => element == $(panel).children().eq(i).attr("type"));
        console.log(j);
        numLiArr[j]++;
        console.log(numLiArr);
      }
      for (let i = 0; i < 4; i++) {

        if (panel.style.display === "none") {
          $(this).children().eq(spanArr[i]).text(numLiArr[i]);
          if (numLiArr[i] > 0) {
            $(this).children().eq(spanArr[i]).removeClass("hidden");

          }
        } else {
          // console.log( $(this).children().eq(1))
          $(this).children().eq(spanArr[i]).text(numLiArr[i]);
          $(this).children().eq(spanArr[i]).addClass("hidden");

        }
      }
    }
    storeTodos();
    /* Toggle between hiding and showing the active panel */

    // }).on('mouseenter', function () {
    //   if (!$(accElArray[i]).hasClass('active')) {
    //     $('.panel')[i].show();
    //     if (i == 3 || i == 10) {
    //       this.classList.toggle("rounded-b-lg")
    //     }
    //   }
    // }).on('mouseleave', function () {
    //   if (!$(this).hasClass('clickActive')) {
    //     $('.panel')[i].hide();
    //     if (i == 3 || i == 10) {
    //       this.classList.toggle("rounded-b-lg")
    //     }
    //     console.log("Number of Elements:", numLi)
    //     var panel = this.nextElementSibling;
    //     if ($(this).parent().attr("id") == "todo-div") {
    //       numLi = $(this).next().children().length;
    //       if (panel.style.display === "none") {
    //         $(this).children().eq(0).text(numLi);
    //         if (numLi > 0) {
    //           $(this).children().eq(0).removeClass("hidden");
    //         }
    //       } else {
    //         // console.log( $(this).children().eq(1))
    //         $(this).children().eq(0).text(numLi);
    //         $(this).children().eq(0).addClass("hidden");
    //       }
    //     }
    //     else {
    //       console.log("In else statement");
    //       let typeArr = ["Unsorted", "Must-do", "Should-do", "Could-do"];
    //       let spanArr = [1, 2, 3, 4];
    //       let numLiArr = [0, 0, 0, 0];
    //       var panel = this.nextElementSibling;
    //       console.log("Panel Length", $(panel).children().length)
    //       for (let i = 0; i < $(panel).children().length; i++) {
    //         console.log("i", i)
    //         console.log($(panel).children().eq(i).attr("type"));
    //         let j = typeArr.findIndex((element) => element == $(panel).children().eq(i).attr("type"));
    //         console.log(j);
    //         numLiArr[j]++;
    //         console.log(numLiArr);
    //       }
    //       for (let i = 0; i < 4; i++) {

    //         if (panel.style.display === "none") {
    //           $(this).children().eq(spanArr[i]).text(numLiArr[i]);
    //           if (numLiArr[i] > 0) {
    //             $(this).children().eq(spanArr[i]).removeClass("hidden");

    //           }
    //         } else {
    //           // console.log( $(this).children().eq(1))
    //           $(this).children().eq(spanArr[i]).text(numLiArr[i]);
    //           $(this).children().eq(spanArr[i]).addClass("hidden");

    //         }
    //       }
    //     }
    //     storeTodos();
    //   }
  });
};

// Make the day event list sortable and connected to the todo lists


// $(function() {
//   $("#Mon, #Tues, #Wed, #Thu, #Fri, #Sat, #Sun, .connectedSortable").sortable({
//     connectWith: ".connectedSortable, #Mon, #Tues, #Wed, #Thu, #Fri, #Sat, #Sun"
//   }).disableSelection();
// });

//To Do- refresh the calendar days for this week
