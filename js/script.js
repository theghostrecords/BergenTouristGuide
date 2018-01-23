function initMap(){
  var akvariet = {lat: 60.399776, lng: 5.303468};
  var bryggen = {lat: 60.397625, lng: 5.324571};
  var floyen = {lat: 60.398801, lng: 5.345680};
  var ulriken = {lat: 60.377952, lng: 5.386695};
  var fisketorget = {lat: 60.394942, lng: 5.325351};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 60.389416, lng: 5.329642}
  });
  var marker1 = new google.maps.Marker({
    position: akvariet,
    map: map
  });
  var marker2 = new google.maps.Marker({
    position: bryggen,
    map: map
  })
  var marker3 = new google.maps.Marker({
    position: floyen,
    map: map
  })
  var marker4 = new google.maps.Marker({
    position: ulriken,
    map: map
  })
  var marker5 = new google.maps.Marker({
    position: fisketorget,
    map: map
  })
}
