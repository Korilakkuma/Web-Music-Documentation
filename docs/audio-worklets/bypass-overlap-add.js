import { OverlapAddProcessor } from './overlap-add.js';
import { FFT, IFFT } from '../libs/FFT.js';

/**
 * This class extends `OverlapAddProcessor`.
 */
class BypassOverlapAddProcessor extends OverlapAddProcessor {
  static createHanningWindow(size) {
    const w = new Float32Array(size);

    for (let n = 0; n < size; n++) {
      w[n] = 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / size);
    }

    return w;
  }

  constructor(options) {
    super(options);

    this.hanningWindow = BypassOverlapAddProcessor.createHanningWindow(this.frameSize);
  }

  /** @overdrive */
  processOverlapAdd(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    const numberOfChannels = input.length;

    for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
      const reals = new Float32Array(this.frameSize);
      const imags = new Float32Array(this.frameSize);

      for (let n = 0; n < this.frameSize; n++) {
        reals[n] = this.hanningWindow[n] * input[channelNumber][n];
      }

      FFT(reals, imags, this.frameSize);

      // Bypass

      IFFT(reals, imags, this.frameSize);

      for (let n = 0; n < this.frameSize; n++) {
        output[channelNumber][n] = this.hanningWindow[n] * reals[n];
      }
    }
  }
}

registerProcessor('BypassOverlapAddProcessor', BypassOverlapAddProcessor);
