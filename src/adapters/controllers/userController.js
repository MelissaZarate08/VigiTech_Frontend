// src/adapters/controllers/userController.js
import { getFirebaseToken } from "../../infraestructure/services/firebaseService.js";
import { showToast } from "../../infraestructure/services/notificationUtil.js";

export async function handleRegister(name, email, password, role) {
  try {
    console.log("Registrando con:", name, email, password, role);

    const firebaseToken = await getFirebaseToken();
    console.log("Token de Firebase obtenido:", firebaseToken);

    const response = await fetch("http://192.168.2.187:8080/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        firebaseToken: firebaseToken || '',
        role,
      }),
    });

    const data = await response.json();
    console.log("Respuesta del servidor al registrar:", data);

    if (response.ok && data.success) {
      localStorage.setItem("vigitechUserName", name);
      showToast("Registro exitoso.", { backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)" });
      window.location.href = "./login.html";
    } else {
      showToast("Error en registro: " + (data.message || "No se pudo registrar."), { backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)" });
    }
  } catch (error) {
    console.error("Error en el registro:", error);
    showToast("Ocurrió un error al registrarse.", { backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)" });
  }
}


// src/adapters/controllers/userController.js
// src/adapters/controllers/userController.js
async function handleLogin(email, password) {
  try {
    const firebaseToken = await getFirebaseToken();

    const response = await fetch("http://192.168.2.187:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firebaseToken }),
    });

    const data = await response.json();
    console.log("Datos recibidos:", data);

    if (!data.success) {
      // Mostrar error y detener la ejecución
      showToast(data.message || "Error en el inicio de sesión", { 
        background: "linear-gradient(to right, #e74c3c, #c0392b)" 
      });
      return;
    }

    // Si el login es exitoso:
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("vigitechUserName", data.userName || "Usuario");

    showToast("¡Bienvenido de nuevo " + (data.userName || "Usuario") + "!", { 
      background: "linear-gradient(to right, #00b09b, #96c93d)" 
    });

    if (data.role === "admin") {
      window.location.href = "./admin-dashboard.html";
    } else {
      window.location.href = "./dashboard.html";
    }
  } catch (error) {
    console.error("Error en el login:", error);
    showToast("Error en el inicio de sesión", { 
      background: "linear-gradient(to right, #e74c3c, #c0392b)" 
    });
  }
}
export { handleLogin };
