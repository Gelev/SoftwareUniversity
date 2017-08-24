function attachEvents (){
    $("#submit").on('click', requestData);

        function requestData(){

            $.ajax({
                method: "GET",
                url: "https://judgetests.firebaseio.com/locations.json",
                success: function (success){
                    console.log(success);
                    let townCode;
                    $("#forecast").show();
                    for(let city of success){
                        console.log(city.name);
                        if($("#location").val().trim() == city.name){
                            townCode = city.code;
                            
                            $.ajax({
                                method: "GET",
                                url: `https://judgetests.firebaseio.com/forecast/today/${townCode}.json`,
                                success: function (forecastData){
                                    console.log(forecastData);

                                    // Draw the data
                                    
                                    $(".condition").remove();
                                    $(".upcoming").remove();
                                    $("#current").append("<span class='condition symbol'>"+ getWeatherIcon(forecastData.forecast.condition) +"</span>");
                                    $("#current").append(($("<span>").addClass("condition"))
                                        .append("<span class='forecast-data'>"+ forecastData.name +"</span>")
                                        .append("<span class='forecast-data'>"+ forecastData.forecast.low + '&#176;' + "/" + forecastData.forecast.high + '&#176;' + "</span>")
                                        .append("<span class='forecast-data'>"+ forecastData.forecast.condition +"</span>"));
                                },
                                error: function (unsuccessfulForcastRequest){
                                    alert('Unsuccessful forcast request.');
                                }
                            });
                            $.ajax({
                                method: "GET",
                                url: `https://judgetests.firebaseio.com/forecast/upcoming/${townCode}.json`,
                                success: function (threeDayForecast){
                                    console.log(threeDayForecast);

                                    // Draw the data
                                    $("#upcoming").append(($("<span>").addClass("upcoming"))
                                                        .append("<span class='symbol'>" + getWeatherIcon(threeDayForecast.forecast[0].condition) + "</span>")
                                                        .append("<span class='forecast-data'>"+ threeDayForecast.forecast[0].low + '&#176;' + "/" + threeDayForecast.forecast[0].high + '&#176;' + "</span>")
                                                        .append("<span class='forecast-data'>" + threeDayForecast.forecast[0].condition + "</span>")
                                    )
                                    .append(($("<span>").addClass("upcoming"))
                                                        .append("<span class='symbol'>" + getWeatherIcon(threeDayForecast.forecast[1].condition) + "</span>")
                                                        .append("<span class='forecast-data'>"+ threeDayForecast.forecast[1].low + '&#176;' + "/" + threeDayForecast.forecast[1].high + '&#176;' + "</span>")
                                                        .append("<span class='forecast-data'>" + threeDayForecast.forecast[1].condition + "</span>")
                                    )
                                    .append(($("<span>").addClass("upcoming"))
                                                        .append("<span class='symbol'>" + getWeatherIcon(threeDayForecast.forecast[2].condition) + "</span>")
                                                        .append("<span class='forecast-data'>"+ threeDayForecast.forecast[2].low + '&#176;' + "/" + threeDayForecast.forecast[2].high + '&#176;' + "</span>")
                                                        .append("<span class='forecast-data'>" + threeDayForecast.forecast[2].condition + "</span>")
                                    );

                                },
                                error: function (threeDayDataFailure){
                                    alert('Unable to retrieve 3 day data.');
                                }

                            });
                        }
                    }
                },
                error: function (error){
                    console.log("Error");
                }
            });
    }; // requestData() end;

    function getWeatherIcon(condition){
        return{
            'Sunny' : '&#x2600;',
            'Partly sunny' : '&#x26C5;',
            'Overcast' : '&#x2601;',
            'Rain' : '&#x2614;'
        }[condition];
    }
}