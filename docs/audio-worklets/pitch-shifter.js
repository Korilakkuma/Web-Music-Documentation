import { OverlapAddProcessor } from './overlap-add.js';
import { FFT, IFFT } from '../libs/FFT.js';

class PitchShifterProcessor extends OverlapAddProcessor {
  static createHanningWindow(size) {
    const w = new Float32Array(size);

    for (let n = 0; n < size; n++) {
      w[n] = 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (size - 1));
    }

    return w;
  }

  constructor(options) {
    super(options);

    this.pitch = 1;
    this.speed = 1;

    this.timeCursor = 0;

    this.hanningWindow = PitchShifterProcessor.createHanningWindow(this.frameSize);

    this.port.onmessage = (event) => {
      if (event.data.pitch > 0) {
        this.pitch = event.data.pitch;
      }

      if (event.data.speed > 0) {
        this.speed = event.data.speed;
      }
    };
  }

  /** @overdrive */
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

      const halfOfFFTSizze = fftSize / 2;
      const bufferSize = halfOfFFTSizze + 1;

      const magnitudes = new Float32Array(bufferSize);
      const peakIndexes = new Uint16Array(bufferSize);

      for (let k = 0; k < bufferSize; k++) {
        magnitudes[k] = reals[k] ** 2 + imags[k] ** 2;
      }

      let numberOfPeaks = 0;

      // Find peaks
      let index = 2;

      const end = halfOfFFTSizze + 1 - 2;

      while (index < end) {
        const magnitude = magnitudes[index];

        if (magnitudes[index - 1] >= magnitude || magnitudes[index - 2] >= magnitude) {
          ++index;
          continue;
        }

        if (magnitudes[index + 1] >= magnitude || magnitudes[index + 2] >= magnitude) {
          ++index;
          continue;
        }

        peakIndexes[numberOfPeaks++] = index;

        index += 2;
      }

      // Shift peaks
      const shiftedReals = new Float32Array(fftSize);
      const shiftedImags = new Float32Array(fftSize);

      for (let k = 0; k < numberOfPeaks; k++) {
        const peakIndex = peakIndexes[k];

        const shiftedPeakIndex = Math.round(peakIndex * this.pitch * (1 / this.speed));

        if (shiftedPeakIndex > bufferSize) {
          break;
        }

        let startIndex = 0;
        let endIndex = fftSize;

        if (k > 0) {
          const peakIndexBefore = peakIndexes[k - 1];

          startIndex = peakIndex - Math.floor((peakIndex - peakIndexBefore) / 2);
        }

        if (k < numberOfPeaks - 1) {
          const peakIndexAfter = peakIndexes[k + 1];

          endIndex = peakIndex + Math.ceil((peakIndexAfter - peakIndex) / 2);
        }

        const startOffset = startIndex - peakIndex;
        const endOffset = endIndex - peakIndex;

        for (let m = startOffset; m < endOffset; m++) {
          const binCountIndex = peakIndex + m;

          const shiftedBinCountIndex = shiftedPeakIndex + m;

          if (shiftedBinCountIndex >= bufferSize) {
            break;
          }

          const omega = (2 * Math.PI * (shiftedBinCountIndex - binCountIndex)) / fftSize;

          const shiftedReal = Math.cos(omega * this.timeCursor);
          const shiftedImag = Math.sin(omega * this.timeCursor);

          shiftedReals[shiftedBinCountIndex] += reals[binCountIndex] * shiftedReal - imags[binCountIndex] * shiftedImag;
          shiftedImags[shiftedBinCountIndex] += reals[binCountIndex] * shiftedImag + imags[binCountIndex] * shiftedReal;
        }
      }

      for (let k = 1; k < halfOfFFTSizze; k++) {
        shiftedReals[fftSize - k] = 0.0 + shiftedReals[k];
        shiftedImags[fftSize - k] = 0.0 - shiftedImags[k];
      }

      IFFT(shiftedReals, shiftedImags, fftSize);

      for (let n = 0; n < fftSize; n++) {
        output[channelNumber][n] = this.hanningWindow[n] * shiftedReals[n];
      }
    }

    this.timeCursor += this.hopSize;
  }
}

registerProcessor('PitchShifterProcessor', PitchShifterProcessor);
