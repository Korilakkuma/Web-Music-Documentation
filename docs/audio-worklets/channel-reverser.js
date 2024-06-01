class ChannelReverserProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.reversing = false;

    this.port.onmessage = (event) => {
      if (typeof event.data.reversing === 'boolean') {
        this.reversing = event.data.reversing;
      }
    };
  }

  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];

    if (input.length === 0 || output.length === 0) {
      return true;
    }

    if (input.length !== 2 || output.length !== 2) {
      output[0].set(input[0]);
      return true;
    }

    if (this.reversing) {
      output[0].set(input[1]);
      output[1].set(input[0]);
    } else {
      output[0].set(input[0]);
      output[1].set(input[1]);
    }

    return true;
  }
}

registerProcessor('ChannelReverserProcessor', ChannelReverserProcessor);
