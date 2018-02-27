var toiletArr = new Array;
var markers = new Array;

//Markers on google maps - top half by Joakim Moss Grutle
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {
      lat: 60.3928444,
      lng: 5.3239541
    }
  });

  for (var i = 0; i < toiletArr.length; i++) {
    markers[i] = new google.maps.Marker({
      position: getLatLng(i),
      map: map,
      label: (i + 1).toString()
    })
  }
}

// Get latitude and longitude from toiletArr
function getLatLng(i) {
  var lat;
  var lng;
  for (var entry in toiletArr[i]) {
    var arr = toiletArr[i];

    if (arr[entry].key === "latitude")
      lat = Number(arr[entry].value);
    if (arr[entry].key === "longitude")
      lng = Number(arr[entry].value);
  }
  return {lat, lng};
}

//From here and down - By Øyvind Skeie liland
function keyValue(k, v) {
  return {
    key: k,
    value: v
  };
}

// Helper function to add list element to the ordered list
function addToList(val) {
  var ol = document.getElementById('list');
  var toiletEntry = document.createElement('li');
  toiletEntry.appendChild(document.createTextNode(val));
  ol.appendChild(toiletEntry);
}

// Read JSON file and add to array
function readJSON() {
  var json = JSON.parse(data)[0];

  for (var i = 0; i < json.entries.length; i++) {
    var arr = new Array;
    for (var entry in json.entries[i]) {
      var value = json.entries[i][entry];
      arr.push(keyValue(entry, value));
      if (entry === "plassering")
        addToList(value);
    }
    toiletArr.push(arr);
  }
}
console.log("Ran map_script.js");
