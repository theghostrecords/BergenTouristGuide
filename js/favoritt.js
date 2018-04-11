var lekeplassArr = new Array;
var playGroundCoord;

// Initialize lekeplass Array from JSON file
function initFavArr(json) {
    for (var i = 0; i < json.entries.length; i++) {
        var arr = new Array;
        for (var entry in json.entries[i]) {
            var value = json.entries[i][entry];
            arr.push(keyValue(entry, value));
        }
        lekeplassArr.push(arr);
    }
    initFavOptions();
}

// Initialize all options in the select element
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

function findChosen() {
    // Get the chosen playgrouns coordinates
    var chosen = document.getElementById('favorite').value;
    var index = getLekeplassIndex(chosen);
    if (index === -1) {
        console.log("This playground does not exist in the dataset");
        return;
    }
    playGroundCoord = coordinate(lekeplassArr[index][3].value, lekeplassArr[index][0].value)
    
    // Get the other dataset -> readJSON calls the function: initClosestToiletsList in this file
    var json = readJSON('https://hotell.difi.no/api/json/bergen/dokart?', 'otherSet');
}

function getLekeplassIndex(name) {
    var index = -1;
    for (var l in lekeplassArr) {
        var foundIndex = false;
        for (var entry in lekeplassArr[l]) {
            if (lekeplassArr[l][entry].key === "navn" && lekeplassArr[l][entry].value === name) {
                index = l;
                foundIndex = true;
                break;
            }
        }
        if (foundIndex)
            break;
    }
    return index;
}

function initClosestToiletsList(response) {
    var json = response.entries;
    // Read toilets to array with distance => Hashmap with key being the distance (assuming unique distances)
    var tArray = new Array;
    for(let entry in json) {
        var lng = json[entry].longitude;
        var lat = json[entry].latitude;
        var distance = calculateDistance(playGroundCoord, coordinate(lng, lat));
        tArray.push(keyValue(distance, json[entry].plassering));
    }
    
    // sort for distance
    var distances = new Array;
    for (var distance in tArray) {
        distances.push(Number(tArray[distance].key));
    }
    distances.sort();

    clearList();
    for (var distance in distances) {
        for (var toilet in tArray) {
            if (distances[distance] === tArray[toilet].key) {
                addToOtherSetList(tArray[toilet].value);
            }
        }
    }
}

// Add name of a toilet to the Ordered List
function addToOtherSetList(name) {
    var list = document.getElementById('closestList');
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(name));
    list.appendChild(li);
}

// Clear the ordered list of all names
function clearList() {
   document.getElementById('closestList').innerHTML = "";
}