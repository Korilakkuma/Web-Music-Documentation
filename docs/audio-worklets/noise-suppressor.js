import { OverlapAddProcessor } from './overlap-add.js';
import { FFT, IFFT } from '../libs/FFT.js';

class NoiseSuppressorProcessor extends OverlapAddProcessor {
  static createHanningWindow(size) {
    const w = new Float32Array(size);

    for (let n = 0; n < size; n++) {
      w[n] = 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (size - 1));
    }

    return w;
  }

  constructor(options) {
    super(options);

    this.threshold = 0;

    this.hanningWindow = NoiseSuppressorProcessor.createHanningWindow(this.frameSize);

    this.port.onmessage = (event) => {
      if (event.data.threshold >= 0 && event.data.threshold <= 1) {
        this.threshold = event.data.threshold;
      }
    };
  }

  processOverlapAdd(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];

    const numberOfChannels = input.length;

    const fftSize = this.frameSize;

    for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
      const reals = new Float32Array(fftSize);
      const imags = new Float32Array(fftSize);

      for (let n = 0; n < fftSize; n++) {
        reals[n] = this.hanningWindow[n] * input[channelNumber][n];
      }

      FFT(reals, imags, fftSize);

      const amplitudes = new Float32Array(fftSize);
      const phases = new Float32Array(fftSize);

      for (let k = 0; k < fftSize; k++) {
        amplitudes[k] = Math.sqrt(reals[k] ** 2 + imags[k] ** 2);

        if (reals[k] !== 0 && imags[k] !== 0) {
          phases[k] = Math.atan2(imags[k], reals[k]);
        }
      }

      for (let k = 0; k < fftSize; k++) {
        amplitudes[k] -= this.threshold;

        if (amplitudes[k] < 0) {
          amplitudes[k] = 0;
        }
      }

      // Euler's formula
      for (let k = 0; k < fftSize; k++) {
        reals[k] = amplitudes[k] * Math.cos(phases[k]);
        imags[k] = amplitudes[k] * Math.sin(phases[k]);
      }

      IFFT(reals, imags, fftSize);

      for (let n = 0; n < fftSize; n++) {
        output[channelNumber][n] = this.hanningWindow[n] * reals[n];
      }
    }
  }
}

registerProcessor('NoiseSuppressorProcessor', NoiseSuppressorProcessor);
