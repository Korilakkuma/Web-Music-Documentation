class WhiteNoiseGeneratorProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.processing = false;

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

    const output = outputs[0];

    for (let channelNumber = 0, numberOfChannels = output.length; channelNumber < numberOfChannels; channelNumber++) {
      const bufferSize = output[channelNumber].length;

      for (let n = 0; n < bufferSize; n++) {
        output[channelNumber][n] = 0.5 * (2 * Math.random() - 1);
      }

      this.port.postMessage(output[channelNumber]);
    }

    return true;
  }
}

registerProcessor('WhiteNoiseGeneratorProcessor', WhiteNoiseGeneratorProcessor);
