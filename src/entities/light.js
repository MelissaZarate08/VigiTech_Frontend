export class LightSensor {
    constructor({ id, timestamp, luminosity }) {
      this.id = id;
      this.timestamp = new Date(timestamp);
      this.luminosity = luminosity;
    }
  }
  