const currentCity = document.querySelector("#current-city")
const currentTemp = document.querySelector("#current-temp");
const currentWind = document.querySelector("#current-wind");
const currentHumidity = document.querySelector("#current-humidity");


var currWkDay = dayjs().format("ddd");
var currDay = dayjs().format("MM / D");
var currMonth = dayjs().format("MM");
var curYear = dayjs().format("YYYY");
var day = $(".day");



var currentDate = dayjs().format('dddd, MMMM D, YYYY');
var currentTime = dayjs().format('hh:mm:ss a');

// display current date and time 
$("#currentDay").html(currentDate);
$("#currentTime").html(currentTime);

let lat = 39
let lon = -75

const settings = {
  async: true,
  crossDomain: true,
  url: `https://weatherapi-com.p.rapidapi.com/current.json?q=${lat},${lon}`,
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '',
    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
  }
};

// $.ajax(settings).done(function (response) {
//   console.log(response);
// });

// Search Weather function pulling weather data from open weather 
function searchWeather() {
  fetch(settings)
    .then((response) => {
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
  searchWeather();
};



// To Do update the date for each day
day.each(function () {
  if ($(this).attr("id") == currWkDay) {
    $(this).text("Today");
  }
})

//To Do- refresh the calendar days for this week

