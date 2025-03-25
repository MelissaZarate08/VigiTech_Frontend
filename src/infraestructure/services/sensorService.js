import { DoorSensor } from '../../entities/door.js';
import { LightSensor } from '../../entities/light.js';
import { MotionSensor } from '../../entities/motion.js';
import { SmokeSensor } from '../../entities/smoke.js';

const SENSOR_API_URL = 'http://192.168.2.187:8081/sensor';
const COMMAND_API_URL = 'http://192.168.2.187:8081/command';

export async function getDoorData() {
  const response = await fetch(`${SENSOR_API_URL}/door`);
  const data = await response.json();
  // Asumimos que el primer elemento es el más reciente, según el orden que devuelve el endpoint.
  return new DoorSensor(data[0]);
}

export async function getLightData() {
  const response = await fetch(`${SENSOR_API_URL}/light`);
  const data = await response.json();
  return new LightSensor(data[0]);
}


export async function getMotionData() {
  const response = await fetch(`${SENSOR_API_URL}/motion`);
  const data = await response.json();
  return new MotionSensor(data[0]);
}


export async function getSmokeData() {
  const response = await fetch(`${SENSOR_API_URL}/smoke`);
  const data = await response.json();
  return new SmokeSensor(data[0]);
}

export async function sendSensorCommand(sensorType, action) {
  try {
    const response = await fetch(`${COMMAND_API_URL}/${sensorType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }) // 'on' o 'off'
    });
    if (!response.ok) throw new Error('Error al enviar el comando');
    const result = await response.json();
    console.log(`Comando enviado a ${sensorType}: ${action}`);
    return result;
  } catch (error) {
    console.error('Error al enviar el comando:', error);
    throw error;
  }
}
