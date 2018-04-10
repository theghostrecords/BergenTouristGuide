var lekeplassArr = new Array;
var markers = new Array;

// Initialize lekeplass Array from JSON file
function initLekeplassArr(json) {
  for (var i = 0; i < json.entries.length; i++) {
    var arr = new Array;
    for (var entry in json.entries[i]) {
      var value = json.entries[i][entry];
      arr.push(keyValue(entry, value));
      if(entry === "navn")
        addToList(value);
    }
    lekeplassArr.push(arr);
  }
  initMap(lekeplassArr);
  initFavOptions();
}

function initFavOptions() {
  var select = document.getElementById('favorite');
  for (var l in lekeplassArr) {
    var opt = document.createElement('option');
    for (var entry in lekeplassArr[l]) {
      if (lekeplassArr[l][entry].key === "navn") {
        opt.appendChild(document.createTextNode(lekeplassArr[l][entry].value))
      }
    }
    select.appendChild(opt)
  }
}
