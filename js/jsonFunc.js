// Send GET-request for dataset (JSON-format)
function readJSON(url, useCase) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  //xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  console.log(xhr);

  xhr.onreadystatechange = function() {
    if (xhr.status == 200 && xhr.readyState == 4) {
      if (useCase === "toilets")
        initToiletArr(JSON.parse(xhr.responseText));
      else if (useCase === "lekeplasser")
        initLekeplassArr(JSON.parse(xhr.responseText));
      else if (useCase === "værdata"){
        initVærDataArr(xhr.responseXML);
      }
    }
  }
  xhr.send();
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
    longitude: lng,
    latitude: lat,
    sumOf: Math.abs(lng + lat)
  };
}

// Function that takes two coordinates as parameters and calculates the difference between them
function calculateDistance(cord1, cord2) {
  return coordinate(cord1.longitude - cord2.longitude, cord1.latitude - cord2.latitude);
}
