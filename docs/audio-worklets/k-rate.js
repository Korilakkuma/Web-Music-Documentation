class NoiseGeneratorProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'noiseGain',
        defaultValue: 1,
        minValue: 0,
        maxValue: 1,
        automationRate: 'k-rate'
      }
    ];
  }

  constructor() {
    super();
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];

    const gain = parameters.noiseGain;

    for (let channelNumber = 0, numberOfChannels = output.length; channelNumber < numberOfChannels; channelNumber++) {
      const bufferSize = output[channelNumber].length;

      for (let n = 0; n < bufferSize; n++) {
        output[channelNumber][n] = gain[0] * (2 * Math.random() - 1);
      }
    }

    return true;
  }
}

registerProcessor('NoiseGeneratorProcessor', NoiseGeneratorProcessor);
