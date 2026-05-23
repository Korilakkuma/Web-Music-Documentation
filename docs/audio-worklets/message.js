class MessageProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];

    const numberOfChannels = input.length;

    for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
      output[channelNumber].set(input[channelNumber]);
    }

    this.port.postMessage({ messaage: 'Bypass samples' });

    return true;
  }
}

registerProcessor('MessageProcessor', MessageProcessor);
