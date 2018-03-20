/*Document by Joakim Moss Grutle*/
var toiletArr = new Array; // array with kayvalue-objects, to keep track of the toilets
var markers = new Array;
var advancedSearchRegex = /\?(([a-zA-Z]+=[a-zA-Z0-9\.\+(%3A)]*&*)+)/;
var freeSearchRegex = /freeSearch=(((([a-zA-ZæøåÆØÅ]+(%3A)[a-zA-Z0-9æøåÆØÅ\.]+)|(([a-zA-ZæøåÆØÅ]*)*))\+*)*)&/
// matching regex with url, splitting the values on "+" or "&"
var freeSearchArray = decodeURI(location.href).match(freeSearchRegex);
var freeSearchArray = freeSearchArray[1].split("+");
var advancedSearchArray = location.href.match(advancedSearchRegex);
var advancedSearchArray = advancedSearchArray[1].split("&");
var searchCriteria; //searchCriteria-object that contains information about whether criteria should be checked or not

//initialize the marker on the map
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

// Separate function to get latitude and longitude
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

//Create searchCriteria object, find out which toilets to print
function advancedSearch() {
  readJSON();
  searchCriteria = searchCrit();

  // check if freeSearch isn't empty, run searchMatching() to initialize the searchCriteria-object
  if (freeSearchArray !== null) {
    searchMatching(freeSearchArray, "%3A", searchCriteria);
  }
  searchMatching(advancedSearchArray, "=", searchCriteria);

  //check if any criteria in searchCriteria has been set to something other than false
  var advSearch = false;
  for (crit in searchCriteria) {
    if (searchCriteria[crit] !== false && searchCriteria[crit] !== undefined)
      advSearch = true;
  }

  if (advSearch) {
    var arr = new Array;
    for (var toilet in toiletArr) {
      if (matchWithCriteria(toilet)) {
        arr.push(toiletArr[toilet]);
      }
    }
    toiletArr = arr;
  }
  printToilets();
}

function printToilets() {
  for (toilet in toiletArr) {
    for (entry in toiletArr[toilet]) {
      if (toiletArr[toilet][entry].key === "plassering")
        addToList(toiletArr[toilet][entry].value);
    }
  }
}

//Function that returns an object for searching,everything set to false by default
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
    place: false,
    dame: false,
  };
}

//return false if toilet should not be added to toiletArr
function matchWithCriteria(toilet) {
  var listToilet = true;
  var placeCounter = 0;
  for (var crit in searchCriteria) {
    if (searchCriteria[crit] !== false) {

      var entry = getEntry(crit, toilet).toLowerCase();
      //check if entry is empty, unless the criteria is price
      if (crit !== "pris" && (entry === undefined || entry === "" || entry === "null")) {
        listToilet = false;

      }
      // Check if requested time is outside of a toilets time, if time isn't "null" or "all"
      if ((crit === "tid_hverdag" || crit === "tid_lordag" || crit === "tid_sondag") && entry !== "null" && entry !== "all") {
        if (searchCriteria[crit].split(".")[0] < entry.split("-")[0].split(".")[0] || searchCriteria[crit].split(".")[0] >= entry.split("-")[1].split(".")[0].trim())
          listToilet = false;
      }
      // if herre === NULL && pissoir !== 1 => don't add toilet
      if (crit === "herre" && entry === "null") {
        entry = getEntry("pissoir_only", toilet);
        if (entry === '1'){
          listToilet = true;
        }
      }
      //if neither place, adresse nor plassering matches, set toilet to false
      if (!entry.match((searchCriteria[crit])) && (crit === "plassering" || crit === "adresse" || crit === "place")) {
        placeCounter++;
        if (placeCounter === 3) {
          listToilet = false;
        }
      }
      //check if price is lower than wanted price
      if (crit === "pris") {
        if (Number(searchCriteria[crit]) < Number(entry)) {
          listToilet = false;
        }
      }
    }
  }
  return listToilet;
}

//use information from the two different regex-expressions to define the values in the searchCriteria object
function searchMatching(array, splitCharacter, searchCriteria) {
  for (i in array) {
    if (splitCharacter === "%3A" && i == 0 && array[i].split(splitCharacter).length < 2) {
      var key = "plassering";
      var value = array[0].toLowerCase();
    } else {
      var key = array[i].split(splitCharacter)[0];
      var value = array[i].split(splitCharacter)[1];
    }

    if ((key === "kjonn" || key === "kjønn") && value === "herre") {
      searchCriteria.herre = true;
    }
    if ((key === "kjonn" || key === "kjønn") && value === "kvinne") {
      searchCriteria.dame = true;
    }
    if (key === "rullestol" && value === "on") {
      searchCriteria.rullestol = true;
    }
    if (key === "maksPris" && value !== "") {
      searchCriteria.pris = value;
    }
    if (key === "gratis" && value === "on") {
      searchCriteria.pris = "0";
    }
    if (key === "stellerom" && value === "on") {
      searchCriteria.stellerom = true;
    }
    if (key === "plassering" && value !== "") {
      searchCriteria.adresse = value;
      searchCriteria.plassering = value;
      searchCriteria.place = value;
    }
    // Separate function to check time and date values
    checkTime(key, value);
  }
}

function checkTime(key, value) {
  if ((key === "aapen" || key === "åpen") && value !== "") {
    var crtDate = new Date();
    var dayOfWeek = crtDate.getDay();
    if (crtDate.getHours() > value.split(".")[0] || (crtDate.getHours() === value.split(".")[0] && crtDate.getMinutes() > value.split(".")[1]))
      dayOfWeek++;
    if (dayOfWeek < 6 && dayOfWeek > 0)
      searchCriteria.tid_hverdag = value;
    else if (dayOfWeek === 6)
      searchCriteria.tid.lordag = value;
    else
      searchCriteria.tid_sondag = value;
  }
  if ((key === "aapenNaa" || key === "åpenNå") && value === "on") {
    var crtDate = new Date();
    var dayOfWeek = crtDate.getDay();
    if ((crtDate.getHours() > value.split(".")[0]) || (crtDate.getHours() === value.split(".")[0] && crtDate.getMinutes() > value.split(".")[1]))
      dayOfWeek++;
    if (dayOfWeek < 6 && dayOfWeek > 0)
      searchCriteria.tid_hverdag = crtDate.getHours() + "." + crtDate.getMinutes();
    else if (dayOfWeek === 6)
      searchCriteria.tid_lordag = crtDate.getHours() + "." + crtDate.getMinutes();
    else
      searchCriteria.tid.sondag = crtDate.getHours() + "." + crtDate.getMinutes();
  }
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
    }
    toiletArr.push(arr);
  }
}

console.log("Ran map_script.js");
console.log(advancedSearchArray);
console.log(freeSearchArray);
