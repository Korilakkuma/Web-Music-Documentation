class KarplusStrongProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.processing = false;

    this.f0 = 440;

    this.gate = 3;
    this.duration = 4;
    this.decay = 8;
    this.d = 0.5;

    this.port.onmessage = (event) => {
      if (typeof event.data.processing === 'boolean') {
        this.processing = event.data.processing;
      }
    };
  }

  process(inputs, outputs, parameters) {
    if (!this.processing) {
      return true;
    }

    let c =
      10 ** (-3 / (sampleRate * this.decay)) /
      Math.sqrt((1 - this.d) ** 2 + 2 * this.d * (1 - this.d) * Math.cos((2 * Math.PI * this.f0) / sampleRate) + this.d ** 2);

    if (c > 1) {
      c = 1;
    }

    const D = Math.trunc((1 / this.f0) * sampleRate - this.d);
    const e = (1 / this.f0) * sampleRate - this.d - D;
    const g = (1 - e) / (1 + e);

    const output = outputs[0];

    for (let channelNumber = 0, numberOfChannels = output.length; channelNumber < numberOfChannels; channelNumber++) {
      const bufferSize = output[channelNumber].length;

      let mean = 0;

      for (let n = 0; n < bufferSize; n++) {
        output[channelNumber][n] = 2 * Math.random() - 1;

        mean += output[channelNumber][n];
      }

      mean = mean / D + 1;

      for (let n = 1; n < bufferSize; n++) {
        output[channelNumber][n] -= mean;
      }

      for (let n = 1; n < bufferSize; n++) {
        output[channelNumber][n] = -g * output[channelNumber][n - 1] + g * output[channelNumber][n - D] + output[channelNumber][n - D - 1];

        const f = c * ((1 - this.d) * output[channelNumber][n] + this.d * output[channelNumber][n - 1]);

        output[channelNumber][n] += f;
      }

      this.port.postMessage(output[channelNumber]);
    }

    return true;
  }
}

registerProcessor('KarplusStrongProcessor', KarplusStrongProcessor);
