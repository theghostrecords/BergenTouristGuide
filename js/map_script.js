/*Document by Joakim Moss Grutle*/
var toiletArr = new Array;
var markers = new Array;
var advancedSearchRegex = /\?(([a-zA-Z]+=[a-zA-Z0-9\.\+(%3A)]*&*)+)/;
var freeSearchRegex = /freeSearch=(((([a-zA-Z]+(%3A)[a-zA-Z0-9]+)|(([a-zA-Z]*)*))\+*)*)&/
var freeSearchArray = location.href.match(freeSearchRegex);
var freeSearchArray = freeSearchArray[1].split("+");
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

//Create searchCriteria object, find out which toilets to print
function advancedSearch() {
  readJSON();
  searchCriteria = searchCrit();
  searchMatching(freeSearchArray, "%3A", searchCriteria);
  searchMatching(advancedSearchArray, "=", searchCriteria);

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
          if (crit !== "pris" && (entry === undefined || entry === "" || entry === "NULL")) {
            listToilet = false;
          }
          if ((crit === "tid_hverdag" || crit === "tid_lordag" || crit === "tid_sondag") && entry !== "NULL" && entry !== "ALL") {
            if (searchCriteria[crit].split(".")[0] < entry.split("-")[0].split(".")[0] || searchCriteria[crit].split(".")[0] >= entry.split("-")[1].split(".")[0].trim())
              listToilet = false;
          }
          // if herre === NULL && pissoir === 1 => Toalett for herrer
          if (crit === "herre" && entry === "NULL") {
            entry = getEntry("pissoir_only", toilet);
            if (entry === "1")
              listToilet = true;
          }
          if (crit === "pris") {
            if (Number(searchCriteria[crit]) < Number(entry)) {
              listToilet = false;
            }
          }
        }
      }
      if (listToilet)
        arr.push(toiletArr[toilet]);
    }
    toiletArr = arr;
    console.log(arr);
  }

  for (toilet in toiletArr) {
    for (entry in toiletArr[toilet]) {
      if (toiletArr[toilet][entry].key === "plassering")
        addToList(toiletArr[toilet][entry].value);
    }
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

function searchMatching(array, splitCharacter, searchCriteria){
  for (i in array) {
    if(splitCharacter === "%3A" && i === 0){
      var key === "plassering";
      var value = array[0];
    }
    else{
      var key = array[i].split(splitCharacter)[0];
      var value = array[i].split(splitCharacter)[1];
    }


    if (key === "kjonn" && value === "herre")
      searchCriteria.herre = true;
    if (key === "kjonn" && value === "kvinne")
      searchCriteria.dame = true;
    if (key === "rullestol" && value !== "")
      searchCriteria.rullestol = true;
    if (key === "maksPris" && value !== "")
      searchCriteria.pris = value;
    if (key === "gratis" && value !== "")
      searchCriteria.pris = "0";
    if (key === "stellerom" && value !== "")
      searchCriteria.stellerom = true;
    if (key === "plassering" && value !== "")
      searchCriteria.plassering = value;
    if (key === "aapen" && value !== "") {
      var crtDate = new Date();
      var dayOfWeek = crtDate.getDay();
      if (crtDate.getHours() > value.split(".")[0] || (crtDate.getHours() === value.split(".")[0] && crtDate.getMinutes() > value.split(".")[1]))
        dayOfWeek++;
      if (dayOfWeek < 5 || dayOfWeek > 6)
        searchCriteria.tid_hverdag = value;
      else if (dayOfWeek === 5)
        searchCriteria.tid_sondag = value;
      else
        searchCriteria.tid_lordag = value;
    }
    if (key === "aapenNaa" && value !== "") {
      var crtDate = new Date();
      var dayOfWeek = crtDate.getDay();
      if ((crtDate.getHours() > value.split(".")[0]) || (crtDate.getHours() === value.split(".")[0] && crtDate.getMinutes() > value.split(".")[1]))
        dayOfWeek++;
      if (dayOfWeek < 5 || dayOfWeek > 6)
        searchCriteria.tid_hverdag = crtDate.getHours() + "." + crtDate.getMinutes();
      else if (dayOfWeek === 5)
        searchCriteria.tid_sondag = crtDate.getHours() + "." + crtDate.getMinutes();
      else
        searchCriteria.tid_lordag = crtDate.getHours() + "." + crtDate.getMinutes();
    }
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
