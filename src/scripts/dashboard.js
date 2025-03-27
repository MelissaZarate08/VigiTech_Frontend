import { initializeFirebase } from '../infraestructure/services/firebaseService.js';
import { requestNotificationPermission } from '../infraestructure/services/notificationService.js';
import { setupSensorDashboard } from '../adapters/controllers/sensorController.js';
import "../infraestructure/services/websocket.js"
import { sendSensorCommand, sendSystemCommand, sendSensorConfigCommand } from '../infraestructure/services/sensorService.js';

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

// Al final del archivo dashboard.js: botones para alternar entre gráficos y tabla
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

window.systemActive = true;

systemSwitch.addEventListener('change', async () => {
  if (systemSwitch.checked) {
    systemStatusLabel.textContent = 'Sistema Activado';
    try {
      await sendSystemCommand('on');
      window.systemActive = true;
      // Si deseas reanudar alguna actualización extra, puedes hacerlo aquí.
    } catch (error) {
      console.error('No se pudo activar el sistema', error);
    }
  } else {
    systemStatusLabel.textContent = 'Sistema Desactivado';
    try {
      await sendSystemCommand('off');
      window.systemActive = false;
      // Aquí puedes, por ejemplo, pausar la actualización de sensores o mostrar un overlay.
    } catch (error) {
      console.error('No se pudo desactivar el sistema', error);
    }
  }
});



//
// Configuración de sensores desde el modal (no modificar nada más)
//
document.getElementById('save-config').addEventListener('click', () => {
  // Actualiza el estado global de cada sensor según los interruptores del modal
  window.sensorsEnabled.door = document.getElementById('chk-door').checked;
  window.sensorsEnabled.light = document.getElementById('chk-light').checked;
  window.sensorsEnabled.motion = document.getElementById('chk-motion').checked;
  window.sensorsEnabled.smoke = document.getElementById('chk-smoke').checked;

  //const doorState = window.sensorsEnabled.door ? 'on' : 'off';
  //const lightState = window.sensorsEnabled.light ? 'on' : 'off';
  //const motionState = window.sensorsEnabled.motion ? 'on' : 'off';
  //const smokeState = window.sensorsEnabled.smoke ? 'on' : 'off';

  // Envía el comando para cada sensor:
  //sendSensorCommand('door', doorState);
  //sendSensorCommand('light', lightState);
  //sendSensorCommand('motion', motionState);
  //sendSensorCommand('smoke', smokeState);

  alert("Configuración guardada");
  document.getElementById('modal-config').style.display = 'none';
});

// Listener para el sensor de puerta
document.getElementById('chk-door').addEventListener('change', (e) => {
  //const action = e.target.checked ? 'on' : 'off';
  //try {
   // await sendSensorConfigCommand('door', action);
    //window.sensorsEnabled.door = e.target.checked;
  //} catch (error) {
  //  console.error('Error al configurar sensor door', error);
    // Opcional: Puedes revertir el checkbox si ocurre un error.
 // }
 window.sensorsEnabled.door = e.target.checked;
});

// Listener para el sensor de luz
document.getElementById('chk-light').addEventListener('change', (e) => {
  //const action = e.target.checked ? 'on' : 'off';
  //try {
   // await sendSensorConfigCommand('light', action);
   // window.sensorsEnabled.light = e.target.checked;
  //} catch (error) {
   // console.error('Error al configurar sensor light', error);
  //}
  window.sensorsEnabled.light = e.target.checked;
});

// Listener para el sensor de movimiento
document.getElementById('chk-motion').addEventListener('change', (e) => {
  //const action = e.target.checked ? 'on' : 'off';
  //try {
    //await sendSensorConfigCommand('motion', action);
    //window.sensorsEnabled.motion = e.target.checked;
  //} catch (error) {
    //console.error('Error al configurar sensor motion', error);
  //}
  window.sensorsEnabled.motion = e.target.checked;
});

// Listener para el sensor de humo
document.getElementById('chk-smoke').addEventListener('change', (e) => {
  //const action = e.target.checked ? 'on' : 'off';
  //try {
   // await sendSensorConfigCommand('smoke', action);
   // window.sensorsEnabled.smoke = e.target.checked;
  //} catch (error) {
  //  console.error('Error al configurar sensor smoke', error);
  //}
  window.sensorsEnabled.smoke = e.target.checked;
});

document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  if (role !== "user") {
      alert("Acceso denegado");
      window.location.href = "login.html";
  }
});
