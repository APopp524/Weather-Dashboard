//search for city function//
function searchCity(cityname) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=934c1a5b2b885889eda3181f27a45d02";
    var queryURLforcast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=imperial&appid=934c1a5b2b885889eda3181f27a45d02";

    //Bring in moment.js and get an up to date weather//
    moment().format('LLL');


    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        $("#current").empty();

        //creates HTML for updated city stats//
        var mainDate = moment().format('LLL');
        var currentweather = response.weather[0].main;
        var cityNameEl = $("<h2>").text(response.name);
        var displayMainDate = cityNameEl.append(" " + mainDate);
        var tempEL = $("<p>").text("Temprature: " + response.main.temp);
        var humEl = $("<p>").text("Humidity: " + response.main.humidity);
        var windEl = $("<p>").text("Wind Speed: " + response.wind.speed);

        var newDiv = $('<div>');
        newDiv.append(displayMainDate, currentIcon, tempEL, humEl, windEl);
        $("#current").html(newDiv);

        //icons for each different type of weather//
        if (currentweather === "Rain") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        } else if (currentweather=== "Clouds") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        } else if (currentweather === "Clear") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
         else if (currentweather === "Drizzle") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
         else if (currentweather === "Snow") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }


            //UV Index//

            var lat = response.coord.lat;
            var lon = response.coord.lon;
            var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&appid=934c1a5b2b885889eda3181f27a45d02&lat=" + lat  + "&lon=" + lon;

                    $.ajax({
                        url: queryURLUV,
                        method: 'GET'
                    }).then(function (response) {
                        $('#uvl-display').empty();
                        var uvlresults = response.value;
                        //create HTML for new div
                        var uvlEl = $("<button class='btn bg-success'>").text("UV Index: " + response.value);
                
                        $('#uvl-display').html(uvlEl);
                
                    });
                });


        //Five Day Forcast//
            $.ajax({
                url: queryURLforcast,
                method: 'GET'
            }).then(function (response) {
                var results = response.list;
                $("#fiveDay").empty();
                for (var i = 0; i < results.length; i += 8) {

                    //Creates a card for each day of the forcast//
                    var fiveDayDiv = $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem;'>");
                    
                    //Stores the date, temperature, and humidity for each day//
                    var date = results[i].dt_txt;
                    var setDate = date.substr(0,10)
                    var temp = results[i].main.temp;
                    var hum = results[i].main.humidity;
        
                    //Displays the date, temperature, and humidity for each day//
                    var fivedayDate = $("<h5 class='card-title'>").text(setDate);
                    var pTemp = $("<p class='card-text'>").text("Temp: " + temp);;
                    var pHum = $("<p class='card-text'>").text("Humidity " + hum);;

                    var weather = results[i].weather[0].main

                    //icons on the card for each different type of weather//
                    if (weather === "Rain") {
                        var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
                        icon.attr("style", "height: 40px; width: 40px");
                    } else if (weather === "Clouds") {
                        var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
                        icon.attr("style", "height: 40px; width: 40px");
                    } 
                    else if (weather === "Clear") {
                        var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
                        icon.attr("style", "height: 40px; width: 40px");
                    }
                    else if (weather === "Drizzle") {
                        var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
                        icon.attr("style", "height: 40px; width: 40px");
                    }
                    else if (weather === "Snow") {
                        var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
                        icon.attr("style", "height: 40px; width: 40px");
                    }

                    //append the items//
                    fiveDayDiv.append(fivedayDate);
                    fiveDayDiv.append(icon);
                    fiveDayDiv.append(pTemp);
                    fiveDayDiv.append(pHum);
                    $("#fiveDay").append(fiveDayDiv);
                }

            });



        }
        pageLoad();
        
        //saves the city search//
        $("#select-city").on("click", function (event) {
            event.preventDefault();

            // Stores the city name to local storage//
            var cityInput = $("#city-input").val().trim();
            var textContent = $(this).siblings("input").val();
            var storearr = [];
            storearr.push(textContent);
            localStorage.setItem('cityName', JSON.stringify(storearr));
        
            searchCity(cityInput);
            pageLoad();
        });

        //Recalls previous searched cities//
        function pageLoad () {
            var lastSearch = JSON.parse(localStorage.getItem("cityName"));
            var searchDiv = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>").text(lastSearch);
            var psearch = $("<div>");
            psearch.append(searchDiv)
            $("#searchhistory").prepend(psearch);
        }

        //displays and onclick for search history//
        $("#searchhistory").on('click', '.btn', function(event) {
        event.preventDefault();

            searchCity($(this).text());

        });