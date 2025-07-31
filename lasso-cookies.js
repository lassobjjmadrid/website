  // Mostrar modal solo si no hay preferencia guardada
  if (!localStorage.getItem('cookiesAccepted')) {
    $(document).ready(function() {
      $('#cookieModal').modal('show');
    });
  }

  // Botón "Aceptar"
  $('#acceptCookies').click(function() {
    localStorage.setItem('cookiesAccepted', 'true');
    $('#cookieModal').modal('hide');
    // Aquí puedes cargar scripts de cookies (ej: Google Analytics)
  });

  // Botón "Rechazar"
  $('#declineCookies').click(function() {
    localStorage.setItem('cookiesAccepted', 'false');
    $('#cookieModal').modal('hide');
    // Opcional: Deshabilitar cookies de terceros
  });