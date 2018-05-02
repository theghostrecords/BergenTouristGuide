var toiletArr = new Array; // Array with kayvalue-objects, to keep track of the toilets
var markers = new Array;
var advancedSearchRegex = /\?(([a-zA-Z]+=[a-zA-Z0-9\.\+(%3A)]*&*)+)/;
var freeSearchRegex = /freeSearch=(((([a-zA-ZæøåÆØÅ]+(%3A)[a-zA-Z0-9æøåÆØÅ\.]+)|(([a-zA-ZæøåÆØÅ]*)*))\+*)*)&/
// Matching regex with url, splitting the values on "+" or "&"
var freeSearchArray = decodeURI(location.href).match(freeSearchRegex);
var freeSearchArray = freeSearchArray[1].split("+");
var advancedSearchArray = location.href.match(advancedSearchRegex);
var advancedSearchArray = advancedSearchArray[1].split("&");
// SearchCriteria-object that contains information about whether criteria should be checked or not
var searchCriteria;


//Get a given entry from the toiletArr array
function getEntry(s, toilet) {
  for (var entry in toiletArr[toilet]) {
    var arr = toiletArr[toilet];
    if (arr[entry].key === s)
      return arr[entry].value;
  }
}

// Create searchCriteria object, find out which toilets to print
function advancedFreeSearch() {
  // Initialize searchCriteria-object with all false values
  searchCriteria = searchCrit();

  /* Check if freeSearch isn't empty, then run searchMatching() on the corresponding
     array to define the values in the searchCriteria-object */
  if (freeSearchArray !== null) {
    searchMatching(freeSearchArray, "%3A", searchCriteria);
  }
  searchMatching(advancedSearchArray, "=", searchCriteria);

  // Check if any criteria in searchCriteria has been set to something other than false
  var advFrSearch = false;
  for (crit in searchCriteria) {
    if (searchCriteria[crit] !== false && searchCriteria[crit] !== undefined) {
      advFrSearch = true;
    }
  }

  //If not all values in searchCriteria equals false, match criteria with toilets
  if (advFrSearch) {
    var arr = new Array;
    for (var toilet in toiletArr) {
      if (matchToiletWithCriteria(toilet)) {
        arr.push(toiletArr[toilet]);
      }
    }
    toiletArr = arr;
  }
  printToilets();
  initMap(toiletArr);
}

// Function used to print toilets to the numeric list
function printToilets() {
  for (toilet in toiletArr) {
    for (entry in toiletArr[toilet]) {
      if (toiletArr[toilet][entry].key === "plassering")
        addToList(toiletArr[toilet][entry].value);
    }
  }
}

// Function that returns an object for searching, everything set to false by default
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

// Return false if toilet should not be added to toiletArr
function matchToiletWithCriteria(toilet) {
  var listToilet = true;
  var placeCounter = 0;
  for (var crit in searchCriteria) {
    if (searchCriteria[crit] !== false) {

      var entry = getEntry(crit, toilet).toLowerCase(); // toLowerCase makes everything easier to match with
      //Check if entry is null, undefined or empty, unless the criteria is price
      if (crit !== "pris" && (entry === undefined || entry === "" || entry === "null")) {
        listToilet = false;
      }
      // Check if requested time is outside of a toilets time, if time isn't "null" or "all"
      if ((crit === "tid_hverdag" || crit === "tid_lordag" || crit === "tid_sondag") && entry !== "null" && entry !== "all") {
        if (Number(searchCriteria[crit].split(".")[0]) < Number(entry.split("-")[0].split(".")[0]) ||
          Number(searchCriteria[crit].split(".")[0]) >= Number(entry.split("-")[1].split(".")[0].trim()))
          listToilet = false;
      }
      // If kjønn:herre is a criteria, but herre === null, check if pissoir_only === '1'
      if (crit === "herre" && entry === "null") {
        entry = getEntry("pissoir_only", toilet);
        if (entry === '1') {
          listToilet = true;
        }
      }
      // If neither place, adresse nor plassering matches, set given toilet to false
      if (!entry.match((searchCriteria[crit])) && (crit === "plassering" || crit === "adresse" || crit === "place")) {
        placeCounter++;
        if (placeCounter === 3) {
          listToilet = false;
        }
      }
      // Check if price is lower than wanted price
      if (crit === "pris") {
        if (Number(searchCriteria[crit]) < Number(entry)) {
          listToilet = false;
        }
      }
    }
  }
  return listToilet;
}

// Use information from the two different regex-expressions to define the values in the searchCriteria object
function searchMatching(array, splitCharacter, searchCriteria) {
  for (i in array) {
    // Look for address or placename in first value of freeSearch
    if (splitCharacter === "%3A" && i == 0 && array[i].split(splitCharacter).length < 2) {
      var key = "plassering";
      var value = array[0].toLowerCase();
    } else {
      var key = array[i].split(splitCharacter)[0];
      var value = array[i].split(splitCharacter)[1];
    }

    addCriteria(key, value);
    addTime(key, value);
  }
}

// Add the different search-values to the searchCriteria-object
function addCriteria(key, value) {
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
}

// Separate function to add time and date values
function addTime(key, value) {
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

// Initialize toiletarray from JSON file
function initToiletArr(json) {
  for (var i = 0; i < json.entries.length; i++) {
    var arr = new Array;
    for (var entry in json.entries[i]) {
      var value = json.entries[i][entry];
      arr.push(keyValue(entry, value));
    }
    toiletArr.push(arr);
  }
  advancedFreeSearch();
}

var clicked = false; // Keep track of hidden/visible advancedSearch options
// Hide/Show advancedSearch
function hideShowAdvSearch() {
  if (clicked) {
    clicked = false;
    document.getElementById('advancedSearch').style.display = 'block';
  } else {
    clicked = true;
    document.getElementById('advancedSearch').style.display = 'none';
  }
}
