var værdataArr = new Array;
var arr = new Array;

// Initialize lekeplass Array from JSON file
function initVærDataArr(xml) {
  console.log(xml);
  var time = xml.getElementsByTagName("time");
  var temp = time[1].childNodes[1].childNodes[1].getAttribute("id");
  console.log(time[1].childNodes[1]);
  console.log(time);
  console.log(time.length);

  for (var i = 0; i < time.length; i = i + 4) {
    var timeOfDay = time[i].getAttribute("to");
    if(time[i].getAttribute("from") === time[i].getAttribute("to")){
      var temperature = time[i].childNodes[1].childNodes[1].getAttribute("value");
      i++; //Short weather explanation is on next time-node
      var weather = time[i].childNodes[1].childNodes[3].getAttribute("id");
      arr.push(forecast(temperature, weather, timeOfDay));
    }
  }
  værdataArr.push(arr);
}

function forecast(temp, w, time){
  return{
    temperature: temp,
    weather: w,
    timeOfDay: time
  }
};
