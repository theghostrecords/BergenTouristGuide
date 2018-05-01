// Send GET-request for dataset (JSON/XML-format) and return a Promise
function readJSON(url, useCase) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          if (useCase === "værdata")
            resolve(xhr.responseXML);
          else
            resolve(xhr.response);
        } else {
          if (useCase === "værdata")
            reject(xhr.responseXML);
          else
            reject(xhr.response);
        }
      }
    };
    xhr.send();
  });
}

var tryCounter = 10; // Number of tries before error message is added to DOM
// Retrieves data from url, if success call the initFunction if not try again or add Error-message
function scan(url, useCase) {
  var promise = readJSON(url);
  promise.then(function (response) {
      if (useCase === "weatherData")
        initWeatherDataArr(response);
      else {
        var response = JSON.parse(response);
        if (useCase === "toilets")
          initToiletArr(response);
        else if (useCase === "playground")
          initPlaygroundArr(response);
        else if (useCase === "favorite")
          initFavArr(response);
        else if (useCase === "otherSet")
          initClosestToiletsList(response);
      }
    })
    .catch(function (reason) {
      if (tryCounter-- <= 0) {
        var errorDiv = document.getElementById('errorMsg');
        var h3 = document.createElement('h3');
        h3.id = "errorMsg";
        h3.appendChild(document.createTextNode("Kunne ikke laste ned datasettet"));
        errorDiv.appendChild(h3);
        return null;
      }
      console.log("Kunne ikke laste datasett: " + reason);
      scan(url, useCase);
    });
}

//initialize the marker on the map
function initMap(arr) {

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {
      lat: 60.3928444,
      lng: 5.3239541
    }
  });
  if (arr === undefined)
    return;

  for (var i = 0; i < arr.length; i++) {
    markers[i] = new google.maps.Marker({
      position: getLatLng(arr, i),
      map: map,
      label: (i + 1).toString()
    })
  }
}

// Separate function to get latitude and longitude
function getLatLng(jsonArr, i) {
  var lat;
  var lng;
  for (var entry in jsonArr[i]) {
    var arr = jsonArr[i];

    if (arr[entry].key === "latitude")
      lat = Number(arr[entry].value);
    if (arr[entry].key === "longitude")
      lng = Number(arr[entry].value);
  }
  return {
    lat,
    lng
  };
}

// Helper function to add list element to the ordered list
function addToList(val) {
  var ol = document.getElementById('list');
  var toiletEntry = document.createElement('li');
  toiletEntry.appendChild(document.createTextNode(val));
  ol.appendChild(toiletEntry);
}

// function that returns an object with a key and a value, used in toiletArr
function keyValue(k, v) {
  return {
    key: k,
    value: v
  };
}