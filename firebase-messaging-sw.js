importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyDqnEmWLU16tNmjbPOQz9aEY-Y7GNJAEok",
    authDomain: "vigitech-63edd.firebaseapp.com",
    projectId: "vigitech-63edd",
    storageBucket: "vigitech-63edd.appspot.com",
    messagingSenderId: "718449220489",
    appId: "1:718449220489:web:882f67319e24993feb9f58"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Mensaje recibido en segundo plano:", payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/icon.png",
    });
});
