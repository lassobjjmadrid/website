// Lasso BJJ Madrid Academy - Contact Form functionality
// Author: Lasso BJJ Team
// Description: Contact form validation, submission, and user experience

$(document).ready(function() {
    
    // Contact form configuration
    const CONTACT_CONFIG = {
        emailService: 'mailto', // Can be changed to a backend service later
        requiredFields: ['name', 'email', 'interest'],
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phoneRegex: /^[\+]?[0-9\s\-\(\)]{9,}$/
    };

    // Initialize contact form
    function initContactForm() {
        const form = $('#contactForm');
        
        if (form.length === 0) {
            console.log('Contact form not found');
            return;
        }

        // Add real-time validation
        addRealTimeValidation();
        
        // Handle form submission
        form.on('submit', handleFormSubmission);
        
        // Auto-fill subject based on URL parameters
        autoFillFromURL();
        
        console.log('Contact form initialized');
    }

    // Add real-time validation to form fields
    function addRealTimeValidation() {
        // Validate on blur (when user leaves field)
        $('.contact-form .form-control, .contact-form input[type="checkbox"]').on('blur change', function() {
            validateField($(this));
        });

        // Remove validation styling on focus
        $('.contact-form .form-control').on('focus', function() {
            $(this).removeClass('is-invalid is-valid');
            $(this).siblings('.invalid-feedback').hide();
        });

        // Format phone number as user types
        $('#phone').on('input', function() {
            formatPhoneNumber($(this));
        });

        // Auto-resize textarea
        $('#message').on('input', function() {
            autoResizeTextarea($(this));
        });
    }

    // Validate individual field
    function validateField(field) {
        const fieldName = field.attr('name');
        const fieldValue = field.val().trim();
        const isRequired = CONTACT_CONFIG.requiredFields.includes(fieldName);
        
        let isValid = true;
        let errorMessage = '';

        // Check if required field is empty
        if (isRequired && !fieldValue) {
            isValid = false;
            errorMessage = getRequiredFieldMessage(fieldName);
        }
        // Validate email format
        else if (fieldName === 'email' && fieldValue && !CONTACT_CONFIG.emailRegex.test(fieldValue)) {
            isValid = false;
            errorMessage = 'Por favor, introduce un email válido.';
        }
        // Validate phone format (if provided)
        else if (fieldName === 'phone' && fieldValue && !CONTACT_CONFIG.phoneRegex.test(fieldValue)) {
            isValid = false;
            errorMessage = 'Por favor, introduce un teléfono válido.';
        }


        // Apply validation styling
        if (isValid) {
            field.removeClass('is-invalid').addClass('is-valid');
            field.siblings('.invalid-feedback').hide();
        } else {
            field.removeClass('is-valid').addClass('is-invalid');
            field.siblings('.invalid-feedback').text(errorMessage).show();
        }

        return isValid;
    }

    // Get appropriate error message for required fields
    function getRequiredFieldMessage(fieldName) {
        const messages = {
            'name': 'Por favor, introduce tu nombre.',
            'email': 'Por favor, introduce tu email.',
            'interest': 'Por favor, selecciona qué te interesa.'
        };
        return messages[fieldName] || 'Este campo es obligatorio.';
    }

    // Format phone number as user types
    function formatPhoneNumber(phoneField) {
        let value = phoneField.val().replace(/\D/g, ''); // Remove non-digits
        
        if (value.length > 0) {
            // Add +34 prefix if not present and number starts with 6, 7, 8, or 9
            if (!value.startsWith('34') && /^[6789]/.test(value)) {
                value = '34' + value;
            }
            
            // Format as +34 XXX XXX XXX
            if (value.startsWith('34')) {
                value = value.replace(/^34(\d{3})(\d{3})(\d{3}).*/, '+34 $1 $2 $3');
            }
        }
        
        phoneField.val(value);
    }

    // Auto-resize textarea based on content
    function autoResizeTextarea(textarea) {
        textarea.css('height', 'auto');
        textarea.css('height', textarea[0].scrollHeight + 'px');
    }

    // Auto-fill form based on URL parameters
    function autoFillFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Auto-select subject if specified in URL
        const subject = urlParams.get('subject');
        if (subject) {
            $('#subject').val(subject);
        }
        
        // Pre-fill message if specified
        const message = urlParams.get('message');
        if (message) {
            $('#message').val(decodeURIComponent(message));
            autoResizeTextarea($('#message'));
        }
    }

    // Handle form submission
    function handleFormSubmission(e) {
        e.preventDefault();
        
        const form = $(this);
        const submitBtn = form.find('.contact-submit-btn');
        
        // Validate entire form
        let isFormValid = true;
        form.find('.form-control, input[type="checkbox"]').each(function() {
            if (!validateField($(this))) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            // Scroll to first error
            const firstError = form.find('.is-invalid').first();
            if (firstError.length) {
                $('html, body').animate({
                    scrollTop: firstError.offset().top - 100
                }, 500);
            }
            return;
        }

        // Show loading state
        showLoadingState(submitBtn);
        
        // Collect form data
        const formData = collectFormData(form);
        
        // Submit form (using mailto for now, can be replaced with backend)
        submitForm(formData, submitBtn);
    }

    // Show loading state on submit button
    function showLoadingState(submitBtn) {
        submitBtn.prop('disabled', true)
                 .html('<i class="fa fa-spinner fa-spin"></i> Enviando...');
        $('.contact-form').addClass('loading');
    }

    // Hide loading state
    function hideLoadingState(submitBtn) {
        submitBtn.prop('disabled', false)
                 .html('<i class="fa fa-paper-plane"></i> Enviar Mensaje');
        $('.contact-form').removeClass('loading');
    }

    // Collect form data
    function collectFormData(form) {
        const data = {};
        form.find('input, select, textarea').each(function() {
            const field = $(this);
            const name = field.attr('name');
            const value = field.attr('type') === 'checkbox' ? field.is(':checked') : field.val();
            data[name] = value;
        });
        return data;
    }

    // Submit form (currently using mailto, can be replaced with backend)
    function submitForm(formData, submitBtn) {
        // Create email content
        const emailSubject = `Contacto desde web: ${formData.interest}`;
        const emailBody = createEmailBody(formData);
        
        // Create mailto link
        const mailtoLink = `mailto:contacto@lassobjjmadrid.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Simulate processing time
        setTimeout(() => {
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            resetForm();
            
            // Hide loading state
            hideLoadingState(submitBtn);
            
            // Track form submission
            trackFormSubmission(formData);
            
        }, 1500);
    }

    // Create email body from form data
    function createEmailBody(data) {
        return `
Nuevo mensaje de contacto desde la web de Lasso BJJ Madrid Academy

DATOS DEL CONTACTO:
-------------------
Nombre: ${data.name}
Email: ${data.email}
Teléfono: ${data.phone || 'No proporcionado'}
Interés: ${data.interest}

MENSAJE:
--------
${data.message || 'Sin mensaje adicional'}

-------------------
Enviado desde: ${window.location.href}
Fecha: ${new Date().toLocaleString('es-ES')}
        `.trim();
    }

    // Show success message
    function showSuccessMessage() {
        $('#contactSuccess').slideDown();
        $('#contactError').slideUp();
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            $('#contactSuccess').slideUp();
        }, 10000);
        
        // Scroll to success message
        $('html, body').animate({
            scrollTop: $('#contactSuccess').offset().top - 100
        }, 500);
    }

    // Show error message
    function showErrorMessage() {
        $('#contactError').slideDown();
        $('#contactSuccess').slideUp();
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            $('#contactError').slideUp();
        }, 8000);
    }

    // Reset form to initial state
    function resetForm() {
        const form = $('#contactForm');
        form[0].reset();
        form.find('.form-control').removeClass('is-valid is-invalid');
        form.find('.invalid-feedback').hide();
        
        // Reset textarea height
        $('#message').css('height', 'auto');
    }

    // Track form submission for analytics
    function trackFormSubmission(formData) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'contact',
                'event_label': formData.interest,
                'value': 1
            });
        }
        
        console.log('Contact form submitted:', formData.interest);
    }

    // Public API for external use
    window.LassoContact = {
        // Pre-fill form with data
        prefillForm: function(data) {
            Object.keys(data).forEach(key => {
                const field = $(`#${key}`);
                if (field.length) {
                    field.val(data[key]);
                    if (key === 'message') {
                        autoResizeTextarea(field);
                    }
                }
            });
        },
        
        // Focus on specific field
        focusField: function(fieldName) {
            const field = $(`#${fieldName}`);
            if (field.length) {
                $('html, body').animate({
                    scrollTop: field.offset().top - 100
                }, 500, function() {
                    field.focus();
                });
            }
        },
        
        // Reset form
        resetForm: resetForm
    };

    // Initialize when DOM is ready
    initContactForm();
    
    console.log('Contact form system loaded');
});