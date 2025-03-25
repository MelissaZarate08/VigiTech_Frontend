// main.js

import { initializeFirebase } from './src/infraestructure/services/firebaseService.js';
import { requestNotificationPermission } from './src/infraestructure/services/notificationService.js';
import { initializeCharts } from "./src/ui/components/charts.js";

// Inicializa Firebase
initializeFirebase();

// Solicita permiso de notificaciones
requestNotificationPermission();

window.onload = () => {
  initializeCharts();
};