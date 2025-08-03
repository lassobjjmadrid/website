// Lasso BJJ Madrid Academy - Map functionality
// Author: Lasso BJJ Team
// Description: Enhanced map features and location services

$(document).ready(function () {

    // Academy location data
    const ACADEMY_LOCATION = {
        lat: 40.4313164,
        lng: -3.6689395,
        address: "Calle Londres, 22, 28028 Madrid",
        name: "Lasso BJJ Madrid Academy",
        phone: "+34 647 54 73 58",
        email: "contacto@lassobjjmadrid.com"
    };

    // Initialize map enhancements
    function initMapFeatures() {

        // Add click handler to map iframe for better mobile experience
        $('#map iframe').on('load', function () {
            console.log('Map loaded successfully');
        });

        // Add map control buttons (only if they don't exist)
        if ($('.map-controls').length === 0) {
            var mapControls = $('<div class="map-controls">' +
                '<a href="https://www.google.com/maps/dir//' +
                encodeURIComponent(ACADEMY_LOCATION.address) +
                '" target="_blank" class="btn btn-primary btn-sm map-directions-btn">' +
                '<i class="fa fa-location-arrow"></i> Cómo llegar</a>' +
                '<button class="btn btn-info btn-sm calculate-distance-btn" style="margin-left: 10px;">' +
                '<i class="fa fa-map-marker"></i> Calcular distancia</button>' +
                '</div>');

            // Add after the iframe
            $('#map iframe').after(mapControls);

            // Add click handler for distance calculation
            $('.calculate-distance-btn').click(function () {
                $(this).prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Calculando...');
                getUserLocationOnDemand();
            });
        }

        // Add public transport info (only if it doesn't exist)
        // if ($('.transport-info').length === 0) {
        //     var transportInfo = $('<div class="transport-info">' +
        //         '<h4><i class="fa fa-subway"></i> Transporte Público</h4>' +
        //         '<div class="transport-options">' +
        //         '<div class="transport-option">' +
        //         '<strong>Metro:</strong> Línea 4 - Estación Avenida de América (10 min caminando)' +
        //         '</div>' +
        //         '<div class="transport-option">' +
        //         '<strong>Autobús:</strong> Líneas 7, 29, 52 - Parada Calle López de Hoyos' +
        //         '</div>' +
        //         '<div class="transport-option">' +
        //         '<strong>Parking:</strong> Zona azul disponible en la calle' +
        //         '</div>' +
        //         '</div>' +
        //         '</div>');

        //     // Add after map controls (or after iframe if controls don't exist)
        //     if ($('.map-controls').length > 0) {
        //         $('.map-controls').after(transportInfo);
        //     } else {
        //         $('#map iframe').after(transportInfo);
        //     }
        // }
    }

    // Get user location on demand (only when user clicks the button)
    function getUserLocationOnDemand() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    // Calculate distance
                    const distance = calculateDistance(
                        userLat, userLng,
                        ACADEMY_LOCATION.lat, ACADEMY_LOCATION.lng
                    );

                    // Show distance info
                    showDistanceInfo(distance);

                    // Re-enable button
                    $('.calculate-distance-btn').prop('disabled', false)
                        .html('<i class="fa fa-map-marker"></i> Calcular distancia');
                },
                function (error) {
                    console.log('Geolocation error:', error.message);

                    // Show error message
                    var errorMsg = $('<div class="alert alert-warning distance-error">' +
                        '<i class="fa fa-exclamation-triangle"></i> ' +
                        'No se pudo obtener tu ubicación. Puedes usar el botón "Cómo llegar" para obtener direcciones.' +
                        '</div>');

                    $('#map .container .row .col-md-12').prepend(errorMsg);

                    // Auto-hide error after 5 seconds
                    setTimeout(function () {
                        errorMsg.fadeOut();
                    }, 5000);

                    // Re-enable button
                    $('.calculate-distance-btn').prop('disabled', false)
                        .html('<i class="fa fa-map-marker"></i> Calcular distancia');
                }
            );
        } else {
            // Geolocation not supported
            var errorMsg = $('<div class="alert alert-warning distance-error">' +
                '<i class="fa fa-exclamation-triangle"></i> ' +
                'Tu navegador no soporta geolocalización. Usa el botón "Cómo llegar" para obtener direcciones.' +
                '</div>');

            $('#map .container .row .col-md-12').prepend(errorMsg);

            setTimeout(function () {
                errorMsg.fadeOut();
            }, 5000);

            // Re-enable button
            $('.calculate-distance-btn').prop('disabled', false)
                .html('<i class="fa fa-map-marker"></i> Calcular distancia');
        }
    }

    // Calculate distance between two points (Haversine formula)
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in kilometers
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Show distance information to user
    function showDistanceInfo(distance) {
        const distanceKm = distance.toFixed(1);
        const walkingTime = Math.round(distance * 12); // Approximate walking time in minutes

        // Remove any existing distance info first
        $('.distance-info').remove();

        var distanceInfo = $('<div class="distance-info alert alert-info">' +
            '<i class="fa fa-map-marker"></i> ' +
            'Estás a aproximadamente <strong>' + distanceKm + ' km</strong> de la academia ' +
            '(~' + walkingTime + ' minutos caminando)' +
            '</div>');

        // Add after map controls
        if ($('.map-controls').length > 0) {
            $('.map-controls').after(distanceInfo);
        } else {
            $('#map iframe').after(distanceInfo);
        }
    }

    // Add nearby landmarks and references
    function addLandmarkInfo() {
        // Only add if it doesn't exist
        // if ($('.landmark-info').length === 0) {
        //     var landmarkInfo = $('<div class="landmark-info">' +
        //         '<h4><i class="fa fa-map-signs"></i> Referencias Cercanas</h4>' +
        //         '<ul class="landmark-list">' +
        //         '<li><i class="fa fa-hospital-o"></i> Hospital Ramón y Cajal (5 min)</li>' +
        //         '<li><i class="fa fa-shopping-cart"></i> Centro Comercial La Vaguada (8 min)</li>' +
        //         '<li><i class="fa fa-tree"></i> Parque de Berlín (3 min)</li>' +
        //         '<li><i class="fa fa-graduation-cap"></i> Universidad Autónoma de Madrid (15 min)</li>' +
        //         '</ul>' +
        //         '</div>');

        //     // Add after transport info (or after map controls if transport doesn't exist)
        //     if ($('.transport-info').length > 0) {
        //         $('.transport-info').after(landmarkInfo);
        //     } else if ($('.map-controls').length > 0) {
        //         $('.map-controls').after(landmarkInfo);
        //     } else {
        //         $('#map iframe').after(landmarkInfo);
        //     }
        // }
    }

    // Enhanced contact information with map integration
    function enhanceContactInfo() {
        // Add click-to-call functionality
        $('a[href^="tel:"]').click(function (e) {
            // Track the call attempt
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'event_category': 'contact',
                    'event_label': 'map_section'
                });
            }
        });

        // Add copy address functionality (only if it doesn't exist)
        if ($('.copy-address-btn').length === 0) {
            var copyAddressBtn = $('<button class="btn btn-sm btn-default copy-address-btn" title="Copiar dirección">' +
                '<i class="fa fa-copy"></i> Copiar dirección</button>');

            // Add after the address paragraph (before the iframe)
            $('#map .container .row .col-md-12 p.lead').after(copyAddressBtn);

            copyAddressBtn.click(function () {
                navigator.clipboard.writeText(ACADEMY_LOCATION.address).then(function () {
                    // Show success message
                    var successMsg = $('<div class="alert alert-success copy-success">' +
                        '<i class="fa fa-check"></i> Dirección copiada al portapapeles</div>');
                    $(this).after(successMsg);
                    setTimeout(function () {
                        successMsg.fadeOut();
                    }, 3000);
                }).catch(function (err) {
                    console.error('Error copying address:', err);
                });
            });
        }
    }

    // Add business hours to map section
    function addBusinessHours() {
        // Only add if it doesn't exist
        // if ($('.business-hours-map').length === 0) {
        //     var hoursInfo = $('<div class="business-hours-map">' +
        //         '<h4><i class="fa fa-clock-o"></i> Horarios de Atención</h4>' +
        //         '<div class="hours-grid">' +
        //         '<div class="hours-item">' +
        //         '<strong>Lunes - Viernes:</strong><br>' +
        //         '07:00 - 21:00' +
        //         '</div>' +
        //         '<div class="hours-item">' +
        //         '<strong>Sábados:</strong><br>' +
        //         '12:00 - 14:00' +
        //         '</div>' +
        //         '<div class="hours-item">' +
        //         '<strong>Domingos:</strong><br>' +
        //         'Cerrado' +
        //         '</div>' +
        //         '</div>' +
        //         '</div>');

        //     // Add after landmarks (or after transport info if landmarks don't exist)
        //     if ($('.landmark-info').length > 0) {
        //         $('.landmark-info').after(hoursInfo);
        //     } else if ($('.transport-info').length > 0) {
        //         $('.transport-info').after(hoursInfo);
        //     } else if ($('.map-controls').length > 0) {
        //         $('.map-controls').after(hoursInfo);
        //     } else {
        //         $('#map iframe').after(hoursInfo);
        //     }
        // }
    }

    // Initialize all map features
    function initMap() {
        initMapFeatures();
        addLandmarkInfo();
        enhanceContactInfo();
        addBusinessHours();

        console.log('Map functionality initialized');
    }

    // Run initialization
    initMap();

    // Export functions for external use
    window.LassoMap = {
        getAcademyLocation: function () {
            return ACADEMY_LOCATION;
        },

        calculateDistanceToAcademy: function (userLat, userLng) {
            return calculateDistance(userLat, userLng, ACADEMY_LOCATION.lat, ACADEMY_LOCATION.lng);
        },

        openDirections: function () {
            window.open('https://www.google.com/maps/dir//' +
                encodeURIComponent(ACADEMY_LOCATION.address), '_blank');
        }
    };
});