import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging.js";


const firebaseConfig = {
    apiKey: "AIzaSyDqnEmWLU16tNmjbPOQz9aEY-Y7GNJAEok",
    authDomain: "vigitech-63edd.firebaseapp.com",
    projectId: "vigitech-63edd",
    storageBucket: "vigitech-63edd.appspot.com",
    messagingSenderId: "718449220489",
    appId: "1:718449220489:web:882f67319e24993feb9f58"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function obtenerToken() {
    try {
        const token = await getToken(messaging, { vapidKey: "BOfNSp5cp-ACTKp20ak6hlsSOfJEltAFMITp3JM6u5n8bVairvJ5Xb0ywyrgKhdetOf0b3ojjVNjTxis6_6_9rk" });
        console.log("Token de notificación:", token);
        
        // Dado que el backend ahora registra el token manualmente a través de DEVICE_TOKEN,
        // ya no es necesario enviar el token dinámicamente al backend.
        // Por ello, se comenta o elimina la siguiente línea:
        // await enviarTokenAlBackend(token);
    } catch (error) {
        console.error("Error obteniendo el token:", error);
    }
}

obtenerToken();

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/firebase-messaging-sw.js")
        .then((registration) => {
            console.log("Service Worker registrado:", registration);
        })
        .catch((error) => {
            console.error("Error al registrar el Service Worker:", error);
        });
}

// Se elimina la función enviarTokenAlBackend, pues el backend ya no la utiliza.

// Agrega el callback onMessage para manejar notificaciones en primer plano
onMessage(messaging, (payload) => {
    console.log("Mensaje recibido en primer plano:", payload);
    // Si se quiere, se puede mostrar manualmente la notificación:
    if (Notification.permission === "granted") {
        new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.icon || '/icon.png'
        });
    }
});
