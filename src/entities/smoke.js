// src/entities/smoke.js
export class SmokeSensor {
    constructor({ id, timestamp, smoke_level, alarm }) {
      this.id = id;
      this.timestamp = new Date(timestamp);
      this.smokeLevel = smoke_level;
      this.alarm = alarm;
    }
  }
  