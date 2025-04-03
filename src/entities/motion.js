export class MotionSensor {
    constructor({ id, timestamp, motion_detected, intensity }) {
      this.id = id;
      this.timestamp = new Date(timestamp);
      this.motionDetected = motion_detected;
      this.intensity = intensity;
    }
  }
  