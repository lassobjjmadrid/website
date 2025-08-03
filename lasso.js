// Lasso BJJ Madrid Academy - Main JavaScript
// Author: Lasso BJJ Team
// Description: Core functionality for the website

$(document).ready(function() {
    
    // Smooth scrolling for navigation links
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 70 // Account for fixed navbar
                }, 800);
                return false;
            }
        }
    });

    // Navbar collapse on click (mobile)
    $('.navbar-nav li a').click(function() {
        if ($('.navbar-toggle').css('display') != 'none') {
            $('.navbar-toggle').click();
        }
    });

    // Add active class to navigation based on scroll position
    $(window).scroll(function() {
        var scrollPos = $(document).scrollTop() + 100;
        
        $('.navbar-nav a').each(function() {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));
            
            if (refElement.length && refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('.navbar-nav li').removeClass("active");
                currLink.parent().addClass("active");
            } else {
                currLink.parent().removeClass("active");
            }
        });
    });

    // Back to top button
    var backToTop = $('<div id="back-to-top" title="Volver arriba"><i class="fa fa-chevron-up"></i></div>');
    $('body').append(backToTop);
    
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });
    
    $('#back-to-top').click(function() {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });

    // WhatsApp floating button functionality
    var whatsappButton = $('<a href="https://wa.me/34647547358?text=Hola,%20me%20gustar%C3%ADa%20probar%20una%20clase%20de%20prueba%20de%20jiu-jitsu." target="_blank" id="whatsapp-float" title="Contactar por WhatsApp"><i class="fa fa-whatsapp"></i></a>');
    $('body').append(whatsappButton);

    // Animate elements on scroll
    function animateOnScroll() {
        $('.content-section-a, .content-section-b').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('animate-in');
            }
        });
    }
    
    $(window).scroll(animateOnScroll);
    animateOnScroll(); // Run on page load

    // Form validation for contact forms (if added later)
    function validateEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Schedule table responsive behavior
    function makeScheduleResponsive() {
        if ($(window).width() < 768) {
            $('#classes table').addClass('table-responsive-stack');
        } else {
            $('#classes table').removeClass('table-responsive-stack');
        }
    }
    
    $(window).resize(makeScheduleResponsive);
    makeScheduleResponsive();

    // Lazy loading for images (basic implementation)
    $('img[data-src]').each(function() {
        var img = $(this);
        var src = img.attr('data-src');
        
        $(window).scroll(function() {
            if (img.offset().top < $(window).scrollTop() + $(window).height() + 100) {
                img.attr('src', src);
                img.removeAttr('data-src');
            }
        });
    });

    // FAQ accordion enhancement
    $('.panel-collapse').on('show.bs.collapse', function() {
        $(this).prev('.panel-heading').addClass('active');
    });
    
    $('.panel-collapse').on('hide.bs.collapse', function() {
        $(this).prev('.panel-heading').removeClass('active');
    });

    // Analytics tracking for important actions
    function trackEvent(category, action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
    }

    // Track WhatsApp clicks
    $('a[href*="wa.me"]').click(function() {
        trackEvent('Contact', 'WhatsApp Click', 'Free Class Request');
    });

    // Track Instagram clicks
    $('a[href*="instagram.com"]').click(function() {
        trackEvent('Social', 'Instagram Click', 'Profile Visit');
    });

    // Track phone clicks
    $('a[href^="tel:"]').click(function() {
        trackEvent('Contact', 'Phone Click', 'Direct Call');
    });

    // Track email clicks
    $('a[href^="mailto:"]').click(function() {
        trackEvent('Contact', 'Email Click', 'Direct Email');
    });

    console.log('Lasso BJJ Madrid Academy - Website loaded successfully');
});

// Utility functions
window.LassoUtils = {
    // Format phone number for display
    formatPhone: function(phone) {
        return phone.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '+34 $1 $2 $3 $4');
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        var rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Debounce function for performance
    debounce: function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
};