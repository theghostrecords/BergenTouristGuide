/*Document by Joakim Moss Grutle*/
var toiletArr = new Array;
var markers = new Array;
var advancedSearchRegex = /\?(([a-zA-Z]+=[a-zA-Z0-9\.\:]*&*)+)/;
var advancedSearchArray = location.href.match(advancedSearchRegex);
var advancedSearchArray = advancedSearchArray[1].split("&");
var searchCriteria;

//Markers on google maps
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
  return {
    lat,
    lng
  };
}

//Get entry from toiletArr
function getEntry(s, i) {
  for (var entry in toiletArr[i]) {
    var arr = toiletArr[i];
    if (arr[entry].key === s)
      return arr[entry].value;
  }
}

function advancedSearch() {
  searchCriteria = searchCrit();
  for (i in advancedSearchArray) {
    splitArray = advancedSearchArray[i].split("=");
    if (splitArray[0] === "kjonn" && splitArray[1] === "herre")
      searchCriteria.gender = "herre";
    if (splitArray[0] === "kjonn" && splitArray[1] === "kvinne")
      searchCriteria.gender = "dame";
    if (splitArray[0] === "rullestol" && splitArray[1] !== "")
      searchCriteria.wheelChair = true;
    if (splitArray[0] === "aapen" && splitArray[1] !== "")
      searchCriteria.open = splitArray[1];
    if (splitArray[0] === "maksPris" && splitArray[1] !== "")
      searchCriteria.maximumPrice = splitArray[1];
    if (splitArray[0] === "gratis" && splitArray[1] !== "")
      searchCriteria.free = true;
    if (splitArray[0] === "stellerom" && splitArray[1] !== "")
      searchCriteria.nursery = true;
  }
}

//Function that returns an object for searching
function searchCrit() {
  return {
    gender: false,
    free: false,
    open: false,
    wheelChair: false,
    nursery: false,
    maximumPrice: false
  };
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
console.log(advancedSearchArray);
