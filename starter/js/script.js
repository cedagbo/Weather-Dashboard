// Pseudocoding to display the current weather conditions and a 5-day forecast

// Make a function available right after the document is loaded
$(document).ready(function () {
    // Define some variables
    var apiKey = "7e841e926fbcd106537cc5abbbde126a";
    var currentConditionsApiUrl = "https://api.openweathermap.org/data/2.5/weather";
    var forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast";
  
    var searchHistory;

    // Define the function renderSearhHistory 
    function renderSearchHistory() {
        // Start with an empty list
        $("#search-history").empty();
        searchHistory = JSON.parse(localStorage.getItem("Searched Cities"));
        // Set the conditions regarding the user's search history
        if (!searchHistory) {
            searchHistory = [];
        } // Looping through each search and display it 
        for (var i = 0; i < searchHistory.length; i++) {
            var city = searchHistory[i];
            var button = $("<button></button>");
            button.css({"background-color": "#6D9886", "width": "300px"})
            button.addClass("btn");
            button.text(city);
            $("#search-history").append(button);
        }
    }
    // Define a function to get an API request
    function getCurrentWeather(cityName) {
        var weatherRequest = {
            q: cityName,
            appid: apiKey,
            units: "imperial"
        };

        $.get(currentConditionsApiUrl, weatherRequest)
            .done(data => onCurrentConditionsSuccess(data, cityName))
            .fail(onCurrentConditionsError);

        $.get(forecastApiUrl, weatherRequest)
            .done(onForecastSuccess)
            .fail(onForecastError);
    }

    // Define the function onCurrentConditionsError to handle user input mispelling

    function onCurrentConditionsError(Response) {
        console.log("error");
        if (Response.status >= 400 && Response.status < 500) {
            alert("There is something wrong with your city name. Please try again.")
        }
        else if (Response.status >= 500 && Response.status < 600) {
            alert("There is a problem getting your results. Please try again later.")
        }
        else {
            alert("There is an unknown error. Please try again later.")
        }
    }
    function onCurrentConditionsSuccess(data, cityName) {
        function displayCurrentConditions() {
            console.log(data);
            var date = new Date();
            var weatherIcon = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
            var weatherRequest = {
                lat: data.coord.lat,
                lon: data.coord.lon,
                appid: apiKey
            }

            // Display some specific features of the weather 
            $("#current-weather").empty();
            $("#current-weather").append($("<h3>" + data.name + " (" + date.toLocaleDateString() + ")" + "<img src=" + weatherIcon + "></img></h3>"));
            $("#current-weather").append($("<p>Temperature: " + data.main.temp + " °F</p>"));
            $("#current-weather").append($("<p>Wind: " + data.wind.speed*1.6 + " KPH</p>"));
            $("#current-weather").append($("<p>Humidity: " + data.main.humidity + " %</p>"));
        }

        function addHistoryButton() {
            var newSearch = $("<button>" + cityName + "</button>");
            newSearch.addClass("btn btn-outline-light");
            $("#search-history").append(newSearch);
        }

        function storeHistory() {
            searchHistory.push(cityName);
            localStorage.setItem("Searched Cities", JSON.stringify(searchHistory))
        }

        displayCurrentConditions();
        //only save new searches in local storage if they are not already there
        if (!searchHistory.includes(cityName)) {
            addHistoryButton();
            storeHistory();
        }
    }
    
    function onForecastError() {
        console.log("error");
    }

    function onForecastSuccess(hourForecasts) {
        // console.log(hourForecasts);
        
        var dayForecasts = hourForecasts.list.filter(forecast => forecast.dt_txt.includes('15:00:00'));

        $("#5-day-forecast").empty();
        //Display data for each day at 1500 in a new card
        for (var i = 0; i < dayForecasts.length; i++) {
            var forecast = dayForecasts[i]
            var date = new Date(forecast.dt_txt).toLocaleDateString();
            var weatherIcon = "http://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png";
            var temp = forecast.main.temp;
            var wind = forecast.wind.speed*1.6;
            var humidity = forecast.main.humidity;
            var card = $("<div class='card forecastCard'></div>");
            card.css("background-color", "#6D9886")
            card.append("<h4>" + date + "</h4>");
            card.append("<p class='card-text'>" + "<img src=" + weatherIcon + "></img><br>Temp: " + temp + "°F<br>Wind: " + wind + "KPH<br>Humidity: " + humidity + "%</p>");
            $("#5-day-forecast").append(card);
        }
    }

    renderSearchHistory();

    // Target the current weather and display the object
    $(".search-button").on("click", function (event) {
        event.preventDefault();
        var cityName = $("#search-input").val();
        $("#cityName").val("");
        getCurrentWeather(cityName);
    });

    // Create an event to display the search history
    $("#search-history").on("click", "button", function () {
        getCurrentWeather($(this).text());

    });

});
