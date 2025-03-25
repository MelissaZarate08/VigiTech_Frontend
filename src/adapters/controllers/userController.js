// src/adapters/controllers/userController.js
import { getFirebaseToken } from "../../infraestructure/services/firebaseService.js";

export async function handleRegister(name, email, password) {
  try {
    console.log("Registrando con:", name, email, password);

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
export async function handleLogin(email, password) {
  try {
    console.log("Iniciando sesión con:", email, password);

    // Obtén el token de notificaciones de Firebase
    const firebaseToken = await getFirebaseToken();
    
    const response = await fetch("http://192.168.2.187:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        firebaseToken, // Envía el token aquí si también se necesita
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Guardar datos del usuario en localStorage
      localStorage.setItem("vigitechUserName", data.userName);
      localStorage.setItem("vigitechToken", data.token); // Si el backend devuelve un token

      // Redirigir al dashboard
      window.location.href = "./dashboard.html";
    } else {
      alert("Error en login: " + (data.message || "Credenciales incorrectas"));
    }
  } catch (error) {
    console.error("Error en el login:", error);
    alert("Ocurrió un error al iniciar sesión.");
  }
}

