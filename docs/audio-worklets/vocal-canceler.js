class VocalCancelerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.depth = 0;

    this.port.onmessage = (event) => {
      if (typeof event.data.depth === 'number' && event.data.depth >= 0) {
        this.depth = event.data.depth;
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

    const bufferSize = input[0].length;

    for (let n = 0; n < bufferSize; n++) {
      output[0][n] = input[0][n] - this.depth * input[1][n];
      output[1][n] = input[1][n] - this.depth * input[0][n];
    }

    return true;
  }
}

registerProcessor('VocalCancelerProcessor', VocalCancelerProcessor);
