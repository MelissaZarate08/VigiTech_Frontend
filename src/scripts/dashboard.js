import { initializeFirebase } from '../infraestructure/services/firebaseService.js';
import { requestNotificationPermission } from '../infraestructure/services/notificationService.js';
import { setupSensorDashboard } from '../adapters/controllers/sensorController.js';
import "../infraestructure/services/websocket.js"
import { sendSensorCommand, sendSystemCommand, sendSensorConfigCommand } from '../infraestructure/services/sensorService.js';


initializeFirebase();
requestNotificationPermission();

setupSensorDashboard();

const userNameSpan = document.getElementById('user-name');
const storedName = localStorage.getItem('vigitechUserName') || 'Usuario';
userNameSpan.textContent = storedName;

const btnLogout = document.getElementById('btn-logout');
btnLogout.addEventListener('click', () => {
  localStorage.removeItem('vigitechUserName');
  window.location.href = './login.html';
});

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

const systemSwitch = document.getElementById('system-switch');
const systemStatusLabel = document.getElementById('system-status-label');

window.systemActive = true;

systemSwitch.addEventListener('change', async () => {
  if (systemSwitch.checked) {
    systemStatusLabel.textContent = 'Sistema Activado';
    try {
      await sendSystemCommand('on');
      window.systemActive = true;
    } catch (error) {
      console.error('No se pudo activar el sistema', error);
    }
  } else {
    systemStatusLabel.textContent = 'Sistema Desactivado';
    try {
      await sendSystemCommand('off');
      window.systemActive = false;
    } catch (error) {
      console.error('No se pudo desactivar el sistema', error);
    }
  }
});


document.getElementById('save-config').addEventListener('click', () => {
  window.sensorsEnabled.door = document.getElementById('chk-door').checked;
  window.sensorsEnabled.light = document.getElementById('chk-light').checked;
  window.sensorsEnabled.motion = document.getElementById('chk-motion').checked;
  window.sensorsEnabled.smoke = document.getElementById('chk-smoke').checked;

  alert("Configuración guardada");
  document.getElementById('modal-config').style.display = 'none';
});

document.getElementById('chk-door').addEventListener('change', (e) => {
 window.sensorsEnabled.door = e.target.checked;
});

document.getElementById('chk-light').addEventListener('change', (e) => {
  window.sensorsEnabled.light = e.target.checked;
});

document.getElementById('chk-motion').addEventListener('change', (e) => {
  window.sensorsEnabled.motion = e.target.checked;
});

document.getElementById('chk-smoke').addEventListener('change', (e) => {
  window.sensorsEnabled.smoke = e.target.checked;
});

document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  if (role !== "user") {
      alert("Acceso denegado");
      window.location.href = "login.html";
  }
});

const userContainer = document.getElementById("user-container");
userContainer.addEventListener("click", function () {
  this.classList.toggle("active");
});


