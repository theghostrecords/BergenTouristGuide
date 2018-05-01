var forecastArr = new Array;
var weatherOptions = new Array;
var dateOptions = new Array;

// Initialize weatherdata array from XML file
function initWeatherDataArr(xml) {
  // Response needs to be parsed to be manipulated
  parser = new DOMParser();
  xml = parser.parseFromString(xml, "text/xml");

  forecastArr = new Array;
  var time = xml.getElementsByTagName("time");

  // There are 5 time-nodes per hour of the day in the xml-document
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
      forecastArr.push(forecast(temperature, weather, timeOfDay, date.toDateString().substring(4)));
    }
    i = i - 3;
  }

  writeForecast(forecastArr);
  initWeatherOptions();
  initDateOptions();
}

// Write the table with the weatherforecast
function writeForecast(array) {
  for (var i = 0; i < array.length; i++) {
    var list = document.getElementById("table");
    var tr = document.createElement("tr");

    var tdDate = document.createElement("td");
    var tdTime = document.createElement("td");
    var tdTemp = document.createElement("td");
    var tdWeather = document.createElement("td");

    tdDate.appendChild(document.createTextNode(array[i].date));
    tdTime.appendChild(document.createTextNode(array[i].timeOfDay));
    tdTemp.appendChild(document.createTextNode(array[i].temperature + "° C"));
    tdWeather.appendChild(document.createTextNode(array[i].weather));

    tr.appendChild(tdDate);
    tr.appendChild(tdTime);
    tr.appendChild(tdTemp);
    tr.appendChild(tdWeather);

    list.appendChild(tr);
  }
}

// Initialize the select-weather box with options
function initWeatherOptions() {
  var selected = document.getElementById('weather');
  for (var i in forecastArr) {
    if (!weatherOptions.includes(forecastArr[i].weather)) {
      weatherOptions.push(forecastArr[i].weather);
    }
  }
  for (var i in weatherOptions) {
    var opt = document.createElement("option");
    opt.appendChild(document.createTextNode(weatherOptions[i]));
    selected.appendChild(opt)
  }
  var reset = document.createElement("option");
  reset.appendChild(document.createTextNode("Reset"))
  selected.appendChild(reset);
}

// Initialize the select-date box with options
function initDateOptions() {
  var selected = document.getElementById('date');
  for (var i in forecastArr) {
    if (!dateOptions.includes(forecastArr[i].date)) {
      dateOptions.push(forecastArr[i].date);
    }
  }
  for (var i in dateOptions) {
    var opt = document.createElement("option");
    opt.appendChild(document.createTextNode(dateOptions[i]));
    selected.appendChild(opt)
  }
  var reset = document.createElement("option");
  reset.appendChild(document.createTextNode("Reset"))
  selected.appendChild(reset);
}

// Find the chosen traits and write a new forecast
function findChosen() {
  document.getElementById('table').innerHTML = "";
  var printedArr = new Array;
  var chosenWeather = document.getElementById('weather').value;
  var chosenDate = document.getElementById('date').value;
  var chosenTemp = document.getElementById('temperature').value;
  var chosenSort = document.getElementById('sort').value;

  if (chosenWeather === "Reset") {
    document.getElementById('weather').selectedIndex = 0;
    chosenWeather = '';
  } else if (chosenDate === "Reset") {
    document.getElementById('date').selectedIndex = 0;
    chosenDate = '';
  } else if (chosenSort === "Reset") {
    document.getElementById('sort').selectedIndex = 0;
    chosenSort = '';
  }
  for (var i in forecastArr) {
    if (forecastArr[i].date === chosenDate && forecastArr[i].weather === "" && Number(forecastArr[i].temperature) === "")
      printedArr.push(forecastArr[i]);
    else if (chosenDate === '' && forecastArr[i].weather === chosenWeather && chosenTemp === '')
      printedArr.push(forecastArr[i]);
    else if (chosenDate === '' && chosenWeather === '' && Number(forecastArr[i].temperature) > chosenTemp)
      printedArr.push(forecastArr[i]);
    else if (chosenDate === '' && forecastArr[i].weather === chosenWeather && Number(forecastArr[i].temperature) > chosenTemp)
      printedArr.push(forecastArr[i]);
    else if (forecastArr[i].date === chosenDate && forecastArr[i].weather === chosenWeather && chosenTemp === '')
      printedArr.push(forecastArr[i]);
    else if (forecastArr[i].date === chosenDate && chosenWeather === '' && Number(forecastArr[i].temperature) > chosenTemp)
      printedArr.push(forecastArr[i]);
    else if (forecastArr[i].date === chosenDate && forecastArr[i].weather === chosenWeather && Number(forecastArr[i].temperature) > chosenTemp)
      printedArr.push(forecastArr[i]);
  }

  if (chosenSort === "Tid reversert")
    printedArr.reverse();
  else if (chosenSort === "Værtype alfabetisk")
    printedArr = sortBy(printedArr, "weather")
  else if (chosenSort === "Værtype alfabetisk reversert") {
    printedArr = sortBy(printedArr, "weather");
    printedArr.reverse();
  } else if (chosenSort === "Temperatur") {
    printedArr = sortBy(printedArr, "temperature")
    printedArr.reverse();
  } else if (chosenSort === "Temperatur reversert")
    printedArr = sortBy(printedArr, "temperature");
  writeForecast(printedArr);
}


function sortBy(printedArr, type) {
  var sortArr = new Array;
  for (var i in printedArr) {
    sortArr.push(printedArr[i][type]);
  }
  sortArr.sort();
  for (var i in sortArr) {
    for (var j in printedArr) {
      if (sortArr[i] === printedArr[j][type]) {
        sortArr[i] = printedArr[j];
        printedArr.splice(j, 1);
        break;
      }
    }
  }
  return sortArr;
}


// Forecast-object, containing temperature, weather, time, and date
function forecast(te, w, ti, d) {
  return {
    temperature: te,
    weather: w,
    timeOfDay: ti,
    date: d
  }
};