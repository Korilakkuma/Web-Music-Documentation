import { OverlapAddProcessor } from './overlap-add.js';
import { FFT, IFFT } from '../libs/FFT.js';

class SpectrumVocalCancelerProcessor extends OverlapAddProcessor {
  // Safe positive minimum on `float` (6 digits)
  static MINIMUM_AMPLITUDE = 0.000001;

  static createHanningWindow(size) {
    const w = new Float32Array(size);

    for (let n = 0; n < size; n++) {
      w[n] = 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (size - 1));
    }

    return w;
  }

  constructor(options) {
    super(options);

    this.depth = 0;
    this.minFrequency = 200;
    this.maxFrequency = 8000;
    this.threshold = 0.05;

    this.hanningWindow = SpectrumVocalCancelerProcessor.createHanningWindow(this.frameSize);

    this.port.onmessage = (event) => {
      if (event.data.depth >= 0 && event.data.depth <= 1) {
        this.depth = event.data.depth;
      }

      if (event.data.minFrequency >= 0 && event.data.minFrequency < this.maxFrequency) {
        this.minFrequency = event.data.minFrequency;
      }

      if (event.data.maxFrequency >= this.minFrequency) {
        this.maxFrequency = event.data.maxFrequency;
      }

      if (event.data.threshold >= 0 && event.data.threshold <= 1) {
        this.threshold = event.data.threshold;
      }
    };
  }

  /** @override */
  processOverlapAdd(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];

    if (input.length === 0 || output.length === 0) {
      return true;
    }

    if (input.length !== 2 || output.length !== 2) {
      for (let channelNumber = 0, numberOfChannels = input.length; channelNumber < numberOfChannels; channelNumber++) {
        output[channelNumber].set(input[channelNumber]);
      }

      return true;
    }

    if (this.depth === 0) {
      for (let channelNumber = 0, numberOfChannels = input.length; channelNumber < numberOfChannels; channelNumber++) {
        output[channelNumber].set(input[channelNumber]);
      }

      return true;
    }

    const inputLs = input[0];
    const inputRs = input[1];

    const outputLs = output[0];
    const outputRs = output[1];

    const fftSize = this.frameSize;

    const realLs = new Float32Array(fftSize);
    const realRs = new Float32Array(fftSize);
    const imagLs = new Float32Array(fftSize);
    const imagRs = new Float32Array(fftSize);

    for (let n = 0; n < fftSize; n++) {
      realLs[n] = this.hanningWindow[n] * inputLs[n];
      realRs[n] = this.hanningWindow[n] * inputRs[n];
    }

    FFT(realLs, imagLs, fftSize);
    FFT(realRs, imagRs, fftSize);

    const absLs = new Float32Array(fftSize);
    const absRs = new Float32Array(fftSize);
    const argLs = new Float32Array(fftSize);
    const argRs = new Float32Array(fftSize);

    for (let k = 0; k < fftSize; k++) {
      absLs[k] = Math.sqrt(realLs[k] ** 2 + imagLs[k] ** 2);
      absRs[k] = Math.sqrt(realRs[k] ** 2 + imagRs[k] ** 2);
      argLs[k] = Math.atan2(imagLs[k], realLs[k]);
      argRs[k] = Math.atan2(imagRs[k], realRs[k]);
    }

    const minIndex = Math.trunc(this.minFrequency * (fftSize / sampleRate));
    const maxIndex = Math.trunc(this.maxFrequency * (fftSize / sampleRate));

    for (let k = minIndex; k < maxIndex; k++) {
      const numerator = Math.pow(absLs[k] - absRs[k], 2);
      const denominator = Math.pow(absLs[k] + absRs[k], 2);

      if (denominator != 0.0) {
        const diff = numerator / denominator;

        if (diff < this.threshold) {
          absLs[k] = SpectrumVocalCancelerProcessor.MINIMUM_AMPLITUDE;
          absRs[k] = SpectrumVocalCancelerProcessor.MINIMUM_AMPLITUDE;

          absLs[fftSize - k] = absLs[k];
          absRs[fftSize - k] = absRs[k];
        }
      }
    }

    for (let k = 0; k < fftSize; k++) {
      realLs[k] = absLs[k] * Math.cos(argLs[k]);
      realRs[k] = absRs[k] * Math.cos(argRs[k]);
      imagLs[k] = absLs[k] * Math.sin(argLs[k]);
      imagRs[k] = absRs[k] * Math.sin(argRs[k]);
    }

    IFFT(realLs, imagLs, fftSize);
    IFFT(realRs, imagRs, fftSize);

    for (let n = 0; n < fftSize; n++) {
      outputLs[n] = (1 - this.depth) * inputLs[n] + this.depth * (this.hanningWindow[n] * realLs[n]);
      outputRs[n] = (1 - this.depth) * inputRs[n] + this.depth * (this.hanningWindow[n] * realRs[n]);
    }

    return true;
  }
}

registerProcessor('SpectrumVocalCancelerProcessor', SpectrumVocalCancelerProcessor);
