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

export function initializeFirebase() {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);

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

  onMessageListener(); 
}

export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Permiso de notificación concedido.");
  } else {
    console.warn("Permiso de notificación denegado.");
  }
}


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
    
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: payload.notification.icon || "/icon.png",
      });
    }

    showToast(`${title} - ${body}`);
  });
}
