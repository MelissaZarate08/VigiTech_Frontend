import { initializeFirebase } from '../infraestructure/services/firebaseService.js';
import { requestNotificationPermission } from '../infraestructure/services/notificationService.js';
import { setupSensorDashboard } from '../adapters/controllers/sensorController.js';
import "../infraestructure/services/websocket.js"

// Inicializa Firebase y notificaciones
initializeFirebase();
requestNotificationPermission();

// Configura la lógica del dashboard (sensores, gráficas, etc.)
setupSensorDashboard();

// Mostrar nombre del usuario (ejemplo: se guarda en localStorage al hacer login)
const userNameSpan = document.getElementById('user-name');
const storedName = localStorage.getItem('vigitechUserName') || 'Usuario';
userNameSpan.textContent = storedName;

// Manejo de botones
const btnLogout = document.getElementById('btn-logout');
btnLogout.addEventListener('click', () => {
  // Borrar datos y redirigir a login
  localStorage.removeItem('vigitechUserName');
  window.location.href = './login.html';
});

// Manejo modales
const modalConfig = document.getElementById('modal-config');
const modalEmergency = document.getElementById('modal-emergency');
const btnConfig = document.getElementById('btn-config');
const btnEmergency = document.getElementById('btn-emergency');
const closeConfig = document.getElementById('close-config');
const closeEmergency = document.getElementById('close-emergency');

btnConfig.addEventListener('click', () => modalConfig.style.display = 'block');
btnEmergency.addEventListener('click', () => modalEmergency.style.display = 'block');
closeConfig.addEventListener('click', () => modalConfig.style.display = 'none');
closeEmergency.addEventListener('click', () => modalEmergency.style.display = 'none');

// Al final del archivo dashboard.js
const btnViewCharts = document.getElementById('btn-view-charts');
const btnViewTable = document.getElementById('btn-view-table');
const chartsContainer = document.getElementById('charts-container');
const tableContainer = document.getElementById('table-container');

btnViewCharts.addEventListener('click', () => {
  btnViewCharts.classList.add('active');
  btnViewTable.classList.remove('active');
  chartsContainer.style.display = 'block';
  tableContainer.style.display = 'none';
});

btnViewTable.addEventListener('click', () => {
  btnViewTable.classList.add('active');
  btnViewCharts.classList.remove('active');
  chartsContainer.style.display = 'none';
  tableContainer.style.display = 'block';
});

// Manejador del interruptor del sistema de seguridad
const systemSwitch = document.getElementById('system-switch');
const systemStatusLabel = document.getElementById('system-status-label');

systemSwitch.addEventListener('change', () => {
  if (systemSwitch.checked) {
    systemStatusLabel.textContent = 'Sistema Activado';
    // Aquí puedes reactivar la lógica de sensores, por ejemplo:
    // reanudar actualización de sensores si fue pausada
  } else {
    systemStatusLabel.textContent = 'Sistema Desactivado';
    // Aquí puedes implementar la pausa de la actualización de sensores o mostrar un overlay
  }
});

// Agrega este código en dashboard.js (o en un archivo apropiado) justo después de configurar los modales:
document.getElementById('save-config').addEventListener('click', () => {
  const doorState = document.getElementById('chk-door').checked ? 'on' : 'off';
  const lightState = document.getElementById('chk-light').checked ? 'on' : 'off';
  const motionState = document.getElementById('chk-motion').checked ? 'on' : 'off';
  const smokeState = document.getElementById('chk-smoke').checked ? 'on' : 'off';

  // Envía el comando para cada sensor:
  sendSensorCommand('door', doorState);
  sendSensorCommand('light', lightState);
  sendSensorCommand('motion', motionState);
  sendSensorCommand('smoke', smokeState);

  alert("Configuración guardada");
  document.getElementById('modal-config').style.display = 'none';
});

