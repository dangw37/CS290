// Name: William Dang
// Class: CS 290
// Date: 11/5/2019
// Description: Assignment 5 - AJAX Interactions


document.addEventListener('DOMContentLoaded', activateButton);

function activateButton()
{
	document.getElementById("weather_button").addEventListener("click", function(event)
	{
		var req = new XMLHttpRequest(); // Generate new request
		var baseURL = "http://api.openweathermap.org/data/2.5/weather?";
		var apiKey = "&appid=b0fd470ab45e675d672866b36168628e";

		var zipInput = document.getElementById("zip_input").value;
		var cityInput = document.getElementById("city_input").value;

		var addedToURL = "";

		if (zipInput != "") // adjust url if zip input
		{
			addedToURL = "zip=" + zipInput;
		}

		else if (cityInput != "") // otherwise, adjust url for city input
		{
			addedToURL = "q=" + cityInput;
		}

		var finalURL = baseURL + addedToURL + apiKey + "&units=imperial"; // make final url for server

		req.open('GET', finalURL, true);
		req.addEventListener("load", function()
		{
			if (req.status >= 200 && req.status < 400)
			{
				var response = JSON.parse(req.responseText);
				console.log(response);
				document.getElementById("weather_announcement").textContent = "Here is the weather for your location...";
				document.getElementById("location").textContent = "Location: " + response.name;
				document.getElementById("weather_description").textContent = "Description: " + response.weather[0].description;
				document.getElementById("current_temperature").textContent = "Current Temperature: " + response.main.temp + " Farenheit";
				document.getElementById("pressure").textContent = "Pressure: " + response.main.pressure + " hectopascals";
				document.getElementById("humidity").textContent = "Humidity: " + response.main.humidity + "%";
				document.getElementById("wind_speed").textContent = "Wind Speed: " + response.wind.speed + " miles per hour";
			}

			else
			{
				var errorMessage = "Error: " + response.statusText;
				console.log(errorMessage);
			}
		});

		req.send(finalURL);
		event.preventDefault();
	});
}