import { OverlapAddProcessor } from './overlap-add.js';
import { FFT } from '../libs/FFT.js';

/**
 * This class extends `OverlapAddProcessor`.
 */
class PhaseSpectrumOverlapAddProcessor extends OverlapAddProcessor {
  static createBlackmanWindow(size) {
    const w = new Float32Array(size);

    const alpha = 0.16;

    const a0 = (1 - alpha) / 2;
    const a1 = 1 / 2;
    const a2 = alpha / 2;

    for (let n = 0; n < size; n++) {
      w[n] = a0 - a1 * Math.cos((2 * Math.PI * n) / (size - 1)) + a2 * Math.cos((4 * Math.PI * n) / (size - 1));
    }

    return w;
  }

  constructor(options) {
    super(options);

    this.blackmanWindow = PhaseSpectrumOverlapAddProcessor.createBlackmanWindow(this.frameSize);

    this.frequencyBinCount = this.frameSize / 2;

    this.isActual = options.processorOptions.isActual;
  }

  /** @overdrive */
  processOverlapAdd(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];

    const numberOfChannels = input.length;

    for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
      // Bypass
      output[channelNumber].set(input[channelNumber]);

      const phases = new Float32Array(this.frequencyBinCount);

      const reals = new Float32Array(this.frameSize);
      const imags = new Float32Array(this.frameSize);

      for (let n = 0; n < this.frameSize; n++) {
        reals[n] = this.blackmanWindow[n] * input[channelNumber][n];
      }

      FFT(reals, imags, this.frameSize);

      const plot = Math.trunc(440 * (this.frameSize / sampleRate));

      for (let k = 0; k < this.frequencyBinCount; k++) {
        if (!this.isActual && k !== plot) {
          continue;
        }

        const amplitude = Math.sqrt(reals[k] ** 2 + imags[k] ** 2);
        const threshold = 0.05;

        if (amplitude >= threshold) {
          phases[k] = Math.atan2(imags[k], reals[k]);
        } else {
          phases[k] = 0;
        }
      }

      // Post to main thread
      this.port.postMessage(phases);
    }
  }
}

registerProcessor('PhaseSpectrumOverlapAddProcessor', PhaseSpectrumOverlapAddProcessor);
