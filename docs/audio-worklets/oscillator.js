class OscillatorProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.processing = false;

    this.numberOfProcessedSamples = 0;

    this.type = 'sine';
    this.frequency = 440;

    this.port.onmessage = (event) => {
      if (typeof event.data.processing === 'boolean') {
        this.processing = event.data.processing;
      }

      if (typeof event.data.frequency === 'number' && event.data.frequency > 0) {
        this.frequency = event.data.frequency;
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

    const numberOfSamplesPer1Hz = sampleRate / this.frequency;

    for (let channelNumber = 0, numberOfChannels = output.length; channelNumber < numberOfChannels; channelNumber++) {
      const bufferSize = output[channelNumber].length;

      for (let n = 0; n < bufferSize; n++) {
        switch (this.type) {
          case 'sine': {
            output[channelNumber][n] = Math.sin((2 * Math.PI * this.frequency * this.numberOfProcessedSamples) / sampleRate);
            break;
          }

          case 'square': {
            output[channelNumber][n] = this.numberOfProcessedSamples < numberOfSamplesPer1Hz / 2 ? 1 : -1;
            break;
          }

          case 'sawtooth': {
            const a = (2 * this.numberOfProcessedSamples) / numberOfSamplesPer1Hz;

            output[channelNumber][n] = a - 1;
            break;
          }

          case 'triangle': {
            const a = (4 * this.numberOfProcessedSamples) / numberOfSamplesPer1Hz;

            output[channelNumber][n] = this.numberOfProcessedSamples < numberOfSamplesPer1Hz / 2 ? -1 + a : 3 - a;
            break;
          }
        }

        if (++this.numberOfProcessedSamples >= numberOfSamplesPer1Hz) {
          this.numberOfProcessedSamples = 0;
        }
      }
    }

    return true;
  }
}

registerProcessor('OscillatorProcessor', OscillatorProcessor);
