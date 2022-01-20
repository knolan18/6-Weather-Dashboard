var searchBtnEl = document.getElementById('#searchBtn');
var cardEl = document.querySelectorAll('card');
var apikey = 'd2118e31f9f0cc212cd748164bf1fcf9'
var currentWeather = `api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}`
var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}&units=imperial`
var archive = JSON.parse(window.localStorage.getItem('archive')) || [];

$(document).ready(function() {
  $('#searchBtn').on('click',function () {
    var cityInput = $('#searchInput').val();
    $('#searchInput').val('')
    currentWeatherSearch(cityInput)
  })

  function listItem(citiesHistory) {
    var li = $('<li>').addClass('list-group-item list-group-item-action').text(citiesHistory);
    $('#archive').append(li);
  }

  $('#archive').on('click', 'li', function() {
    currentWeatherSearch($(this).text());
  })

  function currentWeatherSearch(cityInput) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apikey}`)
      .then(response => 
        response.json())
      .then(data=> {
        $('#mainWeather').removeClass('hide');
        $('#days5').removeClass('hide');
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        var cityName = data.name;
        // Set LocalStorage
        if(archive.indexOf(cityInput) === -1) {
          archive.push(cityInput)
          window.localStorage.setItem('archive', JSON.stringify(archive));
          listItem(cityInput)
        }

        $('#cityName').text(cityName)
        oneCall(lat, lon)
      })
  }

  function oneCall(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
      // Current Weather Code
      var temp = data.current.temp;
      var humid = data.current.humidity;
      var wind = data.current.wind_speed;
      var uvi = data.current.uvi;
      var currentImage = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`

      $('#currentImage').attr('src', currentImage)
      $('#temp').text(temp + ' ºF');
      $('#humidity').text(humid + '%');
      $('#wind').text(wind + ' MPH');
      $('#uvi').text(uvi)
      console.log(data)
      if(uvi <= 3) {
        $('#uvi').css('background-color', 'green')
      } else if (uvi <= 7) {
        $('#uvi').css('background-color', 'yellow')
      } else {
        $('#uvi').css('background-color', 'red')
      }

      // Five Day Forecast Code
      console.log(moment(data.daily[1].dt, 'X').format('MM/DD/YYYY'))
      $('.row-col-5').empty();
      for(var i = 1; i < 6; i ++) {
        var card = $('<card>').attr('class', 'col-2 card');
        var date = $('<h4>').text(moment(data.daily[i].dt, 'X').format('MM/DD/YYYY'));
        var temp = $('<p>').text('Temp: ' + data.daily[i].temp.max + ' ºF')
        var wind = $('<p>').text('Wind Speed: ' + data.daily[i].wind_speed+ ' MPH')
        var humidity = $('<p>').text('Humidity: ' + data.daily[i].humidity + '%')
        var icon = $('<img>').attr('src', `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png`)

        card.append(date, icon, temp, wind, humidity)
        $('.row-col-5').append(card);

      }
    })
  }
  for(var i = 0; i<archive.length; i ++) {
    listItem(archive[i])
  }
})

