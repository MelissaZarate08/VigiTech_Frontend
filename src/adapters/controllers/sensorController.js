// src/adapters/controllers/sensorController.js
import { 
  getDoorData, 
  getLightData, 
  getMotionData, 
  getSmokeData, 
  sendSensorCommand 
} from '../../infraestructure/services/sensorService.js';

/**
 * Lógica para el dashboard de sensores:
 * - Mostrar estados en tiempo real
 * - Graficar datos históricos
 * - Actualizar tabla con eventos críticos (sensores activos)
 */
export function setupSensorDashboard() {
  const doorStatusEl = document.getElementById('door-status');
  const lightStatusEl = document.getElementById('light-status');
  const motionStatusEl = document.getElementById('motion-status');
  const smokeStatusEl = document.getElementById('smoke-status');
  const tableBody = document.getElementById('monitoring-table-body');

  // Canvases para Chart.js
  const doorChartCtx = document.getElementById('doorChart').getContext('2d');
  const lightChartCtx = document.getElementById('lightChart').getContext('2d');
  const motionChartCtx = document.getElementById('motionChart').getContext('2d');
  const smokeChartCtx = document.getElementById('smokeChart').getContext('2d');

  // Inicializamos gráficos vacíos (ejemplo simple)
  const doorChart = new Chart(doorChartCtx, {
    type: 'line',
    data: {
      labels: [],  // timestamps
      datasets: [{
        label: 'Puerta (Abierta=1 / Cerrada=0)',
        data: [],
        borderColor: 'blue',
        fill: false
      }]
    }
  });

  const lightChart = new Chart(lightChartCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Luminosidad',
        data: [],
        borderColor: 'yellow',
        fill: false
      }]
    }
  });

  const motionChart = new Chart(motionChartCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Intensidad Movimiento',
        data: [],
        borderColor: 'green',
        fill: false
      }]
    }
  });

  const smokeChart = new Chart(smokeChartCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Nivel de Humo',
        data: [],
        borderColor: 'red',
        fill: false
      }]
    }
  });

  // Función para agregar filas a la tabla de eventos críticos
  function addTableRow(sensorName, state, value, timestamp) {
    console.log(`Agregando fila: ${sensorName} - ${state} - ${value} - ${timestamp}`);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${sensorName}</td>
      <td>${state}</td>
      <td>${value}</td>
      <td>${timestamp}</td>
    `;
    tableBody.prepend(row); // prepend para ver primero los eventos recientes

    while (tableBody.childElementCount > 30) {
      tableBody.removeChild(tableBody.lastChild);
    }
  }

  function formatTimestamp(utcTimestamp) {
    const date = new Date(utcTimestamp); // Crear la fecha con el timestamp recibido

    return date.toLocaleTimeString("es-MX", {
        hour12: false, // Formato 24 horas
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC", // Mostrar exactamente la hora recibida sin ajustes de zona horaria
    });
}

  
  async function updateSensors() {
    try {
      const doorData = await getDoorData();
      const lightData = await getLightData();
      const motionData = await getMotionData();
      const smokeData = await getSmokeData();
  
      // Depuración: imprime el timestamp original
      console.log("Timestamp original door:", doorData.timestamp);
      console.log("Timestamp original light:", lightData.timestamp);
      console.log("Timestamp original motion:", motionData.timestamp);
      console.log("Timestamp original smoke:", smokeData.timestamp);
  
      // Actualiza los textos de los estados
      doorStatusEl.textContent = doorData.isOpen ? 'Abierta' : 'Cerrada';
      lightStatusEl.textContent = `${lightData.luminosity} lx`;
      motionStatusEl.textContent = motionData.motionDetected ? 'Detectado' : 'Sin movimiento';
      smokeStatusEl.textContent = smokeData.alarm ? `¡Alarma! (${smokeData.smokeLevel})` : smokeData.smokeLevel;
  
      // Usa la función de formateo y depura el valor resultante
      const doorLabel = formatTimestamp(doorData.timestamp);
      console.log("Door label formateado:", doorLabel);
      const lightLabel = formatTimestamp(lightData.timestamp);
      const motionLabel = formatTimestamp(motionData.timestamp);
      const smokeLabel = formatTimestamp(smokeData.timestamp);
      
  
      // Actualiza las gráficas
      doorChart.data.labels.push(doorLabel);
      doorChart.data.datasets[0].data.push(doorData.isOpen ? 1 : 0);
      doorChart.update();
  
      lightChart.data.labels.push(lightLabel);
      lightChart.data.datasets[0].data.push(lightData.luminosity);
      lightChart.update();
  
      motionChart.data.labels.push(motionLabel);
      motionChart.data.datasets[0].data.push(motionData.intensity);
      motionChart.update();
  
      smokeChart.data.labels.push(smokeLabel);
      smokeChart.data.datasets[0].data.push(smokeData.smokeLevel);
      smokeChart.update();
  
      // Actualiza la tabla solo para eventos críticos:
      if (doorData.isOpen) {
        addTableRow('Puerta', 'Abierta', doorData.isOpen ? 1 : 0, doorLabel);
      }
      if (motionData.motionDetected) {
        addTableRow('Movimiento', 'Detectado', motionData.intensity, motionLabel);
      }
      if (smokeData.alarm) {
        addTableRow('Humo', 'Alarma activada', smokeData.smokeLevel, smokeLabel);
      }
    } catch (error) {
      console.error('Error actualizando sensores:', error);
    }
  }  
  
  // Actualiza de inmediato y luego cada 5 segundos
  updateSensors();
  setInterval(updateSensors, 5000);
}

export function setupControlButtons() {
  document.getElementById('btn-system-on').addEventListener('click', () => controlSystem('on'));
  document.getElementById('btn-system-off').addEventListener('click', () => controlSystem('off'));
  // Si quieres botones por sensor, repites aquí con su ID y tipo de sensor
}

async function controlSystem(action) {
  try {
    const response = await sendSensorCommand('system', action);  // 'system' es un ejemplo
    alert(`Sistema ${action === 'on' ? 'encendido' : 'apagado'}`);
    console.log(response);
  } catch (error) {
    alert('Error al enviar el comando');
  }
}

