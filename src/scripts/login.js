// login.js
import { initializeFirebase, requestNotificationPermission } from '../infraestructure/services/firebaseService.js';
import { handleLogin } from '../adapters/controllers/userController.js';

(async () => {
  // Inicializa Firebase (solo debe hacerse una vez)
  initializeFirebase();
  
  // Pide permiso para notificaciones
  await requestNotificationPermission();
})();

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita el comportamiento por defecto del formulario
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // Ahora pasamos los datos directamente
  await handleLogin(email, password);
});
