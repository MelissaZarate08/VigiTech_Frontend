// src/infrastructure/services/firebaseService.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging.js";
import { showToast } from "./notificationUtil.js"; 

const firebaseConfig = {
  apiKey: "AIzaSyDqnEmWLU16tNmjbPOQz9aEY-Y7GNJAEok",
  authDomain: "vigitech-63edd.firebaseapp.com",
  projectId: "vigitech-63edd",
  storageBucket: "vigitech-63edd.firebasestorage.app",
  messagingSenderId: "718449220489",
  appId: "1:718449220489:web:882f67319e24993feb9f58",
};

let messaging = null;

// Inicializa Firebase y el Service Worker
// src/infrastructure/services/firebaseService.js
export function initializeFirebase() {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);

  // Registra el service worker para recibir notificaciones en 2do plano
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Service Worker registrado:", registration);
      })
      .catch((error) => {
        console.error("Error al registrar el Service Worker:", error);
      });
  }

  onMessageListener(); // Para escuchar mensajes en primer plano
}

/**
 * Solicita al usuario el permiso para mostrar notificaciones (recomendable llamarlo
 * en un flujo de UI, como al cargar la página o al dar clic en un botón).
 */
export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Permiso de notificación concedido.");
  } else {
    console.warn("Permiso de notificación denegado.");
  }
}

/**
 * Devuelve el token de notificaciones de Firebase
 */
export async function getFirebaseToken() {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BOfNSp5cp-ACTKp20ak6hlsSOfJEltAFMITp3JM6u5n8bVairvJ5Xb0ywyrgKhdetOf0b3ojjVNjTxis6_6_9rk"
    });
    if (currentToken) {
      console.log("Token de notificación:", currentToken);
      return currentToken;
    } else {
      console.warn("No se pudo obtener token. Asegúrate de haber concedido permiso de notificaciones.");
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo el token:", error);
    return null;
  }
}

function onMessageListener() {
  onMessage(messaging, (payload) => {
    console.log("Mensaje recibido en primer plano:", payload);
    const title = payload.notification.title;
    const body = payload.notification.body;
    
    // Notificación nativa (opcional)
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: payload.notification.icon || "/icon.png",
      });
    }

    // Notificación en la ventana usando Toastify
    showToast(`${title} - ${body}`);
  });
}
