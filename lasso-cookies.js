
document.addEventListener('DOMContentLoaded', function () {
	setTimeout(function () {

		// Mostrar modal con efecto fade (solo si no hay preferencia guardada)
		if (!localStorage.getItem('cookiesAccepted')) {
			$(document).ready(function () {
				$('#cookieModal').modal('show');  // Bootstrap ya aplica el fade automáticamente
			});
		}

		// Botón "Aceptar" (con fade out al cerrar)
		$('#acceptCookies').click(function () {
			localStorage.setItem('cookiesAccepted', 'true');
			$('#cookieModal').modal('hide');  // Cierre con fade out
		});

		// Botón "Rechazar"
		$('#declineCookies').click(function () {
			localStorage.setItem('cookiesAccepted', 'false');
			$('#cookieModal').modal('hide');
		});
	}, 500); // Retraso opcional de 0.5 segundos
});