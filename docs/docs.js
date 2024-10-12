'use strict';

const sampleRate = 48000;

const xmlns = 'http://www.w3.org/2000/svg';

const padding = 60;

const lineWidth = 2;
const lineCap = 'round';
const lineJoin = 'miter';

const baseColor = 'rgb(153 153 153)';
const lightColor = 'rgb(204 204 204)';
const grayColor = 'rgb(66 66 66)';
const waveColor = 'rgb(0 0 255)';
const lightWaveColor = 'rgb(255 0 255)';
const alphaBaseColor = 'rgba(153 153 153 / 30%)';
const alphaWaveColor = 'rgba(0 0 255 / 30%)';
const alphaLightWaveColor = 'rgba(255 0 255 / 30%)';
const white = 'rgb(255 255 255)';

const audiocontext = new AudioContext();

const createCoordinateRect = (svg, textPosition, textFontSize) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const a = Number(svg.getAttribute('data-a'));

  const xRect = document.createElementNS(xmlns, 'rect');

  xRect.setAttribute('x', (padding / 2).toString(10));
  xRect.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
  xRect.setAttribute('width', (innerWidth + padding).toString(10));
  xRect.setAttribute('height', lineWidth.toString(10));
  xRect.setAttribute('stroke', 'none');
  xRect.setAttribute('fill', baseColor);

  svg.appendChild(xRect);

  const yRect = document.createElementNS(xmlns, 'rect');

  yRect.setAttribute('x', (padding - 1).toString(10));
  yRect.setAttribute('y', padding.toString(10));
  yRect.setAttribute('width', lineWidth.toString(10));
  yRect.setAttribute('height', innerHeight.toString(10));
  yRect.setAttribute('stroke', 'none');
  yRect.setAttribute('fill', baseColor);

  svg.appendChild(yRect);

  if (svg.getAttribute('data-parameters') === 'true') {
    const xText = document.createElementNS(xmlns, 'text');

    xText.textContent = 'Time';

    xText.setAttribute('x', (innerWidth + padding).toString(10));
    xText.setAttribute('y', (padding + innerHeight / 2 - 8).toString(10));
    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '18px');

    svg.appendChild(xText);

    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = 'Amplitude';

    yText.setAttribute('x', padding.toString(10));
    yText.setAttribute('y', (padding / 2 - 4).toString(10));
    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '18px');

    svg.appendChild(yText);

    [a, 0, -1 * a].forEach((amplitude, index) => {
      const rect = document.createElementNS(xmlns, 'rect');

      rect.setAttribute('x', (padding / 2).toString(10));
      rect.setAttribute('y', (padding + (innerHeight / 2) * (1 - amplitude)).toString(10));
      rect.setAttribute('width', (innerWidth + padding).toString(10));
      rect.setAttribute('height', lineWidth.toString(10));
      rect.setAttribute('stroke', 'none');
      rect.setAttribute('fill', alphaBaseColor);

      svg.appendChild(rect);

      const text = document.createElementNS(xmlns, 'text');

      text.textContent = amplitude.toFixed(1);

      if (typeof textPosition === 'number') {
        text.setAttribute('x', textPosition.toString(10));
      } else {
        text.setAttribute('x', (padding - 4).toString(10));
      }

      text.setAttribute('y', (padding / 2 + (innerHeight / 2) * (1 - amplitude) + 24).toString(10));

      text.setAttribute('text-anchor', 'end');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);

      if (typeof textFontSize === 'string') {
        text.setAttribute('font-size', textFontSize);
      } else {
        text.setAttribute('font-size', '16px');
      }

      svg.appendChild(text);
    });
  }
};

const createSinFunctionPath = (svg, strokeColor = waveColor) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const a = Number(svg.getAttribute('data-a'));
  const f = Number(svg.getAttribute('data-f'));
  const t = (svg.getAttribute('data-t') ?? '').split(',');

  const w = 2 * Math.PI;

  const path = document.createElementNS(xmlns, 'path');

  let d = '';

  for (let n = 0, len = f * sampleRate; n < len; n++) {
    const v = a * Math.sin((w * f * n) / sampleRate);

    const x = (n / len) * innerWidth + padding;
    const y = (1 - v) * (innerHeight / 2) + padding;

    if (n === 0) {
      d += `M${x + lineWidth / 2} ${y}`;
    } else {
      d += ` L${x} ${y}`;
    }
  }

  path.setAttribute('d', d);

  path.setAttribute('stroke', strokeColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  if (svg.getAttribute('data-parameters') === 'true') {
    t.forEach((sec, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = `${sec} sec`;

      text.setAttribute('x', (padding + 24 + (innerWidth / 2) * index).toString(10));
      text.setAttribute('y', (padding + innerHeight / 2 + 16).toString(10));

      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '16px');

      svg.appendChild(text);
    });
  }
};

const createSquareFunctionPath = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const a = Number(svg.getAttribute('data-a'));
  const f = Number(svg.getAttribute('data-f'));
  const t = (svg.getAttribute('data-t') ?? '').split(',');

  const path = document.createElementNS(xmlns, 'path');

  let d = '';

  for (let i = 0, len = f * sampleRate; i < len; i++) {
    const t = sampleRate / f;
    const n = i < t ? i : i % t;
    const v = a * (n < t / 2 ? 1 : -1);

    const x = (i / len) * innerWidth + padding;
    const y = (1 - v) * (innerHeight / 2) + padding;

    if (i === 0) {
      d += `M${x + lineWidth / 2} ${y}`;
    } else {
      d += ` L${x} ${y}`;
    }
  }

  path.setAttribute('d', d);

  path.setAttribute('stroke', waveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  if (svg.getAttribute('data-parameters') === 'true') {
    t.forEach((sec, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = `${sec} sec`;

      text.setAttribute('x', (padding + 24 + (innerWidth / 2) * index).toString(10));
      text.setAttribute('y', (padding + innerHeight / 2 + 16).toString(10));

      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '16px');

      svg.appendChild(text);
    });
  }
};

const createSawtoothFunctionPath = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const a = Number(svg.getAttribute('data-a'));
  const f = Number(svg.getAttribute('data-f'));
  const t = (svg.getAttribute('data-t') ?? '').split(',');

  const w = 2 * Math.PI;

  const path = document.createElementNS(xmlns, 'path');

  let d = '';

  for (let i = 0, len = f * sampleRate; i < len; i++) {
    const t = sampleRate / f;
    const n = i < t ? i : i % t;
    const s = (2 * n) / t;
    const v = a * (s - 1);

    const x = (i / len) * innerWidth + padding;
    const y = (1 - v) * (innerHeight / 2) + padding;

    if (i === 0) {
      d += `M${x + lineWidth / 2} ${y}`;
    } else {
      d += ` L${x} ${y}`;
    }
  }

  path.setAttribute('d', d);

  path.setAttribute('stroke', waveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  if (svg.getAttribute('data-parameters') === 'true') {
    t.forEach((sec, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = `${sec} sec`;

      text.setAttribute('x', (padding + 24 + (innerWidth / 2) * index).toString(10));
      text.setAttribute('y', (padding + innerHeight / 2 + 16).toString(10));

      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '16px');

      svg.appendChild(text);
    });
  }
};

const createTriangleFunctionPath = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const a = Number(svg.getAttribute('data-a'));
  const f = Number(svg.getAttribute('data-f'));
  const t = (svg.getAttribute('data-t') ?? '').split(',');

  const w = 2 * Math.PI;

  const path = document.createElementNS(xmlns, 'path');

  let d = '';

  for (let i = 0, len = f * sampleRate; i < len; i++) {
    const t = sampleRate / f;
    const n = i < t ? i : i % t;
    const s = (4 * n) / t;
    const v = a * (n < t / 2 ? -1 + s : 3 - s);

    const x = (i / len) * innerWidth + padding;
    const y = (1 - v) * (innerHeight / 2) + padding;

    if (i === 0) {
      d += `M${x + lineWidth / 2} ${y}`;
    } else {
      d += ` L${x} ${y}`;
    }
  }

  path.setAttribute('d', d);

  path.setAttribute('stroke', waveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  if (svg.getAttribute('data-parameters') === 'true') {
    t.forEach((sec, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = `${sec} sec`;

      text.setAttribute('x', (padding + 24 + (innerWidth / 2) * index).toString(10));
      text.setAttribute('y', (padding + innerHeight / 2 + 16).toString(10));

      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '16px');

      svg.appendChild(text);
    });
  }
};

const createKeyboards = (svg, offsetY = 0) => {
  const highlights = (svg.getAttribute('data-highlights') ?? '').split(',').map((index) => Number(index));

  [
    0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 22, 24, 26, 27, 29, 31, 32, 34, 36, 38, 39, 41, 43, 44, 46, 48, 50, 51, 53, 55, 56, 58, 60, 62, 63, 65, 67,
    68, 70, 72, 74, 75, 77, 79, 80, 82, 84, 86, 87
  ].forEach((keyboardIndex, index, a) => {
    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', `${index * 23}`);
    rect.setAttribute('y', `${offsetY}`);
    rect.setAttribute('width', '23');
    rect.setAttribute('height', '150');
    rect.setAttribute('stroke-width', '2px');
    rect.setAttribute('stroke', '#ccc');
    rect.setAttribute('fill', '#fff');

    if (highlights.includes(keyboardIndex)) {
      rect.setAttribute('fill', '#eee');
    }

    svg.appendChild(rect);
  });

  [1, 4, 6, 9, 11, 13, 16, 18, 21, 23, 25, 28, 30, 33, 35, 37, 40, 42, 45, 47, 49, 52, 54, 57, 59, 61, 64, 66, 69, 71, 73, 76, 78, 81, 83, 85].forEach(
    (keyboardIndex, index) => {
      const rect = document.createElementNS(xmlns, 'rect');

      rect.setAttribute('x', `${(keyboardIndex - index) * 23 - 11 / 2}`);
      rect.setAttribute('y', `${offsetY}`);
      rect.setAttribute('width', '11');
      rect.setAttribute('height', '95');
      rect.setAttribute('stroke-width', '2px');
      rect.setAttribute('stroke', '#666');
      rect.setAttribute('fill', '#000');

      if (highlights.includes(keyboardIndex)) {
        rect.setAttribute('fill', '#333');
      }

      svg.appendChild(rect);
    }
  );
};

const createFrequencyandPianoFrequency = (svg) => {
  const offsetY = 120;

  const width = Number(svg.getAttribute('width'));

  const rect = document.createElementNS(xmlns, 'rect');

  rect.setAttribute('x', '0');
  rect.setAttribute('y', '28');
  rect.setAttribute('width', `${width}`);
  rect.setAttribute('height', '4');
  rect.setAttribute('fill', baseColor);

  const minFrequency = document.createElementNS(xmlns, 'text');

  minFrequency.textContent = '20 Hz';

  minFrequency.setAttribute('x', '20');
  minFrequency.setAttribute('y', '20');

  minFrequency.setAttribute('text-anchor', 'middle');
  minFrequency.setAttribute('stroke', 'none');
  minFrequency.setAttribute('fill', baseColor);
  minFrequency.setAttribute('font-size', '14px');

  const maxFrequency = document.createElementNS(xmlns, 'text');

  maxFrequency.textContent = '20000 Hz (20 kHz)';

  maxFrequency.setAttribute('x', '1136');
  maxFrequency.setAttribute('y', '20');

  maxFrequency.setAttribute('text-anchor', 'middle');
  maxFrequency.setAttribute('stroke', 'none');
  maxFrequency.setAttribute('fill', baseColor);
  maxFrequency.setAttribute('font-size', '14px');

  const minPath = document.createElementNS(xmlns, 'path');

  minPath.setAttribute('d', 'M 12 32 L 0 120');
  minPath.setAttribute('stroke', lightColor);
  minPath.setAttribute('stroke-width', '2');
  minPath.setAttribute('stroke-dasharray', '5,5');

  const maxPath = document.createElementNS(xmlns, 'path');

  maxPath.setAttribute('d', `M ${width / 4} 32 L ${width} 120`);
  maxPath.setAttribute('stroke', lightColor);
  maxPath.setAttribute('stroke-width', '2');
  maxPath.setAttribute('stroke-dasharray', '5,5');

  svg.appendChild(rect);
  svg.appendChild(minFrequency);
  svg.appendChild(maxFrequency);
  svg.appendChild(minPath);
  svg.appendChild(maxPath);

  createKeyboards(svg, offsetY);

  const pianoMinFrequency = document.createElementNS(xmlns, 'text');

  pianoMinFrequency.textContent = '27.5 Hz';

  pianoMinFrequency.setAttribute('x', '27');
  pianoMinFrequency.setAttribute('y', `${offsetY + 142}`);

  pianoMinFrequency.setAttribute('text-anchor', 'middle');
  pianoMinFrequency.setAttribute('stroke', 'none');
  pianoMinFrequency.setAttribute('fill', baseColor);
  pianoMinFrequency.setAttribute('font-size', '14px');

  const pianoMaxFrequency = document.createElementNS(xmlns, 'text');

  pianoMaxFrequency.textContent = '4186 Hz';

  pianoMaxFrequency.setAttribute('x', '1166');
  pianoMaxFrequency.setAttribute('y', `${offsetY + 142}`);

  pianoMaxFrequency.setAttribute('text-anchor', 'middle');
  pianoMaxFrequency.setAttribute('stroke', 'none');
  pianoMaxFrequency.setAttribute('fill', baseColor);
  pianoMaxFrequency.setAttribute('font-size', '14px');

  svg.appendChild(pianoMinFrequency);
  svg.appendChild(pianoMaxFrequency);
};

const visualOscillator = (svg) => {
  const gain = new GainNode(audiocontext);
  const analyser = new AnalyserNode(audiocontext, { fftSize: 512 });

  const buttonElement = document.getElementById('button-oscillator');

  const width = Number(svg.getAttribute('width'));
  const height = Number(svg.getAttribute('height'));

  const padding = 32;

  const innerWidth = width - 2 * padding;
  const innerHeight = height - 2 * padding;
  const innerBottom = height - padding;

  const middle = innerHeight / 2 + padding;

  const rectTop = document.createElementNS(xmlns, 'rect');

  rectTop.setAttribute('x', padding.toString(10));
  rectTop.setAttribute('y', (padding - 1).toString(10));
  rectTop.setAttribute('width', innerWidth.toString(10));
  rectTop.setAttribute('height', lineWidth.toString(10));
  rectTop.setAttribute('stroke', 'none');
  rectTop.setAttribute('fill', alphaBaseColor);

  svg.appendChild(rectTop);

  const rectMiddle = document.createElementNS(xmlns, 'rect');

  rectMiddle.setAttribute('x', padding.toString(10));
  rectMiddle.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
  rectMiddle.setAttribute('width', innerWidth.toString(10));
  rectMiddle.setAttribute('height', lineWidth.toString(10));
  rectMiddle.setAttribute('stroke', 'none');
  rectMiddle.setAttribute('fill', baseColor);

  svg.appendChild(rectMiddle);

  const rectBottom = document.createElementNS(xmlns, 'rect');

  rectBottom.setAttribute('x', padding.toString(10));
  rectBottom.setAttribute('y', (padding + innerHeight - 1).toString(10));
  rectBottom.setAttribute('width', innerWidth.toString(10));
  rectBottom.setAttribute('height', lineWidth.toString(10));
  rectBottom.setAttribute('stroke', 'none');
  rectBottom.setAttribute('fill', alphaBaseColor);

  svg.appendChild(rectBottom);

  [' 1.0', ' 0.0', '-1.0'].forEach((text) => {
    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = text;

    yText.setAttribute('x', (padding - 16).toString(10));

    switch (text) {
      case ' 1.0': {
        yText.setAttribute('y', (padding - 4).toString(10));
        break;
      }

      case ' 0.0': {
        yText.setAttribute('y', (padding + innerHeight / 2 - 4).toString(10));
        break;
      }

      case '-1.0': {
        yText.setAttribute('y', (padding + innerHeight - 4).toString(10));
        break;
      }
    }

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '16px');

    svg.appendChild(yText);
  });

  const path = document.createElementNS(xmlns, 'path');

  path.setAttribute('stroke', waveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  let timerId = null;

  const drawOscillator = () => {
    const data = new Float32Array(analyser.fftSize);

    analyser.getFloatTimeDomainData(data);

    path.removeAttribute('d');

    let d = '';

    for (let n = 0, len = data.length; n < len; n++) {
      const x = (n / len) * innerWidth + padding;
      const y = (1 - data[n]) * (innerHeight / 2) + padding;

      if (n === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    path.setAttribute('d', d);

    timerId = window.setTimeout(drawOscillator, 250);
  };

  let type = 'sine';
  let frequency = document.getElementById('range-frequency').valueAsNumber;
  let detune = document.getElementById('range-detune').valueAsNumber;

  let oscillator = null;

  let currentTime = 0;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      oscillator.stop(0);
      oscillator = null;
    }

    oscillator = new OscillatorNode(audiocontext);

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.detune.value = detune;

    // OscillatorNode (Input) -> GainNode -> AnalyserNode -> AudioDestinationNode (Output)
    oscillator.connect(gain);
    gain.connect(analyser);
    analyser.connect(audiocontext.destination);

    oscillator.start(0);

    buttonElement.textContent = 'stop';

    drawOscillator();
  };

  const onUp = () => {
    if (oscillator === null) {
      return;
    }

    oscillator.stop(0);
    oscillator = null;

    buttonElement.textContent = 'start';

    if (timerId) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  document.getElementById('form-oscillator-type').addEventListener('change', (event) => {
    const radios = event.currentTarget.elements['radio-oscillator-type'];

    for (const radio of radios) {
      if (radio.checked) {
        type = radio.value;

        if (oscillator) {
          oscillator.type = type;
        }

        break;
      }
    }
  });

  document.getElementById('range-gain').addEventListener('input', (event) => {
    gain.gain.value = event.currentTarget.valueAsNumber;
  });

  document.getElementById('range-frequency').addEventListener('input', (event) => {
    frequency = event.currentTarget.valueAsNumber;

    if (oscillator) {
      oscillator.frequency.value = frequency;
    }
  });

  document.getElementById('range-detune').addEventListener('input', (event) => {
    detune = event.currentTarget.valueAsNumber;

    if (oscillator) {
      oscillator.detune.value = detune;
    }
  });
};

const createCareer = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const a = 1;
  const f = 6;

  const w = 2 * Math.PI;

  const path = document.createElementNS(xmlns, 'path');

  let d = '';

  for (let n = 0, len = f * sampleRate; n < len; n++) {
    const c = a * Math.sin((w * f * n) / sampleRate);
    const e = a * Math.sin((w * 1 * n) / sampleRate);
    const v = c * e;

    const x = (n / len) * innerWidth + padding;
    const y = (1 - v) * (innerHeight / 2) + padding;

    if (n === 0) {
      d += `M${x + lineWidth / 2} ${y}`;
    } else {
      d += ` L${x} ${y}`;
    }
  }

  path.setAttribute('d', d);

  path.setAttribute('stroke', waveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);
};

const createEnvelope = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const a = 1;
  const f = 6;

  const w = 2 * Math.PI;

  const path = document.createElementNS(xmlns, 'path');

  let d = '';

  for (let n = 0, len = f * sampleRate; n < len; n++) {
    const c = a * Math.sin((w * f * n) / sampleRate);
    const e = a * Math.sin((w * 1 * n) / sampleRate);
    const v = c * e;

    const x = (n / len) * innerWidth + padding;
    const y = (1 - v) * (innerHeight / 2) + padding;

    if (n === 0) {
      d += `M${x + lineWidth / 2} ${y}`;
    } else {
      d += ` L${x} ${y}`;
    }
  }

  path.setAttribute('d', d);

  path.setAttribute('stroke', alphaWaveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', '1');
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  const envelopePath = document.createElementNS(xmlns, 'path');

  d = '';

  for (let n = 0, len = f * sampleRate; n < len; n++) {
    const v = a * Math.sin((w * 1 * n) / sampleRate);

    const x = (n / len) * innerWidth + padding;
    const y = (1 - v) * (innerHeight / 2) + padding;

    if (n === 0) {
      d += `M${x + lineWidth / 2} ${y}`;
    } else {
      d += ` L${x} ${y}`;
    }
  }

  envelopePath.setAttribute('d', d);

  envelopePath.setAttribute('stroke', waveColor);
  envelopePath.setAttribute('fill', 'none');
  envelopePath.setAttribute('stroke-width', lineWidth.toString(10));
  envelopePath.setAttribute('stroke-linecap', lineCap);
  envelopePath.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(envelopePath);

  const invertedEnvelopePath = document.createElementNS(xmlns, 'path');

  d = '';

  for (let n = 0, len = f * sampleRate; n < len; n++) {
    const v = -1 * a * Math.sin((w * 1 * n) / sampleRate);

    const x = (n / len) * innerWidth + padding;
    const y = (1 - v) * (innerHeight / 2) + padding;

    if (n === 0) {
      d += `M${x + lineWidth / 2} ${y}`;
    } else {
      d += ` L${x} ${y}`;
    }
  }

  invertedEnvelopePath.setAttribute('d', d);

  invertedEnvelopePath.setAttribute('stroke', waveColor);
  invertedEnvelopePath.setAttribute('fill', 'none');
  invertedEnvelopePath.setAttribute('stroke-width', lineWidth.toString(10));
  invertedEnvelopePath.setAttribute('stroke-linecap', lineCap);
  invertedEnvelopePath.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(invertedEnvelopePath);
};

const visualADSR = (svg) => {
  const buttonElement = document.getElementById('button-envelopegenerator');

  const envelopegenerator = new GainNode(audiocontext);

  const width = Number(svg.getAttribute('width'));
  const height = Number(svg.getAttribute('height'));

  const padding = 32;

  const innerWidth = width - 2 * padding;
  const innerHeight = height - 2 * padding;
  const innerBottom = height - padding;

  const middle = innerHeight / 2 + padding;

  const rectTop = document.createElementNS(xmlns, 'rect');

  rectTop.setAttribute('x', padding.toString(10));
  rectTop.setAttribute('y', (padding - 1).toString(10));
  rectTop.setAttribute('width', innerWidth.toString(10));
  rectTop.setAttribute('height', lineWidth.toString(10));
  rectTop.setAttribute('stroke', 'none');
  rectTop.setAttribute('fill', baseColor);

  svg.appendChild(rectTop);

  const rectMiddle = document.createElementNS(xmlns, 'rect');

  rectMiddle.setAttribute('x', padding.toString(10));
  rectMiddle.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
  rectMiddle.setAttribute('width', innerWidth.toString(10));
  rectMiddle.setAttribute('height', lineWidth.toString(10));
  rectMiddle.setAttribute('stroke', 'none');
  rectMiddle.setAttribute('fill', baseColor);

  svg.appendChild(rectMiddle);

  const rectBottom = document.createElementNS(xmlns, 'rect');

  rectBottom.setAttribute('x', padding.toString(10));
  rectBottom.setAttribute('y', (padding + innerHeight - 1).toString(10));
  rectBottom.setAttribute('width', innerWidth.toString(10));
  rectBottom.setAttribute('height', lineWidth.toString(10));
  rectBottom.setAttribute('stroke', 'none');
  rectBottom.setAttribute('fill', baseColor);

  svg.appendChild(rectBottom);

  ['1.0', '0.5', '0.0'].forEach((text) => {
    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = text;

    yText.setAttribute('x', (padding - 16).toString(10));

    switch (text) {
      case '1.0': {
        yText.setAttribute('y', (padding - 4).toString(10));
        break;
      }

      case '0.5': {
        yText.setAttribute('y', (padding + innerHeight / 2 - 4).toString(10));
        break;
      }

      case '0.0': {
        yText.setAttribute('y', (padding + innerHeight - 4).toString(10));
        break;
      }
    }

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '16px');

    svg.appendChild(yText);
  });

  const path = document.createElementNS(xmlns, 'path');

  path.setAttribute('stroke', waveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  let attack = document.getElementById('range-attack').valueAsNumber;
  let decay = document.getElementById('range-decay').valueAsNumber;
  let sustain = document.getElementById('range-sustain').valueAsNumber;
  let release = document.getElementById('range-release').valueAsNumber;

  let oscillator = null;
  let intervalid = null;

  let currentTime = 0;

  let startDrawing = false;

  const drawGain = (t) => {
    let d = path.getAttribute('d');

    const x = currentTime / t + padding;
    const y = (1 - envelopegenerator.gain.value) * innerHeight + padding;

    if (currentTime === 0) {
      path.removeAttribute('d');

      startDrawing = false;
    }

    if (startDrawing) {
      d += ` L${x} ${y}`;
    } else {
      d = `M${padding} ${padding + innerHeight}`;

      startDrawing = true;
    }

    path.setAttribute('d', d);

    currentTime = x < padding + innerWidth ? currentTime + t : 0;

    if (envelopegenerator.gain.value >= 1e-3) {
      return;
    }

    oscillator.stop(0);
    oscillator = null;

    if (intervalid !== null) {
      window.clearInterval(intervalid);
      intervalid = null;
    }
  };

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      oscillator.stop(0);
      oscillator = null;
    }

    oscillator = new OscillatorNode(audiocontext);

    // OscillatorNode (Input) -> GainNode (Envelope Generator) -> AudioDestinationNode (Output)
    oscillator.connect(envelopegenerator);
    envelopegenerator.connect(audiocontext.destination);

    const t0 = audiocontext.currentTime;
    const t1 = t0 + attack;
    const t2 = decay;

    const t2Level = sustain;

    envelopegenerator.gain.cancelScheduledValues(t0);
    envelopegenerator.gain.setValueAtTime(0, t0);
    envelopegenerator.gain.linearRampToValueAtTime(1, t1);
    envelopegenerator.gain.setTargetAtTime(t2Level, t1, t2);

    oscillator.start(0);

    buttonElement.textContent = 'stop';

    window.clearInterval(intervalid);

    intervalid = window.setInterval(() => {
      drawGain(25);
    }, 25);
  };

  const onUp = () => {
    if (oscillator === null) {
      return;
    }

    const t3 = audiocontext.currentTime;
    const t4 = release;

    if (typeof envelopegenerator.gain.cancelAndHoldAtTime === 'function') {
      envelopegenerator.gain.cancelAndHoldAtTime(t3);
    } else {
      const value = envelopegenerator.gain.value;

      envelopegenerator.gain.cancelScheduledValues(t3);
      envelopegenerator.gain.setValueAtTime(value, t3);
    }

    envelopegenerator.gain.setTargetAtTime(0, t3, t4);

    buttonElement.textContent = 'start';
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  document.getElementById('range-attack').addEventListener('input', (event) => {
    attack = event.currentTarget.valueAsNumber;
  });

  document.getElementById('range-decay').addEventListener('input', (event) => {
    decay = event.currentTarget.valueAsNumber;
  });

  document.getElementById('range-sustain').addEventListener('input', (event) => {
    sustain = event.currentTarget.valueAsNumber;
  });

  document.getElementById('range-release').addEventListener('input', (event) => {
    release = event.currentTarget.valueAsNumber;
  });
};

const createSampling = (svg, n, showOriginal) => {
  const width = Number(svg.getAttribute('width'));
  const height = Number(svg.getAttribute('height'));

  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const middle = height / 2;

  createCoordinateRect(svg);

  if (showOriginal) {
    createSinFunctionPath(svg, alphaWaveColor);
  }

  const d = (2 * Math.PI) / n;

  for (let rad = 0; rad < 2 * Math.PI; rad += d) {
    const path = document.createElementNS(xmlns, 'path');

    const v = Math.sin(rad);
    const x = (rad / d) * (1 / n) * innerWidth + padding;
    const y = (1 - v) * (innerHeight / 2) + padding;

    path.setAttribute('d', `M${x} ${y} L${x} ${middle}`);
    path.setAttribute('stroke', lightWaveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('stroke-linecap', 'square');

    svg.appendChild(path);
  }
};

const createQuantization = (svg, bit, fillColor, showOriginal, showSampling) => {
  const width = Number(svg.getAttribute('width'));
  const height = Number(svg.getAttribute('height'));

  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const middle = height / 2;

  createCoordinateRect(svg, 16, '12px');

  if (showOriginal) {
    createSinFunctionPath(svg, alphaWaveColor);
  } else {
    const t = (svg.getAttribute('data-t') ?? '').split(',');

    t.forEach((sec, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = `${sec} sec`;

      text.setAttribute('x', (padding + 24 + (innerWidth / 2) * index).toString(10));
      text.setAttribute('y', (padding + innerHeight / 2 + 16).toString(10));

      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '16px');

      svg.appendChild(text);
    });
  }

  switch (bit) {
    case 3: {
      ['100', '101', '110', '111', '000', '001', '010', '011'].forEach((bit, index) => {
        const rect = document.createElementNS(xmlns, 'rect');

        rect.setAttribute('x', padding.toString(10));
        rect.setAttribute('y', ((padding + innerHeight) * (1 - index * 0.105)).toString(10));
        rect.setAttribute('width', innerWidth.toString(10));
        rect.setAttribute('height', lineWidth.toString(10));
        rect.setAttribute('stroke', 'none');
        rect.setAttribute('fill', lightWaveColor);

        svg.appendChild(rect);

        const text = document.createElementNS(xmlns, 'text');

        text.textContent = bit;

        text.setAttribute('x', (padding / 2 + 12).toString(10));
        text.setAttribute('y', ((padding + innerHeight) * (1 - index * 0.105)).toString(10));

        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('stroke', 'none');
        text.setAttribute('fill', grayColor);
        text.setAttribute('font-size', '16px');

        svg.appendChild(text);
      });

      break;
    }

    case 4: {
      ['1000', '1010', '1001', '1011', '1100', '1101', '1110', '1111', '0000', '0001', '0010', '0011', '0100', '0101', '0110', '0111'].forEach((bit, index) => {
        const rect = document.createElementNS(xmlns, 'rect');

        rect.setAttribute('x', padding.toString(10));
        rect.setAttribute('y', ((padding + innerHeight) * (1 - index * 0.052) - 1).toString(10));
        rect.setAttribute('width', innerWidth.toString(10));
        rect.setAttribute('height', lineWidth.toString(10));
        rect.setAttribute('stroke', 'none');
        rect.setAttribute('fill', fillColor);

        svg.appendChild(rect);

        const text = document.createElementNS(xmlns, 'text');

        text.textContent = bit;

        text.setAttribute('x', (padding / 2 + 8).toString(10));
        text.setAttribute('y', ((padding + innerHeight) * (1 - index * 0.052) + 2).toString(10));

        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('stroke', 'none');
        text.setAttribute('fill', grayColor);
        text.setAttribute('font-size', '16px');

        svg.appendChild(text);
      });

      break;
    }
  }

  const n = 16;
  const d = (2 * Math.PI) / n;

  if (showSampling) {
    for (let rad = 0; rad < 2 * Math.PI; rad += d) {
      const path = document.createElementNS(xmlns, 'path');
      const dpath = document.createElementNS(xmlns, 'path');

      const v = Math.sin(rad);
      const x = (rad / d) * (1 / n) * innerWidth + padding;
      const y = (1 - v) * (innerHeight / 2) + padding;
      const dy = y - 8;

      path.setAttribute('d', `M${x} ${y} L${x} ${middle}`);
      path.setAttribute('stroke', alphaWaveColor);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-width', '4');
      path.setAttribute('stroke-linecap', 'square');

      svg.appendChild(path);
    }
  }

  switch (bit) {
    case 3: {
      for (let rad = 0, index = 0; rad < 2 * Math.PI; rad += d, index++) {
        const path = document.createElementNS(xmlns, 'path');
        const dpath = document.createElementNS(xmlns, 'path');

        const v = Math.sin(rad);
        const x = (rad / d) * (1 / n) * innerWidth + padding;

        let y = 0;

        switch (index) {
          case 0:
          case 8: {
            y = middle;
            break;
          }

          case 1:
          case 7: {
            y = (1 - 0.25) * (innerHeight / 2) + padding;
            break;
          }

          case 2:
          case 3:
          case 4:
          case 5:
          case 6: {
            y = (1 - 0.75) * (innerHeight / 2) + padding - 2;
            break;
          }

          case 9:
          case 15: {
            y = (1 - 0.75) * (innerHeight / 2) + padding + innerHeight / 2;
            break;
          }

          case 10:
          case 14: {
            y = (1 - 0.25) * (innerHeight / 2) + padding + innerHeight / 2 - 2;
            break;
          }

          case 11:
          case 12:
          case 13: {
            y = innerHeight / 2 + padding + innerHeight / 2;
            break;
          }
        }

        path.setAttribute('d', `M${x} ${y} L${x} ${middle}`);
        path.setAttribute('stroke', alphaLightWaveColor);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', '4');
        path.setAttribute('stroke-linecap', 'square');

        svg.appendChild(path);
      }

      break;
    }

    case 4: {
      for (let rad = 0, index = 0; rad < 2 * Math.PI; rad += d, index++) {
        const path = document.createElementNS(xmlns, 'path');
        const dpath = document.createElementNS(xmlns, 'path');

        const v = Math.sin(rad);
        const x = (rad / d) * (1 / n) * innerWidth + padding;

        let y = 0;

        switch (index) {
          case 0:
          case 8: {
            y = middle;
            break;
          }

          case 1:
          case 7: {
            y = (1 - 0.4) * (innerHeight / 2) + padding + 2;
            break;
          }

          case 2:
          case 6: {
            y = (1 - 0.75) * (innerHeight / 2) + padding - 1;
            break;
          }

          case 3:
          case 4:
          case 5: {
            y = padding + 16;
            break;
          }

          case 9:
          case 15: {
            y = (1 - 0.6) * (innerHeight / 2) + padding + innerHeight / 2 - 6;
            break;
          }

          case 10:
          case 14: {
            y = (1 - 0.25) * (innerHeight / 2) + padding + innerHeight / 2 - 2;
            break;
          }

          case 11:
          case 13: {
            y = innerHeight / 2 + padding + innerHeight / 2 - 20;
            break;
          }

          case 12: {
            y = innerHeight / 2 + padding + innerHeight / 2;
            break;
          }
        }

        path.setAttribute('d', `M${x} ${y} L${x} ${middle}`);
        path.setAttribute('stroke', alphaLightWaveColor);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', '4');
        path.setAttribute('stroke-linecap', 'square');

        svg.appendChild(path);
      }

      break;
    }
  }
};

const visualFourierSeries = (svg) => {
  const N = 44100;

  const RESOLUTION = 3500;

  const plotButtonElement = document.getElementById('button-plot-fourier-series');
  const clearButtonElement = document.getElementById('button-clear-fourier-series');
  const animationButtonElement = document.getElementById('button-animation-fourier-series');
  const intervalSelectElement = document.getElementById('select-interval-fourier-series');
  const functionSelectElement = document.getElementById('select-function-fourier-series');
  const rangeElement = document.getElementById('range-sum-fourier-series');
  const outputTextElement = document.getElementById('output-sum-fourier-series');

  const plotSeries = (svg, series) => {
    const PADDING = 48;

    const width = Number(svg.getAttribute('width'));
    const height = Number(svg.getAttribute('height'));

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', PADDING.toString(10));
    xRect.setAttribute('y', (height / 2 - lineWidth / 2).toString(10));
    xRect.setAttribute('width', (width - 2 * PADDING).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    svg.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (width / 2 - lineWidth / 2).toString(10));
    yRect.setAttribute('y', '0');
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', height.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    svg.appendChild(yRect);

    const textX = width / 2 - lineWidth / 2 - 20;

    [
      [' 1.0', 1],
      [' π/4', Math.PI / 4],
      [' 0.0', 0],
      ['-π/4', -(Math.PI / 4)],
      ['-1.0', -1]
    ].forEach(([t, v]) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = t;

      text.setAttribute('x', textX.toString(10));
      text.setAttribute('y', ((1 - v) * ((height - 2 * PADDING) / 2) + PADDING).toString(10));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-family', 'Roboto');
      text.setAttribute('font-size', '12px');

      svg.appendChild(text);

      const rect = document.createElementNS(xmlns, 'rect');

      rect.setAttribute('x', PADDING.toString(10));
      rect.setAttribute('y', ((1 - v) * ((height - 2 * PADDING) / 2) + PADDING).toString(10));
      rect.setAttribute('width', (width - 2 * PADDING).toString(10));
      rect.setAttribute('height', '1');
      rect.setAttribute('stroke', 'none');
      rect.setAttribute('fill', alphaBaseColor);

      svg.appendChild(rect);
    });

    const path = document.createElementNS(xmlns, 'path');

    path.setAttribute('stroke', alphaWaveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    let d = '';

    for (let n = 0; n < N; n++) {
      const plotX = n * ((width - 2 * PADDING) / N) + PADDING;
      const y = series[n];
      const plotY = (1 - y) * ((height - 2 * PADDING) / 2) + PADDING;

      if (n === 0) {
        d += `M${plotX} ${plotY}`;
      } else {
        d += ` L${plotX} ${plotY}`;
      }
    }

    path.setAttribute('d', d);

    svg.appendChild(path);
  };

  const square = () => {
    const fourierSeries = new Float32Array(N);

    for (let n = 0; n < N; n++) {
      fourierSeries[n] = 0;

      for (let k = 0; k < K; k++) {
        const x = n / RESOLUTION;
        const odd = 2 * k + 1;

        fourierSeries[n] += Math.sin(odd * x) / odd;
      }
    }

    return fourierSeries;
  };

  const sawtooth = () => {
    const fourierSeries = new Float32Array(N);

    for (let n = 0; n < N; n++) {
      fourierSeries[n] = 0;

      for (let k = 1; k < K; k++) {
        const x = n / RESOLUTION;

        fourierSeries[n] += (1 / 4) * (2 * (Math.pow(-1, k + 1) / k) * Math.sin(k * x));
      }
    }

    return fourierSeries;
  };

  const triangle = () => {
    const fourierSeries = new Float32Array(N);

    for (let n = 0; n < N; n++) {
      fourierSeries[n] = Math.PI / 2;

      for (let k = 1; k < K; k++) {
        const x = n / RESOLUTION;

        fourierSeries[n] += (1 / 2) * (((2 * (Math.pow(-1, k) - 1)) / (Math.pow(k, 2) * Math.PI)) * Math.cos(k * x));
      }

      fourierSeries[n] -= Math.PI / 2;
    }

    return fourierSeries;
  };

  const fourierSeries = () => {
    switch (functionSelectElement.value) {
      case 'square': {
        return square();
      }

      case 'sawtooth': {
        return sawtooth();
      }

      case 'triangle': {
        return triangle();
      }
    }
  };

  let K = rangeElement.valueAsNumber;

  let intervalId = null;
  let animationId = null;

  plotSeries(svg, fourierSeries());

  plotButtonElement.addEventListener(
    'click',
    () => {
      plotSeries(svg, fourierSeries());
    },
    false
  );

  clearButtonElement.addEventListener(
    'click',
    () => {
      for (const path of svg.querySelectorAll('path')) {
        svg.removeChild(path);
      }

      if (intervalId || animationId) {
        if (intervalId) {
          window.clearInterval(intervalId);
          intervalId = null;
        }

        if (animationId) {
          window.cancelAnimationFrame(animationId);
          animationId = null;
        }

        plotButtonElement.removeAttribute('disabled');
        animationButtonElement.removeAttribute('disabled');
        intervalSelectElement.removeAttribute('disabled');
        functionSelectElement.removeAttribute('disabled');
        rangeElement.removeAttribute('disabled');
      }
    },
    false
  );

  animationButtonElement.addEventListener(
    'click',
    () => {
      plotButtonElement.setAttribute('disabled', 'disabled');
      animationButtonElement.setAttribute('disabled', 'disabled');
      intervalSelectElement.setAttribute('disabled', 'disabled');
      functionSelectElement.setAttribute('disabled', 'disabled');
      rangeElement.setAttribute('disabled', 'disabled');

      K = 1;

      const animate = (auto = false) => {
        for (const path of svg.querySelectorAll('path')) {
          svg.removeChild(path);
        }

        plotSeries(svg, fourierSeries());

        rangeElement.valueAsNumber = K;
        outputTextElement.textContent = K;

        ++K;

        if (K > 100) {
          if (intervalId) {
            window.clearInterval(intervalId);
            intervalId = null;
          }

          if (animationId) {
            window.cancelAnimationFrame(animationId);
            animationId = null;
          }

          plotButtonElement.removeAttribute('disabled');
          animationButtonElement.removeAttribute('disabled');
          intervalSelectElement.removeAttribute('disabled');
          functionSelectElement.removeAttribute('disabled');
          rangeElement.removeAttribute('disabled');
          return;
        }

        if (auto) {
          animationId = window.requestAnimationFrame(() => {
            animate(auto);
          });
        }
      };

      if (intervalSelectElement.value === '60 fps') {
        animate(true);
      } else {
        const interval = Number(intervalSelectElement.value);

        intervalId = window.setInterval(animate, interval);
      }
    },
    false
  );

  rangeElement.addEventListener('input', (event) => {
    K = event.currentTarget.valueAsNumber;

    outputTextElement.textContent = K;
  });

  rangeElement.addEventListener(
    'change',
    (event) => {
      plotSeries(svg, fourierSeries());
    },
    false
  );

  functionSelectElement.addEventListener(
    'change',
    (event) => {
      if (event.currentTarget.value === 'sinc') {
        animationButtonElement.setAttribute('disabled', 'disabled');
        intervalSelectElement.setAttribute('disabled', 'disabled');
        rangeElement.setAttribute('disabled', 'disabled');
      } else {
        animationButtonElement.removeAttribute('disabled');
        intervalSelectElement.removeAttribute('disabled');
        rangeElement.removeAttribute('disabled');
      }
    },
    false
  );
};

const createRotationFactors = (svg) => {
  const width = Number(svg.getAttribute('width'));
  const height = Number(svg.getAttribute('height'));

  const xRect = document.createElementNS(xmlns, 'rect');

  xRect.setAttribute('x', (2 * padding).toString(10));
  xRect.setAttribute('y', (height / 2 - lineWidth / 2).toString(10));
  xRect.setAttribute('width', (width - 4 * padding).toString(10));
  xRect.setAttribute('height', lineWidth.toString(10));
  xRect.setAttribute('stroke', 'none');
  xRect.setAttribute('fill', baseColor);

  svg.appendChild(xRect);

  const yRect = document.createElementNS(xmlns, 'rect');

  yRect.setAttribute('x', (width / 2 - lineWidth / 2).toString(10));
  yRect.setAttribute('y', '24');
  yRect.setAttribute('width', lineWidth.toString(10));
  yRect.setAttribute('height', (height - 24).toString(10));
  yRect.setAttribute('stroke', 'none');
  yRect.setAttribute('fill', baseColor);

  svg.appendChild(yRect);

  const realText = document.createElementNS(xmlns, 'text');

  realText.textContent = 'Re';

  realText.setAttribute('x', (width - 2 * padding + 20).toString(10));
  realText.setAttribute('y', (height / 2 + 8).toString(10));
  realText.setAttribute('text-anchor', 'middle');
  realText.setAttribute('stroke', 'none');
  realText.setAttribute('fill', baseColor);
  realText.setAttribute('font-size', '20px');

  svg.appendChild(realText);

  const imagText = document.createElementNS(xmlns, 'text');

  imagText.textContent = 'Im';

  imagText.setAttribute('x', (width / 2).toString(10));
  imagText.setAttribute('y', '20');
  imagText.setAttribute('text-anchor', 'middle');
  imagText.setAttribute('stroke', 'none');
  imagText.setAttribute('fill', baseColor);
  imagText.setAttribute('font-size', '20px');

  svg.appendChild(imagText);

  const circle = document.createElementNS(xmlns, 'circle');

  circle.setAttribute('cx', (width / 2).toString(10));
  circle.setAttribute('cy', (height / 2).toString(10));
  circle.setAttribute('r', '120');
  circle.setAttribute('stroke', alphaBaseColor);
  circle.setAttribute('stroke-width', '4');
  circle.setAttribute('fill', 'none');

  svg.appendChild(circle);

  const innerCircle = document.createElementNS(xmlns, 'circle');

  innerCircle.setAttribute('cx', (width / 2).toString(10));
  innerCircle.setAttribute('cy', (height / 2).toString(10));
  innerCircle.setAttribute('r', '60');
  innerCircle.setAttribute('stroke', lightWaveColor);
  innerCircle.setAttribute('stroke-width', '4');
  innerCircle.setAttribute('fill', 'none');

  svg.appendChild(innerCircle);

  const arrow = document.createElementNS(xmlns, 'path');

  const ax = width - 60 - 4 * padding;

  arrow.setAttribute('d', `M${ax} ${height / 2 - lineWidth / 2} L${ax - 8} ${height / 2 - lineWidth / 2 - 12} ${ax + 8} ${height / 2 - lineWidth / 2 - 12}`);
  arrow.setAttribute('stroke', 'none');
  arrow.setAttribute('fill', lightWaveColor);

  svg.appendChild(arrow);

  [0, (7 * Math.PI) / 4, (6 * Math.PI) / 4, (5 * Math.PI) / 4, (4 * Math.PI) / 4, (3 * Math.PI) / 4, (2 * Math.PI) / 4, Math.PI / 4].forEach((rad, index) => {
    const path = document.createElementNS(xmlns, 'path');

    const startX = width / 2;
    const startY = height / 2;

    const endX = 118 * Math.cos(rad) + startX;
    const endY = 118 * Math.sin(rad) + startY;

    path.setAttribute('d', `M${startX} ${startY} L${endX} ${endY}`);

    path.setAttribute('stroke', lightColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-dasharray', '5,5');
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    svg.appendChild(path);

    const textW = document.createElementNS(xmlns, `text`);
    const textN = document.createElementNS(xmlns, `text`);

    textW.textContent = 'W';

    if (index === 0) {
      textN.textContent = '0';
    } else {
      textN.textContent = (8 - index).toString(10);
    }

    textW.setAttribute('x', endX.toString(10));
    textW.setAttribute('y', endY.toString(10));
    textW.setAttribute('text-anchor', 'middle');
    textW.setAttribute('stroke', 'none');
    textW.setAttribute('fill', baseColor);
    textW.setAttribute('font-size', '20px');

    textN.setAttribute('x', (endX + 12).toString(10));
    textN.setAttribute('y', (endY - 12).toString(10));
    textN.setAttribute('text-anchor', 'middle');
    textN.setAttribute('stroke', 'none');
    textN.setAttribute('fill', baseColor);
    textN.setAttribute('font-size', '16px');

    svg.appendChild(textW);
    svg.appendChild(textN);
  });
};

const createAddSymbol = (svg, x, y) => {
  const addSymbolCircle = document.createElementNS(xmlns, 'circle');

  addSymbolCircle.setAttribute('cx', x.toString(10));
  addSymbolCircle.setAttribute('cy', y.toString(10));
  addSymbolCircle.setAttribute('r', '8');
  addSymbolCircle.setAttribute('stroke', baseColor);
  addSymbolCircle.setAttribute('stroke-width', lineWidth.toString(10));
  addSymbolCircle.setAttribute('stroke-linecap', lineCap);
  addSymbolCircle.setAttribute('stroke-linejoin', lineJoin);
  addSymbolCircle.setAttribute('fill', 'none');

  svg.appendChild(addSymbolCircle);

  const addSymbol = document.createElementNS(xmlns, 'text');

  addSymbol.textContent = '+';

  addSymbol.setAttribute('x', x.toString(10));
  addSymbol.setAttribute('y', (y + 6).toString(10));

  addSymbol.setAttribute('text-anchor', 'middle');
  addSymbol.setAttribute('stroke', 'none');
  addSymbol.setAttribute('fill', baseColor);
  addSymbol.setAttribute('font-size', '24px');

  svg.appendChild(addSymbol);
};

const createSubSymbol = (svg, x, y) => {
  const subSymbolCircle = document.createElementNS(xmlns, 'circle');

  subSymbolCircle.setAttribute('cx', x.toString(10));
  subSymbolCircle.setAttribute('cy', y.toString(10));
  subSymbolCircle.setAttribute('r', '8');
  subSymbolCircle.setAttribute('stroke', baseColor);
  subSymbolCircle.setAttribute('stroke-width', lineWidth.toString(10));
  subSymbolCircle.setAttribute('stroke-linecap', lineCap);
  subSymbolCircle.setAttribute('stroke-linejoin', lineJoin);
  subSymbolCircle.setAttribute('fill', 'none');

  svg.appendChild(subSymbolCircle);

  const subSymbol = document.createElementNS(xmlns, 'text');

  subSymbol.textContent = '-';

  subSymbol.setAttribute('x', x.toString(10));
  subSymbol.setAttribute('y', (y + 14).toString(10));

  subSymbol.setAttribute('text-anchor', 'middle');
  subSymbol.setAttribute('stroke', 'none');
  subSymbol.setAttribute('fill', baseColor);
  subSymbol.setAttribute('font-size', '48px');
  subSymbol.setAttribute('font-weight', '200');

  svg.appendChild(subSymbol);
};

const createFFTSymbols = (svg) => {
  const width = Number(svg.getAttribute('width'));
  const height = Number(svg.getAttribute('height'));

  const padding = 32;

  createAddSymbol(svg, padding, padding);

  const addSymbolText = document.createElementNS(xmlns, 'text');

  addSymbolText.textContent = '加算器';

  addSymbolText.setAttribute('x', (padding + 42).toString(10));
  addSymbolText.setAttribute('y', (padding + 6).toString(10));

  addSymbolText.setAttribute('text-anchor', 'middle');
  addSymbolText.setAttribute('stroke', 'none');
  addSymbolText.setAttribute('fill', grayColor);
  addSymbolText.setAttribute('font-size', '16px');

  svg.appendChild(addSymbolText);

  createSubSymbol(svg, 4 * padding, padding);

  const subSymbolText = document.createElementNS(xmlns, 'text');

  subSymbolText.textContent = '減算器';

  subSymbolText.setAttribute('x', (5 * padding + 12).toString(10));
  subSymbolText.setAttribute('y', (padding + 5).toString(10));

  subSymbolText.setAttribute('text-anchor', 'middle');
  subSymbolText.setAttribute('stroke', 'none');
  subSymbolText.setAttribute('fill', grayColor);
  subSymbolText.setAttribute('font-size', '16px');

  svg.appendChild(subSymbolText);

  const multiplySymbol = document.createElementNS(xmlns, 'path');

  multiplySymbol.setAttribute(
    'd',
    `M${7 * padding} ${padding} L${7 * padding} ${padding - 8} L${7 * padding + 12} ${padding} L${7 * padding} ${padding + 8} L${7 * padding} ${padding}`
  );

  multiplySymbol.setAttribute('stroke', baseColor);
  multiplySymbol.setAttribute('stroke-width', lineWidth.toString(10));
  multiplySymbol.setAttribute('stroke-linecap', lineCap);
  multiplySymbol.setAttribute('stroke-linejoin', lineJoin);
  multiplySymbol.setAttribute('fill', 'none');

  svg.appendChild(multiplySymbol);

  const multiplySymbolText = document.createElementNS(xmlns, 'text');

  multiplySymbolText.textContent = '乗算器';

  multiplySymbolText.setAttribute('x', (8 * padding + 12).toString(10));
  multiplySymbolText.setAttribute('y', (padding + 5).toString(10));

  multiplySymbolText.setAttribute('text-anchor', 'middle');
  multiplySymbolText.setAttribute('stroke', 'none');
  multiplySymbolText.setAttribute('fill', grayColor);
  multiplySymbolText.setAttribute('font-size', '16px');

  svg.appendChild(multiplySymbolText);

  const sortIndexPath = document.createElementNS(xmlns, 'path');

  sortIndexPath.setAttribute('d', `M${10 * padding} ${padding} L${12 * padding} ${padding}`);

  sortIndexPath.setAttribute('stroke', baseColor);
  sortIndexPath.setAttribute('stroke-width', lineWidth.toString(10));
  sortIndexPath.setAttribute('stroke-dasharray', '5,5');
  sortIndexPath.setAttribute('stroke-linecap', lineCap);
  sortIndexPath.setAttribute('stroke-linejoin', lineJoin);
  sortIndexPath.setAttribute('fill', 'none');

  svg.appendChild(sortIndexPath);

  const sortIndexPathText = document.createElementNS(xmlns, 'text');

  sortIndexPathText.textContent = 'インデックス並び替え';

  sortIndexPathText.setAttribute('x', (14 * padding + 24).toString(10));
  sortIndexPathText.setAttribute('y', (padding + 5).toString(10));

  sortIndexPathText.setAttribute('text-anchor', 'middle');
  sortIndexPathText.setAttribute('stroke', 'none');
  sortIndexPathText.setAttribute('fill', grayColor);
  sortIndexPathText.setAttribute('font-size', '16px');

  svg.appendChild(sortIndexPathText);
};

const createFFT4 = (svg) => {
  const size = 4;

  const width = Number(svg.getAttribute('width'));
  const height = Number(svg.getAttribute('height'));

  const padding = 16;

  const innerWidth = width - 4 * padding;
  const innerHeight = height - 2 * padding;

  for (let n = 0; n < size; n++) {
    const rect = document.createElementNS(xmlns, 'rect');

    const x = 2 * padding;
    const y = padding + n * (innerHeight / size);

    rect.setAttribute('x', x.toString(10));
    rect.setAttribute('y', y.toString(10));
    rect.setAttribute('width', innerWidth.toString(10));
    rect.setAttribute('height', lineWidth.toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', alphaBaseColor);

    svg.appendChild(rect);

    const arrow = document.createElementNS(xmlns, 'path');

    const ax = x + innerWidth - 12;

    arrow.setAttribute('d', `M${ax} ${y} L${ax} ${y - 8} ${ax + 12} ${y} L${ax} ${y + 8} ${ax} ${y}`);
    arrow.setAttribute('stroke', 'none');
    arrow.setAttribute('fill', baseColor);

    svg.appendChild(arrow);

    const xn = document.createElementNS(xmlns, 'text');

    xn.textContent = `x[${n}]`;

    xn.setAttribute('x', (x - 16).toString(10));
    xn.setAttribute('y', (y + 5).toString(10));
    xn.setAttribute('text-anchor', 'middle');
    xn.setAttribute('stroke', 'none');
    xn.setAttribute('fill', baseColor);
    xn.setAttribute('font-size', '16px');

    svg.appendChild(xn);

    const xk = document.createElementNS(xmlns, 'text');

    xk.textContent = `X[${n}]`;

    xk.setAttribute('x', (x + innerWidth + 16).toString(10));
    xk.setAttribute('y', (y + 5).toString(10));
    xk.setAttribute('text-anchor', 'middle');
    xk.setAttribute('stroke', 'none');
    xk.setAttribute('fill', baseColor);
    xk.setAttribute('font-size', '16px');

    svg.appendChild(xk);

    for (let stage = 1; stage <= Math.log2(size); stage++) {
      const elementText = document.createElementNS(xmlns, 'text');

      switch (stage) {
        case 1: {
          switch (n) {
            case 0: {
              elementText.textContent = '(x[0] + x[2])';
              break;
            }

            case 1: {
              elementText.textContent = '(x[1] + x[3])';
              break;
            }

            case 2: {
              elementText.textContent = '(x[0] - x[2])';
              break;
            }

            case 3: {
              elementText.textContent = '(x[1] - x[3])';
              break;
            }
          }

          elementText.setAttribute('x', (innerWidth / 4 + 24).toString(10));
          break;
        }

        case 2: {
          switch (n) {
            case 0: {
              elementText.textContent = '(x[0] + x[2]) + (x[1] + x[3])';
              break;
            }

            case 1: {
              elementText.textContent = '(x[0] + x[2]) - (x[1] + x[3])';
              break;
            }

            case 2: {
              elementText.textContent = '(x[0] - x[2]) + W(x[1] - x[3])';
              break;
            }

            case 3: {
              elementText.textContent = '(x[0] - x[2]) - W(x[1] - x[3])';
              break;
            }
          }

          elementText.setAttribute('x', (2 * (innerWidth / 3) + 48).toString(10));
          break;
        }
      }

      elementText.setAttribute('y', (n * (innerHeight / size) + 12).toString(10));
      elementText.setAttribute('text-anchor', 'middle');
      elementText.setAttribute('stroke', 'none');
      elementText.setAttribute('fill', grayColor);
      elementText.setAttribute('font-size', '16px');

      svg.appendChild(elementText);

      const xPath = document.createElementNS(xmlns, 'path');

      const startX = x + (stage - 1) * (innerWidth / 2) + stage * 12;
      const endX = x + stage * (innerWidth / 6) + (stage - 1) * 24;

      switch (stage) {
        case 1: {
          switch (n) {
            case 0: {
              xPath.setAttribute('d', `M${startX} ${padding} L${endX} ${padding + 2 * (innerHeight / size)}`);
              createSubSymbol(svg, endX, padding + 2 * (innerHeight / size));
              break;
            }

            case 1: {
              xPath.setAttribute('d', `M${startX} ${padding + 1 * (innerHeight / size)} L${endX} ${padding + 3 * (innerHeight / size)}`);
              createSubSymbol(svg, endX, padding + 3 * (innerHeight / size));
              break;
            }

            case 2: {
              xPath.setAttribute('d', `M${startX} ${padding + 2 * (innerHeight / size)} L${endX} ${padding}`);
              createAddSymbol(svg, endX, padding);
              break;
            }

            case 3: {
              xPath.setAttribute('d', `M${startX} ${padding + 3 * (innerHeight / size)} L${endX} ${padding + 1 * (innerHeight / size)}`);
              createAddSymbol(svg, endX, padding + 1 * (innerHeight / size));
              break;
            }
          }

          break;
        }

        case 2: {
          switch (n) {
            case 0: {
              xPath.setAttribute('d', `M${startX} ${padding} L${endX} ${padding + 1 * (innerHeight / size)}`);
              createAddSymbol(svg, startX, padding + 1 * (innerHeight / size));
              break;
            }

            case 1: {
              xPath.setAttribute('d', `M${startX} ${padding + 1 * (innerHeight / size)} L${endX} ${padding}`);
              createSubSymbol(svg, startX, padding);
              break;
            }

            case 2: {
              xPath.setAttribute('d', `M${startX} ${padding + 2 * (innerHeight / size)} L${endX} ${padding + 3 * (innerHeight / size)}`);
              createAddSymbol(svg, startX, padding + 3 * (innerHeight / size));
              break;
            }

            case 3: {
              xPath.setAttribute('d', `M${startX} ${padding + 3 * (innerHeight / size)} L${endX} ${padding + 2 * (innerHeight / size)}`);
              createSubSymbol(svg, startX, padding + 2 * (innerHeight / size));
              break;
            }
          }

          break;
        }
      }

      xPath.setAttribute('stroke', baseColor);
      xPath.setAttribute('stroke-width', lineWidth.toString(10));
      xPath.setAttribute('stroke-linecap', lineCap);
      xPath.setAttribute('stroke-linejoin', lineJoin);
      xPath.setAttribute('fill', 'none');

      svg.appendChild(xPath);
    }

    if (n === 1 || n === 2) {
      const sortIndexPath = document.createElementNS(xmlns, 'path');

      const startX = x + innerWidth / 2 + 80;
      const endX = x + innerWidth - 80;

      switch (n) {
        case 1: {
          sortIndexPath.setAttribute('d', `M${startX} ${padding + 1 * (innerHeight / size)} L${endX} ${padding + 2 * (innerHeight / size)}`);
          break;
        }

        case 2: {
          sortIndexPath.setAttribute('d', `M${startX} ${padding + 2 * (innerHeight / size)} L${endX} ${padding + 1 * (innerHeight / size)}`);
          break;
        }
      }

      sortIndexPath.setAttribute('stroke', baseColor);
      sortIndexPath.setAttribute('stroke-width', lineWidth.toString(10));
      sortIndexPath.setAttribute('stroke-dasharray', '5,5');
      sortIndexPath.setAttribute('stroke-linecap', lineCap);
      sortIndexPath.setAttribute('stroke-linejoin', lineJoin);
      sortIndexPath.setAttribute('fill', 'none');

      svg.appendChild(sortIndexPath);
    }

    const rotationFactor = document.createElementNS(xmlns, 'path');

    const rx = x + innerWidth / 3 - 12;

    rotationFactor.setAttribute('d', `M${rx} ${y + 1} L${rx} ${y - 8} ${rx + 12} ${y + 1} L${rx} ${y + 8} ${rx} ${y + 1}`);
    rotationFactor.setAttribute('stroke', baseColor);
    rotationFactor.setAttribute('stroke-width', lineWidth.toString(10));
    rotationFactor.setAttribute('fill', 'none');

    svg.appendChild(rotationFactor);

    const w = document.createElementNS(xmlns, 'text');

    switch (n) {
      case 0: {
        w.textContent = ' 1';
        break;
      }

      case 1: {
        w.textContent = '-1';
        break;
      }

      case 2: {
        w.textContent = ' 1';
        break;
      }

      case 3: {
        w.textContent = '-W';
        break;
      }
    }

    w.setAttribute('x', (rx + 24).toString(10));
    w.setAttribute('y', (n * (innerHeight / size) + 12).toString(10));
    w.setAttribute('text-anchor', 'middle');
    w.setAttribute('stroke', 'none');
    w.setAttribute('fill', baseColor);
    w.setAttribute('font-size', '16px');

    svg.appendChild(w);
  }
};

const createFFT8 = (svg) => {
  const size = 8;

  const width = Number(svg.getAttribute('width'));
  const height = Number(svg.getAttribute('height'));

  const padding = 16;

  const innerWidth = width - 4 * padding;
  const innerHeight = height - 2 * padding;

  for (let n = 0; n < size; n++) {
    const rect = document.createElementNS(xmlns, 'rect');

    const x = 2 * padding;
    const y = padding + n * (innerHeight / size);

    rect.setAttribute('x', x.toString(10));
    rect.setAttribute('y', y.toString(10));
    rect.setAttribute('width', innerWidth.toString(10));
    rect.setAttribute('height', lineWidth.toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', alphaBaseColor);

    svg.appendChild(rect);

    const arrow = document.createElementNS(xmlns, 'path');

    const ax = x + innerWidth - 12;

    arrow.setAttribute('d', `M${ax} ${y} L${ax} ${y - 8} ${ax + 12} ${y} L${ax} ${y + 8} ${ax} ${y}`);
    arrow.setAttribute('stroke', 'none');
    arrow.setAttribute('fill', baseColor);

    svg.appendChild(arrow);

    const xn = document.createElementNS(xmlns, 'text');

    xn.textContent = `x[${n}]`;

    xn.setAttribute('x', (x - 16).toString(10));
    xn.setAttribute('y', (y + 5).toString(10));
    xn.setAttribute('text-anchor', 'middle');
    xn.setAttribute('stroke', 'none');
    xn.setAttribute('fill', baseColor);
    xn.setAttribute('font-size', '16px');

    svg.appendChild(xn);

    const xk = document.createElementNS(xmlns, 'text');

    xk.textContent = `X[${n}]`;

    xk.setAttribute('x', (x + innerWidth + 16).toString(10));
    xk.setAttribute('y', (y + 5).toString(10));
    xk.setAttribute('text-anchor', 'middle');
    xk.setAttribute('stroke', 'none');
    xk.setAttribute('fill', baseColor);
    xk.setAttribute('font-size', '16px');

    svg.appendChild(xk);

    for (let stage = 1; stage <= Math.log2(size); stage++) {
      const elementText = document.createElementNS(xmlns, 'text');
      const elementTextSuper = document.createElementNS(xmlns, 'text');

      switch (stage) {
        case 1: {
          switch (n) {
            case 0: {
              elementText.textContent = '(x[0] + x[4])';
              break;
            }

            case 1: {
              elementText.textContent = '(x[1] + x[5])';
              break;
            }

            case 2: {
              elementText.textContent = '(x[2] + x[6])';
              break;
            }

            case 3: {
              elementText.textContent = '(x[3] + x[7])';
              break;
            }

            case 4: {
              elementText.textContent = '(x[0] - x[4])';
              break;
            }

            case 5: {
              elementText.textContent = '(x[1] - x[5])';
              break;
            }

            case 6: {
              elementText.textContent = '(x[2] - x[6])';
              break;
            }

            case 7: {
              elementText.textContent = '(x[3] - x[7])';
              break;
            }
          }

          elementText.setAttribute('x', (innerWidth / 8).toString(10));

          elementTextSuper.setAttribute('y', (padding + n * (innerHeight / size) - 12).toString(10));
          elementTextSuper.setAttribute('text-anchor', 'middle');
          elementTextSuper.setAttribute('stroke', 'none');
          elementTextSuper.setAttribute('fill', grayColor);
          elementTextSuper.setAttribute('font-size', '12px');

          svg.appendChild(elementTextSuper);
          break;
        }

        case 2: {
          const x2 = x + innerWidth / 3 + 4;

          switch (n) {
            case 0: {
              elementText.textContent = '(x[0] + x[4]) + (x[2] + x[6])';

              elementText.setAttribute('x', x2.toString(10));
              break;
            }

            case 1: {
              elementText.textContent = '(x[1] + x[5]) + (x[3] + x[7])';

              elementText.setAttribute('x', x2.toString(10));
              break;
            }

            case 2: {
              elementText.textContent = '(x[0] + x[4]) - (x[2] + x[6])';

              elementText.setAttribute('x', x2.toString(10));
              break;
            }

            case 3: {
              elementText.textContent = '(x[1] + x[5]) - (x[3] + x[7])';

              elementText.setAttribute('x', x2.toString(10));
              break;
            }

            case 4: {
              elementText.textContent = '(x[0] - x[4]) + W (x[2] - x[6])';
              elementTextSuper.textContent = '2';

              elementText.setAttribute('x', (x2 + 6).toString(10));
              elementTextSuper.setAttribute('x', (x2 + 24).toString(10));
              break;
            }

            case 5: {
              elementText.textContent = '(x[1] - x[5]) + W (x[3] - x[7])';
              elementTextSuper.textContent = '2';

              elementText.setAttribute('x', (x2 + 6).toString(10));
              elementTextSuper.setAttribute('x', (x2 + 24).toString(10));
              break;
            }

            case 6: {
              elementText.textContent = '(x[0] - x[4]) - W (x[2] - x[6])';
              elementTextSuper.textContent = '2';

              elementText.setAttribute('x', (x2 + 6).toString(10));
              elementTextSuper.setAttribute('x', (x2 + 24).toString(10));
              break;
            }

            case 7: {
              elementText.textContent = '(x[1] - x[5]) - W (x[3] - x[7])';
              elementTextSuper.textContent = '2';

              elementText.setAttribute('x', (x2 + 6).toString(10));
              elementTextSuper.setAttribute('x', (x2 + 24).toString(10));
              break;
            }
          }

          elementTextSuper.setAttribute('y', (padding + n * (innerHeight / size) - 12).toString(10));
          elementTextSuper.setAttribute('text-anchor', 'middle');
          elementTextSuper.setAttribute('stroke', 'none');
          elementTextSuper.setAttribute('fill', grayColor);
          elementTextSuper.setAttribute('font-size', '12px');

          svg.appendChild(elementTextSuper);
          break;
        }

        case 3: {
          const x3 = innerWidth - innerWidth / 3 + 52;

          switch (n) {
            case 0: {
              elementText.textContent = '((x[0] + x[4]) + (x[2] + x[6])) + ((x[1] + x[5]) + (x[3] + x[7]))';

              elementText.setAttribute('x', x3.toString(10));
              break;
            }

            case 1: {
              elementText.textContent = '((x[0] + x[4]) + (x[2] + x[6])) - ((x[1] + x[5]) + (x[3] + x[7]))';

              elementText.setAttribute('x', x3.toString(10));
              break;
            }

            case 2: {
              elementText.textContent = '((x[0] + x[4]) - (x[2] + x[6])) + W ((x[1] + x[5]) - (x[3] + x[7]))';
              elementTextSuper.textContent = '2';

              elementText.setAttribute('x', (x3 + 8).toString(10));
              elementTextSuper.setAttribute('x', (x3 + 26).toString(10));
              elementTextSuper.setAttribute('y', (padding + n * (innerHeight / size) - 12).toString(10));
              elementTextSuper.setAttribute('text-anchor', 'middle');
              elementTextSuper.setAttribute('stroke', 'none');
              elementTextSuper.setAttribute('fill', grayColor);
              elementTextSuper.setAttribute('font-size', '12px');

              svg.appendChild(elementTextSuper);
              break;
            }

            case 3: {
              elementText.textContent = '((x[0] + x[4]) - (x[2] + x[6])) - W ((x[1] + x[5]) - (x[3] + x[7]))';
              elementTextSuper.textContent = '2';

              elementText.setAttribute('x', (x3 + 8).toString(10));
              elementTextSuper.setAttribute('x', (x3 + 26).toString(10));
              elementTextSuper.setAttribute('x', (x3 + 26).toString(10));
              elementTextSuper.setAttribute('y', (padding + n * (innerHeight / size) - 12).toString(10));
              elementTextSuper.setAttribute('text-anchor', 'middle');
              elementTextSuper.setAttribute('stroke', 'none');
              elementTextSuper.setAttribute('fill', grayColor);
              elementTextSuper.setAttribute('font-size', '12px');

              svg.appendChild(elementTextSuper);
              break;
            }

            case 4: {
              elementText.textContent = '((x[0] - x[4]) + W (x[2] - x[6])) + W((x[1] - x[5]) + W (x[3] - x[7]))';

              const elementTextSuper1 = document.createElementNS(xmlns, 'text');
              const elementTextSuper2 = document.createElementNS(xmlns, 'text');

              elementTextSuper1.textContent = '2';
              elementTextSuper2.textContent = '2';

              elementText.setAttribute('x', (x3 + 22).toString(10));
              elementTextSuper1.setAttribute('x', (x3 - 74).toString(10));
              elementTextSuper2.setAttribute('x', (x3 + 154).toString(10));

              elementTextSuper1.setAttribute('y', (padding + n * (innerHeight / size) - 12).toString(10));
              elementTextSuper1.setAttribute('text-anchor', 'middle');
              elementTextSuper1.setAttribute('stroke', 'none');
              elementTextSuper1.setAttribute('fill', grayColor);
              elementTextSuper1.setAttribute('font-size', '12px');

              elementTextSuper2.setAttribute('y', (padding + n * (innerHeight / size) - 12).toString(10));
              elementTextSuper2.setAttribute('text-anchor', 'middle');
              elementTextSuper2.setAttribute('stroke', 'none');
              elementTextSuper2.setAttribute('fill', grayColor);
              elementTextSuper2.setAttribute('font-size', '12px');

              svg.appendChild(elementTextSuper1);
              svg.appendChild(elementTextSuper2);
              break;
            }

            case 5: {
              elementText.textContent = '((x[0] - x[4]) + W (x[2] - x[6])) - W((x[1] - x[5]) + W (x[3] - x[7]))';

              const elementTextSuper1 = document.createElementNS(xmlns, 'text');
              const elementTextSuper2 = document.createElementNS(xmlns, 'text');

              elementTextSuper1.textContent = '2';
              elementTextSuper2.textContent = '2';

              elementText.setAttribute('x', (x3 + 22).toString(10));
              elementTextSuper1.setAttribute('x', (x3 - 74).toString(10));
              elementTextSuper2.setAttribute('x', (x3 + 154).toString(10));

              elementTextSuper1.setAttribute('y', (padding + n * (innerHeight / size) - 12).toString(10));
              elementTextSuper1.setAttribute('text-anchor', 'middle');
              elementTextSuper1.setAttribute('stroke', 'none');
              elementTextSuper1.setAttribute('fill', grayColor);
              elementTextSuper1.setAttribute('font-size', '12px');

              elementTextSuper2.setAttribute('y', (padding + n * (innerHeight / size) - 12).toString(10));
              elementTextSuper2.setAttribute('text-anchor', 'middle');
              elementTextSuper2.setAttribute('stroke', 'none');
              elementTextSuper2.setAttribute('fill', grayColor);
              elementTextSuper2.setAttribute('font-size', '12px');

              svg.appendChild(elementTextSuper1);
              svg.appendChild(elementTextSuper2);
              break;
            }

            case 6: {
              elementText.textContent = '((x[0] - x[4]) - W (x[2] - x[6])) + W ((x[1] - x[5]) - W (x[3] - x[7]))';

              const elementTextSuper1 = document.createElementNS(xmlns, 'text');
              const elementTextSuper2 = document.createElementNS(xmlns, 'text');
              const elementTextSuper3 = document.createElementNS(xmlns, 'text');

              elementTextSuper1.textContent = '2';
              elementTextSuper2.textContent = '3';
              elementTextSuper3.textContent = '2';

              elementText.setAttribute('x', (x3 + 24).toString(10));
              elementTextSuper1.setAttribute('x', (x3 - 74).toString(10));
              elementTextSuper2.setAttribute('x', (x3 + 42).toString(10));
              elementTextSuper3.setAttribute('x', (x3 + 154).toString(10));

              elementTextSuper1.setAttribute('y', (padding + n * (innerHeight / size) - 12).toString(10));
              elementTextSuper1.setAttribute('text-anchor', 'middle');
              elementTextSuper1.setAttribute('stroke', 'none');
              elementTextSuper1.setAttribute('fill', grayColor);
              elementTextSuper1.setAttribute('font-size', '12px');

              elementTextSuper2.setAttribute('y', (padding + n * (innerHeight / size) - 12).toString(10));
              elementTextSuper2.setAttribute('text-anchor', 'middle');
              elementTextSuper2.setAttribute('stroke', 'none');
              elementTextSuper2.setAttribute('fill', grayColor);
              elementTextSuper2.setAttribute('font-size', '12px');

              elementTextSuper3.setAttribute('y', (padding + n * (innerHeight / size) - 12).toString(10));
              elementTextSuper3.setAttribute('text-anchor', 'middle');
              elementTextSuper3.setAttribute('stroke', 'none');
              elementTextSuper3.setAttribute('fill', grayColor);
              elementTextSuper3.setAttribute('font-size', '12px');

              svg.appendChild(elementTextSuper1);
              svg.appendChild(elementTextSuper2);
              svg.appendChild(elementTextSuper3);
              break;
            }

            case 7: {
              elementText.textContent = '((x[0] - x[4]) - W (x[2] - x[6])) - W ((x[1] - x[5]) - W (x[3] - x[7]))';

              const elementTextSuper1 = document.createElementNS(xmlns, 'text');
              const elementTextSuper2 = document.createElementNS(xmlns, 'text');
              const elementTextSuper3 = document.createElementNS(xmlns, 'text');

              elementTextSuper1.textContent = '2';
              elementTextSuper2.textContent = '3';
              elementTextSuper3.textContent = '2';

              elementText.setAttribute('x', (x3 + 24).toString(10));
              elementTextSuper1.setAttribute('x', (x3 - 74).toString(10));
              elementTextSuper2.setAttribute('x', (x3 + 42).toString(10));
              elementTextSuper3.setAttribute('x', (x3 + 154).toString(10));

              elementTextSuper1.setAttribute('y', (padding + n * (innerHeight / size) - 12).toString(10));
              elementTextSuper1.setAttribute('text-anchor', 'middle');
              elementTextSuper1.setAttribute('stroke', 'none');
              elementTextSuper1.setAttribute('fill', grayColor);
              elementTextSuper1.setAttribute('font-size', '12px');

              elementTextSuper2.setAttribute('y', (padding + n * (innerHeight / size) - 12).toString(10));
              elementTextSuper2.setAttribute('text-anchor', 'middle');
              elementTextSuper2.setAttribute('stroke', 'none');
              elementTextSuper2.setAttribute('fill', grayColor);
              elementTextSuper2.setAttribute('font-size', '12px');

              elementTextSuper3.setAttribute('y', (padding + n * (innerHeight / size) - 12).toString(10));
              elementTextSuper3.setAttribute('text-anchor', 'middle');
              elementTextSuper3.setAttribute('stroke', 'none');
              elementTextSuper3.setAttribute('fill', grayColor);
              elementTextSuper3.setAttribute('font-size', '12px');

              svg.appendChild(elementTextSuper1);
              svg.appendChild(elementTextSuper2);
              svg.appendChild(elementTextSuper3);
              break;
            }
          }

          break;
        }
      }

      elementText.setAttribute('y', (padding + n * (innerHeight / size) - 4).toString(10));
      elementText.setAttribute('text-anchor', 'middle');
      elementText.setAttribute('stroke', 'none');
      elementText.setAttribute('fill', grayColor);
      elementText.setAttribute('font-size', '16px');

      svg.appendChild(elementText);

      const xPath = document.createElementNS(xmlns, 'path');

      switch (stage) {
        case 1: {
          const startX = x + stage * 12;
          const endX = startX + 88;

          switch (n) {
            case 0: {
              xPath.setAttribute('d', `M${startX} ${padding} L${endX} ${padding + 4 * (innerHeight / size)}`);
              createSubSymbol(svg, endX, padding + 4 * (innerHeight / size));
              break;
            }

            case 1: {
              xPath.setAttribute('d', `M${startX} ${padding + 1 * (innerHeight / size)} L${endX} ${padding + 5 * (innerHeight / size)}`);
              createSubSymbol(svg, endX, padding + 5 * (innerHeight / size));
              break;
            }

            case 2: {
              xPath.setAttribute('d', `M${startX} ${padding + 2 * (innerHeight / size)} L${endX} ${padding + 6 * (innerHeight / size)}`);
              createSubSymbol(svg, endX, padding + 6 * (innerHeight / size));
              break;
            }

            case 3: {
              xPath.setAttribute('d', `M${startX} ${padding + 3 * (innerHeight / size)} L${endX} ${padding + 7 * (innerHeight / size)}`);
              createSubSymbol(svg, endX, padding + 7 * (innerHeight / size));
              break;
            }

            case 4: {
              xPath.setAttribute('d', `M${startX} ${padding + 4 * (innerHeight / size)} L${endX} ${padding}`);
              createAddSymbol(svg, endX, padding);
              break;
            }

            case 5: {
              xPath.setAttribute('d', `M${startX} ${padding + 5 * (innerHeight / size)} L${endX} ${padding + 1 * (innerHeight / size)}`);
              createAddSymbol(svg, endX, padding + 1 * (innerHeight / size));
              break;
            }

            case 6: {
              xPath.setAttribute('d', `M${startX} ${padding + 6 * (innerHeight / size)} L${endX} ${padding + 2 * (innerHeight / size)}`);
              createAddSymbol(svg, endX, padding + 2 * (innerHeight / size));
              break;
            }

            case 7: {
              xPath.setAttribute('d', `M${startX} ${padding + 7 * (innerHeight / size)} L${endX} ${padding + 3 * (innerHeight / size)}`);
              createAddSymbol(svg, endX, padding + 3 * (innerHeight / size));
              break;
            }
          }

          break;
        }

        case 2: {
          const startX = x + stage * 160;
          const endX = startX + 88;

          switch (n) {
            case 0: {
              xPath.setAttribute('d', `M${startX} ${padding} L${endX} ${padding + 2 * (innerHeight / size)}`);
              createSubSymbol(svg, endX, padding + 2 * (innerHeight / size));
              break;
            }

            case 1: {
              xPath.setAttribute('d', `M${startX} ${padding + 1 * (innerHeight / size)} L${endX} ${padding + 3 * (innerHeight / size)}`);
              createSubSymbol(svg, endX, padding + 3 * (innerHeight / size));
              break;
            }

            case 2: {
              xPath.setAttribute('d', `M${startX} ${padding + 2 * (innerHeight / size)} L${endX} ${padding}`);
              createAddSymbol(svg, endX, padding);
              break;
            }

            case 3: {
              xPath.setAttribute('d', `M${startX} ${padding + 3 * (innerHeight / size)} L${endX} ${padding + 1 * (innerHeight / size)}`);
              createAddSymbol(svg, endX, padding + 1 * (innerHeight / size));
              break;
            }

            case 4: {
              xPath.setAttribute('d', `M${startX} ${padding + 4 * (innerHeight / size)} L${endX} ${padding + 6 * (innerHeight / size)}`);
              createSubSymbol(svg, endX, padding + 6 * (innerHeight / size));
              break;
            }

            case 5: {
              xPath.setAttribute('d', `M${startX} ${padding + 5 * (innerHeight / size)} L${endX} ${padding + 7 * (innerHeight / size)}`);
              createSubSymbol(svg, endX, padding + 7 * (innerHeight / size));
              break;
            }

            case 6: {
              xPath.setAttribute('d', `M${startX} ${padding + 6 * (innerHeight / size)} L${endX} ${padding + 4 * (innerHeight / size)}`);
              createAddSymbol(svg, endX, padding + 4 * (innerHeight / size));
              break;
            }

            case 7: {
              xPath.setAttribute('d', `M${startX} ${padding + 7 * (innerHeight / size)} L${endX} ${padding + 5 * (innerHeight / size)}`);
              createAddSymbol(svg, endX, padding + 5 * (innerHeight / size));
              break;
            }
          }

          break;
        }

        case 3: {
          const startX = x + stage * 248;
          const endX = startX + 88;

          switch (n) {
            case 0: {
              xPath.setAttribute('d', `M${startX} ${padding} L${endX} ${padding + 1 * (innerHeight / size)}`);
              createSubSymbol(svg, endX, padding + 1 * (innerHeight / size));
              break;
            }

            case 1: {
              xPath.setAttribute('d', `M${startX} ${padding + 1 * (innerHeight / size)} L${endX} ${padding}`);
              createAddSymbol(svg, endX, padding);
              break;
            }

            case 2: {
              xPath.setAttribute('d', `M${startX} ${padding + 2 * (innerHeight / size)} L${endX} ${padding + 3 * (innerHeight / size)}`);
              createSubSymbol(svg, endX, padding + 3 * (innerHeight / size));
              break;
            }

            case 3: {
              xPath.setAttribute('d', `M${startX} ${padding + 3 * (innerHeight / size)} L${endX} ${padding + 2 * (innerHeight / size)}`);
              createAddSymbol(svg, endX, padding + 2 * (innerHeight / size));
              break;
            }

            case 4: {
              xPath.setAttribute('d', `M${startX} ${padding + 4 * (innerHeight / size)} L${endX} ${padding + 5 * (innerHeight / size)}`);
              createSubSymbol(svg, endX, padding + 5 * (innerHeight / size));
              break;
            }

            case 5: {
              xPath.setAttribute('d', `M${startX} ${padding + 5 * (innerHeight / size)} L${endX} ${padding + 4 * (innerHeight / size)}`);
              createAddSymbol(svg, endX, padding + 4 * (innerHeight / size));
              break;
            }

            case 6: {
              xPath.setAttribute('d', `M${startX} ${padding + 6 * (innerHeight / size)} L${endX} ${padding + 7 * (innerHeight / size)}`);
              createSubSymbol(svg, endX, padding + 7 * (innerHeight / size));
              break;
            }

            case 7: {
              xPath.setAttribute('d', `M${startX} ${padding + 7 * (innerHeight / size)} L${endX} ${padding + 6 * (innerHeight / size)}`);
              createAddSymbol(svg, endX, padding + 6 * (innerHeight / size));
              break;
            }
          }

          break;
        }
      }

      xPath.setAttribute('stroke', baseColor);
      xPath.setAttribute('stroke-width', lineWidth.toString(10));
      xPath.setAttribute('stroke-linecap', lineCap);
      xPath.setAttribute('stroke-linejoin', lineJoin);
      xPath.setAttribute('fill', 'none');

      svg.appendChild(xPath);

      const rotationFactor = document.createElementNS(xmlns, 'path');

      switch (stage) {
        case 1: {
          const rx = x + innerWidth / 6;

          rotationFactor.setAttribute('d', `M${rx} ${y + 1} L${rx} ${y - 8} ${rx + 12} ${y + 1} L${rx} ${y + 8} ${rx} ${y + 1}`);
          rotationFactor.setAttribute('stroke', baseColor);
          rotationFactor.setAttribute('stroke-width', lineWidth.toString(10));
          rotationFactor.setAttribute('fill', 'none');

          svg.appendChild(rotationFactor);

          const w = document.createElementNS(xmlns, 'text');

          switch (n) {
            case 0: {
              w.textContent = '1';
              break;
            }

            case 1: {
              w.textContent = '1';
              break;
            }

            case 2: {
              w.textContent = '1';
              break;
            }

            case 3: {
              w.textContent = '1';
              break;
            }

            case 4: {
              w.textContent = '1';
              break;
            }

            case 5: {
              w.textContent = '1';
              break;
            }

            case 6: {
              w.textContent = 'W';
              break;
            }

            case 7: {
              w.textContent = 'W';
              break;
            }
          }

          w.setAttribute('x', (rx + 20).toString(10));
          w.setAttribute('y', (n * (innerHeight / size) + 12).toString(10));
          w.setAttribute('text-anchor', 'middle');
          w.setAttribute('stroke', 'none');
          w.setAttribute('fill', baseColor);
          w.setAttribute('font-size', '16px');

          svg.appendChild(w);

          if (n === 6 || n === 7) {
            const w_n = document.createElementNS(xmlns, 'text');

            w_n.textContent = '2';

            w_n.setAttribute('x', (rx + 32).toString(10));
            w_n.setAttribute('y', (n * (innerHeight / size) + 4).toString(10));
            w_n.setAttribute('text-anchor', 'middle');
            w_n.setAttribute('stroke', 'none');
            w_n.setAttribute('fill', baseColor);
            w_n.setAttribute('font-size', '12px');

            svg.appendChild(w_n);
          }

          break;
        }

        case 2: {
          const rx = x + innerWidth / 3 + 160;

          rotationFactor.setAttribute('d', `M${rx} ${y + 1} L${rx} ${y - 8} ${rx + 12} ${y + 1} L${rx} ${y + 8} ${rx} ${y + 1}`);
          rotationFactor.setAttribute('stroke', baseColor);
          rotationFactor.setAttribute('stroke-width', lineWidth.toString(10));
          rotationFactor.setAttribute('fill', 'none');

          svg.appendChild(rotationFactor);

          const w = document.createElementNS(xmlns, 'text');

          switch (n) {
            case 0: {
              w.textContent = '1';
              break;
            }

            case 1: {
              w.textContent = '1';
              break;
            }

            case 2: {
              w.textContent = '1';
              break;
            }

            case 3: {
              w.textContent = 'W';

              const w_n = document.createElementNS(xmlns, 'text');

              w_n.textContent = '2';

              w_n.setAttribute('x', (rx + 32).toString(10));
              w_n.setAttribute('y', (n * (innerHeight / size) + 4).toString(10));
              w_n.setAttribute('text-anchor', 'middle');
              w_n.setAttribute('stroke', 'none');
              w_n.setAttribute('fill', baseColor);
              w_n.setAttribute('font-size', '12px');

              svg.appendChild(w_n);
              break;
            }

            case 4: {
              w.textContent = '1';
              break;
            }

            case 5: {
              w.textContent = 'W';
              break;
            }

            case 6: {
              w.textContent = '1';
              break;
            }

            case 7: {
              w.textContent = 'W';

              const w_n = document.createElementNS(xmlns, 'text');

              w_n.textContent = '3';

              w_n.setAttribute('x', (rx + 32).toString(10));
              w_n.setAttribute('y', (n * (innerHeight / size) + 4).toString(10));
              w_n.setAttribute('text-anchor', 'middle');
              w_n.setAttribute('stroke', 'none');
              w_n.setAttribute('fill', baseColor);
              w_n.setAttribute('font-size', '12px');

              svg.appendChild(w_n);
              break;
            }
          }

          w.setAttribute('x', (rx + 20).toString(10));
          w.setAttribute('y', (n * (innerHeight / size) + 12).toString(10));
          w.setAttribute('text-anchor', 'middle');
          w.setAttribute('stroke', 'none');
          w.setAttribute('fill', baseColor);
          w.setAttribute('font-size', '16px');

          svg.appendChild(w);
          break;
        }
      }
    }

    if (n !== 0 && n !== 7) {
      const sortIndexPath = document.createElementNS(xmlns, 'path');

      const startX = innerWidth - 140;
      const endX = startX + 88;

      switch (n) {
        case 1: {
          sortIndexPath.setAttribute('d', `M${startX} ${padding + 1 * (innerHeight / size)} L${endX} ${padding + 4 * (innerHeight / size)}`);
          break;
        }

        case 3: {
          sortIndexPath.setAttribute('d', `M${startX} ${padding + 3 * (innerHeight / size)} L${endX} ${padding + 6 * (innerHeight / size)}`);
          break;
        }

        case 4: {
          sortIndexPath.setAttribute('d', `M${startX} ${padding + 4 * (innerHeight / size)} L${endX} ${padding + 1 * (innerHeight / size)}`);
          break;
        }

        case 6: {
          sortIndexPath.setAttribute('d', `M${startX} ${padding + 6 * (innerHeight / size)} L${endX} ${padding + 3 * (innerHeight / size)}`);
          break;
        }
      }

      sortIndexPath.setAttribute('stroke', baseColor);
      sortIndexPath.setAttribute('stroke-width', lineWidth.toString(10));
      sortIndexPath.setAttribute('stroke-dasharray', '5,5');
      sortIndexPath.setAttribute('stroke-linecap', lineCap);
      sortIndexPath.setAttribute('stroke-linejoin', lineJoin);
      sortIndexPath.setAttribute('fill', 'none');

      svg.appendChild(sortIndexPath);
    }
  }
};

const visualSpectrum = (svgTime, svgSpectrum) => {
  const gain = new GainNode(audiocontext);
  const analyser = new AnalyserNode(audiocontext, { fftSize: 16384 });

  analyser.smoothingTimeConstant = 0.3;

  const buttonElement = document.getElementById('button-spectrum');

  const width = Number(svgTime.getAttribute('width'));
  const height = Number(svgTime.getAttribute('height'));

  const padding = 32;

  const innerWidth = width - 2 * padding;
  const innerHeight = height - 2 * padding;
  const innerBottom = height - padding;

  const middle = innerHeight / 2 + padding;

  const rectTop = document.createElementNS(xmlns, 'rect');

  rectTop.setAttribute('x', padding.toString(10));
  rectTop.setAttribute('y', (padding - 1).toString(10));
  rectTop.setAttribute('width', innerWidth.toString(10));
  rectTop.setAttribute('height', lineWidth.toString(10));
  rectTop.setAttribute('stroke', 'none');
  rectTop.setAttribute('fill', alphaBaseColor);

  svgTime.appendChild(rectTop);

  const rectMiddle = document.createElementNS(xmlns, 'rect');

  rectMiddle.setAttribute('x', padding.toString(10));
  rectMiddle.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
  rectMiddle.setAttribute('width', innerWidth.toString(10));
  rectMiddle.setAttribute('height', lineWidth.toString(10));
  rectMiddle.setAttribute('stroke', 'none');
  rectMiddle.setAttribute('fill', baseColor);

  svgTime.appendChild(rectMiddle);

  const rectBottom = document.createElementNS(xmlns, 'rect');

  rectBottom.setAttribute('x', padding.toString(10));
  rectBottom.setAttribute('y', (padding + innerHeight - 1).toString(10));
  rectBottom.setAttribute('width', innerWidth.toString(10));
  rectBottom.setAttribute('height', lineWidth.toString(10));
  rectBottom.setAttribute('stroke', 'none');
  rectBottom.setAttribute('fill', alphaBaseColor);

  svgTime.appendChild(rectBottom);

  const rectTopSpectrum = document.createElementNS(xmlns, 'rect');

  rectTopSpectrum.setAttribute('x', padding.toString(10));
  rectTopSpectrum.setAttribute('y', (padding - 1).toString(10));
  rectTopSpectrum.setAttribute('width', innerWidth.toString(10));
  rectTopSpectrum.setAttribute('height', lineWidth.toString(10));
  rectTopSpectrum.setAttribute('stroke', 'none');
  rectTopSpectrum.setAttribute('fill', alphaBaseColor);

  svgSpectrum.appendChild(rectTopSpectrum);

  const rectMiddleSpectrum = document.createElementNS(xmlns, 'rect');

  rectMiddleSpectrum.setAttribute('x', padding.toString(10));
  rectMiddleSpectrum.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
  rectMiddleSpectrum.setAttribute('width', innerWidth.toString(10));
  rectMiddleSpectrum.setAttribute('height', lineWidth.toString(10));
  rectMiddleSpectrum.setAttribute('stroke', 'none');
  rectMiddleSpectrum.setAttribute('fill', alphaBaseColor);

  svgSpectrum.appendChild(rectMiddleSpectrum);

  const rectBottomSpectrum = document.createElementNS(xmlns, 'rect');

  rectBottomSpectrum.setAttribute('x', padding.toString(10));
  rectBottomSpectrum.setAttribute('y', (padding + innerHeight - 1).toString(10));
  rectBottomSpectrum.setAttribute('width', innerWidth.toString(10));
  rectBottomSpectrum.setAttribute('height', lineWidth.toString(10));
  rectBottomSpectrum.setAttribute('stroke', 'none');
  rectBottomSpectrum.setAttribute('fill', baseColor);

  svgSpectrum.appendChild(rectBottomSpectrum);

  [' 1.0', ' 0.0', '-1.0'].forEach((text) => {
    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = text;

    yText.setAttribute('x', (padding - 16).toString(10));

    switch (text) {
      case ' 1.0': {
        yText.setAttribute('y', (padding - 4).toString(10));
        break;
      }

      case ' 0.0': {
        yText.setAttribute('y', (padding + innerHeight / 2 - 4).toString(10));
        break;
      }

      case '-1.0': {
        yText.setAttribute('y', (padding + innerHeight - 4).toString(10));
        break;
      }
    }

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '16px');

    svgTime.appendChild(yText);
  });

  ['1.0', '0.5', '0.0'].forEach((text) => {
    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = text;

    yText.setAttribute('x', (padding - 16).toString(10));

    switch (text) {
      case '1.0': {
        yText.setAttribute('y', (padding - 4).toString(10));
        break;
      }

      case '0.5': {
        yText.setAttribute('y', (padding + innerHeight / 2 - 4).toString(10));
        break;
      }

      case '0.0': {
        yText.setAttribute('y', (padding + innerHeight - 4).toString(10));
        break;
      }
    }

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '16px');

    svgSpectrum.appendChild(yText);
  });

  const pathTime = document.createElementNS(xmlns, 'path');

  pathTime.setAttribute('stroke', waveColor);
  pathTime.setAttribute('fill', 'none');
  pathTime.setAttribute('stroke-width', lineWidth.toString(10));
  pathTime.setAttribute('stroke-linecap', lineCap);
  pathTime.setAttribute('stroke-linejoin', lineJoin);

  svgTime.appendChild(pathTime);

  const pathSpectrum = document.createElementNS(xmlns, 'path');

  pathSpectrum.setAttribute('stroke', waveColor);
  pathSpectrum.setAttribute('fill', 'none');
  pathSpectrum.setAttribute('stroke-width', lineWidth.toString(10));
  pathSpectrum.setAttribute('stroke-linecap', lineCap);
  pathSpectrum.setAttribute('stroke-linejoin', lineJoin);

  svgSpectrum.appendChild(pathSpectrum);

  let timerId = null;

  const drawOscillator = () => {
    const times = new Float32Array(analyser.fftSize);
    const spectrums = new Uint8Array(analyser.frequencyBinCount);

    analyser.getFloatTimeDomainData(times);
    analyser.getByteFrequencyData(spectrums);

    pathTime.removeAttribute('d');
    pathSpectrum.removeAttribute('d');

    let d = '';

    for (let n = 0, len = times.length / 32; n < len; n++) {
      const x = (n / len) * innerWidth + padding;
      const y = (1 - times[n]) * (innerHeight / 2) + padding;

      if (n === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    pathTime.setAttribute('d', d);

    d = '';

    for (let k = 0, len = spectrums.length / 4; k < len; k++) {
      const x = k * (audiocontext.sampleRate / analyser.fftSize) * (innerWidth / len) + padding;
      const y = (255 - spectrums[k] * gain.gain.value) * (innerHeight / 255) + padding;

      if (k === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }

      if (k % 128 === 0) {
        const hz = document.createElementNS(xmlns, 'text');

        hz.textContent = `${Math.trunc(k * (audiocontext.sampleRate / analyser.fftSize))} Hz`;

        hz.setAttribute('x', x.toString(10));
        hz.setAttribute('y', (innerHeight + padding + 20).toString(10));
        hz.setAttribute('text-anchor', 'middle');
        hz.setAttribute('stroke', 'none');
        hz.setAttribute('fill', baseColor);
        hz.setAttribute('font-size', '16px');

        svgSpectrum.appendChild(hz);
      }
    }

    pathSpectrum.setAttribute('d', d);

    timerId = window.setTimeout(drawOscillator, 250);
  };

  let type = 'sine';
  let frequency = document.getElementById('range-frequency-spectrum').valueAsNumber;
  let detune = document.getElementById('range-detune-spectrum').valueAsNumber;

  let oscillator = null;

  let currentTime = 0;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      oscillator.stop(0);
      oscillator = null;
    }

    oscillator = new OscillatorNode(audiocontext);

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.detune.value = detune;

    // OscillatorNode (Input) -> GainNode -> AnalyserNode -> AudioDestinationNode (Output)
    oscillator.connect(gain);
    gain.connect(analyser);
    analyser.connect(audiocontext.destination);

    oscillator.start(0);

    buttonElement.textContent = 'stop';

    drawOscillator();
  };

  const onUp = () => {
    if (oscillator === null) {
      return;
    }

    oscillator.stop(0);
    oscillator = null;

    buttonElement.textContent = 'start';

    if (timerId) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  document.getElementById('form-oscillator-type-spectrum').addEventListener('change', (event) => {
    const radios = event.currentTarget.elements['radio-oscillator-type-spectrum'];

    for (const radio of radios) {
      if (radio.checked) {
        type = radio.value;

        if (oscillator) {
          oscillator.type = type;
        }

        break;
      }
    }
  });

  document.getElementById('range-gain-spectrum').addEventListener('input', (event) => {
    gain.gain.value = event.currentTarget.valueAsNumber;
  });

  document.getElementById('range-frequency-spectrum').addEventListener('input', (event) => {
    frequency = event.currentTarget.valueAsNumber;

    if (oscillator) {
      oscillator.frequency.value = frequency;
    }
  });

  document.getElementById('range-detune-spectrum').addEventListener('input', (event) => {
    detune = event.currentTarget.valueAsNumber;

    if (oscillator) {
      oscillator.detune.value = detune;
    }
  });
};

const vibrato = () => {
  let oscillator = null;
  let lfo = null;
  let depth = null;

  let frequency = 440;
  let depthRate = 0.1;
  let rateValue = 1;

  const buttonElement = document.getElementById('button-vibrato');

  const rangeFrequencyElement = document.getElementById('range-oscillator-frequency');
  const rangeDepthElement = document.getElementById('range-lfo-depth');
  const rangeRateElement = document.getElementById('range-lfo-rate');

  const spanPrintFrequencyElement = document.getElementById('print-oscillator-frequency-value');
  const spanPrintDepthElement = document.getElementById('print-lfo-depth-value');
  const spanPrintRateElement = document.getElementById('print-lfo-rate-value');

  const onDown = (event) => {
    if (oscillator !== null || lfo !== null) {
      return;
    }

    oscillator = new OscillatorNode(audiocontext, { frequency });
    lfo = new OscillatorNode(audiocontext, { frequency: rateValue });
    depth = new GainNode(audiocontext, { gain: oscillator.frequency.value * depthRate });

    oscillator.connect(audiocontext.destination);

    lfo.connect(depth);
    depth.connect(oscillator.frequency);

    oscillator.start(0);
    lfo.start(0);

    buttonElement.textContent = 'stop';
  };

  const onUp = (event) => {
    if (oscillator === null || lfo === null) {
      return;
    }

    oscillator.stop(0);
    lfo.stop(0);

    oscillator = null;
    lfo = null;
    depth = null;

    buttonElement.textContent = 'start';
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  rangeFrequencyElement.addEventListener('input', (event) => {
    frequency = event.currentTarget.valueAsNumber;

    if (oscillator && depth) {
      oscillator.frequency.value = frequency;
      depth.gain.value = oscillator.frequency.value * depthRate;
    }

    spanPrintFrequencyElement.textContent = `${Math.trunc(frequency * 10) / 10} Hz`;
  });

  rangeDepthElement.addEventListener('input', (event) => {
    depthRate = event.currentTarget.valueAsNumber;

    if (oscillator && depth) {
      depth.gain.value = oscillator.frequency.value * depthRate;
    }

    spanPrintDepthElement.textContent = depthRate.toString(10);
  });

  rangeRateElement.addEventListener('input', (event) => {
    rateValue = event.currentTarget.valueAsNumber;

    if (lfo) {
      lfo.frequency.value = rateValue;
    }

    spanPrintRateElement.textContent = Math.trunc(rateValue).toString(10);
  });
};

const animateFeedback = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const xRect = document.createElementNS(xmlns, 'rect');

  xRect.setAttribute('x', (padding / 2).toString(10));
  xRect.setAttribute('y', (padding + innerHeight - 1).toString(10));
  xRect.setAttribute('width', (innerWidth + padding).toString(10));
  xRect.setAttribute('height', lineWidth.toString(10));
  xRect.setAttribute('stroke', 'none');
  xRect.setAttribute('fill', baseColor);

  svg.appendChild(xRect);

  const yRect = document.createElementNS(xmlns, 'rect');

  yRect.setAttribute('x', (padding - 1).toString(10));
  yRect.setAttribute('y', padding.toString(10));
  yRect.setAttribute('width', lineWidth.toString(10));
  yRect.setAttribute('height', innerHeight.toString(10));
  yRect.setAttribute('stroke', 'none');
  yRect.setAttribute('fill', baseColor);

  svg.appendChild(yRect);

  if (svg.getAttribute('data-parameters') === 'true') {
    const xText = document.createElementNS(xmlns, 'text');

    xText.textContent = 'Time';

    xText.setAttribute('x', (innerWidth + padding).toString(10));
    xText.setAttribute('y', (padding + innerHeight - 8).toString(10));

    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '20px');

    svg.appendChild(xText);

    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = 'Amplitude';

    yText.setAttribute('x', padding.toString(10));
    yText.setAttribute('y', padding.toString(10));

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '20px');

    svg.appendChild(yText);
  }

  const gains = [1.0, 0.5, 0.25, 0.125, 0.0625];

  const renderGainRect = (gain, index) => {
    const g = document.createElementNS(xmlns, 'g');

    g.classList.add('svg-feedback-rects');

    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', (padding + (innerWidth / gains.length) * index).toString(10));
    rect.setAttribute('y', (padding + (1 - gain) * innerHeight).toString(10));
    rect.setAttribute('width', '4');
    rect.setAttribute('height', (gain * innerHeight).toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', waveColor);

    const text = document.createElementNS(xmlns, 'text');

    if (index === 0) {
      text.textContent = '0';
    } else if (index === 1) {
      text.textContent = 'delayTime';
    } else if (index === 4) {
      text.textContent = `${index} x delayTime ...`;
    } else {
      text.textContent = `${index} x delayTime`;
    }

    text.setAttribute('x', (padding + (innerWidth / 5) * index).toString(10));
    text.setAttribute('y', (padding + innerHeight + 20).toString(10));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '16px');

    g.appendChild(rect);
    g.appendChild(text);

    svg.appendChild(g);
  };

  gains.forEach((gain, index) => {
    renderGainRect(gain, index);
  });

  let intervalId = null;

  document.getElementById('button-feedback-animation').addEventListener('click', (event) => {
    const feedbackRects = document.querySelectorAll('.svg-feedback-rects');

    for (const feedbackRect of feedbackRects) {
      svg.removeChild(feedbackRect);
    }

    const buttonElement = event.currentTarget;

    buttonElement.setAttribute('disabled', 'disabled');

    let index = 0;

    intervalId = window.setInterval(() => {
      if (index < gains.length) {
        renderGainRect(gains[index], index++);
      } else {
        window.clearInterval(intervalId);
        intervalId = null;

        buttonElement.removeAttribute('disabled');
      }
    }, 500);
  });
};

const createAudioNode = (name, x, y, w = 300, h = 100) => {
  const g = document.createElementNS(xmlns, 'g');

  const rect = document.createElementNS(xmlns, 'rect');
  const text = document.createElementNS(xmlns, 'text');

  rect.setAttribute('x', x.toString(10));
  rect.setAttribute('y', y.toString(10));
  rect.setAttribute('width', w.toString(10));
  rect.setAttribute('height', h.toString(10));
  rect.setAttribute('stroke', baseColor);
  rect.setAttribute('stroke-width', lineWidth.toString(10));
  rect.setAttribute('stroke-linecap', lineCap);
  rect.setAttribute('stroke-linejoin', lineJoin);
  rect.setAttribute('fill', white);

  text.textContent = name;

  text.setAttribute('x', (x + w / 2).toString(10));
  text.setAttribute('y', (y + h / 2 + 4).toString(10));
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('stroke', 'none');
  text.setAttribute('fill', baseColor);
  text.setAttribute('font-size', '20px');

  g.appendChild(rect);
  g.appendChild(text);

  return g;
};

const createAudioParam = (name, x, y, w = 80, h = 40) => {
  const g = document.createElementNS(xmlns, 'g');

  const ellipse = document.createElementNS(xmlns, 'ellipse');
  const text = document.createElementNS(xmlns, 'text');

  ellipse.setAttribute('cx', x.toString(10));
  ellipse.setAttribute('cy', y.toString(10));
  ellipse.setAttribute('rx', w.toString(10));
  ellipse.setAttribute('ry', h.toString(10));
  ellipse.setAttribute('stroke', baseColor);
  ellipse.setAttribute('stroke-width', lineWidth.toString(10));
  ellipse.setAttribute('stroke-linecap', lineCap);
  ellipse.setAttribute('stroke-linejoin', lineJoin);
  ellipse.setAttribute('fill', white);

  text.textContent = name;

  text.setAttribute('x', (x + 4).toString(10));
  text.setAttribute('y', (y + h / 2 - 14).toString(10));
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('stroke', 'none');
  text.setAttribute('fill', baseColor);
  text.setAttribute('font-size', '16px');

  g.appendChild(ellipse);
  g.appendChild(text);

  return g;
};

const createLFO = (x, y) => {
  const w = 300;
  const h = 100;

  const g = document.createElementNS(xmlns, 'g');

  const rect = document.createElementNS(xmlns, 'rect');

  const text = document.createElementNS(xmlns, 'text');
  const subText = document.createElementNS(xmlns, 'text');

  rect.setAttribute('x', x.toString(10));
  rect.setAttribute('y', y.toString(10));
  rect.setAttribute('width', w.toString(10));
  rect.setAttribute('height', h.toString(10));
  rect.setAttribute('stroke', baseColor);
  rect.setAttribute('stroke-width', lineWidth.toString(10));
  rect.setAttribute('stroke-linecap', lineCap);
  rect.setAttribute('stroke-linejoin', lineJoin);
  rect.setAttribute('fill', white);

  text.textContent = 'LFO';

  text.setAttribute('x', (x + w / 2).toString(10));
  text.setAttribute('y', (y + h / 2 - 4).toString(10));
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('stroke', 'none');
  text.setAttribute('fill', baseColor);
  text.setAttribute('font-size', '20px');
  text.textContent = 'LFO';

  subText.textContent = '(OscillatorNode -> GainNode)';

  subText.setAttribute('x', (x + w / 2).toString(10));
  subText.setAttribute('y', (y + h / 2 + 16).toString(10));
  subText.setAttribute('text-anchor', 'middle');
  subText.setAttribute('stroke', 'none');
  subText.setAttribute('fill', baseColor);
  subText.setAttribute('font-size', '16px');

  g.appendChild(rect);
  g.appendChild(text);
  g.appendChild(subText);

  return g;
};

const createConnection = (startX, startY, endX, endY, color = waveColor) => {
  const path = document.createElementNS(xmlns, 'path');

  const d = `M${startX} ${startY} L${endX} ${endY}`;

  path.setAttribute('d', d);
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', '4');
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  return path;
};

const createConnectionArrow = (posX, posY, direction = 'down', color = waveColor) => {
  const path = document.createElementNS(xmlns, 'path');

  switch (direction) {
    case 'down': {
      const d = `M${posX} ${posY} L${posX + 8} ${posY} L${posX} ${posY + 12} L${posX - 8} ${posY} L${posX} ${posY}`;

      path.setAttribute('d', d);
      break;
    }

    case 'up': {
      const d = `M${posX} ${posY} L${posX + 8} ${posY} L${posX} ${posY - 12} L${posX - 8} ${posY} L${posX} ${posY}`;

      path.setAttribute('d', d);
      break;
    }

    case 'left': {
      const d = `M${posX} ${posY} L${posX} ${posY + 8} L${posX - 12} ${posY} L${posX} ${posY - 8} L${posX} ${posY}`;

      path.setAttribute('d', d);
      break;
    }

    case 'right': {
      const d = `M${posX} ${posY} L${posX} ${posY + 8} L${posX + 12} ${posY} L${posX} ${posY - 8} L${posX} ${posY}`;

      path.setAttribute('d', d);
      break;
    }
  }

  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', '4');
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);
  path.setAttribute('fill', color);

  return path;
};

const createNodeConnectionsForDelay = (svg) => {
  const g = document.createElementNS(xmlns, 'g');

  const oscillatorNodeRect = createAudioNode('OscillatorNode', 0, 0);
  const dryNodeRect = createAudioNode('GainNode (Dry)', 0, 200);
  const delayNodeRect = createAudioNode('DelayNode', 400, 100);
  const wetNodeRect = createAudioNode('GainNode (Wet)', 400, 300);
  const feedbackNodeRect = createAudioNode('GainNode (Feedback)', 800, 200);
  const audioDestinationNodeRect = createAudioNode('AudioDestinationNode', 0, 400);

  const oscillatorNodeAndDryPath = createConnection(150 - 2, 100, 150 - 2, 300);
  const dryAndAudiodDestinationNodePath = createConnection(150 - 2, 300, 150 - 2, 400);
  const delayNodeAndWetPath = createConnection(400 + (75 - 4), 200, 400 + (75 - 4), 300);

  const oscillatorNodeAndDelayNodePath1 = createConnection(300, 50 - 2, 400 + (75 - 4), 50 - 2);
  const oscillatorNodeAndDelayNodePath2 = createConnection(400 + (75 - 4), 50 - 2, 400 + (75 - 4), 100 - 2);

  const wetAndAudioDestiationNodePath1 = createConnection(400 + (75 - 4), 400 + 2, 400 + (75 - 4), 450 - 2);
  const wetAndAudioDestiationNodePath2 = createConnection(400 + (75 - 4), 450 - 2, 300, 450 - 2);

  const delayNodeAndFeedbackPath1 = createConnection(600, 200 + 2, 600, 250 - 2);
  const delayNodeAndFeedbackPath2 = createConnection(600, 250 - 2, 800, 250 - 2);

  const feedbackAndDelayNodePath1 = createConnection(925, 200 - 2, 925, 50 - 2);
  const feedbackAndDelayNodePath2 = createConnection(925, 50 - 2, 600, 50 - 2);
  const feedbackAndDelayNodePath3 = createConnection(600, 50 - 2, 600, 100 - 2);

  const oscillatorNodeAndDryArrow = createConnectionArrow(150 - 2, 200 - 14, 'down');
  const dryAndAudiodDestinationNodeArrow = createConnectionArrow(150 - 2, 400 - 14, 'down');

  const oscillatorNodeAndDelayNodeArrow = createConnectionArrow(475 - 4, 100 - 14, 'down');
  const delayNodeAndWetArrow = createConnectionArrow(400 + (75 - 4), 300 - 14, 'down');
  const wetAndAudioDestiationArrow = createConnectionArrow(300 + 14, 450 - 2, 'left');

  const delayNodeAndFeedbackArrow = createConnectionArrow(800 - 12, 250 - 2, 'right');
  const feedbackAndDelayNodeArrow = createConnectionArrow(600, 100 - 14, 'down');

  g.appendChild(oscillatorNodeRect);
  g.appendChild(oscillatorNodeAndDryPath);
  g.appendChild(dryNodeRect);
  g.appendChild(dryAndAudiodDestinationNodePath);
  g.appendChild(audioDestinationNodeRect);
  g.appendChild(delayNodeRect);
  g.appendChild(delayNodeAndWetPath);
  g.appendChild(wetNodeRect);
  g.appendChild(feedbackNodeRect);

  g.appendChild(oscillatorNodeAndDelayNodePath1);
  g.appendChild(oscillatorNodeAndDelayNodePath2);

  g.appendChild(wetAndAudioDestiationNodePath1);
  g.appendChild(wetAndAudioDestiationNodePath2);

  g.appendChild(delayNodeAndFeedbackPath1);
  g.appendChild(delayNodeAndFeedbackPath2);

  g.appendChild(feedbackAndDelayNodePath1);
  g.appendChild(feedbackAndDelayNodePath2);
  g.appendChild(feedbackAndDelayNodePath3);

  g.appendChild(oscillatorNodeAndDryArrow);
  g.appendChild(dryAndAudiodDestinationNodeArrow);

  g.appendChild(oscillatorNodeAndDelayNodeArrow);
  g.appendChild(delayNodeAndWetArrow);
  g.appendChild(wetAndAudioDestiationArrow);

  g.appendChild(delayNodeAndFeedbackArrow);
  g.appendChild(feedbackAndDelayNodeArrow);

  svg.appendChild(g);
};

const createNodeConnectionsForReverb = (svg) => {
  const g = document.createElementNS(xmlns, 'g');

  const oscillatorNodeRect = createAudioNode('OscillatorNode', 0, 0);
  const dryNodeRect = createAudioNode('GainNode (Dry)', 0, 200);
  const convolverNodeRect = createAudioNode('ConvolverNode', 400, 100);
  const wetNodeRect = createAudioNode('GainNode (Wet)', 400, 300);
  const audioDestinationNodeRect = createAudioNode('AudioDestinationNode', 0, 400);

  const oscillatorNodeAndDryPath = createConnection(150 - 2, 100, 150 - 2, 300);
  const dryAndAudiodDestinationNodePath = createConnection(150 - 2, 300, 150 - 2, 400);
  const convolverNodeAndWetPath = createConnection(550 - 2, 200, 550 - 2, 300);

  const oscillatorNodeAndConvolverNodeNodePath1 = createConnection(300, 50 - 2, 548, 50 - 2);
  const oscillatorNodeAndConvolverNodeNodePath2 = createConnection(548, 50 - 2, 548, 100 - 2);

  const wetAndAudioDestiationNodePath1 = createConnection(548, 400 + 2, 548, 450 - 2);
  const wetAndAudioDestiationNodePath2 = createConnection(548, 450 - 2, 300, 450 - 2);

  const oscillatorNodeAndDryArrow = createConnectionArrow(150 - 2, 200 - 14, 'down');
  const dryAndAudiodDestinationNodeArrow = createConnectionArrow(150 - 2, 400 - 14, 'down');

  const oscillatorNodeAndConvolverNodeNodeArrow = createConnectionArrow(548, 100 - 14, 'down');
  const convolverNodeAndWetArrow = createConnectionArrow(548, 300 - 14, 'down');
  const wetAndAudioDestiationArrow = createConnectionArrow(300 + 14, 450 - 2, 'left');

  g.appendChild(oscillatorNodeRect);
  g.appendChild(oscillatorNodeAndDryPath);
  g.appendChild(dryNodeRect);
  g.appendChild(dryAndAudiodDestinationNodePath);
  g.appendChild(audioDestinationNodeRect);
  g.appendChild(convolverNodeRect);
  g.appendChild(convolverNodeAndWetPath);
  g.appendChild(wetNodeRect);

  g.appendChild(oscillatorNodeAndConvolverNodeNodePath1);
  g.appendChild(oscillatorNodeAndConvolverNodeNodePath2);

  g.appendChild(wetAndAudioDestiationNodePath1);
  g.appendChild(wetAndAudioDestiationNodePath2);

  g.appendChild(oscillatorNodeAndDryArrow);
  g.appendChild(dryAndAudiodDestinationNodeArrow);

  g.appendChild(oscillatorNodeAndConvolverNodeNodeArrow);
  g.appendChild(convolverNodeAndWetArrow);
  g.appendChild(wetAndAudioDestiationArrow);

  svg.appendChild(g);
};

const createRIR = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const xRect = document.createElementNS(xmlns, 'rect');

  xRect.setAttribute('x', (padding / 2).toString(10));
  xRect.setAttribute('y', (padding + innerHeight - 1).toString(10));
  xRect.setAttribute('width', (innerWidth + padding).toString(10));
  xRect.setAttribute('height', lineWidth.toString(10));
  xRect.setAttribute('stroke', 'none');
  xRect.setAttribute('fill', baseColor);

  svg.appendChild(xRect);

  const yRect = document.createElementNS(xmlns, 'rect');

  yRect.setAttribute('x', (padding - 1).toString(10));
  yRect.setAttribute('y', padding.toString(10));
  yRect.setAttribute('width', lineWidth.toString(10));
  yRect.setAttribute('height', innerHeight.toString(10));
  yRect.setAttribute('stroke', 'none');
  yRect.setAttribute('fill', baseColor);

  svg.appendChild(yRect);

  if (svg.getAttribute('data-parameters') === 'true') {
    const xText = document.createElementNS(xmlns, 'text');

    xText.textContent = 'Time';

    xText.setAttribute('x', (innerWidth + padding).toString(10));
    xText.setAttribute('y', (padding + innerHeight - 8).toString(10));

    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '20px');

    svg.appendChild(xText);

    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = 'Amplitude';

    yText.setAttribute('x', padding.toString(10));
    yText.setAttribute('y', padding.toString(10));

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '20px');

    svg.appendChild(yText);
  }

  const rect = document.createElementNS(xmlns, 'rect');

  rect.setAttribute('x', (padding + 120).toString(10));
  rect.setAttribute('y', (padding + 12).toString(10));
  rect.setAttribute('width', '4');
  rect.setAttribute('height', (innerHeight - 12).toString(10));
  rect.setAttribute('stroke', 'none');
  rect.setAttribute('fill', waveColor);

  const text = document.createElementNS(xmlns, 'text');

  text.textContent = '∞';

  text.setAttribute('x', (padding + 120).toString(10));
  text.setAttribute('y', padding.toString(10));
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('stroke', 'none');
  text.setAttribute('fill', baseColor);
  text.setAttribute('font-size', '24px');

  svg.appendChild(rect);
  svg.appendChild(text);
};

const animateRIR = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const xRect = document.createElementNS(xmlns, 'rect');

  xRect.setAttribute('x', (padding / 2).toString(10));
  xRect.setAttribute('y', (padding + innerHeight - 1).toString(10));
  xRect.setAttribute('width', (innerWidth + padding).toString(10));
  xRect.setAttribute('height', lineWidth.toString(10));
  xRect.setAttribute('stroke', 'none');
  xRect.setAttribute('fill', baseColor);

  svg.appendChild(xRect);

  const yRect = document.createElementNS(xmlns, 'rect');

  yRect.setAttribute('x', (padding - 1).toString(10));
  yRect.setAttribute('y', padding.toString(10));
  yRect.setAttribute('width', lineWidth.toString(10));
  yRect.setAttribute('height', innerHeight.toString(10));
  yRect.setAttribute('stroke', 'none');
  yRect.setAttribute('fill', baseColor);

  svg.appendChild(yRect);

  if (svg.getAttribute('data-parameters') === 'true') {
    const xText = document.createElementNS(xmlns, 'text');

    xText.textContent = 'Time';

    xText.setAttribute('x', (innerWidth + padding).toString(10));
    xText.setAttribute('y', (padding + innerHeight - 8).toString(10));

    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '20px');

    svg.appendChild(xText);

    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = 'Amplitude';

    yText.setAttribute('x', padding.toString(10));
    yText.setAttribute('y', padding.toString(10));

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '20px');

    svg.appendChild(yText);
  }

  const amplitudes = [1.0, 0.8, 0.7, 0.5, 0.6, 0.45, 0.3, 0.4, 0.325, 0.2, 0.1, 0.0625, 0.05, 0.025, 0.02];

  const renderRIRRect = (amplitude, index) => {
    const rect = document.createElementNS(xmlns, 'rect');

    rect.classList.add('svg-response-rects');

    rect.setAttribute('x', (padding + (innerWidth / amplitudes.length) * index).toString(10));
    rect.setAttribute('y', (padding + (1 - amplitude) * innerHeight).toString(10));
    rect.setAttribute('width', '4');
    rect.setAttribute('height', (amplitude * innerHeight).toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', waveColor);

    svg.appendChild(rect);
  };

  amplitudes.forEach((amplitude, index) => {
    renderRIRRect(amplitude, index);
  });

  let intervalId = null;

  document.getElementById('button-impulse-response-animation').addEventListener('click', (event) => {
    const feedbackRects = document.querySelectorAll('.svg-response-rects');

    for (const feedbackRect of feedbackRects) {
      svg.removeChild(feedbackRect);
    }

    const buttonElement = event.currentTarget;

    buttonElement.setAttribute('disabled', 'disabled');

    let index = 0;

    intervalId = window.setInterval(() => {
      if (index < amplitudes.length) {
        renderRIRRect(amplitudes[index], index++);
      } else {
        window.clearInterval(intervalId);
        intervalId = null;

        buttonElement.removeAttribute('disabled');
      }
    }, 250);
  });
};

const renderRIR = async (svg) => {
  const response = await fetch('./assets/rirs/rir.mp3');
  const arraybuffer = await response.arrayBuffer();
  const audioBuffer = await audiocontext.decodeAudioData(arraybuffer);

  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  createCoordinateRect(svg);

  const path = document.createElementNS(xmlns, 'path');

  path.setAttribute('stroke', waveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  const rect = document.createElementNS(xmlns, 'rect');

  rect.setAttribute('x', padding);
  rect.setAttribute('y', padding);
  rect.setAttribute('width', lineWidth.toString(10));
  rect.setAttribute('height', innerHeight);
  rect.setAttribute('stroke', 'none');
  rect.setAttribute('fill', alphaBaseColor);

  svg.appendChild(path);
  svg.appendChild(rect);

  const drawRIROverview = () => {
    const times = audioBuffer.getChannelData(0);

    path.removeAttribute('d');

    let d = '';

    for (let n = 0, len = times.length; n < len; n++) {
      if (n !== 0 && n % 4 !== 0) {
        continue;
      }

      const x = (n / len) * innerWidth + padding;
      const y = (1 - times[n] * 10) * (innerHeight / 2) + padding;

      if (n === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    path.setAttribute('d', d);
  };

  drawRIROverview();

  let startTime = 0;
  let animationId = null;

  const updateCurrentTime = () => {
    const currentTime = audiocontext.currentTime - startTime;

    const translateX = (currentTime / audioBuffer.duration) * innerWidth;

    rect.setAttribute('transform', `translate(${translateX} 0)`);

    animationId = window.requestAnimationFrame(updateCurrentTime);
  };

  let source = null;

  const buttonElement = document.getElementById('button-rir');

  const onDown = async () => {
    buttonElement.setAttribute('disabled', 'disabled');

    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    source = new AudioBufferSourceNode(audiocontext, { buffer: audioBuffer });

    source.connect(audiocontext.destination);

    source.start(0);

    startTime = audiocontext.currentTime;

    updateCurrentTime();

    source.onended = () => {
      if (source === null) {
        return;
      }

      buttonElement.removeAttribute('disabled');

      source.stop(0);

      source = null;

      window.cancelAnimationFrame(animationId);
    };
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
};

const createConvolution = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  for (let i = 1; i <= 3; i++) {
    const g = document.createElementNS(xmlns, 'g');

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (padding / 2).toString(10));
    xRect.setAttribute('y', (padding * i - 1 + (innerHeight / 4) * i).toString(10));
    xRect.setAttribute('width', (innerWidth + padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (padding - 1).toString(10));
    yRect.setAttribute('y', (padding * i + (innerHeight / 4) * (i - 1)).toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', (innerHeight / 4).toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    const xText = document.createElementNS(xmlns, 'text');

    switch (i) {
      case 1: {
        xText.textContent = 'Time (n - m)';
        break;
      }

      case 2: {
        xText.textContent = 'Time (m)';
        break;
      }

      case 3: {
        xText.textContent = 'Time (n)';
        break;
      }
    }

    xText.setAttribute('x', (innerWidth + padding).toString(10));
    xText.setAttribute('y', (padding * i + (innerHeight / 4) * i - 8).toString(10));

    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '20px');

    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = 'Amplitude';

    yText.setAttribute('x', padding.toString(10));
    yText.setAttribute('y', (padding * i + (innerHeight / 4) * (i - 1) - 8).toString(10));

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '20px');

    const amplitudeTexts = document.createElementNS(xmlns, 'g');

    if (i < 3) {
      ['1.0', '0.5', '0.0'].forEach((amplitude) => {
        const amplitudeText = document.createElementNS(xmlns, 'text');

        amplitudeText.textContent = amplitude;

        amplitudeText.setAttribute('x', (padding - 16).toString(10));
        amplitudeText.setAttribute('y', (padding * i + (innerHeight / 4) * (i - 1) + (innerHeight / 4) * (1 - Number(amplitude)) + 16).toString(10));

        amplitudeText.setAttribute('text-anchor', 'middle');
        amplitudeText.setAttribute('stroke', 'none');
        amplitudeText.setAttribute('fill', baseColor);
        amplitudeText.setAttribute('font-size', '16px');

        amplitudeTexts.appendChild(amplitudeText);
      });
    } else {
      ['3.0', '2.0', '1.0', '0.0'].forEach((amplitude) => {
        const amplitudeText = document.createElementNS(xmlns, 'text');

        amplitudeText.textContent = amplitude;

        amplitudeText.setAttribute('x', (padding - 16).toString(10));
        amplitudeText.setAttribute('y', (padding * i + (innerHeight / 4) * (i - 1) + (innerHeight / 4) * (1 - Number(amplitude) / 3) + 16).toString(10));

        amplitudeText.setAttribute('text-anchor', 'middle');
        amplitudeText.setAttribute('stroke', 'none');
        amplitudeText.setAttribute('fill', baseColor);
        amplitudeText.setAttribute('font-size', '16px');

        amplitudeTexts.appendChild(amplitudeText);
      });
    }

    g.appendChild(xRect);
    g.appendChild(yRect);
    g.appendChild(xText);
    g.appendChild(yText);
    g.appendChild(amplitudeTexts);

    svg.appendChild(g);
  }

  const inputRects = document.createElementNS(xmlns, 'g');

  [1, 1, 1, 1, 1, 1].forEach((amplitude, index) => {
    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', (padding - 1 + (innerWidth / 6) * index).toString(10));
    rect.setAttribute('y', padding.toString(10));
    rect.setAttribute('width', '4');
    rect.setAttribute('height', ((innerHeight / 4) * amplitude).toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', waveColor);

    inputRects.appendChild(rect);
  });

  svg.appendChild(inputRects);

  const rirRects = document.createElementNS(xmlns, 'g');

  [1, 0.75, 0.5, 0.25, 0.125, 0.0625].forEach((amplitude, index) => {
    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', (padding - 1 + (innerWidth / 6) * index).toString(10));
    rect.setAttribute('y', (4 * padding + (1 - amplitude) * (innerHeight / 4)).toString(10));
    rect.setAttribute('width', '4');
    rect.setAttribute('height', ((innerHeight / 4) * amplitude).toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', waveColor);

    rirRects.appendChild(rect);
  });

  svg.appendChild(rirRects);

  const outputRects = document.createElementNS(xmlns, 'g');

  [1, 1.75, 2.25, 2.5, 2.625, 2.6875].forEach((amplitude, index) => {
    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', (padding - 1 + (innerWidth / 6) * index).toString(10));
    rect.setAttribute('y', (7 * padding + (1 - amplitude / 3) * (innerHeight / 4)).toString(10));
    rect.setAttribute('width', '4');
    rect.setAttribute('height', ((innerHeight / 4) * (amplitude / 3)).toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', lightWaveColor);

    outputRects.appendChild(rect);
  });

  svg.appendChild(outputRects);
};

const animateConvolution = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const interval = 1000;

  let intervalId = null;

  let time = 0;

  for (let i = 1; i <= 3; i++) {
    const g = document.createElementNS(xmlns, 'g');

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (padding / 2).toString(10));
    xRect.setAttribute('y', (padding * i - 1 + (innerHeight / 4) * i).toString(10));
    xRect.setAttribute('width', (innerWidth + padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (padding - 1).toString(10));
    yRect.setAttribute('y', (padding * i + (innerHeight / 4) * (i - 1)).toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', (innerHeight / 4).toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    const xText = document.createElementNS(xmlns, 'text');

    switch (i) {
      case 1: {
        xText.textContent = 'Time (n - m)';
        break;
      }

      case 2: {
        xText.textContent = 'Time (m)';
        break;
      }

      case 3: {
        xText.textContent = 'Time (n)';
        break;
      }
    }

    xText.setAttribute('x', (innerWidth + padding).toString(10));
    xText.setAttribute('y', (padding * i + (innerHeight / 4) * i - 8).toString(10));

    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '20px');

    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = 'Amplitude';

    yText.setAttribute('x', padding.toString(10));
    yText.setAttribute('y', (padding * i + (innerHeight / 4) * (i - 1) - 8).toString(10));

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '20px');

    const amplitudeTexts = document.createElementNS(xmlns, 'g');

    if (i < 3) {
      ['1.0', '0.5', '0.0'].forEach((amplitude) => {
        const amplitudeText = document.createElementNS(xmlns, 'text');

        amplitudeText.textContent = amplitude;

        amplitudeText.setAttribute('x', (padding - 16).toString(10));
        amplitudeText.setAttribute('y', (padding * i + (innerHeight / 4) * (i - 1) + (innerHeight / 4) * (1 - Number(amplitude)) + 16).toString(10));

        amplitudeText.setAttribute('text-anchor', 'middle');
        amplitudeText.setAttribute('stroke', 'none');
        amplitudeText.setAttribute('fill', baseColor);
        amplitudeText.setAttribute('font-size', '16px');

        amplitudeTexts.appendChild(amplitudeText);
      });
    } else {
      ['3.0', '2.0', '1.0', '0.0'].forEach((amplitude) => {
        const amplitudeText = document.createElementNS(xmlns, 'text');

        amplitudeText.textContent = amplitude;

        amplitudeText.setAttribute('x', (padding - 16).toString(10));
        amplitudeText.setAttribute('y', (padding * i + (innerHeight / 4) * (i - 1) + (innerHeight / 4) * (1 - Number(amplitude) / 3) + 16).toString(10));

        amplitudeText.setAttribute('text-anchor', 'middle');
        amplitudeText.setAttribute('stroke', 'none');
        amplitudeText.setAttribute('fill', baseColor);
        amplitudeText.setAttribute('font-size', '16px');

        amplitudeTexts.appendChild(amplitudeText);
      });
    }

    g.appendChild(xRect);
    g.appendChild(yRect);
    g.appendChild(xText);
    g.appendChild(yText);
    g.appendChild(amplitudeTexts);

    svg.appendChild(g);
  }

  const inputs = [1, 1, 1, 1, 1, 1];
  const rirs = [1, 0.75, 0.5, 0.25, 0.125, 0.0625];
  const outputs = [1, 1.75, 2.25, 2.5, 2.625, 2.6875];

  const paths = document.createElementNS(xmlns, 'g');

  const inputRects = document.createElementNS(xmlns, 'g');

  inputs.forEach((amplitude, index) => {
    const rect = document.createElementNS(xmlns, 'rect');

    const x = padding - 1 + (innerWidth / 6) * index;
    const y = padding;

    rect.setAttribute('x', x.toString(10));
    rect.setAttribute('y', y.toString(10));
    rect.setAttribute('width', '4');
    rect.setAttribute('height', ((innerHeight / 4) * amplitude).toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', waveColor);

    inputRects.appendChild(rect);

    if (index < 4) {
      const path = document.createElementNS(xmlns, 'path');

      const endX = padding - 1 + (innerWidth / 6) * (3 - index) + 1;
      const endY = 4 * padding;

      const m3startX = padding - 1 + (innerWidth / 6) * (3 - index) + 1;
      const m3startY = 4 * padding + (1 - rirs[3 - index]) * (innerHeight / 4);

      const m3endX = padding - 1 + (innerWidth / 6) * 3 + 1;
      const m3endY = 7 * padding + 20;

      path.setAttribute('d', `M${x} ${y + innerHeight / 4} L${endX} ${endY} L${m3startX} ${m3startY} L${m3endX} ${m3endY}`);

      path.setAttribute('stroke', baseColor);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-width', lineWidth.toString(10));
      path.setAttribute('stroke-linecap', lineCap);
      path.setAttribute('stroke-linejoin', lineJoin);
      path.setAttribute('stroke-dasharray', '5,5');

      paths.appendChild(path);
    }
  });

  svg.appendChild(inputRects);

  const rirRects = document.createElementNS(xmlns, 'g');

  rirs.forEach((amplitude, index) => {
    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', (padding - 1 + (innerWidth / 6) * index).toString(10));
    rect.setAttribute('y', (4 * padding + (1 - amplitude) * (innerHeight / 4)).toString(10));
    rect.setAttribute('width', '4');
    rect.setAttribute('height', ((innerHeight / 4) * amplitude).toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', waveColor);

    rirRects.appendChild(rect);
  });

  svg.appendChild(rirRects);

  const outputRects = document.createElementNS(xmlns, 'g');

  svg.appendChild(outputRects);

  const delayTextM = document.createElementNS(xmlns, 'text');
  const delayTextN = document.createElementNS(xmlns, 'text');

  delayTextM.setAttribute('x', (padding + innerWidth / 2).toString(10));
  delayTextM.setAttribute('y', (padding + 2 * (innerHeight / 3) + 12).toString(10));
  delayTextM.setAttribute('text-anchor', 'middle');
  delayTextM.setAttribute('stroke', 'none');
  delayTextM.setAttribute('fill', baseColor);
  delayTextM.setAttribute('font-size', '20px');

  delayTextN.setAttribute('x', (padding + innerWidth / 2).toString(10));
  delayTextN.setAttribute('y', (padding + innerHeight + 24).toString(10));
  delayTextN.setAttribute('text-anchor', 'middle');
  delayTextN.setAttribute('stroke', 'none');
  delayTextN.setAttribute('fill', baseColor);
  delayTextN.setAttribute('font-size', '20px');

  svg.appendChild(delayTextM);
  svg.appendChild(delayTextN);

  const m3rect = document.createElementNS(xmlns, 'rect');

  m3rect.setAttribute('x', (padding + innerWidth / 2).toString(10));
  m3rect.setAttribute('y', (2 * padding).toString(19));
  m3rect.setAttribute('width', '4');
  m3rect.setAttribute('height', `${600 - 2 * padding - 6}`);
  m3rect.setAttribute('stroke', 'none');
  m3rect.setAttribute('fill', alphaBaseColor);

  svg.appendChild(m3rect);

  const render = (time) => {
    const index = Math.trunc(time / interval);

    rirRects.setAttribute('transform', `translate(${(innerWidth / 6) * (3 - index)} 0)`);

    const amplitude = outputs[index];

    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', (padding - 1 + (innerWidth / 6) * index).toString(10));
    rect.setAttribute('y', (7 * padding + (1 - amplitude / 3) * (innerHeight / 4)).toString(10));
    rect.setAttribute('width', '4');
    rect.setAttribute('height', ((innerHeight / 4) * (amplitude / 3)).toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', lightWaveColor);

    outputRects.appendChild(rect);

    delayTextM.textContent = `m = ${index}`;
    delayTextN.textContent = `n = ${index}`;
  };

  document.getElementById('button-convolution-animation').addEventListener('click', (event) => {
    const buttonElement = event.currentTarget;

    buttonElement.setAttribute('disabled', 'disabled');

    if (svg.contains(rirRects)) {
      rirRects.removeAttribute('transform');
    }

    if (outputRects.querySelectorAll('rect').length > 0) {
      outputRects.querySelectorAll('rect').forEach((rect) => {
        outputRects.removeChild(rect);
      });
    }

    if (svg.contains(paths)) {
      svg.removeChild(paths);
    }

    intervalId = window.setInterval(() => {
      render(time);

      time += interval;

      if (time > 3000) {
        window.clearInterval(intervalId);
        intervalId = null;

        time = 0;

        svg.appendChild(paths);

        buttonElement.removeAttribute('disabled');
      }
    }, interval);
  });
};

const createConvolutionSize = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  for (let i = 1; i <= 3; i++) {
    const g = document.createElementNS(xmlns, 'g');

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (padding / 2).toString(10));
    xRect.setAttribute('y', (padding * i - 1 + (innerHeight / 4) * i).toString(10));
    xRect.setAttribute('width', (innerWidth + padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (padding - 1).toString(10));
    yRect.setAttribute('y', (padding * i + (innerHeight / 4) * (i - 1)).toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', (innerHeight / 4).toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    const xText = document.createElementNS(xmlns, 'text');

    switch (i) {
      case 1: {
        xText.textContent = 'Time (n - m)';
        break;
      }

      case 2: {
        xText.textContent = 'Time (m)';
        break;
      }

      case 3: {
        xText.textContent = 'Time (n)';
        break;
      }
    }

    xText.setAttribute('x', (innerWidth + padding).toString(10));
    xText.setAttribute('y', (padding * i + (innerHeight / 4) * i - 8).toString(10));

    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '20px');

    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = 'Amplitude';

    yText.setAttribute('x', padding.toString(10));
    yText.setAttribute('y', (padding * i + (innerHeight / 4) * (i - 1) - 8).toString(10));

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '20px');

    const amplitudeTexts = document.createElementNS(xmlns, 'g');

    if (i < 3) {
      ['1.0', '0.5', '0.0'].forEach((amplitude) => {
        const amplitudeText = document.createElementNS(xmlns, 'text');

        amplitudeText.textContent = amplitude;

        amplitudeText.setAttribute('x', (padding - 16).toString(10));
        amplitudeText.setAttribute('y', (padding * i + (innerHeight / 4) * (i - 1) + (innerHeight / 4) * (1 - Number(amplitude)) + 16).toString(10));

        amplitudeText.setAttribute('text-anchor', 'middle');
        amplitudeText.setAttribute('stroke', 'none');
        amplitudeText.setAttribute('fill', baseColor);
        amplitudeText.setAttribute('font-size', '16px');

        amplitudeTexts.appendChild(amplitudeText);
      });
    } else {
      ['3.0', '2.0', '1.0', '0.0'].forEach((amplitude) => {
        const amplitudeText = document.createElementNS(xmlns, 'text');

        amplitudeText.textContent = amplitude;

        amplitudeText.setAttribute('x', (padding - 16).toString(10));
        amplitudeText.setAttribute('y', (padding * i + (innerHeight / 4) * (i - 1) + (innerHeight / 4) * (1 - Number(amplitude) / 3) + 16).toString(10));

        amplitudeText.setAttribute('text-anchor', 'middle');
        amplitudeText.setAttribute('stroke', 'none');
        amplitudeText.setAttribute('fill', baseColor);
        amplitudeText.setAttribute('font-size', '16px');

        amplitudeTexts.appendChild(amplitudeText);
      });
    }

    g.appendChild(xRect);
    g.appendChild(yRect);
    g.appendChild(xText);
    g.appendChild(yText);
    g.appendChild(amplitudeTexts);

    svg.appendChild(g);
  }

  const inputRects = document.createElementNS(xmlns, 'g');

  [1, 1, 1, 0, 0].forEach((amplitude, index) => {
    if (index < 3) {
      const rect = document.createElementNS(xmlns, 'rect');

      rect.setAttribute('x', (padding - 2 + (innerWidth / 6) * index).toString(10));
      rect.setAttribute('y', padding.toString(10));
      rect.setAttribute('width', '4');
      rect.setAttribute('height', ((innerHeight / 4) * amplitude).toString(10));
      rect.setAttribute('stroke', 'none');
      rect.setAttribute('fill', waveColor);

      inputRects.appendChild(rect);

      if (index === 2) {
        const text = document.createElementNS(xmlns, 'text');

        text.textContent = 'X - 1';

        text.setAttribute('x', (padding + (innerWidth / 6) * index).toString(10));
        text.setAttribute('y', padding.toString(10));
        text.setAttribute('text-anchor', 'start');
        text.setAttribute('stroke', 'none');
        text.setAttribute('fill', baseColor);
        text.setAttribute('font-size', '18px');

        const subText = document.createElementNS(xmlns, 'text');

        subText.textContent = 'L';

        subText.setAttribute('x', (padding + (innerWidth / 6) * index + 12).toString(10));
        subText.setAttribute('y', (padding + 4).toString(10));
        subText.setAttribute('text-anchor', 'start');
        subText.setAttribute('stroke', 'none');
        subText.setAttribute('fill', baseColor);
        subText.setAttribute('font-size', '12px');

        svg.appendChild(text);
        svg.appendChild(subText);
      }
    } else {
      const circle = document.createElementNS(xmlns, 'circle');

      circle.setAttribute('cx', (padding - 4 + (innerWidth / 6) * index).toString(10));
      circle.setAttribute('cy', (padding + innerHeight / 4).toString(10));
      circle.setAttribute('r', '8');
      circle.setAttribute('stroke', baseColor);
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('fill', 'none');

      svg.appendChild(circle);

      if (index === 4) {
        const text = document.createElementNS(xmlns, 'text');

        text.textContent = '(X + H - 1) - 1 (index)';

        text.setAttribute('x', (padding + (innerWidth / 6) * index).toString(10));
        text.setAttribute('y', padding.toString(10));
        text.setAttribute('text-anchor', 'start');
        text.setAttribute('stroke', 'none');
        text.setAttribute('fill', baseColor);
        text.setAttribute('font-size', '18px');

        const subText = document.createElementNS(xmlns, 'text');

        subText.textContent = 'L　　L';

        subText.setAttribute('x', (padding + (innerWidth / 6) * index + 18).toString(10));
        subText.setAttribute('y', (padding + 4).toString(10));
        subText.setAttribute('text-anchor', 'start');
        subText.setAttribute('stroke', 'none');
        subText.setAttribute('fill', baseColor);
        subText.setAttribute('font-size', '12px');

        svg.appendChild(text);
        svg.appendChild(subText);
      }
    }
  });

  svg.appendChild(inputRects);

  const rirRects = document.createElementNS(xmlns, 'g');

  [0, 0, 1, 0.5, 0.25].forEach((amplitude, index) => {
    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', (padding - 2 + (innerWidth / 6) * index).toString(10));
    rect.setAttribute('y', (4 * padding + (1 - amplitude) * (innerHeight / 4)).toString(10));
    rect.setAttribute('width', '4');
    rect.setAttribute('height', ((innerHeight / 4) * amplitude).toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', waveColor);

    rirRects.appendChild(rect);
  });

  svg.appendChild(rirRects);

  const outputRects = document.createElementNS(xmlns, 'g');

  [1.75, 1.75, 1.75, 0.75, 0.25].forEach((amplitude, index) => {
    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', (padding - 2 + (innerWidth / 6) * index).toString(10));
    rect.setAttribute('y', (7 * padding + (1 - amplitude / 3) * (innerHeight / 4)).toString(10));
    rect.setAttribute('width', '4');
    rect.setAttribute('height', ((innerHeight / 4) * (amplitude / 3)).toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', lightWaveColor);

    outputRects.appendChild(rect);
  });

  svg.appendChild(outputRects);

  const tailRect = document.createElementNS(xmlns, 'rect');

  tailRect.setAttribute('x', (padding - 2 + (innerWidth / 6) * 4).toString(10));
  tailRect.setAttribute('y', (2 * padding).toString(19));
  tailRect.setAttribute('width', '4');
  tailRect.setAttribute('height', `${600 - 2 * padding - 6}`);
  tailRect.setAttribute('stroke', 'none');
  tailRect.setAttribute('fill', alphaBaseColor);

  svg.appendChild(tailRect);

  const paths = document.createElementNS(xmlns, 'g');

  const offsetX = (innerWidth / 6) * 2;

  [0, 1, 2].forEach((m) => {
    const path = document.createElementNS(xmlns, 'path');

    const x = offsetX + padding - 2 + (innerWidth / 6) * m;
    const y = padding;

    const endX = offsetX + padding - 2 + (innerWidth / 6) * (2 - m) + 1;
    const endY = 4 * padding;

    const startX = offsetX + padding - 2 + (innerWidth / 6) * (2 - m) + 1;
    const startY = 4 * padding + (1 - [1, 0.5, 0.25][2 - m]) * (innerHeight / 4);

    const outputEndX = offsetX + padding - 2 + (innerWidth / 6) * 2 + 1;
    const outputEndY = padding + 0.975 * innerHeight;

    path.setAttribute('d', `M${x} ${y + innerHeight / 4} L${endX} ${endY} L${startX} ${startY} L${outputEndX} ${outputEndY}`);

    path.setAttribute('stroke', baseColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);
    path.setAttribute('stroke-dasharray', '5,5');

    paths.appendChild(path);
  });

  svg.appendChild(paths);
};

const createAddElement = (x, y) => {
  const g = document.createElementNS(xmlns, 'g');

  const circle = document.createElementNS(xmlns, 'circle');

  circle.setAttribute('cx', x.toString(10));
  circle.setAttribute('cy', y.toString(10));
  circle.setAttribute('r', '12');
  circle.setAttribute('stroke', baseColor);
  circle.setAttribute('stroke-width', lineWidth.toString(10));
  circle.setAttribute('stroke-linecap', lineCap);
  circle.setAttribute('stroke-linejoin', lineJoin);
  circle.setAttribute('fill', white);

  const text = document.createElementNS(xmlns, 'text');

  text.textContent = '+';

  text.setAttribute('x', x.toString(10));
  text.setAttribute('y', (y + 6).toString(10));
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('stroke', 'none');
  text.setAttribute('fill', baseColor);
  text.setAttribute('font-size', '24px');
  text.setAttribute('font-weight', '24px');

  g.appendChild(circle);
  g.appendChild(text);

  return g;
};

const createMultiplyElement = (x, y, direction = 'right') => {
  const path = document.createElementNS(xmlns, 'path');

  if (direction === 'right') {
    path.setAttribute('d', `M${x} ${y} L${x} ${y - 12} L${x + 16} ${y} L${x} ${y + 12} L${x} ${y}`);
  } else if (direction === 'left') {
    path.setAttribute('d', `M${x} ${y} L${x} ${y - 12} L${x - 16} ${y} L${x} ${y + 12} L${x} ${y}`);
  }

  path.setAttribute('stroke', baseColor);
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);
  path.setAttribute('fill', white);

  return path;
};

const createDelayElement = (x, y) => {
  const g = document.createElementNS(xmlns, 'g');

  const rect = document.createElementNS(xmlns, 'rect');

  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', '40');
  rect.setAttribute('height', '24');
  rect.setAttribute('stroke', baseColor);
  rect.setAttribute('stroke-width', lineWidth.toString(10));
  rect.setAttribute('fill', white);

  const text = document.createElementNS(xmlns, 'text');
  const superText = document.createElementNS(xmlns, 'text');

  text.textContent = 'z';
  superText.textContent = '-1';

  text.setAttribute('x', (x + 16).toString(10));
  text.setAttribute('y', (y + 18).toString(10));
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('stroke', 'none');
  text.setAttribute('fill', baseColor);
  text.setAttribute('font-size', '20px');

  superText.setAttribute('x', (x + 28).toString(10));
  superText.setAttribute('y', (y + 12).toString(10));
  superText.setAttribute('text-anchor', 'middle');
  superText.setAttribute('stroke', 'none');
  superText.setAttribute('fill', baseColor);
  superText.setAttribute('font-size', '16px');

  g.appendChild(rect);
  g.appendChild(text);
  g.appendChild(superText);

  return g;
};

const createBus = (startX, startY, endX, endY) => {
  const path = document.createElementNS(xmlns, 'path');

  const d = `M${startX} ${startY} L${endX} ${endY}`;

  path.setAttribute('d', d);
  path.setAttribute('stroke', baseColor);
  path.setAttribute('stroke-width', '4');
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  return path;
};

const createBusArrow = (posX, posY, direction = 'down') => {
  const path = document.createElementNS(xmlns, 'path');

  switch (direction) {
    case 'down': {
      const d = `M${posX} ${posY} L${posX + 4} ${posY} L${posX} ${posY + 8} L${posX - 4} ${posY} L${posX} ${posY}`;

      path.setAttribute('d', d);
      break;
    }

    case 'up': {
      const d = `M${posX} ${posY} L${posX + 4} ${posY} L${posX} ${posY - 8} L${posX - 4} ${posY} L${posX} ${posY}`;

      path.setAttribute('d', d);
      break;
    }

    case 'left': {
      const d = `M${posX} ${posY} L${posX} ${posY + 4} L${posX - 8} ${posY} L${posX} ${posY - 4} L${posX} ${posY}`;

      path.setAttribute('d', d);
      break;
    }

    case 'right': {
      const d = `M${posX} ${posY} L${posX} ${posY + 4} L${posX + 8} ${posY} L${posX} ${posY - 4} L${posX} ${posY}`;

      path.setAttribute('d', d);
      break;
    }
  }

  path.setAttribute('stroke', baseColor);
  path.setAttribute('stroke-width', '4');
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);
  path.setAttribute('fill', baseColor);

  return path;
};

const createFIRFilter = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const inputText = document.createElementNS(xmlns, 'text');

  inputText.textContent = 'x(n)';

  inputText.setAttribute('x', (padding - 16).toString(10));
  inputText.setAttribute('y', (padding + 4).toString(10));
  inputText.setAttribute('text-anchor', 'middle');
  inputText.setAttribute('stroke', 'none');
  inputText.setAttribute('fill', baseColor);
  inputText.setAttribute('font-size', '16px');

  const outputText = document.createElementNS(xmlns, 'text');

  outputText.textContent = 'y(n)';

  outputText.setAttribute('x', (padding + innerWidth + 16).toString(10));
  outputText.setAttribute('y', (padding + 4).toString(10));
  outputText.setAttribute('text-anchor', 'middle');
  outputText.setAttribute('stroke', 'none');
  outputText.setAttribute('fill', baseColor);
  outputText.setAttribute('font-size', '16px');

  const outputText0 = document.createElementNS(xmlns, 'text');

  outputText0.textContent = `x(n)h(0)`;

  outputText0.setAttribute('x', (padding + innerWidth - 140).toString(10));
  outputText0.setAttribute('y', (padding + 36).toString(10));
  outputText0.setAttribute('text-anchor', 'middle');
  outputText0.setAttribute('stroke', 'none');
  outputText0.setAttribute('fill', baseColor);
  outputText0.setAttribute('font-size', '16px');

  const bus0 = createBus(padding, padding, padding + innerWidth, padding);
  const arrow0 = createBusArrow(padding + innerWidth - 8, padding, 'right');

  const adder0 = createAddElement(innerWidth - 24, padding);

  const multiplier0 = createMultiplyElement(padding + innerWidth / 2, padding);

  const multiplierText0 = document.createElementNS(xmlns, 'text');

  multiplierText0.textContent = 'h(0)';

  multiplierText0.setAttribute('x', (padding + innerWidth / 2 + 8).toString(10));
  multiplierText0.setAttribute('y', (padding + 36).toString(10));
  multiplierText0.setAttribute('text-anchor', 'middle');
  multiplierText0.setAttribute('stroke', 'none');
  multiplierText0.setAttribute('fill', baseColor);
  multiplierText0.setAttribute('font-size', '16px');

  for (let i = 1; i <= 3; i++) {
    const g = document.createElementNS(xmlns, 'g');

    const busDown = createBus(padding + 128, padding + 128 * (i - 1) + (i > 1 ? 12 : 0), padding + 128, padding + 128 * i);
    const bus = createBus(padding + 128, padding + 128 * i, padding + innerWidth - 84, padding + 128 * i);
    const busUp = createBus(padding + innerWidth - 84, padding + 128 * i, padding + innerWidth - 84, padding + 128 * (i - 1) + 12);

    const arrowDown = createBusArrow(padding + 128, padding + 128 * i - 24, 'down');
    const arrow = createBusArrow(padding + innerWidth - 84 - 24, padding + 128 * i, 'right');

    const delayElement = createDelayElement(padding + 128 - 20, padding + 128 * i - 12);

    const multiplier = createMultiplyElement(padding + innerWidth / 2, padding + 128 * i);

    const multiplierText = document.createElementNS(xmlns, 'text');

    multiplierText.textContent = `h(${i})`;

    multiplierText.setAttribute('x', (padding + innerWidth / 2 + 8).toString(10));
    multiplierText.setAttribute('y', (padding + 128 * i + 36).toString(10));
    multiplierText.setAttribute('text-anchor', 'middle');
    multiplierText.setAttribute('stroke', 'none');
    multiplierText.setAttribute('fill', baseColor);
    multiplierText.setAttribute('font-size', '16px');

    const outputText = document.createElementNS(xmlns, 'text');

    outputText.textContent = `x(n - ${i})h(${i})`;

    outputText.setAttribute('x', (padding + innerWidth - 128).toString(10));
    outputText.setAttribute('y', (padding + 128 * i + 36).toString(10));
    outputText.setAttribute('text-anchor', 'middle');
    outputText.setAttribute('stroke', 'none');
    outputText.setAttribute('fill', baseColor);
    outputText.setAttribute('font-size', '16px');

    const adder = createAddElement(padding + innerWidth - 84, padding + 128 * i);

    g.appendChild(busDown);
    g.appendChild(arrowDown);
    g.appendChild(bus);
    g.appendChild(arrow);
    g.appendChild(busUp);
    g.appendChild(delayElement);
    g.appendChild(multiplier);
    g.appendChild(multiplierText);
    g.appendChild(outputText);
    g.appendChild(adder);

    svg.appendChild(g);
  }

  svg.appendChild(bus0);
  svg.appendChild(arrow0);
  svg.appendChild(multiplier0);
  svg.appendChild(multiplierText0);
  svg.appendChild(outputText0);
  svg.appendChild(adder0);
  svg.appendChild(inputText);
  svg.appendChild(outputText);
};

const createNodeConnectionsForChorus = (svg) => {
  const g = document.createElementNS(xmlns, 'g');

  const oscillatorNodeRect = createAudioNode('OscillatorNode', 0, 0);
  const dryNodeRect = createAudioNode('GainNode (Dry)', 0, 200);
  const delayNodeRect = createAudioNode('DelayNode', 400, 100);
  const wetNodeRect = createAudioNode('GainNode (Wet)', 400, 300);
  const audioDestinationNodeRect = createAudioNode('AudioDestinationNode', 0, 400);

  const oscillatorNodeAndDryPath = createConnection(150 - 2, 100, 150 - 2, 300);
  const dryAndAudiodDestinationNodePath = createConnection(150 - 2, 300, 150 - 2, 400);
  const delayNodeAndWetPath = createConnection(550 - 2, 200, 550 - 2, 300);

  const oscillatorNodeAndDelayNodeNodePath1 = createConnection(300, 50 - 2, 548, 50 - 2);
  const oscillatorNodeAndDelayNodeNodePath2 = createConnection(548, 50 - 2, 548, 100 - 2);

  const wetAndAudioDestiationNodePath1 = createConnection(548, 400 + 2, 548, 450 - 2);
  const wetAndAudioDestiationNodePath2 = createConnection(548, 450 - 2, 300, 450 - 2);

  const oscillatorNodeAndDryArrow = createConnectionArrow(150 - 2, 200 - 14, 'down');
  const dryAndAudiodDestinationNodeArrow = createConnectionArrow(150 - 2, 400 - 14, 'down');

  const oscillatorNodeAndDelayNodeNodeArrow = createConnectionArrow(548, 100 - 14, 'down');
  const delayNodeAndWetArrow = createConnectionArrow(548, 300 - 14, 'down');
  const wetAndAudioDestiationArrow = createConnectionArrow(300 + 14, 450 - 2, 'left');

  const lfoRect = createLFO(800, 150);
  const delayTimeParamEllipse = createAudioParam('delayTime', 650, 200);
  const lfoAndDelayTimeParamPath = createConnection(800, 200 - 2, 732, 200 - 2, lightWaveColor);
  const lfoAndDelayTimeParamArrow = createConnectionArrow(732 + 12, 200 - 2, 'left', lightWaveColor);

  g.appendChild(oscillatorNodeRect);
  g.appendChild(oscillatorNodeAndDryPath);
  g.appendChild(dryNodeRect);
  g.appendChild(dryAndAudiodDestinationNodePath);
  g.appendChild(audioDestinationNodeRect);
  g.appendChild(delayNodeRect);
  g.appendChild(delayNodeAndWetPath);
  g.appendChild(wetNodeRect);

  g.appendChild(oscillatorNodeAndDelayNodeNodePath1);
  g.appendChild(oscillatorNodeAndDelayNodeNodePath2);

  g.appendChild(wetAndAudioDestiationNodePath1);
  g.appendChild(wetAndAudioDestiationNodePath2);

  g.appendChild(oscillatorNodeAndDryArrow);
  g.appendChild(dryAndAudiodDestinationNodeArrow);

  g.appendChild(oscillatorNodeAndDelayNodeNodeArrow);
  g.appendChild(delayNodeAndWetArrow);
  g.appendChild(wetAndAudioDestiationArrow);

  g.appendChild(lfoRect);
  g.appendChild(delayTimeParamEllipse);
  g.appendChild(lfoAndDelayTimeParamPath);
  g.appendChild(lfoAndDelayTimeParamArrow);

  svg.appendChild(g);
};

const chorus = () => {
  let oscillator = null;
  let lfo = null;

  let depthRate = 0;
  let rateValue = 0;
  let mixValue = 0;

  const delay = new DelayNode(audiocontext);
  const depth = new GainNode(audiocontext, { gain: delay.delayTime.value * depthRate });
  const dry = new GainNode(audiocontext, { gain: 1 - mixValue });
  const wet = new GainNode(audiocontext, { gain: mixValue });

  const buttonElement = document.getElementById('button-chorus');

  const rangeDelayTimeElement = document.getElementById('range-chorus-delay-time');
  const rangeDepthElement = document.getElementById('range-chorus-depth');
  const rangeRateElement = document.getElementById('range-chorus-rate');
  const rangeMixElement = document.getElementById('range-chorus-mix');

  const spanPrintDelayTimeElement = document.getElementById('print-chorus-delay-time-value');
  const spanPrintDepthElement = document.getElementById('print-chorus-depth-value');
  const spanPrintRateElement = document.getElementById('print-chorus-rate-value');
  const spanPrintMixElement = document.getElementById('print-chorus-mix-value');

  const onDown = (event) => {
    if (oscillator !== null || lfo !== null) {
      return;
    }

    oscillator = new OscillatorNode(audiocontext);
    lfo = new OscillatorNode(audiocontext, { frequency: rateValue });

    oscillator.connect(dry);
    dry.connect(audiocontext.destination);

    oscillator.connect(delay);
    delay.connect(wet);
    wet.connect(audiocontext.destination);

    lfo.connect(depth);
    depth.connect(delay.delayTime);

    oscillator.start(0);
    lfo.start(0);

    buttonElement.textContent = 'stop';
  };

  const onUp = (event) => {
    if (oscillator === null || lfo === null) {
      return;
    }

    oscillator.stop(0);
    lfo.stop(0);

    oscillator = null;
    lfo = null;

    buttonElement.textContent = 'start';
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  rangeDelayTimeElement.addEventListener('input', (event) => {
    delay.delayTime.value = event.currentTarget.valueAsNumber * 0.001;
    depth.gain.value = delay.delayTime.value * depthRate;

    spanPrintDelayTimeElement.textContent = `${Math.trunc(delay.delayTime.value * 1000)} msec`;
  });

  rangeDepthElement.addEventListener('input', (event) => {
    depthRate = event.currentTarget.valueAsNumber;

    depth.gain.value = delay.delayTime.value * depthRate;

    spanPrintDepthElement.textContent = depthRate.toString(10);
  });

  rangeRateElement.addEventListener('input', (event) => {
    rateValue = event.currentTarget.valueAsNumber;

    if (lfo) {
      lfo.frequency.value = rateValue;
    }

    spanPrintRateElement.textContent = rateValue.toString(10);
  });

  rangeMixElement.addEventListener('input', (event) => {
    mixValue = event.currentTarget.valueAsNumber;

    dry.gain.value = 1 - mixValue;
    wet.gain.value = mixValue;

    spanPrintMixElement.textContent = mixValue.toString(10);
  });
};

const createNodeConnectionsForFlanger = (svg) => {
  const g = document.createElementNS(xmlns, 'g');

  const oscillatorNodeRect = createAudioNode('OscillatorNode', 0, 0);
  const dryNodeRect = createAudioNode('GainNode (Dry)', 0, 200);
  const delayNodeRect = createAudioNode('DelayNode', 400, 100);
  const wetNodeRect = createAudioNode('GainNode (Wet)', 400, 300);
  const feedbackNodeRect = createAudioNode('GainNode (Feedback)', 800, 0);
  const audioDestinationNodeRect = createAudioNode('AudioDestinationNode', 0, 400);

  const oscillatorNodeAndDryPath = createConnection(150 - 2, 100, 150 - 2, 300);
  const dryAndAudiodDestinationNodePath = createConnection(150 - 2, 300, 150 - 2, 400);
  const delayNodeAndWetPath = createConnection(400 + (75 - 4), 200, 400 + (75 - 4), 300);

  const oscillatorNodeAndDelayNodePath1 = createConnection(300, 50 - 2, 400 + (75 - 4), 50 - 2);
  const oscillatorNodeAndDelayNodePath2 = createConnection(400 + (75 - 4), 50 - 2, 400 + (75 - 4), 100 - 2);

  const wetAndAudioDestiationNodePath1 = createConnection(400 + (75 - 4), 400 + 2, 400 + (75 - 4), 450 - 2);
  const wetAndAudioDestiationNodePath2 = createConnection(400 + (75 - 4), 450 - 2, 300, 450 - 2);

  const delayNodeAndFeedbackPath1 = createConnection(600, 200 + 2, 600, 250 - 2);
  const delayNodeAndFeedbackPath2 = createConnection(600, 250 - 2, 950, 250 - 2);
  const delayNodeAndFeedbackPath3 = createConnection(950, 250 - 2, 950, 100);

  const feedbackAndDelayNodePath1 = createConnection(800, 50 - 2, 600, 50 - 2);
  const feedbackAndDelayNodePath2 = createConnection(600, 50 - 2, 600, 100 - 2);

  const oscillatorNodeAndDryArrow = createConnectionArrow(150 - 2, 200 - 14, 'down');
  const dryAndAudiodDestinationNodeArrow = createConnectionArrow(150 - 2, 400 - 14, 'down');

  const oscillatorNodeAndDelayNodeArrow = createConnectionArrow(475 - 4, 100 - 14, 'down');
  const delayNodeAndWetArrow = createConnectionArrow(400 + (75 - 4), 300 - 14, 'down');
  const wetAndAudioDestiationArrow = createConnectionArrow(300 + 14, 450 - 2, 'left');

  const delayNodeAndFeedbackArrow = createConnectionArrow(950, 100 + 12, 'up');
  const feedbackAndDelayNodeArrow = createConnectionArrow(600, 100 - 14, 'down');

  const lfoRect = createLFO(800, 300);
  const delayTimeParamEllipse = createAudioParam('delayTime', 700, 200);
  const lfoAndDelayTimeParamPath1 = createConnection(875, 300 - 2, 875, 200 - 2, lightWaveColor);
  const lfoAndDelayTimeParamPath2 = createConnection(875, 200 - 2, 782, 200 - 2, lightWaveColor);
  const lfoAndDelayTimeParamArrow = createConnectionArrow(782 + 12, 200 - 2, 'left', lightWaveColor);

  g.appendChild(oscillatorNodeRect);
  g.appendChild(oscillatorNodeAndDryPath);
  g.appendChild(dryNodeRect);
  g.appendChild(dryAndAudiodDestinationNodePath);
  g.appendChild(audioDestinationNodeRect);
  g.appendChild(delayNodeRect);
  g.appendChild(delayNodeAndWetPath);
  g.appendChild(wetNodeRect);
  g.appendChild(feedbackNodeRect);

  g.appendChild(oscillatorNodeAndDelayNodePath1);
  g.appendChild(oscillatorNodeAndDelayNodePath2);

  g.appendChild(wetAndAudioDestiationNodePath1);
  g.appendChild(wetAndAudioDestiationNodePath2);

  g.appendChild(delayNodeAndFeedbackPath1);
  g.appendChild(delayNodeAndFeedbackPath2);
  g.appendChild(delayNodeAndFeedbackPath3);

  g.appendChild(feedbackAndDelayNodePath1);
  g.appendChild(feedbackAndDelayNodePath2);

  g.appendChild(oscillatorNodeAndDryArrow);
  g.appendChild(dryAndAudiodDestinationNodeArrow);

  g.appendChild(oscillatorNodeAndDelayNodeArrow);
  g.appendChild(delayNodeAndWetArrow);
  g.appendChild(wetAndAudioDestiationArrow);

  g.appendChild(delayNodeAndFeedbackArrow);
  g.appendChild(feedbackAndDelayNodeArrow);

  g.appendChild(lfoRect);
  g.appendChild(delayTimeParamEllipse);
  g.appendChild(lfoAndDelayTimeParamPath1);
  g.appendChild(lfoAndDelayTimeParamPath2);
  g.appendChild(lfoAndDelayTimeParamArrow);

  svg.appendChild(g);
};

const flanger = () => {
  let oscillator = null;
  let lfo = null;

  let depthRate = 0;
  let rateValue = 0;
  let mixValue = 0;

  const delay = new DelayNode(audiocontext);
  const depth = new GainNode(audiocontext, { gain: delay.delayTime.value * depthRate });
  const dry = new GainNode(audiocontext, { gain: 1 - mixValue });
  const wet = new GainNode(audiocontext, { gain: mixValue });
  const feedback = new GainNode(audiocontext, { gain: 0 });

  const buttonElement = document.getElementById('button-flanger');

  const rangeDelayTimeElement = document.getElementById('range-flanger-delay-time');
  const rangeDepthElement = document.getElementById('range-flanger-depth');
  const rangeRateElement = document.getElementById('range-flanger-rate');
  const rangeMixElement = document.getElementById('range-flanger-mix');
  const rangeFeedbackElement = document.getElementById('range-flanger-feedback');

  const spanPrintDelayTimeElement = document.getElementById('print-flanger-delay-time-value');
  const spanPrintDepthElement = document.getElementById('print-flanger-depth-value');
  const spanPrintRateElement = document.getElementById('print-flanger-rate-value');
  const spanPrintMixElement = document.getElementById('print-flanger-mix-value');
  const spanPrintFeedbackElement = document.getElementById('print-flanger-feedback-value');

  const onDown = async (event) => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null || lfo !== null) {
      return;
    }

    oscillator = new OscillatorNode(audiocontext);
    lfo = new OscillatorNode(audiocontext, { frequency: rateValue });

    oscillator.connect(dry);
    dry.connect(audiocontext.destination);

    oscillator.connect(delay);
    delay.connect(wet);
    wet.connect(audiocontext.destination);

    delay.connect(feedback);
    feedback.connect(delay);

    lfo.connect(depth);
    depth.connect(delay.delayTime);

    oscillator.start(0);
    lfo.start(0);

    buttonElement.textContent = 'stop';
  };

  const onUp = (event) => {
    if (oscillator === null || lfo === null) {
      return;
    }

    oscillator.stop(0);
    lfo.stop(0);

    oscillator = null;
    lfo = null;

    buttonElement.textContent = 'start';
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  rangeDelayTimeElement.addEventListener('input', (event) => {
    delay.delayTime.value = event.currentTarget.valueAsNumber * 0.001;
    depth.gain.value = delay.delayTime.value * depthRate;

    spanPrintDelayTimeElement.textContent = `${Math.trunc(delay.delayTime.value * 1000)} msec`;
  });

  rangeDepthElement.addEventListener('input', (event) => {
    depthRate = event.currentTarget.valueAsNumber;

    depth.gain.value = delay.delayTime.value * depthRate;

    spanPrintDepthElement.textContent = depthRate.toString(10);
  });

  rangeRateElement.addEventListener('input', (event) => {
    rateValue = event.currentTarget.valueAsNumber;

    if (lfo) {
      lfo.frequency.value = rateValue;
    }

    spanPrintRateElement.textContent = rateValue.toString(10);
  });

  rangeMixElement.addEventListener('input', (event) => {
    mixValue = event.currentTarget.valueAsNumber;

    dry.gain.value = 1 - mixValue;
    wet.gain.value = mixValue;

    spanPrintMixElement.textContent = mixValue.toString(10);
  });

  rangeFeedbackElement.addEventListener('input', (event) => {
    const feedbackValue = event.currentTarget.valueAsNumber;

    feedback.gain.value = feedbackValue;

    spanPrintFeedbackElement.textContent = feedbackValue.toString(10);
  });
};

const animateFM = (svgTime, svgSpectrum) => {
  const innerWidth = Number(svgTime.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svgTime.getAttribute('height')) - padding * 2;

  createCoordinateRect(svgTime);

  const analyser = new AnalyserNode(audiocontext, { fftSize: 8192, smoothingTimeConstant: 0.2 });

  const buttonElement = document.getElementById('button-frequency-modulation-animation');

  const rectTopSpectrum = document.createElementNS(xmlns, 'rect');

  rectTopSpectrum.setAttribute('x', padding.toString(10));
  rectTopSpectrum.setAttribute('y', (padding - 1).toString(10));
  rectTopSpectrum.setAttribute('width', innerWidth.toString(10));
  rectTopSpectrum.setAttribute('height', lineWidth.toString(10));
  rectTopSpectrum.setAttribute('stroke', 'none');
  rectTopSpectrum.setAttribute('fill', alphaBaseColor);

  svgSpectrum.appendChild(rectTopSpectrum);

  const rectMiddleSpectrum = document.createElementNS(xmlns, 'rect');

  rectMiddleSpectrum.setAttribute('x', padding.toString(10));
  rectMiddleSpectrum.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
  rectMiddleSpectrum.setAttribute('width', innerWidth.toString(10));
  rectMiddleSpectrum.setAttribute('height', lineWidth.toString(10));
  rectMiddleSpectrum.setAttribute('stroke', 'none');
  rectMiddleSpectrum.setAttribute('fill', alphaBaseColor);

  svgSpectrum.appendChild(rectMiddleSpectrum);

  const rectBottomSpectrum = document.createElementNS(xmlns, 'rect');

  rectBottomSpectrum.setAttribute('x', padding.toString(10));
  rectBottomSpectrum.setAttribute('y', (padding + innerHeight - 1).toString(10));
  rectBottomSpectrum.setAttribute('width', innerWidth.toString(10));
  rectBottomSpectrum.setAttribute('height', lineWidth.toString(10));
  rectBottomSpectrum.setAttribute('stroke', 'none');
  rectBottomSpectrum.setAttribute('fill', baseColor);

  svgSpectrum.appendChild(rectBottomSpectrum);

  const yRect = document.createElementNS(xmlns, 'rect');

  yRect.setAttribute('x', padding.toString(10));
  yRect.setAttribute('y', padding.toString(10));
  yRect.setAttribute('width', lineWidth.toString(10));
  yRect.setAttribute('height', innerHeight.toString(10));
  yRect.setAttribute('stroke', 'none');
  yRect.setAttribute('fill', baseColor);

  svgSpectrum.appendChild(yRect);

  const xText = document.createElementNS(xmlns, 'text');

  xText.textContent = 'Frequency';

  xText.setAttribute('x', (innerWidth + padding).toString(10));
  xText.setAttribute('y', (padding + innerHeight - 8).toString(10));

  xText.setAttribute('text-anchor', 'middle');
  xText.setAttribute('stroke', 'none');
  xText.setAttribute('fill', baseColor);
  xText.setAttribute('font-size', '20px');

  svgSpectrum.appendChild(xText);

  const yText = document.createElementNS(xmlns, 'text');

  yText.textContent = 'Amplitude';

  yText.setAttribute('x', padding.toString(10));
  yText.setAttribute('y', '24');

  yText.setAttribute('text-anchor', 'middle');
  yText.setAttribute('stroke', 'none');
  yText.setAttribute('fill', baseColor);
  yText.setAttribute('font-size', '20px');

  svgSpectrum.appendChild(yText);

  ['1.0', '0.5', '0.0'].forEach((text) => {
    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = text;

    yText.setAttribute('x', (padding - 16).toString(10));

    switch (text) {
      case '1.0': {
        yText.setAttribute('y', (padding - 4).toString(10));
        break;
      }

      case '0.5': {
        yText.setAttribute('y', (padding + innerHeight / 2 - 4).toString(10));
        break;
      }

      case '0.0': {
        yText.setAttribute('y', (padding + innerHeight - 4).toString(10));
        break;
      }
    }

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '16px');

    svgSpectrum.appendChild(yText);
  });

  const timePath = document.createElementNS(xmlns, 'path');

  timePath.setAttribute('stroke', waveColor);
  timePath.setAttribute('fill', 'none');
  timePath.setAttribute('stroke-width', lineWidth.toString(10));
  timePath.setAttribute('stroke-linecap', lineCap);
  timePath.setAttribute('stroke-linejoin', lineJoin);

  const spectrumPath = document.createElementNS(xmlns, 'path');

  spectrumPath.setAttribute('stroke', waveColor);
  spectrumPath.setAttribute('fill', 'none');
  spectrumPath.setAttribute('stroke-width', lineWidth.toString(10));
  spectrumPath.setAttribute('stroke-linecap', lineCap);
  spectrumPath.setAttribute('stroke-linejoin', lineJoin);

  svgTime.appendChild(timePath);
  svgSpectrum.appendChild(spectrumPath);

  let timerId = null;

  const drawOscillator = () => {
    const times = new Float32Array(analyser.fftSize);
    const spectrums = new Uint8Array(analyser.frequencyBinCount);

    analyser.getFloatTimeDomainData(times);
    analyser.getByteFrequencyData(spectrums);

    timePath.removeAttribute('d');
    spectrumPath.removeAttribute('d');

    let d = '';

    for (let n = 0, len = times.length / 32; n < len; n++) {
      const x = (n / len) * innerWidth + padding;
      const y = (1 - times[n]) * (innerHeight / 2) + padding;

      if (n === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    timePath.setAttribute('d', d);

    d = '';

    for (let k = 0, len = spectrums.length; k < len; k++) {
      const x = k * (audiocontext.sampleRate / analyser.fftSize) * (innerWidth / len) + padding;
      const y = (255 - spectrums[k] * gain.gain.value) * (innerHeight / 255) + padding;

      if (x > padding + innerWidth) {
        break;
      }

      if (k === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }

      if (k % 128 === 0) {
        const hz = document.createElementNS(xmlns, 'text');

        hz.textContent = `${Math.trunc(k * (audiocontext.sampleRate / analyser.fftSize))} Hz`;

        hz.setAttribute('x', x.toString(10));
        hz.setAttribute('y', (innerHeight + padding + 20).toString(10));
        hz.setAttribute('text-anchor', 'middle');
        hz.setAttribute('stroke', 'none');
        hz.setAttribute('fill', baseColor);
        hz.setAttribute('font-size', '16px');

        svgSpectrum.appendChild(hz);
      }
    }

    spectrumPath.setAttribute('d', d);

    timerId = window.setTimeout(drawOscillator, 125);
  };

  let oscillator = null;
  let lfo = null;

  const gain = new GainNode(audiocontext, { gain: 0.5 });
  const depth = new GainNode(audiocontext, { gain: 440 });

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      oscillator.stop(0);
      oscillator = null;
    }

    if (lfo !== null) {
      lfo.stop(0);
      lfo = null;
    }

    oscillator = new OscillatorNode(audiocontext, { frequency: 880 });

    oscillator.connect(gain);
    gain.connect(analyser);
    analyser.connect(audiocontext.destination);

    lfo = new OscillatorNode(audiocontext, { frequency: 0.5 });

    lfo.connect(depth);
    depth.connect(oscillator.frequency);

    oscillator.start(0);
    lfo.start(0);

    drawOscillator();

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (oscillator === null || lfo === null) {
      return;
    }

    oscillator.stop(0);
    oscillator = null;

    lfo.stop(0);
    lfo = null;

    buttonElement.textContent = 'start';

    if (timerId) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);
};

const createPhase = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const renderRotationFactor = () => {
    const width = innerWidth / 2;

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (2 * padding).toString(10));
    xRect.setAttribute('y', (padding + innerHeight / 2 - lineWidth / 2).toString(10));
    xRect.setAttribute('width', (width - 4 * padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    svg.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (width / 2 - lineWidth / 2).toString(10));
    yRect.setAttribute('y', '60');
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', innerHeight.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    svg.appendChild(yRect);

    const realText = document.createElementNS(xmlns, 'text');

    realText.textContent = 'Re';

    realText.setAttribute('x', (width - 2 * padding + 20).toString(10));
    realText.setAttribute('y', (padding + innerHeight / 2).toString(10));
    realText.setAttribute('text-anchor', 'middle');
    realText.setAttribute('stroke', 'none');
    realText.setAttribute('fill', baseColor);
    realText.setAttribute('font-size', '16px');

    svg.appendChild(realText);

    const imagText = document.createElementNS(xmlns, 'text');

    imagText.textContent = 'Im';

    imagText.setAttribute('x', (width / 2).toString(10));
    imagText.setAttribute('y', (padding - 8).toString(10));
    imagText.setAttribute('text-anchor', 'middle');
    imagText.setAttribute('stroke', 'none');
    imagText.setAttribute('fill', baseColor);
    imagText.setAttribute('font-size', '16px');

    svg.appendChild(imagText);

    const circle = document.createElementNS(xmlns, 'circle');

    circle.setAttribute('cx', (width / 2).toString(10));
    circle.setAttribute('cy', (padding + innerHeight / 2).toString(10));
    circle.setAttribute('r', '60');
    circle.setAttribute('stroke', alphaBaseColor);
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('fill', 'none');

    svg.appendChild(circle);

    const path = document.createElementNS(xmlns, 'path');

    const startX = width / 2;
    const startY = padding + innerHeight / 2;

    const d = `M${startX} ${startY} L${startX + 60} ${startY - 60}`;

    path.setAttribute('d', d);

    path.setAttribute('stroke', baseColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-dasharray', '5,5');
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    svg.appendChild(path);

    const pathRad = document.createElementNS(xmlns, 'path');

    pathRad.setAttribute('d', `M${startX} ${startY} L${startX + 24} ${startY} A 20 20 90 0 0 ${startX + 18} ${startY - 18} z`);

    pathRad.setAttribute('stroke', lightWaveColor);
    pathRad.setAttribute('fill', 'none');
    pathRad.setAttribute('stroke-width', lineWidth.toString(10));
    pathRad.setAttribute('stroke-linecap', lineCap);
    pathRad.setAttribute('stroke-linejoin', lineJoin);

    svg.appendChild(pathRad);

    const text = document.createElementNS(xmlns, 'text');

    text.textContent = 'θ';

    text.setAttribute('x', (startX + 30).toString(10));
    text.setAttribute('y', (startY - 8).toString(10));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '16px');

    svg.appendChild(text);
  };

  const renderSine = () => {
    const width = innerWidth / 2;

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (width + padding / 2).toString(10));
    xRect.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
    xRect.setAttribute('width', (width + padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    svg.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (width + padding - 1).toString(10));
    yRect.setAttribute('y', padding.toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', innerHeight.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    svg.appendChild(yRect);

    const xText = document.createElementNS(xmlns, 'text');

    xText.textContent = 'Time';

    xText.setAttribute('x', (width + width + padding).toString(10));
    xText.setAttribute('y', (padding + innerHeight / 2 - 8).toString(10));

    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '16px');

    svg.appendChild(xText);

    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = 'Amplitude';

    yText.setAttribute('x', (width + padding).toString(10));
    yText.setAttribute('y', (padding - 4).toString(10));

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '16px');

    svg.appendChild(yText);

    [1, 0, -1].forEach((amplitude, index) => {
      const rect = document.createElementNS(xmlns, 'rect');

      rect.setAttribute('x', (width + padding / 2).toString(10));
      rect.setAttribute('y', (padding + (innerHeight / 2) * (1 - amplitude)).toString(10));
      rect.setAttribute('width', (width + padding).toString(10));
      rect.setAttribute('height', lineWidth.toString(10));
      rect.setAttribute('stroke', 'none');
      rect.setAttribute('fill', alphaBaseColor);

      svg.appendChild(rect);

      const text = document.createElementNS(xmlns, 'text');

      text.textContent = amplitude.toString(10);

      text.setAttribute('x', (width + padding - 8).toString(10));
      text.setAttribute('y', (padding + (innerHeight / 2) * (1 - amplitude) + 16).toString(10));

      text.setAttribute('text-anchor', 'end');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '14px');

      svg.appendChild(text);
    });

    const w = 2 * Math.PI;

    const path = document.createElementNS(xmlns, 'path');

    let d = '';

    for (let n = 0, len = sampleRate; n < len; n++) {
      const v = Math.sin((w * n) / sampleRate);

      const x = (n / len) * width + width + padding;
      const y = (1 - v) * (innerHeight / 2) + padding;

      if (n === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    path.setAttribute('d', d);

    path.setAttribute('stroke', waveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    svg.appendChild(path);

    const pathArg = document.createElementNS(xmlns, 'path');

    pathArg.setAttribute('d', `M${width + innerWidth / 8} ${padding + innerHeight / 2} L${width + innerWidth / 8} ${padding + 40}`);
    pathArg.setAttribute('stroke', lightWaveColor);
    pathArg.setAttribute('fill', 'none');
    pathArg.setAttribute('stroke-width', lineWidth.toString(10));
    pathArg.setAttribute('stroke-linecap', lineCap);
    pathArg.setAttribute('stroke-linejoin', lineJoin);

    svg.appendChild(pathArg);

    const text = document.createElementNS(xmlns, 'text');

    text.textContent = 'θ';

    text.setAttribute('x', (width + innerWidth / 8).toString(10));
    text.setAttribute('y', (padding + innerHeight / 2 + 16).toString(10));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '16px');

    svg.appendChild(text);
  };

  renderRotationFactor();
  renderSine();
};

const animatePhaseShift = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  createCoordinateRect(svg);

  const xText = document.createElementNS(xmlns, 'text');

  xText.textContent = 'Phase (radian)';

  xText.setAttribute('x', (innerWidth + padding - 8).toString(10));
  xText.setAttribute('y', (padding + innerHeight / 2 - 8).toString(10));

  xText.setAttribute('text-anchor', 'middle');
  xText.setAttribute('stroke', 'none');
  xText.setAttribute('fill', baseColor);
  xText.setAttribute('font-size', '18px');

  svg.appendChild(xText);

  const yText = document.createElementNS(xmlns, 'text');

  yText.textContent = 'Amplitude';

  yText.setAttribute('x', padding.toString(10));
  yText.setAttribute('y', (padding - 4).toString(10));

  yText.setAttribute('text-anchor', 'middle');
  yText.setAttribute('stroke', 'none');
  yText.setAttribute('fill', baseColor);
  yText.setAttribute('font-size', '18px');

  svg.appendChild(yText);

  ['0', 'π/2', 'π', '3π/2', '2π', '5π/2', '3π', '7π/2', '4π'].forEach((phase, index) => {
    const text = document.createElementNS(xmlns, 'text');

    text.textContent = `${phase}`;

    text.setAttribute('x', (padding + 16 + (innerWidth / 9) * index).toString(10));
    text.setAttribute('y', (padding + innerHeight / 2 + 16).toString(10));

    text.setAttribute('text-anchor', 'end');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '16px');

    svg.appendChild(text);
  });

  const buttonAnimationElement = document.getElementById('button-phase-shift-animation');
  const buttonElement = document.getElementById('button-phase-shift-half-pi');

  const path = document.createElementNS(xmlns, 'path');

  let d = '';

  const w = 2 * Math.PI;

  for (let n = -2 * sampleRate, len = 2 * sampleRate; n < len; n++) {
    const v = 0.5 * Math.sin((w * n) / sampleRate);

    const x = (n / len) * innerWidth + padding;
    const y = (1 - v) * (innerHeight / 2) + padding;

    if (d === '') {
      d += `M${x + lineWidth / 2} ${y}`;
    } else {
      d += ` L${x} ${y}`;
    }
  }

  path.setAttribute('d', d);

  path.setAttribute('stroke', waveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  let animationId = null;

  let translateX = 0;

  const phaseShift = () => {
    path.setAttribute('transform', `translate(${translateX++} 0)`);

    if (translateX >= innerWidth / 2) {
      translateX = 0;
    }

    animationId = window.requestAnimationFrame(phaseShift);
  };

  const onClickAnimationButton = () => {
    if (animationId) {
      window.cancelAnimationFrame(animationId);
      animationId = null;

      buttonAnimationElement.textContent = 'start';
      return;
    }

    phaseShift();

    buttonAnimationElement.textContent = 'stop';
  };

  const onClick = () => {
    if (translateX >= innerWidth / 2) {
      translateX = 0;
    }

    translateX += 75;

    path.setAttribute('transform', `translate(${translateX} 0)`);
  };

  buttonAnimationElement.addEventListener('click', onClickAnimationButton);
  buttonElement.addEventListener('click', onClick);
};

const animateInterference = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  createCoordinateRect(svg);

  const xText = document.createElementNS(xmlns, 'text');

  xText.textContent = 'Phase (radian)';

  xText.setAttribute('x', (innerWidth + padding - 8).toString(10));
  xText.setAttribute('y', (padding + innerHeight / 2 - 8).toString(10));

  xText.setAttribute('text-anchor', 'middle');
  xText.setAttribute('stroke', 'none');
  xText.setAttribute('fill', baseColor);
  xText.setAttribute('font-size', '18px');

  svg.appendChild(xText);

  const yText = document.createElementNS(xmlns, 'text');

  yText.textContent = 'Amplitude';

  yText.setAttribute('x', padding.toString(10));
  yText.setAttribute('y', (padding - 4).toString(10));

  yText.setAttribute('text-anchor', 'middle');
  yText.setAttribute('stroke', 'none');
  yText.setAttribute('fill', baseColor);
  yText.setAttribute('font-size', '18px');

  svg.appendChild(yText);

  [1, 0.5, -0.5, -1].forEach((amplitude, index) => {
    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', (padding / 2).toString(10));
    rect.setAttribute('y', (padding + (innerHeight / 2) * (1 - amplitude)).toString(10));
    rect.setAttribute('width', (innerWidth + padding).toString(10));
    rect.setAttribute('height', lineWidth.toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', alphaBaseColor);

    svg.appendChild(rect);

    const text = document.createElementNS(xmlns, 'text');

    text.textContent = amplitude.toString(10).padStart(4, ' ');

    text.setAttribute('x', (padding / 2 + 8).toString(10));
    text.setAttribute('y', (padding + (innerHeight / 2) * (1 - amplitude) + 16).toString(10));

    text.setAttribute('text-anchor', 'end');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '16px');

    svg.appendChild(text);
  });

  ['0', 'π/2', 'π', '3π/2', '2π', '5π/2', '3π', '7π/2', '4π'].forEach((phase, index) => {
    const text = document.createElementNS(xmlns, 'text');

    text.textContent = `${phase}`;

    text.setAttribute('x', (padding + 16 + (innerWidth / 9) * index).toString(10));
    text.setAttribute('y', (padding + innerHeight / 2 + 16).toString(10));

    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '16px');

    svg.appendChild(text);
  });

  const buttonAnimationElement = document.getElementById('button-interference-animation');
  const buttonElement = document.getElementById('button-interference-half-pi');

  const pathsynthesized = document.createElementNS(xmlns, 'path');
  const pathOrigin = document.createElementNS(xmlns, 'path');
  const path = document.createElementNS(xmlns, 'path');

  let d = '';
  let originD = '';

  const w = 2 * Math.PI;

  for (let n = -2 * sampleRate, len = 2 * sampleRate; n < len; n++) {
    const v = 0.5 * Math.sin((w * n) / sampleRate);

    const x = (n / len) * innerWidth + padding;
    const y = (1 - v) * (innerHeight / 2) + padding;

    const sy = (1 - (v + v)) * (innerHeight / 2) + padding;

    if (d === '') {
      d += `M${x + lineWidth / 2} ${sy}`;
    } else {
      d += ` L${x} ${sy}`;
    }

    if (originD === '') {
      originD += `M${x + lineWidth / 2} ${y}`;
    } else {
      originD += ` L${x} ${y}`;
    }
  }

  pathsynthesized.setAttribute('d', d);

  pathsynthesized.setAttribute('stroke', lightWaveColor);
  pathsynthesized.setAttribute('fill', 'none');
  pathsynthesized.setAttribute('stroke-width', lineWidth.toString(10));
  pathsynthesized.setAttribute('stroke-linecap', lineCap);
  pathsynthesized.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(pathsynthesized);

  pathOrigin.setAttribute('d', originD);

  pathOrigin.setAttribute('stroke', alphaWaveColor);
  pathOrigin.setAttribute('fill', 'none');
  pathOrigin.setAttribute('stroke-width', lineWidth.toString(10));
  pathOrigin.setAttribute('stroke-linecap', lineCap);
  pathOrigin.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(pathOrigin);

  path.setAttribute('d', originD);

  path.setAttribute('stroke', alphaWaveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  let animationId = null;

  let translateX = 0;

  const phaseShift = () => {
    pathsynthesized.removeAttribute('d');

    let d = '';

    const w = 2 * Math.PI;

    const s = (translateX / innerWidth) * Math.PI * sampleRate * 0.65;

    for (let n = -2 * sampleRate, len = 2 * sampleRate; n < len; n++) {
      const v = 0.5 * Math.sin((w * n) / sampleRate) + 0.5 * Math.sin((w * (n - s)) / sampleRate);

      const x = (n / len) * innerWidth + padding;
      const y = (1 - v) * (innerHeight / 2) + padding;

      if (d === '') {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    pathsynthesized.setAttribute('d', d);

    path.setAttribute('transform', `translate(${translateX++} 0)`);

    if (translateX >= innerWidth / 2) {
      translateX = 0;
    }

    animationId = window.requestAnimationFrame(phaseShift);
  };

  const onClickAnimationButton = () => {
    if (animationId) {
      window.cancelAnimationFrame(animationId);
      animationId = null;

      buttonAnimationElement.textContent = 'start';
      return;
    }

    phaseShift();

    buttonAnimationElement.textContent = 'stop';
  };

  const onClick = () => {
    translateX += 75;

    if (translateX >= innerWidth / 2) {
      translateX = 0;
    }

    pathsynthesized.removeAttribute('d');

    let d = '';

    const w = 2 * Math.PI;

    const s = ((translateX - 2) / innerWidth) * Math.PI * sampleRate * 0.65;

    for (let n = -2 * sampleRate, len = 2 * sampleRate; n < len; n++) {
      const v = 0.5 * Math.sin((w * n) / sampleRate) + 0.5 * Math.sin((w * (n - s)) / sampleRate);

      const x = (n / len) * innerWidth + padding;
      const y = (1 - v) * (innerHeight / 2) + padding;

      if (d === '') {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    pathsynthesized.setAttribute('d', d);

    path.setAttribute('transform', `translate(${translateX} 0)`);
  };

  buttonAnimationElement.addEventListener('click', onClickAnimationButton);
  buttonElement.addEventListener('click', onClick);
};

const createNodeConnectionsForPhaser = (svg) => {
  const g = document.createElementNS(xmlns, 'g');

  const oscillatorNodeRect = createAudioNode('OscillatorNode', 0, 0);
  const dryNodeRect = createAudioNode('GainNode (Dry)', 0, 300);
  const allpassFilterRect1 = createAudioNode('BiquadFilterNode (All-Pass)', 400, 0);
  const allpassFilterRect2 = createAudioNode('BiquadFilterNode (All-Pass)', 400, 150);
  const allpassFilterRect3 = createAudioNode('BiquadFilterNode (All-Pass)', 400, 300);
  const allpassFilterRect4 = createAudioNode('BiquadFilterNode (All-Pass)', 400, 450);
  const wetNodeRect = createAudioNode('GainNode (Wet)', 400, 600);
  const audioDestinationNodeRect = createAudioNode('AudioDestinationNode', 0, 600);

  const oscillatorNodeAndDryPath = createConnection(150 - 2, 100, 150 - 2, 300);
  const dryAndAudiodDestinationNodePath = createConnection(150 - 2, 400, 150 - 2, 600);

  const oscillatorNodeAndDryArrow = createConnectionArrow(150 - 2, 300 - 14, 'down');
  const dryAndAudiodDestinationNodeArrow = createConnectionArrow(150 - 2, 600 - 14, 'down');

  const oscillatorNodeAndAllpassPath = createConnection(300, 50 - 2, 400, 50 - 2);
  const oscillatorNodeAndAllpassArrow = createConnectionArrow(400 - 14, 50 - 2, 'right');

  const wetNodeAndAudioDestinationPath = createConnection(300, 650 - 2, 400, 650 - 2);
  const wetNodeAndAudioDestinationArrow = createConnectionArrow(300 + 14, 650 - 2, 'left');

  const allpass1AndAllpass2Path = createConnection(550 - 2, 100, 550 - 2, 150);
  const allpass1AndAllpass2Arrow = createConnectionArrow(550 - 2, 150 - 14, 'down');
  const allpass2AndAllpass3Path = createConnection(550 - 2, 250, 550 - 2, 300);
  const allpass2AndAllpass3Arrow = createConnectionArrow(550 - 2, 300 - 14, 'down');
  const allpass3AndAllpass4Path = createConnection(550 - 2, 400, 550 - 2, 450);
  const allpass3AndAllpass4Arrow = createConnectionArrow(550 - 2, 450 - 14, 'down');
  const allpass4AndWetNodePath = createConnection(550 - 2, 550, 550 - 2, 600);
  const allpass4AndWetNodeArrow = createConnectionArrow(550 - 2, 600 - 14, 'down');

  const lfoRect = createLFO(900, 275);
  const frequencyParamEllipse1 = createAudioParam('frequency', 700, 100);
  const frequencyParamEllipse2 = createAudioParam('frequency', 700, 250);
  const frequencyParamEllipse3 = createAudioParam('frequency', 700, 400);
  const frequencyParamEllipse4 = createAudioParam('frequency', 700, 550);
  const lfoAndAllpassPath1 = createConnection(900, 325 - 2, 850, 325 - 2, lightWaveColor);
  const lfoAndAllpassPath2 = createConnection(850, 100, 850, 550, lightWaveColor);
  const lfoAndAllpass1Path = createConnection(850, 100, 780, 100, lightWaveColor);
  const lfoAndAllpass1Arrow = createConnectionArrow(794, 100, 'left', lightWaveColor);
  const lfoAndAllpass2Path = createConnection(850, 250, 780, 250, lightWaveColor);
  const lfoAndAllpass2Arrow = createConnectionArrow(794, 250, 'left', lightWaveColor);
  const lfoAndAllpass3Path = createConnection(850, 400, 780, 400, lightWaveColor);
  const lfoAndAllpass3Arrow = createConnectionArrow(794, 400, 'left', lightWaveColor);
  const lfoAndAllpass4Path = createConnection(850, 550, 780, 550, lightWaveColor);
  const lfoAndAllpass4Arrow = createConnectionArrow(794, 550, 'left', lightWaveColor);

  g.appendChild(oscillatorNodeRect);
  g.appendChild(oscillatorNodeAndDryPath);
  g.appendChild(dryNodeRect);
  g.appendChild(dryAndAudiodDestinationNodePath);
  g.appendChild(audioDestinationNodeRect);

  g.appendChild(oscillatorNodeAndDryArrow);
  g.appendChild(dryAndAudiodDestinationNodeArrow);

  g.appendChild(oscillatorNodeAndAllpassPath);
  g.appendChild(oscillatorNodeAndAllpassArrow);

  g.appendChild(wetNodeAndAudioDestinationPath);
  g.appendChild(wetNodeAndAudioDestinationArrow);

  g.appendChild(allpassFilterRect1);
  g.appendChild(allpassFilterRect2);
  g.appendChild(allpassFilterRect3);
  g.appendChild(allpassFilterRect4);
  g.appendChild(wetNodeRect);

  g.appendChild(lfoRect);
  g.appendChild(frequencyParamEllipse1);
  g.appendChild(frequencyParamEllipse2);
  g.appendChild(frequencyParamEllipse3);
  g.appendChild(frequencyParamEllipse4);

  g.appendChild(allpass1AndAllpass2Path);
  g.appendChild(allpass1AndAllpass2Arrow);
  g.appendChild(allpass2AndAllpass3Path);
  g.appendChild(allpass2AndAllpass3Arrow);
  g.appendChild(allpass3AndAllpass4Path);
  g.appendChild(allpass3AndAllpass4Arrow);
  g.appendChild(allpass4AndWetNodePath);
  g.appendChild(allpass4AndWetNodeArrow);
  g.appendChild(lfoAndAllpassPath1);
  g.appendChild(lfoAndAllpassPath2);
  g.appendChild(lfoAndAllpass1Path);
  g.appendChild(lfoAndAllpass1Arrow);
  g.appendChild(lfoAndAllpass2Path);
  g.appendChild(lfoAndAllpass2Arrow);
  g.appendChild(lfoAndAllpass3Path);
  g.appendChild(lfoAndAllpass3Arrow);
  g.appendChild(lfoAndAllpass4Path);
  g.appendChild(lfoAndAllpass4Arrow);

  svg.appendChild(g);
};

const phaser = () => {
  let oscillator = null;
  let lfo = null;

  let numberOfStages = 4;
  let baseFrequency = 880;
  let depthRate = 0;
  let rateValue = 0;
  let resonance = 1;
  let mixValue = 0;

  const allpasses = [
    new BiquadFilterNode(audiocontext, { type: 'allpass', frequency: baseFrequency }),
    new BiquadFilterNode(audiocontext, { type: 'allpass', frequency: baseFrequency }),
    new BiquadFilterNode(audiocontext, { type: 'allpass', frequency: baseFrequency }),
    new BiquadFilterNode(audiocontext, { type: 'allpass', frequency: baseFrequency })
  ];

  const depth = new GainNode(audiocontext, { gain: baseFrequency * depthRate });
  const dry = new GainNode(audiocontext, { gain: 1 - mixValue });
  const wet = new GainNode(audiocontext, { gain: mixValue });

  const buttonElement = document.getElementById('button-phaser');

  const selectPhaserStagesElement = document.getElementById('select-phaser-stages');
  const rangeFrequencyElement = document.getElementById('range-phaser-frequency');
  const rangeDepthElement = document.getElementById('range-phaser-depth');
  const rangeRateElement = document.getElementById('range-phaser-rate');
  const rangeResonanceElement = document.getElementById('range-phaser-resonance');
  const rangeMixElement = document.getElementById('range-phaser-mix');

  const spanPrintFrequencyElement = document.getElementById('print-phaser-frequency-value');
  const spanPrintDepthElement = document.getElementById('print-phaser-depth-value');
  const spanPrintRateElement = document.getElementById('print-phaser-rate-value');
  const spanPrintResonanceElement = document.getElementById('print-phaser-resonance-value');
  const spanPrintMixElement = document.getElementById('print-phaser-mix-value');

  const onDown = async (event) => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null || lfo !== null) {
      return;
    }

    oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth' });
    lfo = new OscillatorNode(audiocontext, { frequency: rateValue });

    oscillator.connect(dry);
    dry.connect(audiocontext.destination);

    oscillator.connect(allpasses[0]);

    for (let i = 0; i < numberOfStages - 1; i++) {
      allpasses[i].connect(allpasses[i + 1]);
    }

    allpasses[numberOfStages - 1].connect(wet);
    wet.connect(audiocontext.destination);

    lfo.connect(depth);

    for (let i = 0; i < numberOfStages; i++) {
      depth.connect(allpasses[i].frequency);
    }

    oscillator.start(0);
    lfo.start(0);

    buttonElement.textContent = 'stop';
  };

  const onUp = (event) => {
    if (oscillator === null || lfo === null) {
      return;
    }

    oscillator.stop(0);
    lfo.stop(0);

    oscillator = null;
    lfo = null;

    buttonElement.textContent = 'start';
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  selectPhaserStagesElement.addEventListener('change', (event) => {
    numberOfStages = Number(event.currentTarget.value);

    for (let i = 0, len = allpasses.length; i < len; i++) {
      allpasses[i].disconnect(0);
    }

    for (let i = 0; i < numberOfStages; i++) {
      allpasses[i] = new BiquadFilterNode(audiocontext, { type: 'allpass', frequency: baseFrequency });
    }

    if (oscillator !== null) {
      oscillator.connect(allpasses[0]);
    }

    for (let i = 0; i < numberOfStages - 1; i++) {
      allpasses[i].connect(allpasses[i + 1]);
    }

    allpasses[numberOfStages - 1].connect(wet);
    wet.connect(audiocontext.destination);

    for (let i = 0; i < numberOfStages; i++) {
      depth.connect(allpasses[i].frequency);
    }
  });

  rangeFrequencyElement.addEventListener('input', (event) => {
    baseFrequency = event.currentTarget.valueAsNumber;

    for (let i = 0; i < numberOfStages; i++) {
      allpasses[i].frequency.value = baseFrequency;
    }

    spanPrintFrequencyElement.textContent = `${Math.trunc(baseFrequency)} Hz`;
  });

  rangeDepthElement.addEventListener('input', (event) => {
    depthRate = event.currentTarget.valueAsNumber;

    depth.gain.value = baseFrequency * depthRate;

    spanPrintDepthElement.textContent = depthRate.toString(10);
  });

  rangeRateElement.addEventListener('input', (event) => {
    rateValue = event.currentTarget.valueAsNumber;

    if (lfo) {
      lfo.frequency.value = rateValue;
    }

    spanPrintRateElement.textContent = rateValue.toString(10);
  });

  rangeResonanceElement.addEventListener('input', (event) => {
    resonance = event.currentTarget.valueAsNumber;

    for (let i = 0; i < numberOfStages; i++) {
      allpasses[i].Q.value = resonance;
    }

    spanPrintResonanceElement.textContent = resonance.toString(10);
  });

  rangeMixElement.addEventListener('input', (event) => {
    mixValue = event.currentTarget.valueAsNumber;

    dry.gain.value = 1 - mixValue;
    wet.gain.value = mixValue;

    spanPrintMixElement.textContent = mixValue.toString(10);
  });
};

createCoordinateRect(document.getElementById('svg-figure-sin-function'));
createSinFunctionPath(document.getElementById('svg-figure-sin-function'));

createCoordinateRect(document.getElementById('svg-figure-sin-function-with-parameters-1-1Hz'));
createSinFunctionPath(document.getElementById('svg-figure-sin-function-with-parameters-1-1Hz'));

createCoordinateRect(document.getElementById('svg-figure-sin-function-with-parameters-0.5-1Hz'));
createSinFunctionPath(document.getElementById('svg-figure-sin-function-with-parameters-0.5-1Hz'));

createCoordinateRect(document.getElementById('svg-figure-sin-function-with-parameters-1-2Hz'));
createSinFunctionPath(document.getElementById('svg-figure-sin-function-with-parameters-1-2Hz'));

createCoordinateRect(document.getElementById('svg-figure-sin-function-with-parameters-1-0.5Hz'));
createSinFunctionPath(document.getElementById('svg-figure-sin-function-with-parameters-1-0.5Hz'));

createCoordinateRect(document.getElementById('svg-figure-square-function-with-parameters-0.5-4Hz'));
createSquareFunctionPath(document.getElementById('svg-figure-square-function-with-parameters-0.5-4Hz'));

createCoordinateRect(document.getElementById('svg-figure-sawtooth-function-with-parameters-0.5-4Hz'));
createSawtoothFunctionPath(document.getElementById('svg-figure-sawtooth-function-with-parameters-0.5-4Hz'));

createCoordinateRect(document.getElementById('svg-figure-triangle-function-with-parameters-0.5-4Hz'));
createTriangleFunctionPath(document.getElementById('svg-figure-triangle-function-with-parameters-0.5-4Hz'));

createFrequencyandPianoFrequency(document.getElementById('svg-figure-frequency-and-piano-frequency'));
createKeyboards(document.getElementById('svg-figure-12-equal-temperament'));

createCoordinateRect(document.getElementById('svg-figure-career'));
createCareer(document.getElementById('svg-figure-career'));

createCoordinateRect(document.getElementById('svg-figure-envelope'));
createEnvelope(document.getElementById('svg-figure-envelope'));

visualOscillator(document.getElementById('svg-oscillator'));
visualADSR(document.getElementById('svg-envelopegenerator'));

createSampling(document.getElementById('svg-figure-sampling'), 8, true);
createSampling(document.getElementById('svg-figure-sampling-theorem-with-aliasing'), 2, true);
createSampling(document.getElementById('svg-figure-sampling-theorem-without-aliasing'), 3, true);
createSampling(document.getElementById('svg-figure-sampling-theorem'), 48, true);

createQuantization(document.getElementById('svg-figure-quantization'), 3, lightWaveColor, true, true);
createQuantization(document.getElementById('svg-figure-quantization-bits'), 4, lightWaveColor, false, true);
createQuantization(document.getElementById('svg-figure-coding'), 4, alphaBaseColor, false, false);

visualFourierSeries(document.getElementById('svg-fourier-series'));

createRotationFactors(document.getElementById('svg-figure-rotation-factors'));

createFFTSymbols(document.getElementById('svg-figure-fft-symbols'));
createFFT4(document.getElementById('svg-figure-fft-4'));
createFFT8(document.getElementById('svg-figure-fft-8'));

visualSpectrum(document.getElementById('svg-time'), document.getElementById('svg-spectrum'));

vibrato();

animateFeedback(document.getElementById('svg-animation-feedback'));
createNodeConnectionsForDelay(document.getElementById('svg-figure-node-connections-for-delay'));

createNodeConnectionsForReverb(document.getElementById('svg-figure-node-connections-for-reverb'));
createRIR(document.getElementById('svg-figure-impulse'));
animateRIR(document.getElementById('svg-animation-impulse-response'));
renderRIR(document.getElementById('svg-rir'));

createConvolution(document.getElementById('svg-figure-convolution'));
animateConvolution(document.getElementById('svg-animation-convolution'));
createConvolutionSize(document.getElementById('svg-figure-convolution-output-signal-size'));

createFIRFilter(document.getElementById('svg-figure-fir-filter'));

createNodeConnectionsForChorus(document.getElementById('svg-figure-node-connections-for-chorus'));

chorus();

createNodeConnectionsForFlanger(document.getElementById('svg-figure-node-connections-for-flanger'));

flanger();

animateFM(document.getElementById('svg-animation-frequency-modulation-time'), document.getElementById('svg-animation-frequency-modulation-spectrum'));

createPhase(document.getElementById('svg-figure-phase'));
animatePhaseShift(document.getElementById('svg-animation-phase-shift'));
animateInterference(document.getElementById('svg-animation-interference'));
createNodeConnectionsForPhaser(document.getElementById('svg-figure-node-connections-for-phaser'));

phaser();
