// Define the VolumeProcessor class extending AudioWorkletProcessor
class VolumeProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.volume = 0; // Initialize volume
  }

  // The process method where audio processing takes place
  process(inputs) {
    const input = inputs[0]; // Get input buffer
    if (input.length > 0) {
      const samples = input[0]; // Get samples from input buffer
      let sum = 0;
      // Calculate the sum of squared samples
      for (let i = 0; i < samples.length; i++) {
        sum += samples[i] * samples[i];
      }
      // Calculate the root mean square (RMS) value
      const rms = Math.sqrt(sum / samples.length);
      this.volume = rms; // Update volume with RMS value
      // Send volume data to the main thread
      this.port.postMessage({ volume: this.volume * 100 }); // Scale to a more readable value
    }
    return true; // Return true to indicate success
  }
}

// Register the processor with the name 'volume-processor'
registerProcessor('volume-processor', VolumeProcessor);
