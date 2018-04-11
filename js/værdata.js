var weatherdataArr = new Array;
var arr = new Array;

// Initialize weatherdata array from XML file
function initVærDataArr(xml) {
  var time = xml.getElementsByTagName("time");

  //there are 5 time-nodes per hour of the day in the xml-document
  for (var i = 0; i < time.length; i = i + 4) {
    var timeOfDay = time[i].getAttribute("to");
    if(time[i].getAttribute("from") === time[i].getAttribute("to")){
      var temperature = time[i].childNodes[1].childNodes[1].getAttribute("value");
      i++; //Short weather explanation is on next time-node
      var weather = time[i].childNodes[1].childNodes[3].getAttribute("id");
      arr.push(forecast(temperature, weather, timeOfDay));
    }
  }
  weatherdataArr.push(arr);
}

function forecast(temp, w, time){
  return{
    temperature: temp,
    weather: w,
    timeOfDay: time
  }
};

console.log(weatherdataArr);
