function initMap(){
  var akvariet = {lat: 60.3996913, lng:5.3011823}
  var map = new google.maps.Map(document.getElementByIs('map'), {
    zoom: 4,
    center: akvariet
  });
  var marker = new google.maps.Marker({
    position akvariet,
    map: map
  });
}
