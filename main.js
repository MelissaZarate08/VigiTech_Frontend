import { initializeFirebase } from './src/infraestructure/services/firebaseService.js';
import { requestNotificationPermission } from './src/infraestructure/services/notificationService.js';
import { initializeCharts } from "./src/ui/components/charts.js";

initializeFirebase();

requestNotificationPermission();

window.onload = () => {
  initializeCharts();
};