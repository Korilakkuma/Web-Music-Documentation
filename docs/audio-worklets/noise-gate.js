class NoiseGateProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super(options);

    this.level = 0;

    this.port.onmessage = (event) => {
      if (event.data.level >= 0 && event.data.level <= 1) {
        this.level = event.data.level;
      }
    };
  }

  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];

    const numberOfChannels = input.length;

    for (let channelNumber = 0; channelNumber < input.length; channelNumber++) {
      const bufferSize = input[channelNumber].length;

      for (let n = 0; n < bufferSize; n++) {
        output[channelNumber][n] = Math.abs(input[channelNumber][n]) > this.level ? input[channelNumber][n] : 0;
      }
    }

    return true;
  }
}

registerProcessor('NoiseGateProcessor', NoiseGateProcessor);
