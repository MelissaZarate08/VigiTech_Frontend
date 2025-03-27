// src/adapters/controllers/userController.js
import { getFirebaseToken } from "../../infraestructure/services/firebaseService.js";

export async function handleRegister(name, email, password, role) {
  try {
    console.log("Registrando con:", name, email, password, role);

    // Obtén el token de notificaciones de Firebase
    const firebaseToken = await getFirebaseToken();
    console.log("Token de Firebase obtenido:", firebaseToken); // Verifica que el token se obtiene

    const response = await fetch("http://192.168.2.187:8080/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        firebaseToken: firebaseToken || '', // Envía una cadena vacía si el token es null
        role, // Enviamos el rol
      }),
    });

    const data = await response.json();
    console.log("Respuesta del servidor al registrar:", data); // Verifica la respuesta

    if (response.ok && data.success) {
      // Guardar nombre en localStorage
      localStorage.setItem("vigitechUserName", name);
      
      // Redirigir al dashboard
      window.location.href = "./login.html";
    } else {
      alert("Error en registro: " + (data.message || "No se pudo registrar."));
    }
  } catch (error) {
    console.error("Error en el registro:", error);
    alert("Ocurrió un error al registrarse.");
  }
}


// src/adapters/controllers/userController.js
// src/adapters/controllers/userController.js
async function handleLogin(email, password) {
  try {
      const response = await fetch("http://192.168.2.187:8080/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Datos recibidos:", data); // Verifica que el objeto `data` contiene `isActive`

      if (data.success) {
          // Verificar si el usuario está activo
          if (!data.isActive) {
              // Si no está activo, mostrar un mensaje y redirigir
              alert("Tu cuenta está desactivada. No puedes acceder.");
              window.location.href = "./login.html"; // Redirige de nuevo al login
              return; // Detener la ejecución si el usuario está desactivado
          }

          // Si el usuario está activo, guarda los datos y redirige según el rol
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role); // Guarda el rol en localStorage

          // Redirigir según el rol
          if (data.role === "admin") {
              window.location.href = "./admin-dashboard.html";
          } else {
              window.location.href = "./dashboard.html";
          }
      } else {
          alert("Credenciales incorrectas");
      }
  } catch (error) {
      console.error("Error en el login:", error);
      alert("Error en el inicio de sesión");
  }
}
export { handleLogin };
