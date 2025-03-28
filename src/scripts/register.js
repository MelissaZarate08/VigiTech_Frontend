// src/scripts/register.js
import { initializeFirebase, requestNotificationPermission } from '../infraestructure/services/firebaseService.js';
import { handleRegister } from '../adapters/controllers/userController.js';

(async () => {
  // Inicializa Firebase (solo debe hacerse una vez)
  initializeFirebase();
  
  // Pide permiso para notificaciones
  await requestNotificationPermission();
})();

document.addEventListener("DOMContentLoaded", () => {
document.getElementById("register-form").addEventListener("submit", async function(event) {
  event.preventDefault();

  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const confirmPassword = document.getElementById("register-confirm-password").value.trim();

  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }
   // Aquí se obtiene el rol, asegurándote de que el elemento existe
    const roleElem = document.getElementById("register-role");
    if (!roleElem) {
      alert("No se encontró el elemento de selección del rol.");
      return;
    }
    const role = roleElem.value;
    
    // Llama a handleRegister para enviar los datos al backend
    await handleRegister(name, email, password, role);
  });
});
