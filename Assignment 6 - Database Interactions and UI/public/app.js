document.getElementById("add").addEventListener("click", function(event){
  var req = new XMLHttpRequest();
  var route = "/insert";
  var payload = "name=" + document.getElementById("name").value + "&reps=" + document.getElementById("reps").value + "&weight=" + document.getElementById("weight").value + "&date=" + document.getElementById("date").value + "&lbs=" + document.getElementById("lbs").value;

  //GET
  req.open("GET",route + "?" + payload, true);
	req.addEventListener('load', function(){
    //make sure if the response is valid
		if(req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			console.log(response);

      
      var table = document.getElementById("table");
      var newRow = document.createElement("tr");
      var name = document.createElement("td");
      var reps = document.createElement("td");
      var weight = document.createElement("td");
      var date = document.createElement("td");
      var lbs = document.createElement("td");

      //add variables appended
      name.innerHTML = document.getElementById("name").value;
      table.appendChild(newRow).appendChild(name);
      reps.innerHTML = document.getElementById("reps").value;
      table.appendChild(newRow).appendChild(reps);
      weight.innerHTML = document.getElementById("weight").value;
      table.appendChild(newRow).appendChild(weight);
      date.innerHTML = document.getElementById("date").value;
      table.appendChild(newRow).appendChild(date);
      lbs.innerHTML = document.getElementById("lbs").value;
      table.appendChild(newRow).appendChild(lbs);

      //edit button
      var edit = document.createElement("td");
      var length = response.results.length - 1;
      console.log(length);
      var id = response.results[length].id;
      console.log(id);
      newRow.setAttribute("id", id + "row");

      var newForm1 = document.createElement("form");
      newForm1.setAttribute("method", "get");
      newForm1.setAttribute("action", "./edit");
      var newInput1 = document.createElement("input");
      newInput1.setAttribute("type", "hidden");
      newInput1.setAttribute("name", "id");
      newInput1.setAttribute("value", id) ;
      newForm1.appendChild(newInput1);
      var button1 = document.createElement("button");
      button1.setAttribute("type", "submit");
      button1.textContent = "Edit";
      newForm1.appendChild(button1);
      edit.appendChild(newForm1);
      table.appendChild(newRow).appendChild(edit);



      var remove = document.createElement("td");

      //set attribute for remove
      var newForm2 = document.createElement("form");
      newForm2.setAttribute("method", "get");
      newForm2.setAttribute("action", "./delete");
      var newInput2 = document.createElement("input");
      newInput2.setAttribute("type", "hidden");
      newInput2.setAttribute("name", "id");
      newInput2.setAttribute("value", id);
      newForm2.appendChild(newInput2);

      //delete button creation
      var button2 = document.createElement("button");
      button2.setAttribute("type", "submit");
      button2.setAttribute("onClick", "deleteRow(id)")
      button2.textContent = "Delete";
      newForm2.appendChild(button2);
      remove.appendChild(newForm2);
      table.appendChild(newRow).appendChild(remove);
		}
		else {
	    	console.log("Error in network request: " + req.statusText);
		}
	});
	req.send(route + "?" + payload);
	event.preventDefault();
});

//function to load table after reset
function loadTable(response){
   var table = "<table><tr><th>Name</th><th>Reps</th><th>Weight</th><th>Date</th><th>lbs/kgs (lbs = 1, kgs = 0)</th><th>Edit</th><th>Delete</th></tr>";
   //print values
   for(var i=0; i < response.length; i++){
        table += "<tr>";
        table += "<td>"+response[i].name   +"</td>";
	      table += "<td>"+response[i].reps   +"</td>";
        table += "<td>"+response[i].weight +"</td>";
        var a = response[i].date.split("T")
        table += "<td>"+ a[0] +"</td>";
        table += "<td>"+response[i].lbs    +"</td>";
      	table += "<td><input type='button' name='id' value='Edit' onclick='window.location.href=\"/edit?id="+response[i].id+"\"'></td>";
      	table += "<td><input type='button' name='id' value='Delete' onclick='deleteRow("+response[i].id+")'></td>";
        table += "</tr>";
   }
   table += "</table>";
   console.log(table);
   document.getElementById("stuff").innerHTML = table;
};

//delete row function 
function deleteRow(id){
  var req = new XMLHttpRequest();
  req.open("GET", "/delete?id="+ id, false);
  req.addEventListener("load",function(){
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText);
      console.log(response);
      loadTable(response);
    }
    else{
      console.log("Error in network request: " + req.statusText);
    }
  })
  req.send(null);
  event.preventDefault();
}
