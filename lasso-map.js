/*
 * Map code from: Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */


// Google Maps Scripts
var map = null;
// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);
google.maps.event.addDomListener(window, 'resize', function() {
    //    map.setCenter(new google.maps.LatLng(50.834044, 4.401235));
    map.setCenter(new google.maps.LatLng(50.823, 4.40133));
});

/*
document.addEventListener("DOMContentLoaded", function() {
    function loadHTML(id, url) {
	fetch(url)
	    .then(response => response.text())
	    .then(data => document.getElementById(id).innerHTML = data);
    }
    loadHTML('members', 'members.html');
});
*/




function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 14,

        // The latitude and longitude to center the map (always required)
       //center: new google.maps.LatLng(50.834044, 4.401235), // mid way
	center: new google.maps.LatLng(50.823, 4.40133), // mid way

        // Disables the default Google Maps UI components
        disableDefaultUI: true,
        scrollwheel: false,
        draggable: false,
	zoomControl: false,

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{"featureType":"water","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#b8cb93"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","stylers":[{"visibility":"simplified"}]}]
	
    };


    
    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using out element and options defined above
    map = new google.maps.Map(mapElement, mapOptions);

    // Custom Map Marker Icon - Customize the map-marker.png file to customize your icon
    var image_gymnasium = 'img/map-marker-kaizen_Gymnasium.png';
    var GymnasiumLatLng = new google.maps.LatLng(50.8182466, 4.40625);
    var GymnasiumMarker = new google.maps.Marker({
        position: GymnasiumLatLng,
        map: map,
        icon: image_gymnasium
    });

    var image_VUB = 'img/map-marker-kaizen_VUB.png';    
    var VUBLatLng = new google.maps.LatLng(50.824640, 4.396407);
    var VUBMarker = new google.maps.Marker({
        position: VUBLatLng,
        map: map,
        icon: image_VUB
    });

/*    
    var image_RMA = 'img/map-marker-kaizen_RMA.png';    
    var RMALatLng = new google.maps.LatLng(50.844569, 4.393361);
    var RMAMarker = new google.maps.Marker({
        position: RMALatLng,
        map: map,
        icon: image_RMA
    });
*/

}

