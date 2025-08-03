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

    // WhatsApp floating button functionality with reliable icon
    var whatsappButton = $('<a href="https://wa.me/34647547358?text=Hola,%20me%20gustar%C3%ADa%20probar%20una%20clase%20de%20prueba%20de%20jiu-jitsu." target="_blank" id="whatsapp-float" title="Contactar por WhatsApp">' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">' +
        '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>' +
        '</svg>' +
        '</a>');
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