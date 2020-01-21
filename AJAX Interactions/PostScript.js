// Name: William Dang
// Class: CS 290
// Date: 11/5/2019
// Description: Assignment 5 - AJAX Interactions

document.addEventListener('DOMContentLoaded', activateButton);

function activateButton()
{
	document.getElementById("postButton").addEventListener("click", function(event)
	{
		var req = new XMLHttpRequest();
		var URL = "http://httpbin.org/post";
		var payload = {userName: null, email: null, password: null}; // initialize payload objects to null
		payload.userName = document.getElementById("username").value;
		payload.email = document.getElementById("email").value;
		payload.password = document.getElementById("password").value;
	
		req.open('POST', URL, true); // open asynchronous POST request to URL
		req.setRequestHeader('Content-Type', 'application/json'); // send content type of application/json
		req.addEventListener("load", function()
		{
			if (req.status >= 200 && req.status < 400)
			{
				var response = JSON.parse(JSON.parse(req.responseText).data);
				console.log(response);

				document.getElementById("post_info").textContent = "The information you just entered...";
				document.getElementById("post_userName").textContent = "Username: " + response.userName;
				document.getElementById("post_Email").textContent = "Email: " + response.email;
				document.getElementById("post_Password").textContent = "Password: " + response.password;
			}

			else
			{
				var errorMessage = "Error: " + response.statusText;
				console.log(errorMessage);
			}
		});

		req.send(JSON.stringify(payload));
		event.preventDefault();
	});
}