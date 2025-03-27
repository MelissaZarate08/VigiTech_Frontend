// src/adapters/controllers/sensorController.js
import { 
  getDoorData, 
  getLightData, 
  getMotionData, 
  getSmokeData, 
  sendSensorCommand 
} from '../../infraestructure/services/sensorService.js';


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

  // Objeto para mantener el estado (activado/desactivado) de cada sensor
  const sensorsEnabled = {
    door: true,
    light: true,
    motion: true,
    smoke: true
  };

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
    // Si el sistema está desactivado, no se actualizan sensores.
    if (!window.systemActive) {
      console.log("Sistema desactivado, no se actualizan sensores.");
      return;
    }
  
    // SENSOR DE PUERTA
    if (sensorsEnabled.door) {
     try {
        const doorData = await getDoorData();
       if (sensorsEnabled.door) {
          doorStatusEl.textContent = doorData.isOpen ? 'Abierta' : 'Cerrada';
          const doorLabel = formatTimestamp(doorData.timestamp);
         doorChart.data.labels.push(doorLabel);
         doorChart.data.datasets[0].data.push(doorData.isOpen ? 1 : 0);
         doorChart.update();
         if (doorData.isOpen) {
           addTableRow('Puerta', 'Abierta', doorData.isOpen ? 1 : 0, doorLabel);
         }
        } else {
         doorStatusEl.textContent = 'Sensor desactivado';
       }
     } catch (error) {
       console.error('Error actualizando sensor de puerta:', error);
     }
    } else {
      doorStatusEl.textContent = 'Sensor desactivado';
    }


    // SENSOR DE LUZ
    if (sensorsEnabled.light) {
      try {
        const lightData = await getLightData();
        // Verificar si el sensor sigue activado al momento de recibir los datos
        if (sensorsEnabled.light) {
          lightStatusEl.textContent = `${lightData.luminosity} lx`;
          const lightLabel = formatTimestamp(lightData.timestamp);
          lightChart.data.labels.push(lightLabel);
          lightChart.data.datasets[0].data.push(lightData.luminosity);
          lightChart.update();
        } else {
          // Si se desactivó durante la petición, se muestra "Sensor desactivado"
          lightStatusEl.textContent = 'Sensor desactivado';
        }
      } catch (error) {
        console.error('Error actualizando sensor de luz:', error);
      }
    } else {
     lightStatusEl.textContent = 'Sensor desactivado';
    }

  
   
  
    // SENSOR DE MOVIMIENTO
 // SENSOR DE MOVIMIENTO
    if (sensorsEnabled.motion) {
      try {
       const motionData = await getMotionData();
       if (sensorsEnabled.motion) {
          motionStatusEl.textContent = motionData.motionDetected ? 'Detectado' : 'Sin movimiento';
         const motionLabel = formatTimestamp(motionData.timestamp);
         motionChart.data.labels.push(motionLabel);
         motionChart.data.datasets[0].data.push(motionData.intensity);
         motionChart.update();
         if (motionData.motionDetected) {
           addTableRow('Movimiento', 'Detectado', motionData.intensity, motionLabel);
         }
        } else {
          motionStatusEl.textContent = 'Sensor desactivado';
        }
     } catch (error) {
       console.error('Error actualizando sensor de movimiento:', error);
     }
    } else {
     motionStatusEl.textContent = 'Sensor desactivado';
    }
  
// SENSOR DE HUMO
    if (sensorsEnabled.smoke) {
      try {
       const smokeData = await getSmokeData();
       if (sensorsEnabled.smoke) {
          smokeStatusEl.textContent = smokeData.alarm ? `¡Alarma! (${smokeData.smokeLevel})` : smokeData.smokeLevel;
         const smokeLabel = formatTimestamp(smokeData.timestamp);
         smokeChart.data.labels.push(smokeLabel);
         smokeChart.data.datasets[0].data.push(smokeData.smokeLevel);
         smokeChart.update();
          if (smokeData.alarm) {
            addTableRow('Humo', 'Alarma activada', smokeData.smokeLevel, smokeLabel);
          }
       } else {
         smokeStatusEl.textContent = 'Sensor desactivado';
       }
      } catch (error) {
        console.error('Error actualizando sensor de humo:', error);
      }
    } else {
     smokeStatusEl.textContent = 'Sensor desactivado';
    }

  }
  

  // Actualiza de inmediato y luego cada 5 segundos
  updateSensors();
  setInterval(updateSensors, 5000);

  // Para poder actualizar el estado de sensores desde el modal de configuración,
  // se expone la referencia del objeto sensorsEnabled en el ámbito global del dashboard.
  window.sensorsEnabled = sensorsEnabled;
}


