var playgroundArr = new Array;
var playGroundCoord;


// Initialize Playground Array from JSON file
function initFavArr(json) {
    for (var i = 0; i < json.entries.length; i++) {
        var arr = new Array;
        for (var entry in json.entries[i]) {
            var value = json.entries[i][entry];
            arr.push(keyValue(entry, value));
        }
        playgroundArr.push(arr);
    }
    initFavOptions();
}

// Initialize all options in the select element
function initFavOptions() {
    var select = document.getElementById('favorite');
    for (var l in playgroundArr) {
        var opt = document.createElement('option');
        for (var entry in playgroundArr[l]) {
            if (playgroundArr[l][entry].key === "navn") {
                opt.appendChild(document.createTextNode(playgroundArr[l][entry].value))
            }
        }
        select.appendChild(opt)
    }
}

// Get chosen playground and its coordinates then call scan() for the other dataset
function findChosen() {
    // Get the chosen playgrouns coordinates
    var chosen = document.getElementById('favorite').value;
    var index = getPlaygroundIndex(chosen);
    if (index === -1) {
        console.log("This playground does not exist in the dataset");
        return;
    }
    playGroundCoord = coordinate(playgroundArr[index][3].value, playgroundArr[index][0].value)

    // Get the other dataset -> readJSON calls the function: initClosestToiletsTable in this file
    var json = scan('https://hotell.difi.no/api/json/bergen/dokart?', 'otherSet');
}

// Helper function to find the index of a given playground in the playGroundArr
function getPlaygroundIndex(name) {
    var index = -1;
    for (var l in playgroundArr) {
        var foundIndex = false;
        for (var entry in playgroundArr[l]) {
            if (playgroundArr[l][entry].key === "navn" && playgroundArr[l][entry].value === name) {
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

// Fill the table with toilet entries sorted by distance to the playground
function initClosestToiletsTable(response) {
    var json = response.entries;
    // Read toilets to array with distance => Hashmap with key being the distance (assuming unique distances)
    var tArray = new Array;
    for (let entry in json) {
        var lng = json[entry].longitude;
        var lat = json[entry].latitude;
        var distance = calculateDistance(playGroundCoord, coordinate(lng, lat));
        tArray.push(keyValue(distance, json[entry].plassering));
    }

    // Sort by distance
    var distances = new Array;
    for (var distance in tArray) {
        distances.push(Number(tArray[distance].key));
    }
    distances.sort();

    // Remove old entries and than add new entries to the table
    clearTable();
    for (var distance in distances) {
        for (var toilet in tArray) {
            if (distances[distance] === tArray[toilet].key) {
                addToOtherSetTable(tArray[toilet].value, (distances[distance] * 1000).toFixed(2));
            }
        }
    }
}

// Add name of a toilet to the Table
function addToOtherSetTable(name, distance) {
    var table = document.getElementById('closestTable');
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.appendChild(document.createTextNode(name));
    tr.appendChild(td);
    td = document.createElement("td");
    td.appendChild(document.createTextNode(distance));
    tr.appendChild(td);
    table.appendChild(tr);
}

// Clear the ordered list of all names
function clearTable() {
    document.getElementById('closestTable').innerHTML = "";
}

// Returns a coordinate object
function coordinate(lng, lat) {
    return {
        longitude: Number(lng),
        latitude: Number(lat),
    };
}

/* Function that takes two coordinates as parameters and calculates the difference between them
   The calculation is done by using the Haversine formula
*/
function calculateDistance(cord1, cord2) {
    var earthR = 6372.8;
    var lat1 = cord1.latitude;
    var lat2 = cord2.latitude;
    var distLat = toRadians(cord1.latitude - cord2.latitude);
    var distLng = toRadians(cord1.longitude - cord2.longitude);;

    var n = Math.pow(Math.sin(distLat / 2), 2) + Math.pow(Math.sin(distLng / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    var k = 2 * Math.asin(Math.sqrt(n));
    return earthR * k;
}

// Degrees to radians
function toRadians(deg) {
    return deg * (Math.PI / 180);
}