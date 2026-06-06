class RingBuffer {
  constructor(size) {
    this.size = size;
    this.queue = new Float32Array(size);

    this.rear = 0; // enqueue
    this.front = 0; // dequeue

    // number of samples for delay time
    this.interval = 0;
  }

  write(data) {
    if (this.isFull()) {
      return;
    }

    this.queue[this.rear++] = data;

    if (this.rear >= this.size) {
      this.rear = 0;
    }
  }

  read() {
    if (this.isEmpty()) {
      return 0.0;
    }

    if (this.interval === 0) {
      return 0.0;
    }

    const interval = this.rear - this.interval;

    this.front = interval >= 0 ? interval : this.rear + this.interval;

    if (this.front < 0) {
      return 0.0;
    }

    const data = this.queue[this.front++];

    if (this.front >= this.size) {
      this.front = 0;
    }

    return data;
  }

  isEmpty() {
    return this.rear === this.front;
  }

  isFull() {
    return (this.rear + 1) % this.size === this.front;
  }

  reset() {
    this.queue.fill(0.0);

    this.rear = 0;
    this.front = 0;
  }

  setInerval(interval) {
    this.interval = Math.trunc(interval);
  }
}

class DelayNodeProcessor extends AudioWorkletProcessor {
  static MAX_DELAY_TIME = 0.5;

  constructor() {
    super();

    this.ringbuffer = new RingBuffer(DelayNodeProcessor.MAX_DELAY_TIME * sampleRate);

    this.delayTime = 0.0;
    this.wet = 0.0;

    this.port.onmessage = (event) => {
      if (typeof event.data.delayTime === 'number') {
        if (event.data.delayTime <= DelayNodeProcessor.MAX_DELAY_TIME) {
          this.delayTime = event.data.delayTime;
          this.ringbuffer.setInerval(this.delayTime * sampleRate);
        }
      }

      if (typeof event.data.wet === 'number') {
        if (event.data.wet >= 0.0 && event.data.wet <= 1.0) {
          this.wet = event.data.wet;
        }
      }

      if (typeof event.data.reset === 'boolean') {
        if (event.data.reset) {
          this.ringbuffer.reset();
        }
      }
    };
  }

  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];

    const numberOfChannels = input.length;

    for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
      const bufferSize = input[channelNumber].length;

      for (let n = 0; n < bufferSize; n++) {
        const inputData = input[channelNumber][n];

        this.ringbuffer.write(inputData);

        output[channelNumber][n] = this.wet * this.ringbuffer.read();
      }
    }

    return true;
  }
}

registerProcessor('DelayNodeProcessor', DelayNodeProcessor);
