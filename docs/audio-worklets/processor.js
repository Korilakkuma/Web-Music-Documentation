class NoiseGeneratorProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.processing = false;

    this.type = 'whitenoise';

    this.b0 = 0;
    this.b1 = 0;
    this.b2 = 0;
    this.b3 = 0;
    this.b4 = 0;
    this.b5 = 0;
    this.b6 = 0;

    this.lastOut = 0;

    this.port.onmessage = (event) => {
      if (typeof event.data.processing === 'boolean') {
        this.processing = event.data.processing;
      }

      if (event.data.type) {
        this.type = event.data.type;
      }
    };
  }

  process(inputs, outputs, parameters) {
    if (!this.processing) {
      return true;
    }

    const output = outputs[0];

    switch (this.type) {
      case 'whitenoise': {
        for (let channelNumber = 0, numberOfChannels = output.length; channelNumber < numberOfChannels; channelNumber++) {
          const bufferSize = output[channelNumber].length;

          for (let n = 0; n < bufferSize; n++) {
            output[channelNumber][n] = 2 * Math.random() - 1;
          }
        }

        break;
      }

      case 'pinknoise': {
        for (let channelNumber = 0, numberOfChannels = output.length; channelNumber < numberOfChannels; channelNumber++) {
          const bufferSize = output[channelNumber].length;

          for (let n = 0; n < bufferSize; n++) {
            const white = 2 * Math.random() - 1;

            this.b0 = 0.99886 * this.b0 + white * 0.0555179;
            this.b1 = 0.99332 * this.b1 + white * 0.0750759;
            this.b2 = 0.969 * this.b2 + white * 0.153852;
            this.b3 = 0.8665 * this.b3 + white * 0.3104856;
            this.b4 = 0.55 * this.b4 + white * 0.5329522;
            this.b5 = -0.7616 * this.b5 - white * 0.016898;

            output[channelNumber][n] = this.b0 + this.b1 + this.b2 + this.b3 + this.b4 + this.b5 + this.b6 + white * 0.5362;
            output[channelNumber][n] *= 0.11;

            this.b6 = white * 0.115926;
          }
        }

        break;
      }

      case 'browniannoise': {
        for (let channelNumber = 0, numberOfChannels = output.length; channelNumber < numberOfChannels; channelNumber++) {
          const bufferSize = output[channelNumber].length;

          for (let n = 0; n < bufferSize; n++) {
            const white = 2 * Math.random() - 1;

            output[channelNumber][n] = (this.lastOut + 0.02 * white) / 1.02;

            this.lastOut = output[channelNumber][n];

            output[channelNumber][n] *= 3.5;
          }
        }

        break;
      }
    }

    return true;
  }
}

registerProcessor('NoiseGeneratorProcessor', NoiseGeneratorProcessor);
