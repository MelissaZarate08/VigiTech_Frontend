let reconnectInterval = 5000; 
let ws;

function connectWebSocket() {
  ws = new WebSocket("ws://vigitech-ws.integrador.xyz/ws");

  ws.onopen = () => {
    console.log("Conectado al servidor WebSocket");
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("Datos recibidos del WebSocket:", data);
      
      let sensorType = data.sensor;
      if (!sensorType && data.id) {
        if (data.id.toLowerCase().includes('door')) sensorType = 'door';
        else if (data.id.toLowerCase().includes('light')) sensorType = 'light';
        else if (data.id.toLowerCase().includes('motion')) sensorType = 'motion';
        else if (data.id.toLowerCase().includes('smoke')) sensorType = 'smoke';
      }
      
      if (!sensorType) {
        console.warn("Mensaje recibido sin sensor definido:", data);
        return;
      }
      
      if (window.sensorsEnabled && window.sensorsEnabled[sensorType] === false) {
        console.log(`Actualización ignorada: sensor ${sensorType} desactivado.`);
        return;
      }
      
      const element = document.getElementById(`${sensorType}-status`);
      if (!element) {
        console.warn(`Elemento no encontrado para el sensor: ${sensorType}`);
        return;
      }
      
      switch (sensorType) {
        case "door":
          element.textContent = data.is_open ? "Abierta" : "Cerrada";
          break;
        case "light":
          element.textContent = `${data.luminosity} lx`;
          break;
        case "motion":
          element.textContent = data.motion_detected ? "Detectado" : "Sin movimiento";
          break;
        case "smoke":
          element.textContent = data.alarm ? `¡Alarma! (${data.smoke_level})` : data.smoke_level;
          break;
        default:
          console.warn("Sensor desconocido recibido:", sensorType, "Datos:", data);
      }
    } catch (error) {
      console.error("Error al procesar el mensaje del WebSocket:", error);
    }
  };
  

  ws.onerror = (error) => {
    console.error("Error en el WebSocket:", error);
  };

  ws.onclose = () => {
    console.log(`La conexión WebSocket se ha cerrado. Intentando reconectar en ${reconnectInterval / 1000} segundos...`);
    setTimeout(connectWebSocket, reconnectInterval);
  };
}

export function sendWebSocketMessage(payload) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  } else {
    console.error("WebSocket no está abierto. No se pudo enviar el mensaje:", payload);
  }
}

connectWebSocket();
