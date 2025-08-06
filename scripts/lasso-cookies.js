
// Cookie Consent Configuration for Lasso BJJ Madrid Academy
document.addEventListener('DOMContentLoaded', function () {

    // Check if cookieconsent library is loaded
    if (typeof window.cookieconsent === 'undefined') {
        console.error('Cookie Consent library not loaded');
        return;
    }

    // Initialize Cookie Consent
    window.cookieconsent.initialise({
        "palette": {
            "popup": {
                "background": "#000",
                "text": "#fff"
            },
            "button": {
                "background": "#d9534f",
                "text": "#fff"
            }
        },
        "theme": "classic",
        "position": "bottom",
        "content": {
            "message": "Este sitio web utiliza cookies para mejorar tu experiencia de navegación y analizar el uso del sitio.",
            "dismiss": "Aceptar",
            "link": "Más información",
            "href": "#"
        },
        "onPopupOpen": function () {
            // Override the "Más información" link to open modal instead
            setTimeout(function () {
                var link = document.querySelector('.cc-link');
                if (link) {
                    link.addEventListener('click', function (e) {
                        e.preventDefault();
                        $('#cookiePolicyModal').modal('show');
                    });
                }
            }, 100);
        },
        "onStatusChange": function (status, chosenBefore) {
            // Track cookie consent in analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cookie_consent', {
                    'event_category': 'privacy',
                    'event_label': status,
                    'value': chosenBefore ? 1 : 0
                });
            }

            // Store consent status
            localStorage.setItem('cookiesAccepted', status === 'allow' ? 'true' : 'false');

            console.log('Cookie consent status:', status);
        },
        "onInitialise": function (status) {
            // Check if user has already made a choice
            if (status === 'allow') {
                // Enable analytics and other tracking
                enableAnalytics();
            }
        },
        "onNoCookieLaw": function (countryCode, country) {
            // If no cookie law applies, enable analytics by default
            enableAnalytics();
        }
    });

    // Function to enable analytics tracking
    function enableAnalytics() {
        // Enable Google Analytics if consent is given
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }

        console.log('Analytics enabled with user consent');
    }

    // Function to disable analytics tracking
    function disableAnalytics() {
        // Disable Google Analytics if consent is withdrawn
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }

        console.log('Analytics disabled per user preference');
    }

    // Check existing consent status
    var existingConsent = localStorage.getItem('cookiesAccepted');
    if (existingConsent === 'true') {
        enableAnalytics();
    } else if (existingConsent === 'false') {
        disableAnalytics();
    }

    // Provide a way to revoke consent (can be called from anywhere)
    window.revokeCookieConsent = function () {
        localStorage.removeItem('cookiesAccepted');
        disableAnalytics();

        // Close the modal first
        $('#cookiePolicyModal').modal('hide');

        // Show the cookie banner again after a short delay
        setTimeout(function() {
            if (typeof window.cookieconsent !== 'undefined') {
                window.cookieconsent.initialise({
                    "palette": {
                        "popup": {
                            "background": "#000",
                            "text": "#fff"
                        },
                        "button": {
                            "background": "#d9534f",
                            "text": "#fff"
                        }
                    },
                    "content": {
                        "message": "Has revocado tu consentimiento para cookies. ¿Deseas aceptar cookies nuevamente?",
                        "dismiss": "Aceptar",
                        "link": "Más información",
                        "href": "#"
                    },
                    "onPopupOpen": function () {
                        // Override the "Más información" link to open modal instead
                        setTimeout(function () {
                            var link = document.querySelector('.cc-link');
                            if (link) {
                                link.addEventListener('click', function (e) {
                                    e.preventDefault();
                                    $('#cookiePolicyModal').modal('show');
                                });
                            }
                        }, 100);
                    }
                });
            }
        }, 500);
    };

    console.log('Cookie consent system initialized');
});