class OscillatorProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.processing = false;

    this.t = 0;

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

    const t0 = sampleRate / this.frequency;

    for (let channelNumber = 0, numberOfChannels = output.length; channelNumber < numberOfChannels; channelNumber++) {
      for (let n = 0; n < 128; n++) {
        switch (this.type) {
          case 'sine': {
            output[channelNumber][n] = Math.sin((2 * Math.PI * this.frequency * this.t) / sampleRate);
            break;
          }

          case 'square': {
            output[channelNumber][n] = this.t < t0 / 2 ? 1 : -1;
            break;
          }

          case 'sawtooth': {
            const a = (2 * this.t) / t0;

            output[channelNumber][n] = a - 1;
            break;
          }

          case 'triangle': {
            const a = (4 * this.t) / t0;

            output[channelNumber][n] = this.t < t0 / 2 ? -1 + a : 3 - a;
            break;
          }
        }

        if (++this.t >= t0) {
          this.t = 0;
        }
      }
    }

    return true;
  }
}

registerProcessor('OscillatorProcessor', OscillatorProcessor);
