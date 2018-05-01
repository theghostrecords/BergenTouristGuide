var playgroundArr = new Array;
var markers = new Array;

// Initialize Playground Array from JSON file
function initPlaygroundArr(json) {
  for (var i = 0; i < json.entries.length; i++) {
    var arr = new Array;
    for (var entry in json.entries[i]) {
      var value = json.entries[i][entry];
      arr.push(keyValue(entry, value));
      if (entry === "navn")
        addToList(value);
    }
    playgroundArr.push(arr);
  }
  initMap(playgroundArr);
}