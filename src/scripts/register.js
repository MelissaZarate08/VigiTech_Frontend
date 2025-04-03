import { initializeFirebase, requestNotificationPermission } from '../infraestructure/services/firebaseService.js';
import { handleRegister } from '../adapters/controllers/userController.js';

(async () => {
  initializeFirebase();
   await requestNotificationPermission();
})();

document.addEventListener("DOMContentLoaded", () => {
document.getElementById("register-form").addEventListener("submit", async function(event) {
  event.preventDefault();

  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const confirmPassword = document.getElementById("register-confirm-password").value.trim();
  const systemIDInput = document.getElementById("register-systemID")?.value.trim();
  const systemID = systemIDInput ? parseInt(systemIDInput, 10) : null;

  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }
    const roleElem = document.getElementById("register-role");
    if (!roleElem) {
      alert("No se encontró el elemento de selección del rol.");
      return;
    }
    const role = roleElem.value;
    
    await handleRegister(name, email, password, role, systemID);
  });
});
