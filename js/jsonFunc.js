// Send GET-request for dataset (JSON/XML-format)
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

// Forklar hvorfor denne finnes
function scan(url, useCase) {
  var promise = readJSON(url);
  promise.then(function (response) {
      if (useCase === "værdata")
        initVærDataArr(response);
      else {
        var response = JSON.parse(response);
        if (useCase === "toilets")
          initToiletArr(response);
        else if (useCase === "lekeplasser")
          initLekeplassArr(response);
        else if (useCase === "favoritt")
          initFavArr(response);
        else if (useCase === "otherSet")
          initClosestToiletsList(response);
      }
    })
    .catch(function (reason) {
      console.log(reason); // legg inn feilmelding
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

function coordinate(lng, lat) {
  return {
    longitude: Number(lng),
    latitude: Number(lat),
  };
}

/* Function that takes two coordinates as parameters and calculates the difference between them
   The calculation is done by using the Haversine formula
*/
function calculateDistance(cord1, cord2) {
  var earthR = 6372.8;
  var lat1 = cord1.latitude;
  var lat2 = cord2.latitude;
  var distLat = toRadians(cord1.latitude - cord2.latitude);
  var distLng = toRadians(cord1.longitude - cord2.longitude);;

  var n = Math.pow(Math.sin(distLat / 2), 2) + Math.pow(Math.sin(distLng / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
  var k = 2 * Math.asin(Math.sqrt(n));
  return earthR * k;
}

function toRadians(deg) {
  return deg * (Math.PI / 180);
}