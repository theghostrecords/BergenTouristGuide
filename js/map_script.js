/*Document by Joakim Moss Grutle*/
var toiletArr = new Array;
var markers = new Array;
var advancedSearchRegex = /\?(([a-zA-Z]+=[a-zA-Z0-9\.]*&*)+)/;
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
  readJSON();
  searchCriteria = searchCrit();
  for (i in advancedSearchArray) {
    splitArray = advancedSearchArray[i].split("=");
    if (splitArray[0] === "kjonn" && splitArray[1] === "herre")
      searchCriteria.herre = true;
    if (splitArray[0] === "kjonn" && splitArray[1] === "kvinne")
      searchCriteria.dame = true;
    if (splitArray[0] === "rullestol" && splitArray[1] !== "")
      searchCriteria.rullestol = true;
    if (splitArray[0] === "maksPris" && splitArray[1] !== "")
      searchCriteria.pris = splitArray[1];
    if (splitArray[0] === "gratis" && splitArray[1] !== "")
      searchCriteria.gratis = true;
    if (splitArray[0] === "stellerom" && splitArray[1] !== "")
      searchCriteria.stellerom = true;
    if (splitArray[0] === "plassering" && splitArray[1] !== "")
      searchCriteria.stellerom = splitArray[1];
    /*
    if (splitArray[0] === "aapen" && splitArray[1] !== ""){
      var crtDate = new Date();
      var dayOfWeek = crtDate.getDay();
      if()
        dayOfWeek++;
      if(dayOfWeek < 5 || dayOfWeek > 6)
        searchCriteria.tid_hverdag = splitArray[1];
      else if(dayOfWeek === 5)
        searchCriteria.tid_sondag = splitArray[1];
      else
        searchCriteria.tid_lordag = splitArray[1];
    }
    if (splitArray[0] === "aapenNaa" && splitArray[1] !== ""){
      var crtDate = Date.now();
      if()
        dayOfWeek++;
      if(dayOfWeek < 5 || dayOfWeek > 6)
        searchCriteria.tid_hverdag = splitArray[1];
      else if(dayOfWeek === 5)
        searchCriteria.tid_sondag = splitArray[1];
      else
        searchCriteria.tid_lordag = splitArray[1];
    }*/
  }
  var advSearch = false;
  for (crit in searchCriteria) {
    if (searchCriteria[crit] !== false && searchCriteria[crit] !== undefined)
      advSearch = true;
  }

  if (advSearch) {
    var arr = new Array;

    for (var toilet in toiletArr) {
      var listToilet = true;
      for (var crit in searchCriteria) {
        if (searchCriteria[crit] !== false) {
          var entry = getEntry(crit, toilet);
          if (entry === undefined || entry === "" || entry === "NULL") {
            listToilet = false;
          }
          // if herre === NULL && pissoir === 1 => Toalett for herrer
          if (crit === "herre" && entry == "NULL") {
            entry = getEntry("pissoir_only", toilet);
            if (entry === "1")
              listToilet = true;
          }
        }
      }
      if (listToilet)
        arr.push(toiletArr[toilet]);
    }
    toiletArr = arr;
    console.log(arr);
  }
}

//Function that returns an object for searching
function searchCrit() {
  return {
    herre: false,
    tid_sondag: false,
    pissoir_only: false,
    stellerom: false,
    tid_hverdag: false,
    plassering: false,
    tid_lordag: false,
    rullestol: false,
    adresse: false,
    pris: false,
    id: false,
    place: false,
    dame: false,
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
