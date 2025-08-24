// Lasso BJJ Madrid Academy - Privacy Policy Modal functionality
// Author: Lasso BJJ Team
// Description: Privacy policy modal URL hash handling and tracking

$(document).ready(function () {

    // Initialize privacy policy modal functionality
    function initPrivacyModal() {
        console.log('Privacy policy modal initialized');
    }

    // Check for #privacy hash in URL and open modal
    function checkForPrivacyHash() {
        const hash = window.location.hash;
        if (hash === '#privacy') {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                $('#privacyPolicyModal').modal('show');
                
                // Track modal opening from URL hash for analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'modal_open', {
                        'event_category': 'privacy_policy',
                        'event_label': 'url_hash',
                        'value': 1
                    });
                }
                
                console.log('Privacy policy modal opened from URL hash');
            }, 100);
        }
    }

    // Initialize when DOM is ready
    initPrivacyModal();

    // Check for #privacy hash in URL and open modal
    checkForPrivacyHash();

    // Listen for hash changes (for tracking purposes)
    $(window).on('hashchange', function() {
        checkForPrivacyHash();
    });

    console.log('Privacy policy system loaded');
});