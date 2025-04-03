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

  const doorChartCtx = document.getElementById('doorChart').getContext('2d');
  const lightChartCtx = document.getElementById('lightChart').getContext('2d');
  const motionChartCtx = document.getElementById('motionChart').getContext('2d');
  const smokeChartCtx = document.getElementById('smokeChart').getContext('2d');

  const doorChart = new Chart(doorChartCtx, {
    type: 'line',
    data: {
      labels: [], 
      datasets: [{
        label: 'Puerta (Abierta=1 / Cerrada=0)',
        data: [],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#007bff',
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: 'white',
            font: { size: 12 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.7)',
          titleFont: { size: 14 },
          bodyFont: { size: 12 }
        }
      },
    }
  });

  const lightChart = new Chart(lightChartCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Luminosidad (lx)',
        data: [],
        borderColor: '#ffc107',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#ffc107',
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: 'white',
            font: { size: 12 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.7)',
          titleFont: { size: 14 },
          bodyFont: { size: 12 }
        }
      },
    }
  });

  const motionChart = new Chart(motionChartCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Intensidad Movimiento',
        data: [],
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#28a745',
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: 'white',
            font: { size: 12 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.7)',
          titleFont: { size: 14 },
          bodyFont: { size: 12 }
        }
      },
    }
  });

  const smokeChart = new Chart(smokeChartCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Nivel de Gas',
        data: [],
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#dc3545',
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: 'white',
            font: { size: 12 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.7)',
          titleFont: { size: 14 },
          bodyFont: { size: 12 }
        }
      },
    }
  });
  
  const sensorsEnabled = {
    door: true,
    light: true,
    motion: true,
    smoke: true
  };

  function addTableRow(sensorName, state, value, timestamp) {
    console.log(`Agregando fila: ${sensorName} - ${state} - ${value} - ${timestamp}`);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${sensorName}</td>
      <td>${state}</td>
      <td>${value}</td>
      <td>${timestamp}</td>
    `;
    tableBody.prepend(row); 

    while (tableBody.childElementCount > 30) {
      tableBody.removeChild(tableBody.lastChild);
    }
  }

  function formatTimestamp(utcTimestamp) {
    const date = new Date(utcTimestamp); 

    return date.toLocaleTimeString("es-MX", {
      hour12: false, 
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC", 
    });
  }
  

  async function updateSensors() {
    if (!window.systemActive) {
      console.log("Sistema desactivado, no se actualizan sensores.");
      return;
    }
  
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
        if (sensorsEnabled.light) {
          lightStatusEl.textContent = `${lightData.luminosity} lx`;
          const lightLabel = formatTimestamp(lightData.timestamp);
          lightChart.data.labels.push(lightLabel);
          lightChart.data.datasets[0].data.push(lightData.luminosity);
          lightChart.update();
        } else {
          lightStatusEl.textContent = 'Sensor desactivado';
        }
      } catch (error) {
        console.error('Error actualizando sensor de luz:', error);
      }
    } else {
     lightStatusEl.textContent = 'Sensor desactivado';
    }

  
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
            addTableRow('Gas', 'Alarma activada', smokeData.smokeLevel, smokeLabel);
          }
       } else {
         smokeStatusEl.textContent = 'Sensor desactivado';
       }
      } catch (error) {
        console.error('Error actualizando sensor de gas:', error);
      }
    } else {
     smokeStatusEl.textContent = 'Sensor desactivado';
    }

  }
  
  updateSensors();
  setInterval(updateSensors, 5000);
  window.sensorsEnabled = sensorsEnabled;
}


