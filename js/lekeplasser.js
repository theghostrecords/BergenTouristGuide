var lekeplassArr = new Array;
var markers = new Array;

// Initialize lekeplass Array from JSON file
function initLekeplassArr(json) {
  for (var i = 0; i < json.entries.length; i++) {
    var arr = new Array;
    for (var entry in json.entries[i]) {
      var value = json.entries[i][entry];
      arr.push(keyValue(entry, value));
      if (entry === "navn")
        addToList(value);
    }
    lekeplassArr.push(arr);
  }
  initMap(lekeplassArr);
}