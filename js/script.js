function initMap(){
  var akvariet = {lat: 60.399776, lng: 5.303468};
  var bryggen = {lat: 60.397625, lng: 5.324571};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: bryggen
  });
  var marker1 = new google.maps.Marker({
    position: akvariet,
    map: map
  });
  var marker2 = new google.maps.Marker({
    position: bryggen,
    map: map
  })
}
