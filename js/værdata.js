//document by Joakim Moss Grutle
var weatherdataArr = new Array;
var weatherOptions = new Array;

// Initialize weatherdata array from XML file
function initVærDataArr(xml) {
  var time = xml.getElementsByTagName("time");

  //there are 5 time-nodes per hour of the day in the xml-document
  for (var i = 0; i < time.length; i = i + 4) {
    var timeOfDay = time[i].getAttribute("to");
    var d = timeOfDay.split("T")[0];
    var date = new Date(d);
    timeOfDay = timeOfDay.split("T")[1].split(":")[0] + ".00";

    if (time[i].getAttribute("from") === time[i].getAttribute("to")) {
      var temperature = time[i].childNodes[1].childNodes[1].getAttribute("value");
      i++; //Short weather explanation is on next time-node
      var weather = time[i].childNodes[1].childNodes[3].getAttribute("id");
      if (weather === "TTT")
        break;
      weatherdataArr.push(forecast(temperature, weather, timeOfDay, date));
    }
    i = i - 3;
  }
  writeForecast();
}

// function to write the table with the weatherforecast
function writeForecast() {
  for (var i = 0; i < weatherdataArr.length; i++) {
    var list = document.getElementById("list");
    var tr = document.createElement("tr");

    var tdDate = document.createElement("td");
    var tdTime = document.createElement("td");
    var tdTemp = document.createElement("td");
    var tdWeather = document.createElement("td");

    tdDate.appendChild(document.createTextNode(weatherdataArr[i].date.toDateString().substring(4)));
    tdTime.appendChild(document.createTextNode(weatherdataArr[i].timeOfDay));
    tdTemp.appendChild(document.createTextNode(weatherdataArr[i].temperature + "° C"));
    tdWeather.appendChild(document.createTextNode(weatherdataArr[i].weather));

    tr.appendChild(tdDate);
    tr.appendChild(tdTime);
    tr.appendChild(tdTemp);
    tr.appendChild(tdWeather);

    list.appendChild(tr);
  }
}

function initFavOptions() {
    var select = document.getElementById('favorite');
    for (var i in weatherdataArr) {
      if(!weatherOptions.contains(i.weather))
        weatherOptions.push(i.weather);
        }
    var opt = document.createElement("option");
    for(var i in weatherOptions)
      opt.appendChild(document.createTextNode(i));

    select.appendChild(opt);
}

function findChosenWeather() {
    // Get the chosen playgrouns coordinates
    var chosen = document.getElementById('favorite').value;
    var index = "";
    if (index === -1) {
        console.log("This playground does not exist in the dataset");
        return;
    }
    playGroundCoord = coordinate(lekeplassArr[index][3].value, lekeplassArr[index][0].value)

    // Get the other dataset -> readJSON calls the function: initClosestToiletsList in this file
    var json = readJSON('https://hotell.difi.no/api/json/bergen/dokart?', 'otherSet');
}


//forecast-object, containing temperature, weather, time, and date
function forecast(te, w, ti, d) {
  return {
    temperature: te,
    weather: w,
    timeOfDay: ti,
    date: d
  }
};

console.log(weatherdataArr);
