import { initializeFirebase, requestNotificationPermission } from '../infraestructure/services/firebaseService.js';
import { handleLogin } from '../adapters/controllers/userController.js';

(async () => {
  initializeFirebase();
  
  await requestNotificationPermission();
})();

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault(); 
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  await handleLogin(email, password);
});
