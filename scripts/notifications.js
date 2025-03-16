// Solicitar permiso para notificaciones
// Solicitar permiso para notificaciones
Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('Permiso para notificaciones concedido');
    } else {
      console.log('Permiso para notificaciones denegado');
      alert('Por favor, habilita las notificaciones en la configuración de tu navegador.');
    }
  });