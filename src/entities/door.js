// src/entities/door.js
export class DoorSensor {
    constructor({ id, timestamp, is_open }) {
      this.id = id;
      this.timestamp = new Date(timestamp);
      this.isOpen = is_open;
    }
  }
  