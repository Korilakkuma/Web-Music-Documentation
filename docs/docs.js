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

const createAudioNode2LineText = (name, sub, x, y, w = 300, h = 100) => {
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

  text.textContent = name;

  text.setAttribute('x', (x + w / 2).toString(10));
  text.setAttribute('y', (y + h / 2 - 4).toString(10));
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('stroke', 'none');
  text.setAttribute('fill', baseColor);
  text.setAttribute('font-size', '20px');

  subText.textContent = sub;

  subText.setAttribute('x', (x + w / 2).toString(10));
  subText.setAttribute('y', (y + h / 2 + 24).toString(10));
  subText.setAttribute('text-anchor', 'middle');
  subText.setAttribute('stroke', 'none');
  subText.setAttribute('fill', baseColor);
  subText.setAttribute('font-size', '18px');

  g.appendChild(rect);
  g.appendChild(text);
  g.appendChild(subText);

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

const createNodeConnectionsForTremolo = (svg) => {
  const g = document.createElementNS(xmlns, 'g');

  const oscillatorNodeRect = createAudioNode('OscillatorNode', 0, 0);
  const amplitudeRect = createAudioNode('GainNode (Amplitude)', 0, 200);
  const audioDestinationNodeRect = createAudioNode('AudioDestinationNode', 0, 400);

  const oscillatorNodeAndAmplitudePath = createConnection(150 - 2, 100, 150 - 2, 300);
  const amplitudeAndAudiodDestinationNodePath = createConnection(150 - 2, 300, 150 - 2, 400);

  const oscillatorNodeAndAmplitudeArrow = createConnectionArrow(150 - 2, 200 - 14, 'down');
  const amplitudeAndAudiodDestinationNodeArrow = createConnectionArrow(150 - 2, 400 - 14, 'down');

  const lfoRect = createLFO(400, 0);
  const gainParamEllipse = createAudioParam('gain', 350, 250);
  const lfoAndGainParamPath1 = createConnection(545, 100 + 2, 545, 250 - 2, lightWaveColor);
  const lfoAndGainParamPath2 = createConnection(430, 250 - 2, 545, 250 - 2, lightWaveColor);
  const lfoAndGainParamArrow = createConnectionArrow(430 + 12, 250 - 2, 'left', lightWaveColor);

  g.appendChild(oscillatorNodeRect);
  g.appendChild(oscillatorNodeAndAmplitudePath);
  g.appendChild(oscillatorNodeAndAmplitudeArrow);
  g.appendChild(amplitudeRect);
  g.appendChild(amplitudeAndAudiodDestinationNodePath);
  g.appendChild(amplitudeAndAudiodDestinationNodeArrow);
  g.appendChild(audioDestinationNodeRect);

  g.appendChild(lfoRect);
  g.appendChild(gainParamEllipse);
  g.appendChild(lfoAndGainParamPath1);
  g.appendChild(lfoAndGainParamPath2);
  g.appendChild(lfoAndGainParamArrow);

  svg.appendChild(g);
};

const tremolo = () => {
  let depthRate = 0;
  let rateValue = 0;

  let oscillator = new OscillatorNode(audiocontext);
  let lfo = new OscillatorNode(audiocontext, { frequency: rateValue });

  let isStop = true;

  const amplitude = new GainNode(audiocontext, { gain: 0.5 }); // 0.5 +- ${depthValue}
  const depth = new GainNode(audiocontext, { gain: amplitude.gain.value * depthRate });

  const buttonElement = document.getElementById('button-tremolo');
  const checkboxElement = document.getElementById('checkbox-tremolo');

  const rangeDepthElement = document.getElementById('range-tremolo-depth');
  const rangeRateElement = document.getElementById('range-tremolo-rate');

  const spanPrintCheckedElement = document.getElementById('print-checked-tremolo');
  const spanPrintDepthElement = document.getElementById('print-tremolo-depth-value');
  const spanPrintRateElement = document.getElementById('print-tremolo-rate-value');

  const onDown = async () => {
    if (audiocontext !== 'running') {
      await audiocontext.resume();
    }

    if (!isStop) {
      return;
    }

    if (checkboxElement.checked) {
      oscillator.connect(amplitude);
      amplitude.connect(audiocontext.destination);

      oscillator.start(0);
    } else {
      amplitude.disconnect(0);

      oscillator.connect(audiocontext.destination);

      oscillator.start(0);
    }

    lfo.connect(depth);
    depth.connect(amplitude.gain);

    lfo.start(0);

    isStop = false;

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (isStop) {
      return;
    }

    oscillator.stop(0);
    lfo.stop(0);

    oscillator = new OscillatorNode(audiocontext);
    lfo = new OscillatorNode(audiocontext, { frequency: rateValue });

    isStop = true;

    buttonElement.textContent = 'start';
  };

  checkboxElement.addEventListener('click', () => {
    oscillator.disconnect(0);
    amplitude.disconnect(0);
    lfo.disconnect(0);

    if (checkboxElement.checked) {
      oscillator.connect(amplitude);
      amplitude.connect(audiocontext.destination);

      lfo.connect(depth);
      depth.connect(amplitude.gain);

      spanPrintCheckedElement.textContent = 'ON';
    } else {
      oscillator.connect(audiocontext.destination);

      spanPrintCheckedElement.textContent = 'OFF';
    }
  });

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  rangeDepthElement.addEventListener('input', (event) => {
    depthRate = event.currentTarget.valueAsNumber;

    depth.gain.value = amplitude.gain.value * depthRate;

    spanPrintDepthElement.textContent = depthRate.toString(10);
  });

  rangeRateElement.addEventListener('input', (event) => {
    rateValue = event.currentTarget.valueAsNumber;

    if (lfo) {
      lfo.frequency.value = rateValue;
    }

    spanPrintRateElement.textContent = rateValue.toString(10);
  });
};

const createNodeConnectionsForRingmodulator = (svg) => {
  const g = document.createElementNS(xmlns, 'g');

  const oscillatorNodeRect = createAudioNode('OscillatorNode', 0, 0);
  const amplitudeRect = createAudioNode('GainNode (Amplitude)', 0, 200);
  const audioDestinationNodeRect = createAudioNode('AudioDestinationNode', 0, 400);

  const oscillatorNodeAndAmplitudePath = createConnection(150 - 2, 100, 150 - 2, 300);
  const amplitudeAndAudiodDestinationNodePath = createConnection(150 - 2, 300, 150 - 2, 400);

  const oscillatorNodeAndAmplitudeArrow = createConnectionArrow(150 - 2, 200 - 14, 'down');
  const amplitudeAndAudiodDestinationNodeArrow = createConnectionArrow(150 - 2, 400 - 14, 'down');

  const lfoRect = createLFO(572, 200);
  const gainParamEllipse = createAudioParam('gain', 350, 250);
  const lfoAndGainParamArrow = createConnectionArrow(430 + 12, 250 - 2, 'left', lightWaveColor);

  const lfoAndGainParamPath = document.createElementNS(xmlns, 'path');

  const startX = 430 + 24;
  const startY = 250 - 2;

  let d = `M${430} ${250 - 2}`;

  for (let x = 0; x < 115; x++) {
    const y = 25 * Math.sin(x / 4);

    d += ` L${startX + x} ${startY + y}`;
  }

  d += ` L${startX + 115} ${startY}`;

  lfoAndGainParamPath.setAttribute('d', d);
  lfoAndGainParamPath.setAttribute('fill', 'none');
  lfoAndGainParamPath.setAttribute('stroke', lightWaveColor);
  lfoAndGainParamPath.setAttribute('stroke-width', '4');
  lfoAndGainParamPath.setAttribute('stroke-linecap', lineCap);
  lfoAndGainParamPath.setAttribute('stroke-linejoin', lineJoin);

  g.appendChild(oscillatorNodeRect);
  g.appendChild(oscillatorNodeAndAmplitudePath);
  g.appendChild(oscillatorNodeAndAmplitudeArrow);
  g.appendChild(amplitudeRect);
  g.appendChild(amplitudeAndAudiodDestinationNodePath);
  g.appendChild(amplitudeAndAudiodDestinationNodeArrow);
  g.appendChild(audioDestinationNodeRect);

  g.appendChild(lfoRect);
  g.appendChild(gainParamEllipse);
  g.appendChild(lfoAndGainParamPath);
  g.appendChild(lfoAndGainParamArrow);

  svg.appendChild(g);
};

const ringmodulator = () => {
  let depthRate = 1;
  let rateValue = 1000;

  let oscillator = new OscillatorNode(audiocontext);
  let lfo = new OscillatorNode(audiocontext, { frequency: rateValue });

  let isStop = true;

  const amplitude = new GainNode(audiocontext, { gain: 0 }); // 0 +- ${depthValue}
  const depth = new GainNode(audiocontext, { gain: depthRate });

  const buttonElement = document.getElementById('button-ringmodulator');
  const checkboxElement = document.getElementById('checkbox-ringmodulator');

  const rangeDepthElement = document.getElementById('range-ringmodulator-depth');
  const rangeRateElement = document.getElementById('range-ringmodulator-rate');

  const spanPrintCheckedElement = document.getElementById('print-checked-ringmodulator');
  const spanPrintDepthElement = document.getElementById('print-ringmodulator-depth-value');
  const spanPrintRateElement = document.getElementById('print-ringmodulator-rate-value');

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (!isStop) {
      return;
    }

    if (checkboxElement.checked) {
      oscillator.connect(amplitude);
      amplitude.connect(audiocontext.destination);

      oscillator.start(0);
    } else {
      amplitude.disconnect(0);

      oscillator.connect(audiocontext.destination);

      oscillator.start(0);
    }

    lfo.connect(depth);
    depth.connect(amplitude.gain);

    lfo.start(0);

    isStop = false;

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (isStop) {
      return;
    }

    oscillator.stop(0);
    lfo.stop(0);

    oscillator = new OscillatorNode(audiocontext);
    lfo = new OscillatorNode(audiocontext, { frequency: rateValue });

    isStop = true;

    buttonElement.textContent = 'start';
  };

  checkboxElement.addEventListener('click', () => {
    oscillator.disconnect(0);
    amplitude.disconnect(0);
    lfo.disconnect(0);

    if (checkboxElement.checked) {
      oscillator.connect(amplitude);
      amplitude.connect(audiocontext.destination);

      lfo.connect(depth);
      depth.connect(amplitude.gain);

      spanPrintCheckedElement.textContent = 'ON';
    } else {
      oscillator.connect(audiocontext.destination);

      spanPrintCheckedElement.textContent = 'OFF';
    }
  });

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  rangeDepthElement.addEventListener('input', (event) => {
    depthRate = event.currentTarget.valueAsNumber;

    depth.gain.value = depthRate;

    spanPrintDepthElement.textContent = depthRate.toString(10);
  });

  rangeRateElement.addEventListener('input', (event) => {
    rateValue = event.currentTarget.valueAsNumber;

    if (lfo) {
      lfo.frequency.value = rateValue;
    }

    spanPrintRateElement.textContent = rateValue.toString(10);
  });
};

const animateAM = (svgTime, svgSpectrum) => {
  const innerWidth = Number(svgTime.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svgTime.getAttribute('height')) - padding * 2;

  createCoordinateRect(svgTime);

  const analyser = new AnalyserNode(audiocontext, { fftSize: 16384, smoothingTimeConstant: 0.2 });

  const buttonElement = document.getElementById('button-amplitude-modulation-animation');
  const rangeRateElement = document.getElementById('range-amplitude-modulation-rate');
  const spanPrintRateElement = document.getElementById('print-amplitude-modulation-rate');

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
      const y = (255 - spectrums[k]) * (innerHeight / 255) + padding;

      if (x > padding + innerWidth) {
        break;
      }

      if (k === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }

      if (k % 512 === 0) {
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

  let rateValue = rangeRateElement.valueAsNumber;

  const amplitude = new GainNode(audiocontext, { gain: 0.5 });
  const depth = new GainNode(audiocontext, { gain: 0.5 });

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

    oscillator = new OscillatorNode(audiocontext, { frequency: 440 });

    oscillator.connect(amplitude);
    amplitude.connect(analyser);
    analyser.connect(audiocontext.destination);

    lfo = new OscillatorNode(audiocontext, { frequency: 1 });

    lfo.connect(depth);
    depth.connect(amplitude.gain);

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

  rangeRateElement.addEventListener('input', (event) => {
    rateValue = event.currentTarget.valueAsNumber;

    if (lfo) {
      lfo.frequency.value = rateValue;
    }

    spanPrintRateElement.textContent = `${rateValue} Hz`;
  });
};

const renderFrequencyResponse = (svg, type) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const path = document.createElementNS(xmlns, 'path');

  path.setAttribute('stroke', waveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  const frequencies = new Float32Array(8000);

  const min = Math.log(10);
  const max = Math.log(20000);
  const diff = max - min;

  for (let i = 0, len = frequencies.length; i < len; i++) {
    const ratio = i / (len - 1);

    frequencies[i] = Math.exp(diff * ratio + min);
  }

  for (let i = 0; i < 10; i++) {
    const x = i * (innerWidth / 9) + padding;

    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', x.toString(10));
    rect.setAttribute('y', padding.toString(10));
    rect.setAttribute('width', lineWidth.toString(10));
    rect.setAttribute('height', innerHeight.toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', alphaBaseColor);

    svg.appendChild(rect);

    const text = document.createElementNS(xmlns, 'text');

    text.textContent = `${Math.trunc(frequencies[i < 9 ? (i + 1) * 800 : 7999])} Hz`;

    text.setAttribute('x', x.toString(10));
    text.setAttribute('y', (padding + innerHeight + 16).toString(10));

    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '12px');

    svg.appendChild(text);
  }

  if (type === 'allpass') {
    const rads = ['π', 'π/2', '0', '-π/2', '-π'];

    for (let i = 0; i < 5; i++) {
      const y = i * (innerHeight / 4) + padding;

      const rect = document.createElementNS(xmlns, 'rect');

      rect.setAttribute('x', padding.toString(10));
      rect.setAttribute('y', y.toString(10));
      rect.setAttribute('width', innerWidth.toString(10));
      rect.setAttribute('height', lineWidth.toString(10));
      rect.setAttribute('stroke', 'none');
      rect.setAttribute('fill', alphaBaseColor);

      svg.appendChild(rect);

      const text = document.createElementNS(xmlns, 'text');

      text.textContent = `${rads[i]} rad`;

      text.setAttribute('x', (padding - 8).toString(10));
      text.setAttribute('y', (y + 4).toString(10));

      text.setAttribute('text-anchor', 'end');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-family', 'Roboto');
      text.setAttribute('font-size', '12px');

      svg.appendChild(text);
    }
  } else {
    const dBs = ['24', '18', '12', '6', '0', '-6', '-12', '-18', '-24'];

    for (let i = 0; i < 9; i++) {
      const y = i * (innerHeight / 8) + padding;

      const rect = document.createElementNS(xmlns, 'rect');

      rect.setAttribute('x', padding.toString(10));
      rect.setAttribute('y', y.toString(10));
      rect.setAttribute('width', innerWidth.toString(10));
      rect.setAttribute('height', lineWidth.toString(10));
      rect.setAttribute('stroke', 'none');
      rect.setAttribute('fill', alphaBaseColor);

      svg.appendChild(rect);

      const text = document.createElementNS(xmlns, 'text');

      text.textContent = `${dBs[i]} dB`;

      text.setAttribute('x', (padding - 8).toString(10));
      text.setAttribute('y', (y + 4).toString(10));

      text.setAttribute('text-anchor', 'end');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '12px');

      svg.appendChild(text);
    }
  }

  const filter = new BiquadFilterNode(audiocontext, { type });

  const render = () => {
    const magResponses = new Float32Array(frequencies.length);
    const phaseResponses = new Float32Array(frequencies.length);

    filter.getFrequencyResponse(frequencies, magResponses, phaseResponses);

    path.removeAttribute('d');

    let d = '';

    if (type === 'allpass') {
      for (let i = 0, len = frequencies.length; i < len; i++) {
        const f = frequencies[i];
        const x = (Math.log10(f / 20) / Math.log10(1000)) * innerWidth + padding - 3;
        const p = phaseResponses[i];
        const y = -1 * (p / (2 * Math.PI)) * innerHeight + innerHeight / 2 + padding;

        if (x < padding) {
          continue;
        }

        if (y > padding + innerHeight) {
          continue;
        }

        if (d === '') {
          d += `M${x} ${y} `;
        } else {
          d += `L${x} ${y} `;
        }
      }
    } else {
      for (let i = 0, len = frequencies.length; i < len; i++) {
        const f = frequencies[i];
        const x = (Math.log10(f / 20) / Math.log10(1000)) * innerWidth + padding - 3;
        const dB = 20 * Math.log10(magResponses[i]);
        const y = ((-1 * dB) / 48) * innerHeight + innerHeight / 2 + padding;

        if (x < padding) {
          continue;
        }

        if (y > padding + innerHeight) {
          continue;
        }

        if (d === '') {
          d += `M${x} ${y} `;
        } else {
          d += `L${x} ${y} `;
        }
      }
    }

    path.setAttribute('d', d);
  };

  if (!type) {
    document.getElementById('select-filter-type').addEventListener('change', (event) => {
      filter.type = event.currentTarget.value;

      render();
    });
  }

  document.getElementById(`range-filter-${type}-frequency`).addEventListener('input', (event) => {
    filter.frequency.value = event.currentTarget.valueAsNumber;

    document.getElementById(`print-filter-${type}-frequency`).textContent = `${filter.frequency.value} Hz`;

    render();
  });

  document.getElementById(`range-filter-${type}-detune`).addEventListener('input', (event) => {
    filter.detune.value = event.currentTarget.valueAsNumber;

    document.getElementById(`print-filter-${type}-detune`).textContent = `${filter.detune.value} cent`;

    render();
  });

  if (type !== 'lowshelf' && type !== 'highshelf') {
    document.getElementById(`range-filter-${type}-Q`).addEventListener('input', (event) => {
      filter.Q.value = event.currentTarget.valueAsNumber;

      if (type === 'lowpass' || type === 'highpass') {
        document.getElementById(`print-filter-${type}-Q`).textContent = `${filter.Q.value} dB`;
      } else {
        document.getElementById(`print-filter-${type}-Q`).textContent = `${filter.Q.value}`;
      }

      render();
    });
  }

  if (type === 'lowshelf' || type === 'highshelf' || type === 'peaking') {
    document.getElementById(`range-filter-${type}-gain`).addEventListener('input', (event) => {
      filter.gain.value = event.currentTarget.valueAsNumber;

      document.getElementById(`print-filter-${type}-gain`).textContent = `${filter.gain.value} dB`;

      render();
    });
  }

  render();
};

const createIIRFilter = (svg) => {
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

  outputText0.textContent = `b(0)x(n)`;

  outputText0.setAttribute('x', (padding + innerWidth / 2 - 40).toString(10));
  outputText0.setAttribute('y', (padding - 24).toString(10));
  outputText0.setAttribute('text-anchor', 'middle');
  outputText0.setAttribute('stroke', 'none');
  outputText0.setAttribute('fill', baseColor);
  outputText0.setAttribute('font-size', '16px');

  const bus0 = createBus(padding, padding, padding + innerWidth, padding);
  const arrow0 = createBusArrow(padding + innerWidth - 8, padding, 'right');

  const renderInput = () => {
    const inputAdderX = padding + innerWidth / 2;
    const inputX = padding + 128;

    const adder0 = createAddElement(inputAdderX, padding);

    const multiplier0 = createMultiplyElement(padding + innerWidth / 3, padding);

    const multiplierText0 = document.createElementNS(xmlns, 'text');

    multiplierText0.textContent = 'b(0)';

    multiplierText0.setAttribute('x', (padding + innerWidth / 3 + 8).toString(10));
    multiplierText0.setAttribute('y', (padding + 36).toString(10));
    multiplierText0.setAttribute('text-anchor', 'middle');
    multiplierText0.setAttribute('stroke', 'none');
    multiplierText0.setAttribute('fill', baseColor);
    multiplierText0.setAttribute('font-size', '16px');

    for (let i = 1; i <= 2; i++) {
      const g = document.createElementNS(xmlns, 'g');

      const busDown = createBus(inputX, padding + 128 * (i - 1) + (i > 1 ? 12 : 0), inputX, padding + 128 * i);
      const bus = createBus(inputX, padding + 128 * i, inputAdderX, padding + 128 * i);
      const busUp = createBus(inputAdderX, padding + 128 * i, inputAdderX, padding + 128 * (i - 1) + 12);

      const arrowDown = createBusArrow(inputX, padding + 128 * i - 24, 'down');
      const arrow = createBusArrow(inputAdderX - 24, padding + 128 * i, 'right');

      const delayElement = createDelayElement(inputX - 20, padding + 128 * i - 12);

      const multiplier = createMultiplyElement(padding + innerWidth / 3, padding + 128 * i);

      const multiplierText = document.createElementNS(xmlns, 'text');

      multiplierText.textContent = `b(${i})`;

      multiplierText.setAttribute('x', (padding + innerWidth / 3 + 8).toString(10));
      multiplierText.setAttribute('y', (padding + 128 * i + 36).toString(10));
      multiplierText.setAttribute('text-anchor', 'middle');
      multiplierText.setAttribute('stroke', 'none');
      multiplierText.setAttribute('fill', baseColor);
      multiplierText.setAttribute('font-size', '16px');

      const outputText = document.createElementNS(xmlns, 'text');

      outputText.textContent = `b(${i})x(n - ${i})`;

      outputText.setAttribute('x', (inputAdderX - 48).toString(10));
      outputText.setAttribute('y', (padding + 128 * i - 24).toString(10));
      outputText.setAttribute('text-anchor', 'middle');
      outputText.setAttribute('stroke', 'none');
      outputText.setAttribute('fill', baseColor);
      outputText.setAttribute('font-size', '16px');

      const adder = createAddElement(inputAdderX, padding + 128 * i);

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

    svg.appendChild(multiplier0);
    svg.appendChild(multiplierText0);
    svg.appendChild(outputText0);
    svg.appendChild(adder0);
  };

  const renderFeedback = () => {
    const feedbackAdderX = padding + innerWidth / 2 + 48;
    const feedbackX = feedbackAdderX + 172;

    const adder0 = createAddElement(feedbackAdderX, padding);

    for (let i = 1; i <= 2; i++) {
      const g = document.createElementNS(xmlns, 'g');

      const busDown = createBus(feedbackX, padding + 128 * (i - 1) + (i > 1 ? 12 : 0), feedbackX, padding + 128 * i);
      const bus = createBus(feedbackX, padding + 128 * i, feedbackAdderX, padding + 128 * i);
      const busUp = createBus(feedbackAdderX, padding + 128 * i, feedbackAdderX, padding + 128 * (i - 1) + 12);

      const arrowDown = createBusArrow(feedbackX, padding + 128 * i - 24, 'down');
      const arrow = createBusArrow(feedbackAdderX + 24, padding + 128 * i, 'left');

      const delayElement = createDelayElement(feedbackX - 20, padding + 128 * i - 12);

      const multiplier = createMultiplyElement(feedbackX - 80, padding + 128 * i, 'left');

      const multiplierText = document.createElementNS(xmlns, 'text');

      multiplierText.textContent = `-a(${i})`;

      multiplierText.setAttribute('x', (feedbackAdderX + 80).toString(10));
      multiplierText.setAttribute('y', (padding + 128 * i + 36).toString(10));
      multiplierText.setAttribute('text-anchor', 'middle');
      multiplierText.setAttribute('stroke', 'none');
      multiplierText.setAttribute('fill', baseColor);
      multiplierText.setAttribute('font-size', '16px');

      const outputText = document.createElementNS(xmlns, 'text');

      outputText.textContent = `-a(${i})y(n - ${i})`;

      outputText.setAttribute('x', (feedbackAdderX + 48).toString(10));
      outputText.setAttribute('y', (padding + 128 * i - 24).toString(10));
      outputText.setAttribute('text-anchor', 'middle');
      outputText.setAttribute('stroke', 'none');
      outputText.setAttribute('fill', baseColor);
      outputText.setAttribute('font-size', '16px');

      const adder = createAddElement(feedbackAdderX, padding + 128 * i);

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

    svg.appendChild(adder0);
  };

  svg.appendChild(bus0);
  svg.appendChild(arrow0);
  svg.appendChild(inputText);
  svg.appendChild(outputText);

  renderInput();
  renderFeedback();
};

const createNodeConnectionsFor3BandsEqualizer = (svg) => {
  const g = document.createElementNS(xmlns, 'g');

  const oscillatorNodeRect = createAudioNode('OscillatorNode', 0, 0);
  const lowshelfRect = createAudioNode2LineText('BiquadFilterNode', '(Bass: Low-Shelving)', 0, 200);
  const peakingRect = createAudioNode2LineText('BiquadFilterNode', '(Middle: Peaking)', 0, 400);
  const highshelfRect = createAudioNode2LineText('BiquadFilterNode', '(Treble: High-Shelving)', 0, 600);
  const audioDestinationNodeRect = createAudioNode('AudioDestinationNode', 0, 800);

  const oscillatorNodeAndLowshelfPath = createConnection(150 - 2, 100, 150 - 2, 300);
  const lowshelfAndPeakingPath = createConnection(150 - 2, 300, 150 - 2, 400);
  const peakingAndHighshelfPath = createConnection(150 - 2, 500, 150 - 2, 600);
  const highshelfAndAudiodDestinationNodePath = createConnection(150 - 2, 700, 150 - 2, 800);

  const oscillatorNodeAndLowshelfArrow = createConnectionArrow(150 - 2, 200 - 14, 'down');
  const lowshelfAndPeakingArrow = createConnectionArrow(150 - 2, 400 - 14, 'down');
  const peakingAndHighshelfArrow = createConnectionArrow(150 - 2, 600 - 14, 'down');
  const highshelfAndAudiodDestinationNodeArrow = createConnectionArrow(150 - 2, 800 - 14, 'down');

  g.appendChild(oscillatorNodeRect);
  g.appendChild(oscillatorNodeAndLowshelfPath);
  g.appendChild(oscillatorNodeAndLowshelfArrow);
  g.appendChild(lowshelfRect);
  g.appendChild(lowshelfAndPeakingPath);
  g.appendChild(lowshelfAndPeakingArrow);
  g.appendChild(peakingRect);
  g.appendChild(peakingAndHighshelfPath);
  g.appendChild(peakingAndHighshelfArrow);
  g.appendChild(highshelfRect);
  g.appendChild(highshelfAndAudiodDestinationNodePath);
  g.appendChild(highshelfAndAudiodDestinationNodeArrow);
  g.appendChild(audioDestinationNodeRect);

  svg.appendChild(g);
};

const renderFrequencyResponse3BandsEqualizer = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const pathBass = document.createElementNS(xmlns, 'path');

  pathBass.setAttribute('stroke', baseColor);
  pathBass.setAttribute('fill', 'none');
  pathBass.setAttribute('stroke-width', lineWidth.toString(10));
  pathBass.setAttribute('stroke-linecap', lineCap);
  pathBass.setAttribute('stroke-linejoin', lineJoin);

  const pathMiddle = document.createElementNS(xmlns, 'path');

  pathMiddle.setAttribute('stroke', waveColor);
  pathMiddle.setAttribute('fill', 'none');
  pathMiddle.setAttribute('stroke-width', lineWidth.toString(10));
  pathMiddle.setAttribute('stroke-linecap', lineCap);
  pathMiddle.setAttribute('stroke-linejoin', lineJoin);

  const pathTreble = document.createElementNS(xmlns, 'path');

  pathTreble.setAttribute('stroke', lightWaveColor);
  pathTreble.setAttribute('fill', 'none');
  pathTreble.setAttribute('stroke-width', lineWidth.toString(10));
  pathTreble.setAttribute('stroke-linecap', lineCap);
  pathTreble.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(pathBass);
  svg.appendChild(pathMiddle);
  svg.appendChild(pathTreble);

  const frequencies = new Float32Array(8000);

  const min = Math.log(10);
  const max = Math.log(20000);
  const diff = max - min;

  for (let i = 0, len = frequencies.length; i < len; i++) {
    const ratio = i / (len - 1);

    frequencies[i] = Math.exp(diff * ratio + min);
  }

  for (let i = 0; i < 10; i++) {
    const x = i * (innerWidth / 9) + padding;

    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', x.toString(10));
    rect.setAttribute('y', padding.toString(10));
    rect.setAttribute('width', lineWidth.toString(10));
    rect.setAttribute('height', innerHeight.toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', alphaBaseColor);

    svg.appendChild(rect);

    const text = document.createElementNS(xmlns, 'text');

    text.textContent = `${Math.trunc(frequencies[i < 9 ? (i + 1) * 800 : 7999])} Hz`;

    text.setAttribute('x', x.toString(10));
    text.setAttribute('y', (padding + innerHeight + 16).toString(10));

    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '12px');

    svg.appendChild(text);
  }

  const dBs = ['24', '18', '12', '6', '0', '-6', '-12', '-18', '-24'];

  for (let i = 0; i < 9; i++) {
    const y = i * (innerHeight / 8) + padding;

    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', padding.toString(10));
    rect.setAttribute('y', y.toString(10));
    rect.setAttribute('width', innerWidth.toString(10));
    rect.setAttribute('height', lineWidth.toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', alphaBaseColor);

    svg.appendChild(rect);

    const text = document.createElementNS(xmlns, 'text');

    text.textContent = `${dBs[i]} dB`;

    text.setAttribute('x', (padding - 8).toString(10));
    text.setAttribute('y', (y + 4).toString(10));

    text.setAttribute('text-anchor', 'end');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '12px');

    svg.appendChild(text);
  }

  const bass = new BiquadFilterNode(audiocontext, { type: 'lowshelf', frequency: 250 });
  const middle = new BiquadFilterNode(audiocontext, { type: 'peaking', frequency: 1000, Q: Math.SQRT1_2 });
  const treble = new BiquadFilterNode(audiocontext, { type: 'highshelf', frequency: 4000 });

  const render = (filter) => {
    const magResponses = new Float32Array(frequencies.length);
    const phaseResponses = new Float32Array(frequencies.length);

    filter.getFrequencyResponse(frequencies, magResponses, phaseResponses);

    let path = null;

    switch (filter.type) {
      case 'lowshelf': {
        path = pathBass;
        break;
      }

      case 'peaking': {
        path = pathMiddle;
        break;
      }

      case 'highshelf': {
        path = pathTreble;
        break;
      }
    }

    if (path === null) {
      return;
    }

    path.removeAttribute('d');

    let d = '';

    for (let i = 0, len = frequencies.length; i < len; i++) {
      const f = frequencies[i];
      const x = (Math.log10(f / 20) / Math.log10(1000)) * innerWidth + padding - 3;
      const dB = 20 * Math.log10(magResponses[i]);
      const y = ((-1 * dB) / 48) * innerHeight + innerHeight / 2 + padding;

      if (x < padding) {
        continue;
      }

      if (y > padding + innerHeight) {
        continue;
      }

      if (d === '') {
        d += `M${x} ${y} `;
      } else {
        d += `L${x} ${y} `;
      }
    }

    path.setAttribute('d', d);
  };

  document.getElementById('range-3-bands-equalizer-bass-gain').addEventListener('input', (event) => {
    bass.gain.value = event.currentTarget.valueAsNumber;

    document.getElementById('print-3-bands-equalizer-bass-gain').textContent = `${bass.gain.value} dB`;

    render(bass);
  });

  document.getElementById('range-3-bands-equalizer-middle-gain').addEventListener('input', (event) => {
    middle.gain.value = event.currentTarget.valueAsNumber;

    document.getElementById('print-3-bands-equalizer-middle-gain').textContent = `${middle.gain.value} dB`;

    render(middle);
  });

  document.getElementById('range-3-bands-equalizer-treble-gain').addEventListener('input', (event) => {
    treble.gain.value = event.currentTarget.valueAsNumber;

    document.getElementById('print-3-bands-equalizer-treble-gain').textContent = `${treble.gain.value} dB`;

    render(treble);
  });

  render(bass);
  render(middle);
  render(treble);
};

const equalizer3bands = () => {
  let frequency = 440;

  let oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth', frequency });

  let isStop = true;

  const bass = new BiquadFilterNode(audiocontext, { type: 'lowshelf', frequency: 250 });
  const middle = new BiquadFilterNode(audiocontext, { type: 'peaking', frequency: 1000, Q: Math.SQRT1_2 });
  const treble = new BiquadFilterNode(audiocontext, { type: 'highshelf', frequency: 4000 });

  const buttonElement = document.getElementById('button-3-bands-equalizer');
  const checkboxElement = document.getElementById('checkbox-3-bands-equalizer');

  const rangeBassElement = document.getElementById('range-3-bands-equalizer-bass');
  const rangeMiddleElement = document.getElementById('range-3-bands-equalizer-middle');
  const rangeTrebleElement = document.getElementById('range-3-bands-equalizer-treble');

  const spanPrintCheckedElement = document.getElementById('print-checked-3-bands-equalizer');
  const spanPrintBassElement = document.getElementById('print-3-bands-equalizer-bass-value');
  const spanPrintMiddleElement = document.getElementById('print-3-bands-equalizer-middle-value');
  const spanPrintTrebleElement = document.getElementById('print-3-bands-equalizer-treble-value');

  const rangeOscillatorFrequencyElement = document.getElementById('range-3-bands-equalizer-oscillator-frequency');
  const spanPrintOscillatorFrequencyElement = document.getElementById('print-3-bands-equalizer-oscillator-frequency-value');

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (!isStop) {
      return;
    }

    if (checkboxElement.checked) {
      oscillator.connect(bass);
      bass.connect(middle);
      middle.connect(treble);
      treble.connect(audiocontext.destination);
    } else {
      oscillator.connect(audiocontext.destination);
    }

    oscillator.start(0);

    isStop = false;

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (isStop) {
      return;
    }

    oscillator.stop(0);

    oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth', frequency });

    isStop = true;

    buttonElement.textContent = 'start';
  };

  checkboxElement.addEventListener('click', () => {
    oscillator.disconnect(0);

    if (checkboxElement.checked) {
      oscillator.connect(bass);
      bass.connect(middle);
      middle.connect(treble);
      treble.connect(audiocontext.destination);

      spanPrintCheckedElement.textContent = 'ON';
    } else {
      oscillator.connect(audiocontext.destination);

      spanPrintCheckedElement.textContent = 'OFF';
    }
  });

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  rangeOscillatorFrequencyElement.addEventListener('input', (event) => {
    frequency = event.currentTarget.valueAsNumber;

    if (oscillator) {
      oscillator.frequency.value = frequency;
    }

    spanPrintOscillatorFrequencyElement.textContent = `${frequency} Hz`;
  });

  rangeBassElement.addEventListener('input', (event) => {
    const gain = event.currentTarget.valueAsNumber;

    bass.gain.value = gain;

    spanPrintBassElement.textContent = `${gain} dB`;
  });

  rangeMiddleElement.addEventListener('input', (event) => {
    const gain = event.currentTarget.valueAsNumber;

    middle.gain.value = gain;

    spanPrintMiddleElement.textContent = `${gain} dB`;
  });

  rangeTrebleElement.addEventListener('input', (event) => {
    const gain = event.currentTarget.valueAsNumber;

    treble.gain.value = gain;

    spanPrintTrebleElement.textContent = `${gain} dB`;
  });
};

const createNodeConnectionsForGraphicEqualizer = (svg) => {
  const g = document.createElementNS(xmlns, 'g');

  const oscillatorNodeRect = createAudioNode('OscillatorNode', 0, 0);
  const peakingRect = createAudioNode('BiquadFilterNode (Peaking) x N', 0, 200);
  const audioDestinationNodeRect = createAudioNode('AudioDestinationNode', 0, 400);

  const oscillatorNodeAndPeakingPath = createConnection(150 - 2, 100, 150 - 2, 300);
  const peakingAndAudiodDestinationNodePath = createConnection(150 - 2, 300, 150 - 2, 400);

  const oscillatorNodeAndPeakingArrow = createConnectionArrow(150 - 2, 200 - 14, 'down');
  const peakingAndAudiodDestinationNodeArrow = createConnectionArrow(150 - 2, 400 - 14, 'down');

  g.appendChild(oscillatorNodeRect);
  g.appendChild(oscillatorNodeAndPeakingPath);
  g.appendChild(oscillatorNodeAndPeakingArrow);
  g.appendChild(peakingRect);
  g.appendChild(peakingAndAudiodDestinationNodePath);
  g.appendChild(peakingAndAudiodDestinationNodeArrow);
  g.appendChild(audioDestinationNodeRect);

  const centerFrequencies = [32, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000].forEach((frequency, index) => {
    const peakingRect = createAudioNode(`Peaking (${frequency} Hz)`, 400, index * 100, 300, 50);

    g.appendChild(peakingRect);

    if (frequency !== 16000) {
      const peakingAndNextPeakingPath = createConnection(550 - 2, (index + 1) * 50 + index * 50, 550 - 2, (index + 1) * 100);
      const peakingAndNextPeakingArrow = createConnectionArrow(550 - 2, (index + 1) * 100 - 14, 'down');

      g.appendChild(peakingAndNextPeakingPath);
      g.appendChild(peakingAndNextPeakingArrow);
    }
  });

  const path0 = document.createElementNS(xmlns, 'path');
  const path1 = document.createElementNS(xmlns, 'path');

  path0.setAttribute('d', `M${300} ${200} L${400} 0`);

  path0.setAttribute('stroke', baseColor);
  path0.setAttribute('fill', 'none');
  path0.setAttribute('stroke-width', lineWidth.toString(10));
  path0.setAttribute('stroke-linecap', lineCap);
  path0.setAttribute('stroke-linejoin', lineJoin);
  path0.setAttribute('stroke-dasharray', '5,5');

  path1.setAttribute('d', `M${300} ${300} L${400} ${950}`);

  path1.setAttribute('stroke', baseColor);
  path1.setAttribute('fill', 'none');
  path1.setAttribute('stroke-width', lineWidth.toString(10));
  path1.setAttribute('stroke-linecap', lineCap);
  path1.setAttribute('stroke-linejoin', lineJoin);
  path1.setAttribute('stroke-dasharray', '5,5');

  g.appendChild(path0);
  g.appendChild(path1);

  svg.appendChild(g);
};

const renderFrequencyResponseGraphicEqualizer = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const g = document.createElementNS(xmlns, 'g');

  const pathFc32Hz = document.createElementNS(xmlns, 'path');
  const pathFc62Hz = document.createElementNS(xmlns, 'path');
  const pathFc125Hz = document.createElementNS(xmlns, 'path');
  const pathFc250Hz = document.createElementNS(xmlns, 'path');
  const pathFc500Hz = document.createElementNS(xmlns, 'path');
  const pathFc1000Hz = document.createElementNS(xmlns, 'path');
  const pathFc2000Hz = document.createElementNS(xmlns, 'path');
  const pathFc4000Hz = document.createElementNS(xmlns, 'path');
  const pathFc8000Hz = document.createElementNS(xmlns, 'path');
  const pathFc16000Hz = document.createElementNS(xmlns, 'path');

  const pathes = [pathFc32Hz, pathFc62Hz, pathFc125Hz, pathFc250Hz, pathFc500Hz, pathFc1000Hz, pathFc2000Hz, pathFc4000Hz, pathFc8000Hz, pathFc16000Hz];

  pathes.forEach((path) => {
    path.setAttribute('stroke', waveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    g.appendChild(path);
  });

  svg.appendChild(g);

  const frequencies = new Float32Array(8000);

  const min = Math.log(10);
  const max = Math.log(20000);
  const diff = max - min;

  for (let i = 0, len = frequencies.length; i < len; i++) {
    const ratio = i / (len - 1);

    frequencies[i] = Math.exp(diff * ratio + min);
  }

  for (let i = 0; i < 10; i++) {
    const x = i * (innerWidth / 9) + padding;

    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', x.toString(10));
    rect.setAttribute('y', padding.toString(10));
    rect.setAttribute('width', lineWidth.toString(10));
    rect.setAttribute('height', innerHeight.toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', alphaBaseColor);

    svg.appendChild(rect);

    const text = document.createElementNS(xmlns, 'text');

    text.textContent = `${Math.trunc(frequencies[i < 9 ? (i + 1) * 800 : 7999])} Hz`;

    text.setAttribute('x', x.toString(10));
    text.setAttribute('y', (padding + innerHeight + 16).toString(10));

    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '12px');

    svg.appendChild(text);
  }

  const dBs = ['24', '18', '12', '6', '0', '-6', '-12', '-18', '-24'];

  for (let i = 0; i < 9; i++) {
    const y = i * (innerHeight / 8) + padding;

    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', padding.toString(10));
    rect.setAttribute('y', y.toString(10));
    rect.setAttribute('width', innerWidth.toString(10));
    rect.setAttribute('height', lineWidth.toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', alphaBaseColor);

    svg.appendChild(rect);

    const text = document.createElementNS(xmlns, 'text');

    text.textContent = `${dBs[i]} dB`;

    text.setAttribute('x', (padding - 8).toString(10));
    text.setAttribute('y', (y + 4).toString(10));

    text.setAttribute('text-anchor', 'end');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '12px');

    svg.appendChild(text);
  }

  const render = (filter, path) => {
    const magResponses = new Float32Array(frequencies.length);
    const phaseResponses = new Float32Array(frequencies.length);

    filter.getFrequencyResponse(frequencies, magResponses, phaseResponses);

    path.removeAttribute('d');

    let d = '';

    for (let i = 0, len = frequencies.length; i < len; i++) {
      const f = frequencies[i];
      const x = (Math.log10(f / 20) / Math.log10(1000)) * innerWidth + padding - 3;
      const dB = 20 * Math.log10(magResponses[i]);
      const y = ((-1 * dB) / 48) * innerHeight + innerHeight / 2 + padding;

      if (x < padding) {
        continue;
      }

      if (y > padding + innerHeight) {
        continue;
      }

      if (d === '') {
        d += `M${x} ${y} `;
      } else {
        d += `L${x} ${y} `;
      }
    }

    path.setAttribute('d', d);
  };

  const centerFrequencies = [32, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

  const peakingFilters = centerFrequencies.map((frequency) => {
    return new BiquadFilterNode(audiocontext, { type: 'peaking', frequency, Q: Math.SQRT1_2 });
  });

  centerFrequencies.forEach((frequency, index) => {
    document.getElementById(`range-graphic-equalizer-${Math.trunc(frequency)}Hz-gain`).addEventListener('input', (event) => {
      const peakingFilter = peakingFilters[index];

      peakingFilter.gain.value = event.currentTarget.valueAsNumber;

      document.getElementById(`print-graphic-equalizer-${Math.trunc(frequency)}Hz-gain`).textContent = `${peakingFilter.gain.value} dB`;

      render(peakingFilter, pathes[index]);
    });
  });

  peakingFilters.forEach((peakingFilter, index) => {
    render(peakingFilter, pathes[index]);
  });
};

const equalizerGraphic = () => {
  let frequency = 440;

  let oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth', frequency });

  let isStop = true;

  const buttonElement = document.getElementById('button-graphic-equalizer');
  const checkboxElement = document.getElementById('checkbox-graphic-equalizer');
  const spanPrintCheckedElement = document.getElementById('print-checked-graphic-equalizer');

  const rangeOscillatorFrequencyElement = document.getElementById('range-graphic-equalizer-oscillator-frequency');
  const spanPrintOscillatorFrequencyElement = document.getElementById('print-graphic-equalizer-oscillator-frequency-value');

  const centerFrequencies = [32, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

  const peakingFilters = centerFrequencies.map((frequency) => {
    return new BiquadFilterNode(audiocontext, { type: 'peaking', frequency, Q: Math.SQRT1_2 });
  });

  centerFrequencies.forEach((frequency, index) => {
    document.getElementById(`range-graphic-equalizer-${Math.trunc(frequency)}Hz`).addEventListener('input', (event) => {
      const peakingFilter = peakingFilters[index];

      peakingFilter.gain.value = event.currentTarget.valueAsNumber;

      document.getElementById(`print-graphic-equalizer-${Math.trunc(frequency)}Hz-value`).textContent = `${peakingFilter.gain.value} dB`;
    });
  });

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (!isStop) {
      return;
    }

    if (checkboxElement.checked) {
      oscillator.connect(peakingFilters[0]);

      for (let i = 0, len = peakingFilters.length - 1; i < len; i++) {
        peakingFilters[i].connect(peakingFilters[i + 1]);
      }

      peakingFilters[peakingFilters.length - 1].connect(audiocontext.destination);
    } else {
      oscillator.connect(audiocontext.destination);
    }

    oscillator.start(0);

    isStop = false;

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (isStop) {
      return;
    }

    oscillator.stop(0);

    oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth', frequency });

    isStop = true;

    buttonElement.textContent = 'start';
  };

  checkboxElement.addEventListener('click', () => {
    oscillator.disconnect(0);

    if (checkboxElement.checked) {
      oscillator.connect(peakingFilters[0]);

      for (let i = 0, len = peakingFilters.length - 1; i < len; i++) {
        peakingFilters[i].connect(peakingFilters[i + 1]);
      }

      peakingFilters[peakingFilters.length - 1].connect(audiocontext.destination);

      spanPrintCheckedElement.textContent = 'ON';
    } else {
      oscillator.connect(audiocontext.destination);

      spanPrintCheckedElement.textContent = 'OFF';
    }
  });

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  rangeOscillatorFrequencyElement.addEventListener('input', (event) => {
    frequency = event.currentTarget.valueAsNumber;

    if (oscillator) {
      oscillator.frequency.value = frequency;
    }

    spanPrintOscillatorFrequencyElement.textContent = `${frequency} Hz`;
  });
};

const renderWahPrinciple = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const buttonElement = document.getElementById('button-wah-principle-animation');

  const path = document.createElementNS(xmlns, 'path');

  path.setAttribute('stroke', waveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  const frequencies = new Float32Array(8000);

  const min = Math.log(10);
  const max = Math.log(20000);
  const diff = max - min;

  for (let i = 0, len = frequencies.length; i < len; i++) {
    const ratio = i / (len - 1);

    frequencies[i] = Math.exp(diff * ratio + min);
  }

  for (let i = 0; i < 10; i++) {
    const x = i * (innerWidth / 9) + padding;

    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', x.toString(10));
    rect.setAttribute('y', padding.toString(10));
    rect.setAttribute('width', lineWidth.toString(10));
    rect.setAttribute('height', innerHeight.toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', alphaBaseColor);

    svg.appendChild(rect);

    const text = document.createElementNS(xmlns, 'text');

    text.textContent = `${Math.trunc(frequencies[i < 9 ? (i + 1) * 800 : 7999])} Hz`;

    text.setAttribute('x', x.toString(10));
    text.setAttribute('y', (padding + innerHeight + 16).toString(10));

    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '12px');

    svg.appendChild(text);
  }

  const dBs = ['24', '18', '12', '6', '0', '-6', '-12', '-18', '-24'];

  for (let i = 0; i < 9; i++) {
    const y = i * (innerHeight / 8) + padding;

    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', padding.toString(10));
    rect.setAttribute('y', y.toString(10));
    rect.setAttribute('width', innerWidth.toString(10));
    rect.setAttribute('height', lineWidth.toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', alphaBaseColor);

    svg.appendChild(rect);

    const text = document.createElementNS(xmlns, 'text');

    text.textContent = `${dBs[i]} dB`;

    text.setAttribute('x', (padding - 8).toString(10));
    text.setAttribute('y', (y + 4).toString(10));

    text.setAttribute('text-anchor', 'end');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '12px');

    svg.appendChild(text);
  }

  const filter = new BiquadFilterNode(audiocontext, { type: 'lowpass', frequency: 250, Q: 15 });

  let timerId = null;

  let isPlus = true;

  const render = (isLoad) => {
    const magResponses = new Float32Array(frequencies.length);
    const phaseResponses = new Float32Array(frequencies.length);

    filter.getFrequencyResponse(frequencies, magResponses, phaseResponses);

    path.removeAttribute('d');

    let d = '';

    for (let i = 0, len = frequencies.length; i < len; i++) {
      const f = frequencies[i];
      const x = (Math.log10(f / 20) / Math.log10(1000)) * innerWidth + padding - 3;
      const dB = 20 * Math.log10(magResponses[i]);
      const y = ((-1 * dB) / 48) * innerHeight + innerHeight / 2 + padding;

      if (x < padding) {
        continue;
      }

      if (y > padding + innerHeight) {
        continue;
      }

      if (d === '') {
        d += `M${x} ${y} `;
      } else {
        d += `L${x} ${y} `;
      }
    }

    path.setAttribute('d', d);

    if (isLoad) {
      return;
    }

    if (isPlus && filter.frequency.value <= 1000) {
      filter.frequency.value += 50;
    } else {
      isPlus = false;
      filter.frequency.value -= 50;

      if (filter.frequency.value <= 250) {
        isPlus = true;
      }
    }

    timerId = window.setTimeout(() => {
      render(false);
    }, 125);
  };

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    render(false);

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
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

  render(true);
};

const createNodeConnectionsForPedalWah = (svg) => {
  const g = document.createElementNS(xmlns, 'g');

  const oscillatorNodeRect = createAudioNode('OscillatorNode', 0, 0);
  const lowpassRect = createAudioNode('BiquadFilterNode (Low-Pass)', 0, 200);
  const audioDestinationNodeRect = createAudioNode('AudioDestinationNode', 0, 400);

  const oscillatorNodeAndLowpassPath = createConnection(150 - 2, 100, 150 - 2, 300);
  const lowpassAndAudiodDestinationNodePath = createConnection(150 - 2, 300, 150 - 2, 400);

  const oscillatorNodeAndLowpassArrow = createConnectionArrow(150 - 2, 200 - 14, 'down');
  const lowpassAndAudiodDestinationNodeArrow = createConnectionArrow(150 - 2, 400 - 14, 'down');

  const lfoRect = createLFO(400, 0);
  const frequencyParamEllipse = createAudioParam('frequency', 350, 300);
  const lfoAndFrequencyParamPath1 = createConnection(545, 100 + 2, 545, 300 - 2, lightWaveColor);
  const lfoAndFrequencyParamPath2 = createConnection(430, 300 - 2, 545, 300 - 2, lightWaveColor);
  const lfoAndFrequencyParamArrow = createConnectionArrow(430 + 12, 300 - 2, 'left', lightWaveColor);

  g.appendChild(oscillatorNodeRect);
  g.appendChild(oscillatorNodeAndLowpassPath);
  g.appendChild(oscillatorNodeAndLowpassArrow);
  g.appendChild(lowpassRect);
  g.appendChild(lowpassAndAudiodDestinationNodePath);
  g.appendChild(lowpassAndAudiodDestinationNodeArrow);
  g.appendChild(audioDestinationNodeRect);

  g.appendChild(lfoRect);
  g.appendChild(frequencyParamEllipse);
  g.appendChild(lfoAndFrequencyParamPath1);
  g.appendChild(lfoAndFrequencyParamPath2);
  g.appendChild(lfoAndFrequencyParamArrow);

  svg.appendChild(g);
};

const pedalWah = () => {
  let cutoff = 1000;
  let depthRate = 0;
  let rateValue = 0;
  let resonance = 1;

  let oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth', frequency: 440 });
  let lfo = new OscillatorNode(audiocontext, { frequency: rateValue });

  let isStop = true;

  const lowpass = new BiquadFilterNode(audiocontext, { type: 'lowpass', frequency: cutoff, Q: resonance });
  const depth = new GainNode(audiocontext, { gain: lowpass.frequency.value * depthRate });

  const buttonElement = document.getElementById('button-pedal-wah');
  const checkboxElement = document.getElementById('checkbox-pedal-wah');

  const rangeCutoffElement = document.getElementById('range-pedal-wah-cutoff');
  const rangeDepthElement = document.getElementById('range-pedal-wah-depth');
  const rangeRateElement = document.getElementById('range-pedal-wah-rate');
  const rangeResonanceElement = document.getElementById('range-pedal-wah-resonance');

  const spanPrintCheckedElement = document.getElementById('print-checked-pedal-wah');
  const spanPrintCutoffElement = document.getElementById('print-pedal-wah-cutoff-value');
  const spanPrintDepthElement = document.getElementById('print-pedal-wah-depth-value');
  const spanPrintRateElement = document.getElementById('print-pedal-wah-rate-value');
  const spanPrintResonanceElement = document.getElementById('print-pedal-wah-resonance-value');

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (!isStop) {
      return;
    }

    if (checkboxElement.checked) {
      oscillator.connect(lowpass);
      lowpass.connect(audiocontext.destination);

      oscillator.start(0);
    } else {
      lowpass.disconnect(0);

      oscillator.connect(audiocontext.destination);

      oscillator.start(0);
    }

    lfo.connect(depth);
    depth.connect(lowpass.frequency);

    lfo.start(0);

    isStop = false;

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (isStop) {
      return;
    }

    oscillator.stop(0);
    lfo.stop(0);

    oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth', frequency: 440 });
    lfo = new OscillatorNode(audiocontext, { frequency: rateValue });

    isStop = true;

    buttonElement.textContent = 'start';
  };

  checkboxElement.addEventListener('click', () => {
    oscillator.disconnect(0);
    lowpass.disconnect(0);
    lfo.disconnect(0);

    if (checkboxElement.checked) {
      oscillator.connect(lowpass);
      lowpass.connect(audiocontext.destination);

      lfo.connect(depth);
      depth.connect(lowpass.frequency);

      spanPrintCheckedElement.textContent = 'ON';
    } else {
      oscillator.connect(audiocontext.destination);

      spanPrintCheckedElement.textContent = 'OFF';
    }
  });

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  rangeCutoffElement.addEventListener('input', (event) => {
    cutoff = event.currentTarget.valueAsNumber;

    lowpass.frequency.value = cutoff;

    spanPrintCutoffElement.textContent = `${cutoff.toString(10)} Hz`;
  });

  rangeDepthElement.addEventListener('input', (event) => {
    depthRate = event.currentTarget.valueAsNumber;

    depth.gain.value = lowpass.frequency.value * depthRate;

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

    lowpass.Q.value = resonance;

    spanPrintResonanceElement.textContent = resonance.toString(10);
  });
};

const vcfAutoWah = () => {
  const cutoff = 1000;
  const targetCutoff = 2000;
  const resonance = 10;

  let attack = 1.0;
  let decay = 0.5;
  let sustain = 0.5;
  let release = 1.0;

  const envelopegenerator = new GainNode(audiocontext);

  let oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth', frequency: 440 });

  let isStop = true;

  const lowpass = new BiquadFilterNode(audiocontext, { type: 'lowpass', frequency: cutoff, Q: resonance });

  const buttonElement = document.getElementById('button-vcf-auto-wah');

  const rangeAttackElement = document.getElementById('range-vcf-auto-wah-attack');
  const rangeDecayElement = document.getElementById('range-vcf-auto-wah-decay');
  const rangeSustainElement = document.getElementById('range-vcf-auto-wah-sustain');
  const rangeReleaseElement = document.getElementById('range-vcf-auto-wah-release');

  const spanPrintAttackElement = document.getElementById('print-vcf-auto-wah-attack-value');
  const spanPrintDecayElement = document.getElementById('print-vcf-auto-wah-decay-value');
  const spanPrintSutainElement = document.getElementById('print-vcf-auto-wah-sustain-value');
  const spanPrintReleaseElement = document.getElementById('print-vcf-auto-wah-release-value');

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (!isStop) {
      return;
    }

    oscillator.connect(envelopegenerator);
    envelopegenerator.connect(lowpass);
    lowpass.connect(audiocontext.destination);

    const t0 = audiocontext.currentTime;
    const t1 = t0 + attack;
    const t2 = decay;

    const t2Level = lowpass.frequency.value * sustain;

    envelopegenerator.gain.cancelScheduledValues(t0);
    envelopegenerator.gain.setValueAtTime(0, t0);
    envelopegenerator.gain.linearRampToValueAtTime(1, t1);
    envelopegenerator.gain.setTargetAtTime(sustain, t1, t2);

    lowpass.frequency.cancelScheduledValues(t0);
    lowpass.frequency.setValueAtTime(cutoff, t0);
    lowpass.frequency.exponentialRampToValueAtTime(targetCutoff, t1);
    lowpass.frequency.setTargetAtTime(t2Level, t1, t2);

    oscillator.start(0);

    isStop = false;

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (isStop) {
      return;
    }

    const t3 = audiocontext.currentTime;
    const t4 = release;

    envelopegenerator.gain.cancelAndHoldAtTime(t3);
    envelopegenerator.gain.setTargetAtTime(0, t3, t4);

    lowpass.frequency.cancelAndHoldAtTime(t3);
    lowpass.frequency.setTargetAtTime(cutoff, t3, t4);

    oscillator.stop(t3 + t4 + 5);

    oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth', frequency: 440 });

    isStop = true;

    buttonElement.textContent = 'start';
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  rangeAttackElement.addEventListener('input', (event) => {
    attack = event.currentTarget.valueAsNumber;

    spanPrintAttackElement.textContent = attack.toString(10);
  });

  rangeDecayElement.addEventListener('input', (event) => {
    decay = event.currentTarget.valueAsNumber;

    spanPrintDecayElement.textContent = decay.toString(10);
  });

  rangeSustainElement.addEventListener('input', (event) => {
    sustain = event.currentTarget.valueAsNumber;

    spanPrintSutainElement.textContent = sustain.toString(10);
  });

  rangeReleaseElement.addEventListener('input', (event) => {
    release = event.currentTarget.valueAsNumber;

    spanPrintReleaseElement.textContent = release.toString(10);
  });
};

const createNodeConnectionsForAutoWah = (svg) => {
  const g = document.createElementNS(xmlns, 'g');

  const oscillatorNodeRect = createAudioNode('OscillatorNode', 0, 0);
  const sensitivityRect = createAudioNode2LineText('BiquadFilterNode (Low-Pass)', '(Sensitivity)', 0, 300);
  const envelopeFollowerRect = createAudioNode2LineText('WaveShaperNode', '(Envelope Follower)', 600, 0);
  const lowpassRect = createAudioNode('BiquadFilterNode (Low-Pass)', 600, 150);
  const depthRect = createAudioNode('GainNode (Depth)', 600, 300);
  const audioDestinationNodeRect = createAudioNode('AudioDestinationNode', 0, 600);

  const oscillatorNodeAndSensitivityPath = createConnection(150 - 2, 100, 150 - 2, 300);
  const sensitivityAndAudiodDestinationNodePath = createConnection(150 - 2, 400, 150 - 2, 600);

  const oscillatorNodeAndSensitivityArrow = createConnectionArrow(150 - 2, 300 - 14, 'down');
  const sensitivityAndAudiodDestinationNodeArrow = createConnectionArrow(150 - 2, 600 - 14, 'down');

  const oscillatorNodeAndEnvelopeFollowerPath = createConnection(300, 50 - 2, 600, 50 - 2, lightWaveColor);
  const oscillatorNodeAndEnvelopeFollowerArrow = createConnectionArrow(600 - 14, 50 - 2, 'right', lightWaveColor);

  const depthAndAudioDestinationPath = createConnection(450, 350 - 2, 600, 350 - 2, lightWaveColor);
  const depthAndAudioDestinationArrow = createConnectionArrow(450 + 12, 350 - 2, 'left', lightWaveColor);

  const envelopeFollowerAndLowpassPath = createConnection(750 - 2, 100, 750 - 2, 150, lightWaveColor);
  const envelopeFollowerAndLowpassArrow = createConnectionArrow(750 - 2, 750 - 14, 'down', lightWaveColor);
  const lowpassAndDepthPath = createConnection(750 - 2, 250, 750 - 2, 300, lightWaveColor);
  const lowpassAndDepthArrow = createConnectionArrow(750 - 2, 300 - 14, 'down', lightWaveColor);

  const frequencyParamEllipse = createAudioParam('frequency', 365, 350);

  g.appendChild(oscillatorNodeRect);
  g.appendChild(oscillatorNodeAndSensitivityPath);
  g.appendChild(sensitivityRect);
  g.appendChild(sensitivityAndAudiodDestinationNodePath);
  g.appendChild(frequencyParamEllipse);
  g.appendChild(audioDestinationNodeRect);

  g.appendChild(oscillatorNodeAndSensitivityArrow);
  g.appendChild(sensitivityAndAudiodDestinationNodeArrow);

  g.appendChild(oscillatorNodeAndEnvelopeFollowerPath);
  g.appendChild(oscillatorNodeAndEnvelopeFollowerArrow);

  g.appendChild(depthAndAudioDestinationPath);
  g.appendChild(depthAndAudioDestinationArrow);

  g.appendChild(envelopeFollowerRect);
  g.appendChild(lowpassRect);
  g.appendChild(depthRect);

  g.appendChild(envelopeFollowerAndLowpassPath);
  g.appendChild(envelopeFollowerAndLowpassArrow);
  g.appendChild(lowpassAndDepthPath);
  g.appendChild(lowpassAndDepthArrow);

  svg.appendChild(g);
};

const autoWah = () => {
  let sensitivityFrequency = 2000;
  let sensitivityDepthRate = 0.5;
  let sensitivityResonance = 10;

  const tremoloDepthValue = 0.25;
  const tremoloRateValue = 1;

  let oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth', frequency: 440 });
  let lfo = new OscillatorNode(audiocontext, { frequency: tremoloRateValue });

  // for Tremolo
  const lfoDepth = new GainNode(audiocontext, { gain: tremoloDepthValue });
  const amplitude = new GainNode(audiocontext, { gain: 0.5 }); // 0.5 +- ${tremoloDepthValue}

  lfo.connect(lfoDepth);
  lfoDepth.connect(amplitude.gain);

  // Start LFO (for simulating amplitude modulation)
  lfo.start(0);

  const envelopeFollower = new WaveShaperNode(audiocontext, { buffer: new Float32Array([1, 0, 1]) });
  const sensitivity = new BiquadFilterNode(audiocontext, { type: 'lowpass', frequency: sensitivityFrequency, Q: sensitivityResonance });
  const lowpass = new BiquadFilterNode(audiocontext, { type: 'lowpass', frequency: 2, Q: 1 });

  const depth = new GainNode(audiocontext, { gain: sensitivity.frequency.value * sensitivityDepthRate });

  let isStop = true;

  const buttonElement = document.getElementById('button-auto-wah');
  const checkboxElement = document.getElementById('checkbox-auto-wah');

  const rangeSensitivityFrequencyElement = document.getElementById('range-auto-wah-sensitivity');
  const rangeSensitivityDepthElement = document.getElementById('range-auto-wah-depth');
  const rangeResonanceElement = document.getElementById('range-auto-wah-resonance');

  const spanPrintCheckedElement = document.getElementById('print-checked-auto-wah');
  const spanPrintSensitivityFrequencyElement = document.getElementById('print-auto-wah-sensitivity-value');
  const spanPrintDepthElement = document.getElementById('print-auto-wah-depth-value');
  const spanPrintResonanceElement = document.getElementById('print-auto-wah-resonance-value');

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (!isStop) {
      return;
    }

    if (checkboxElement.checked) {
      oscillator.connect(amplitude);
      amplitude.connect(sensitivity);
      sensitivity.connect(audiocontext.destination);

      oscillator.connect(envelopeFollower);
      envelopeFollower.connect(lowpass);
      lowpass.connect(depth);
      depth.connect(sensitivity.frequency);

      oscillator.start(0);
    } else {
      oscillator.disconnect(0);

      oscillator.connect(audiocontext.destination);

      // Start oscillator
      oscillator.start(0);
    }

    isStop = false;

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (isStop) {
      return;
    }

    oscillator.stop(0);

    oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth', frequency: 440 });

    isStop = true;

    buttonElement.textContent = 'start';
  };

  checkboxElement.addEventListener('click', () => {
    oscillator.disconnect(0);
    sensitivity.disconnect(0);
    envelopeFollower.disconnect(0);
    lowpass.disconnect(0);
    depth.disconnect(0);

    if (checkboxElement.checked) {
      oscillator.connect(amplitude);
      amplitude.connect(sensitivity);
      sensitivity.connect(audiocontext.destination);

      oscillator.connect(envelopeFollower);
      envelopeFollower.connect(lowpass);
      lowpass.connect(depth);
      depth.connect(sensitivity.frequency);

      spanPrintCheckedElement.textContent = 'ON';
    } else {
      oscillator.connect(audiocontext.destination);

      spanPrintCheckedElement.textContent = 'OFF';
    }
  });

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  rangeSensitivityFrequencyElement.addEventListener('input', (event) => {
    sensitivityFrequency = event.currentTarget.valueAsNumber;

    sensitivity.frequency.value = sensitivityFrequency;

    spanPrintSensitivityFrequencyElement.textContent = `${sensitivityFrequency.toString(10)} Hz`;
  });

  rangeSensitivityDepthElement.addEventListener('input', (event) => {
    sensitivityDepthRate = event.currentTarget.valueAsNumber;

    depth.gain.value = sensitivityFrequency * sensitivityDepthRate;

    spanPrintDepthElement.textContent = sensitivityDepthRate.toString(10);
  });

  rangeResonanceElement.addEventListener('input', (event) => {
    sensitivityResonance = event.currentTarget.valueAsNumber;

    sensitivity.Q.value = sensitivityResonance;

    spanPrintResonanceElement.textContent = sensitivityResonance.toString(10);
  });
};

const createClipping = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const renderSine = (offset, isClipping) => {
    const g = document.createElementNS(xmlns, 'g');

    const width = innerWidth / 2 - padding;

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (offset + padding / 2).toString(10));
    xRect.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
    xRect.setAttribute('width', (width + padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    g.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (offset + padding - 1).toString(10));
    yRect.setAttribute('y', padding.toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', innerHeight.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    g.appendChild(yRect);

    const xText = document.createElementNS(xmlns, 'text');

    xText.textContent = 'Time';

    xText.setAttribute('x', (offset + width + padding).toString(10));
    xText.setAttribute('y', (padding + innerHeight / 2 - 8).toString(10));

    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '16px');

    g.appendChild(xText);

    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = 'Amplitude';

    yText.setAttribute('x', (offset + padding).toString(10));
    yText.setAttribute('y', (padding - 4).toString(10));

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '16px');

    g.appendChild(yText);

    [1, 0, -1].forEach((amplitude, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = amplitude.toString(10);

      text.setAttribute('x', (offset + padding - 8).toString(10));
      text.setAttribute('y', (padding + (innerHeight / 2) * (1 - amplitude) + 12).toString(10));

      text.setAttribute('text-anchor', 'end');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '14px');

      g.appendChild(text);
    });

    const w = 2 * Math.PI;

    const path = document.createElementNS(xmlns, 'path');

    let d = '';

    for (let n = 0, len = sampleRate; n < len; n++) {
      let v = Math.sin((2 * w * n) / sampleRate);

      if (isClipping) {
        if (Math.abs(v) > 0.5) {
          v = v > 0 ? 0.5 : -0.5;
        }
      }

      const x = (n / len) * width + offset + padding;
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

    g.appendChild(path);

    svg.appendChild(g);
  };

  [-0.5, 0.5].forEach((y) => {
    const clippingRect = document.createElementNS(xmlns, 'rect');

    clippingRect.setAttribute('x', padding.toString(10));
    clippingRect.setAttribute('y', (padding + (1 - y) * (innerHeight / 2)).toString(10));
    clippingRect.setAttribute('width', innerWidth.toString(10));
    clippingRect.setAttribute('height', lineWidth.toString(10));
    clippingRect.setAttribute('stroke', 'none');
    clippingRect.setAttribute('fill', alphaLightWaveColor);

    svg.appendChild(clippingRect);
  });

  renderSine(0, false);
  renderSine(innerWidth / 2 + padding, true);
};

const createCurveTable = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const rect = document.createElementNS(xmlns, 'rect');

  rect.setAttribute('x', padding);
  rect.setAttribute('y', padding);
  rect.setAttribute('width', innerWidth.toString(10));
  rect.setAttribute('height', innerHeight.toString(10));
  rect.setAttribute('stroke', lightColor);
  rect.setAttribute('stroke-width', lineWidth.toString(10));
  rect.setAttribute('fill', 'none');

  svg.appendChild(rect);

  const g = document.createElementNS(xmlns, 'g');

  const inputLabel = document.createElementNS(xmlns, 'text');

  inputLabel.textContent = 'Input';

  inputLabel.setAttribute('x', (innerWidth + padding + 40).toString(10));
  inputLabel.setAttribute('y', (padding + innerHeight + 20).toString(10));
  inputLabel.setAttribute('text-anchor', 'middle');
  inputLabel.setAttribute('stroke', 'none');
  inputLabel.setAttribute('fill', baseColor);
  inputLabel.setAttribute('font-size', '16px');

  g.appendChild(inputLabel);

  const outputLabel = document.createElementNS(xmlns, 'text');

  outputLabel.textContent = 'Output';

  outputLabel.setAttribute('x', (padding - 20).toString(10));
  outputLabel.setAttribute('y', (padding - 20).toString(10));
  outputLabel.setAttribute('text-anchor', 'middle');
  outputLabel.setAttribute('stroke', 'none');
  outputLabel.setAttribute('fill', baseColor);
  outputLabel.setAttribute('font-size', '16px');

  g.appendChild(outputLabel);

  ['-1.0', '-0.5', ' 0.0', ' 0.5', ' 1.0'].forEach((x, index) => {
    const text = document.createElementNS(xmlns, 'text');

    text.textContent = x;

    text.setAttribute('x', ((innerWidth / 4) * index + padding).toString(10));
    text.setAttribute('y', (padding + innerHeight + 20).toString(10));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '14px');

    g.appendChild(text);

    if (x === -1 || x === 1) {
      return;
    }

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', ((innerWidth / 4) * index + padding).toString(10));
    xRect.setAttribute('y', padding.toString(10));
    xRect.setAttribute('width', lineWidth.toString(10));
    xRect.setAttribute('height', innerHeight.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', lightColor);

    g.appendChild(xRect);
  });

  ['1.0', '0.5', ' 0.0', '-0.5', '-1.0'].forEach((y, index) => {
    const text = document.createElementNS(xmlns, 'text');

    text.textContent = y;

    text.setAttribute('x', (padding - 20).toString(10));
    text.setAttribute('y', ((innerHeight / 4) * index + padding).toString(10));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '14px');

    g.appendChild(text);

    if (y === -1 || y === 1) {
      return;
    }

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', padding.toString(10));
    yRect.setAttribute('y', ((innerHeight / 4) * index + padding).toString(10));
    yRect.setAttribute('width', innerWidth.toString(10));
    yRect.setAttribute('height', lineWidth.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', lightColor);

    g.appendChild(yRect);
  });

  svg.appendChild(g);

  let type = '';
  let numberOfSamples = 4096;
  let amount = 0;
  let step = 2;

  const createLinearPath = () => {
    const path = document.createElementNS(xmlns, 'path');

    path.setAttribute('d', `M${padding} ${padding + innerHeight} L${padding + innerWidth} ${padding}`);
    path.setAttribute('stroke', waveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    return path;
  };

  const createSigmoidFunctionPath = () => {
    const path = document.createElementNS(xmlns, 'path');

    path.setAttribute('stroke', waveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    let d = '';

    for (let n = 0; n < numberOfSamples; n++) {
      const x = 3 * (amount + 1) * (n / numberOfSamples - 0.5);
      const y = 1 / (1 + Math.exp(-x));

      if (n === 0) {
        d += `M${n * (innerWidth / numberOfSamples) + padding} ${(1 - y) * innerHeight + padding}`;
      } else {
        d += ` L${n * (innerWidth / numberOfSamples) + padding} ${(1 - y) * innerHeight + padding}`;
      }
    }

    path.setAttribute('d', d);

    return path;
  };

  const createOverdriveCurvePath = () => {
    const path = document.createElementNS(xmlns, 'path');

    path.setAttribute('stroke', waveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    if (amount < 0 || amount >= 1) {
      return path;
    }

    const k = (2 * amount) / (1 - amount);

    let d = '';

    for (let n = 0; n < numberOfSamples; n++) {
      const x = ((n - 0) * (1 - -1)) / (numberOfSamples - 0) + -1;
      const y = ((1 + k) * x) / (1 + k * Math.abs(x));

      if (n === 0) {
        d += `M${n * (innerWidth / numberOfSamples) + padding} ${(1 - y) * (innerHeight / 2) + padding}`;
      } else {
        d += ` L${n * (innerWidth / numberOfSamples) + padding} ${(1 - y) * (innerHeight / 2) + padding}`;
      }
    }

    path.setAttribute('d', d);

    return path;
  };

  const createAsymmetricalOverdriveCurvePath = () => {
    const path = document.createElementNS(xmlns, 'path');

    path.setAttribute('stroke', waveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    if (amount < 0 || amount >= 1) {
      return path;
    }

    const k = (2 * amount) / (1 - amount);

    let d = '';

    for (let n = 0; n < numberOfSamples; n++) {
      const x = ((n - 0) * (1 - -1)) / (numberOfSamples - 0) + -1;
      const v = ((1 + k) * x) / (1 + k * Math.abs(x));

      const y = v > 0 ? v : (1 - (amount > 0.5 ? 0.5 : amount)) * v;

      if (n === 0) {
        d += `M${n * (innerWidth / numberOfSamples) + padding} ${(1 - y) * (innerHeight / 2) + padding}`;
      } else {
        d += ` L${n * (innerWidth / numberOfSamples) + padding} ${(1 - y) * (innerHeight / 2) + padding}`;
      }
    }

    path.setAttribute('d', d);

    return path;
  };

  const createFullWaveRectifierPath = () => {
    const path = document.createElementNS(xmlns, 'path');

    path.setAttribute('d', `M${padding} ${padding} L${padding + innerWidth / 2} ${padding + innerHeight / 2} L${padding + innerWidth} ${padding}`);
    path.setAttribute('stroke', waveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    return path;
  };

  const createHalfWaveRectifierPath = () => {
    const path = document.createElementNS(xmlns, 'path');

    path.setAttribute(
      'd',
      `M${padding} ${padding + innerHeight / 2} L${padding + innerWidth / 2} ${padding + innerHeight / 2} L${padding + innerWidth} ${padding}`
    );
    path.setAttribute('stroke', waveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    return path;
  };

  const createFullWaveRectifierAndHardClippingPath = () => {
    const path = document.createElementNS(xmlns, 'path');

    path.setAttribute(
      'd',
      `M${padding} ${padding + amount * (innerHeight / 2)} L${padding + amount * (innerWidth / 2)} ${padding + amount * (innerHeight / 2)} L${padding + innerWidth / 2} ${padding + innerHeight / 2} L${padding + innerWidth - amount * (innerWidth / 2)} ${padding + amount * (innerHeight / 2)} L${padding + innerWidth} ${padding + amount * (innerHeight / 2)}`
    );
    path.setAttribute('stroke', waveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    return path;
  };

  const createHalfWaveRectifierAndHardClippingPath = () => {
    const path = document.createElementNS(xmlns, 'path');

    path.setAttribute(
      'd',
      `M${padding} ${padding + innerHeight / 2} L${padding + innerWidth / 2} ${padding + innerHeight / 2} L${padding + innerWidth - amount * (innerWidth / 2)} ${padding + amount * (innerHeight / 2)} L${padding + innerWidth} ${padding + amount * (innerHeight / 2)}`
    );
    path.setAttribute('stroke', waveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    return path;
  };

  const createBitCrusherPath = () => {
    const path = document.createElementNS(xmlns, 'path');

    path.setAttribute('stroke', waveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    let d = '';

    for (let n = 0; n < numberOfSamples; n++) {
      const y = (((n / numberOfSamples) * step) | 0) / (2 * (step - 1)) - 1;

      if (n === 0) {
        d += `M${n * (innerWidth / numberOfSamples) + padding} ${-1 * y * (innerHeight / 2) + padding}`;
      } else {
        d += ` L${n * (innerWidth / numberOfSamples) + padding} ${-1 * y * (innerHeight / 2) + padding}`;
      }
    }

    path.setAttribute('d', d);

    return path;
  };

  let curvePath = null;

  const renderCurve = () => {
    if (curvePath) {
      svg.removeChild(curvePath);
    }

    switch (type) {
      case 'sigmoid': {
        curvePath = createSigmoidFunctionPath();
        break;
      }

      case 'overdrive': {
        curvePath = createOverdriveCurvePath();
        break;
      }

      case 'asymmetrical-overdrive': {
        curvePath = createAsymmetricalOverdriveCurvePath();
        break;
      }

      case 'full-wave-rectifier': {
        curvePath = createFullWaveRectifierPath();
        break;
      }

      case 'half-wave-rectifier': {
        curvePath = createHalfWaveRectifierPath();
        break;
      }

      case 'full-wave-rectifier-and-hard-clipping': {
        curvePath = createFullWaveRectifierAndHardClippingPath();
        break;
      }

      case 'half-wave-rectifier-and-hard-clipping': {
        curvePath = createHalfWaveRectifierAndHardClippingPath();
        break;
      }

      case 'bitcrusher': {
        curvePath = createBitCrusherPath();
        break;
      }

      default: {
        curvePath = createLinearPath();
        break;
      }
    }

    svg.appendChild(curvePath);
  };

  const selectCurveTypeElement = document.getElementById('svg-figure-wave-shaper-node-curve-select-curve-type');
  const rangeCurveSizeElement = document.getElementById('svg-figure-wave-shaper-node-curve-range-curve-size');
  const rangeAmountElement = document.getElementById('svg-figure-wave-shaper-node-curve-range-amount');
  const rangeStepElement = document.getElementById('svg-figure-wave-shaper-node-curve-range-step');

  const spanPrintCurveSizeElement = document.getElementById('svg-figure-wave-shaper-node-curve-range-curve-size-value');
  const spanPrintAmountElement = document.getElementById('svg-figure-wave-shaper-node-curve-range-amount-value');
  const spanPrintStepElement = document.getElementById('svg-figure-wave-shaper-node-curve-range-step-value');

  rangeCurveSizeElement.setAttribute('disabled', 'disabled');
  rangeAmountElement.setAttribute('disabled', 'disabled');
  rangeStepElement.setAttribute('disabled', 'disabled');

  selectCurveTypeElement.addEventListener('input', (event) => {
    type = event.currentTarget.value;

    rangeCurveSizeElement.removeAttribute('disabled');
    rangeAmountElement.removeAttribute('disabled');
    rangeStepElement.removeAttribute('disabled');

    switch (type) {
      case 'sigmoid':
      case 'overdrive':
      case 'asymmetrical-overdrive': {
        rangeStepElement.setAttribute('disabled', 'disabled');
        break;
      }

      case 'full-wave-rectifier-and-hard-clipping':
      case 'half-wave-rectifier-and-hard-clipping': {
        rangeCurveSizeElement.setAttribute('disabled', 'disabled');
        rangeStepElement.setAttribute('disabled', 'disabled');
        break;
      }

      case 'bitcrusher': {
        rangeAmountElement.setAttribute('disabled', 'disabled');
        break;
      }

      case 'full-wave--follower':
      case 'half-wave-rectifier':
      default: {
        rangeCurveSizeElement.setAttribute('disabled', 'disabled');
        rangeAmountElement.setAttribute('disabled', 'disabled');
        rangeStepElement.setAttribute('disabled', 'disabled');
        break;
      }
    }

    renderCurve();
  });

  rangeCurveSizeElement.addEventListener('input', (event) => {
    numberOfSamples = event.currentTarget.valueAsNumber;

    spanPrintCurveSizeElement.textContent = numberOfSamples.toString(10);

    renderCurve();
  });

  rangeAmountElement.addEventListener('input', (event) => {
    amount = event.currentTarget.valueAsNumber;

    spanPrintAmountElement.textContent = amount.toString(10);

    renderCurve();
  });

  rangeStepElement.addEventListener('input', (event) => {
    step = event.currentTarget.valueAsNumber;

    spanPrintStepElement.textContent = step.toString(10);

    renderCurve();
  });

  renderCurve();
};

const createNodeConnectionsForWaveShaperNode = (svg) => {
  const g = document.createElementNS(xmlns, 'g');

  const oscillatorNodeRect = createAudioNode('OscillatorNode', 0, 0);
  const waveShaperNodeRect = createAudioNode('WaveShaperNode', 0, 200);
  const audioDestinationNodeRect = createAudioNode('AudioDestinationNode', 0, 400);

  const oscillatorNodeAndWaveShaperNodePath = createConnection(150 - 2, 100, 150 - 2, 300);
  const waveShaperNodeAndAudiodDestinationNodePath = createConnection(150 - 2, 300, 150 - 2, 400);

  const oscillatorNodeAndWaveShaperNodeArrow = createConnectionArrow(150 - 2, 200 - 14, 'down');
  const waveShaperNodeAndAudiodDestinationNodeArrow = createConnectionArrow(150 - 2, 400 - 14, 'down');

  g.appendChild(oscillatorNodeRect);
  g.appendChild(oscillatorNodeAndWaveShaperNodePath);
  g.appendChild(oscillatorNodeAndWaveShaperNodeArrow);
  g.appendChild(waveShaperNodeRect);
  g.appendChild(waveShaperNodeAndAudiodDestinationNodePath);
  g.appendChild(waveShaperNodeAndAudiodDestinationNodeArrow);
  g.appendChild(audioDestinationNodeRect);

  svg.appendChild(g);
};

const createAsymmetricalClipping = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const renderClipping = (offset, isAsymmetric) => {
    const g = document.createElementNS(xmlns, 'g');

    const width = innerWidth / 2 - padding;

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (offset + padding / 2).toString(10));
    xRect.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
    xRect.setAttribute('width', (width + padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    g.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (offset + padding - 1).toString(10));
    yRect.setAttribute('y', padding.toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', innerHeight.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    g.appendChild(yRect);

    const xText = document.createElementNS(xmlns, 'text');

    xText.textContent = 'Time';

    xText.setAttribute('x', (offset + width + padding).toString(10));
    xText.setAttribute('y', (padding + innerHeight / 2 - 8).toString(10));

    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '16px');

    g.appendChild(xText);

    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = 'Amplitude';

    yText.setAttribute('x', (offset + padding).toString(10));
    yText.setAttribute('y', (padding - 4).toString(10));

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '16px');

    g.appendChild(yText);

    [1, 0, -1].forEach((amplitude, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = amplitude.toString(10);

      text.setAttribute('x', (offset + padding - 8).toString(10));
      text.setAttribute('y', (padding + (innerHeight / 2) * (1 - amplitude) + 12).toString(10));

      text.setAttribute('text-anchor', 'end');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '14px');

      g.appendChild(text);
    });

    if (isAsymmetric) {
      [-0.25, 0.5].forEach((y) => {
        const clippingRect = document.createElementNS(xmlns, 'rect');

        clippingRect.setAttribute('x', (offset + padding).toString(10));
        clippingRect.setAttribute('y', (padding + (1 - y) * (innerHeight / 2)).toString(10));
        clippingRect.setAttribute('width', width.toString(10));
        clippingRect.setAttribute('height', lineWidth.toString(10));
        clippingRect.setAttribute('stroke', 'none');
        clippingRect.setAttribute('fill', alphaLightWaveColor);

        g.appendChild(clippingRect);
      });
    } else {
      [-0.5, 0.5].forEach((y) => {
        const clippingRect = document.createElementNS(xmlns, 'rect');

        clippingRect.setAttribute('x', (offset + padding).toString(10));
        clippingRect.setAttribute('y', (padding + (1 - y) * (innerHeight / 2)).toString(10));
        clippingRect.setAttribute('width', width.toString(10));
        clippingRect.setAttribute('height', lineWidth.toString(10));
        clippingRect.setAttribute('stroke', 'none');
        clippingRect.setAttribute('fill', alphaLightWaveColor);

        g.appendChild(clippingRect);
      });
    }

    const w = 2 * Math.PI;

    const sinePath = document.createElementNS(xmlns, 'path');

    let sinePathD = '';

    for (let n = 0, len = sampleRate; n < len; n++) {
      const v = Math.sin((2 * w * n) / sampleRate);

      const x = (n / len) * width + offset + padding;
      const y = (1 - v) * (innerHeight / 2) + padding;

      if (n === 0) {
        sinePathD += `M${x + lineWidth / 2} ${y}`;
      } else {
        sinePathD += ` L${x} ${y}`;
      }
    }

    sinePath.setAttribute('d', sinePathD);

    sinePath.setAttribute('stroke', alphaWaveColor);
    sinePath.setAttribute('fill', 'none');
    sinePath.setAttribute('stroke-width', lineWidth.toString(10));
    sinePath.setAttribute('stroke-linecap', lineCap);
    sinePath.setAttribute('stroke-linejoin', lineJoin);
    sinePath.setAttribute('stroke-dasharray', '5,5');

    g.appendChild(sinePath);

    const path = document.createElementNS(xmlns, 'path');

    let d = '';

    for (let n = 0, len = sampleRate; n < len; n++) {
      let v = Math.sin((2 * w * n) / sampleRate);

      if (isAsymmetric) {
        if (v > 0.5) {
          v = 0.5;
        }

        if (v < -0.25) {
          v = -0.25;
        }
      } else {
        if (Math.abs(v) > 0.5) {
          v = v > 0 ? 0.5 : -0.5;
        }
      }

      const x = (n / len) * width + offset + padding;
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

    g.appendChild(path);

    svg.appendChild(g);
  };

  renderClipping(0, false);
  renderClipping(innerWidth / 2 + padding, true);
};

const createSoftAndHardClipping = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const renderClipping = (offset, isHard) => {
    const g = document.createElementNS(xmlns, 'g');

    const width = innerWidth / 2 - padding;

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (offset + padding / 2).toString(10));
    xRect.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
    xRect.setAttribute('width', (width + padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    g.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (offset + padding - 1).toString(10));
    yRect.setAttribute('y', padding.toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', innerHeight.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    g.appendChild(yRect);

    const xText = document.createElementNS(xmlns, 'text');

    xText.textContent = 'Time';

    xText.setAttribute('x', (offset + width + padding).toString(10));
    xText.setAttribute('y', (padding + innerHeight / 2 - 8).toString(10));

    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '16px');

    g.appendChild(xText);

    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = 'Amplitude';

    yText.setAttribute('x', (offset + padding).toString(10));
    yText.setAttribute('y', (padding - 4).toString(10));

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '16px');

    g.appendChild(yText);

    [1, 0, -1].forEach((amplitude, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = amplitude.toString(10);

      text.setAttribute('x', (offset + padding - 8).toString(10));
      text.setAttribute('y', (padding + (innerHeight / 2) * (1 - amplitude) + 12).toString(10));

      text.setAttribute('text-anchor', 'end');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '14px');

      g.appendChild(text);
    });

    const w = 2 * Math.PI;

    const sinePath = document.createElementNS(xmlns, 'path');

    let sinePathD = '';

    for (let n = 0, len = sampleRate; n < len; n++) {
      const v = Math.sin((2 * w * n) / sampleRate);

      const x = (n / len) * width + offset + padding;
      const y = (1 - v) * (innerHeight / 2) + padding;

      if (n === 0) {
        sinePathD += `M${x + lineWidth / 2} ${y}`;
      } else {
        sinePathD += ` L${x} ${y}`;
      }
    }

    sinePath.setAttribute('d', sinePathD);

    sinePath.setAttribute('stroke', alphaWaveColor);
    sinePath.setAttribute('fill', 'none');
    sinePath.setAttribute('stroke-width', lineWidth.toString(10));
    sinePath.setAttribute('stroke-linecap', lineCap);
    sinePath.setAttribute('stroke-linejoin', lineJoin);
    sinePath.setAttribute('stroke-dasharray', '5,5');

    g.appendChild(sinePath);

    const path = document.createElementNS(xmlns, 'path');

    let d = '';

    for (let n = 0, len = sampleRate; n < len; n++) {
      let v = Math.sin((2 * w * n) / sampleRate);

      if (Math.abs(v) > 0.5) {
        if (isHard) {
          v = v > 0 ? 0.5 : -0.5;
        } else {
          v = 0.4 * v + (v > 0 ? 0.3 : -0.3);
        }
      }

      const x = (n / len) * width + offset + padding;
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

    g.appendChild(path);

    svg.appendChild(g);
  };

  [-0.5, 0.5].forEach((y) => {
    const clippingRect = document.createElementNS(xmlns, 'rect');

    clippingRect.setAttribute('x', padding.toString(10));
    clippingRect.setAttribute('y', (padding + (1 - y) * (innerHeight / 2)).toString(10));
    clippingRect.setAttribute('width', innerWidth.toString(10));
    clippingRect.setAttribute('height', lineWidth.toString(10));
    clippingRect.setAttribute('stroke', 'none');
    clippingRect.setAttribute('fill', alphaLightWaveColor);

    svg.appendChild(clippingRect);
  });

  renderClipping(0, false);
  renderClipping(innerWidth / 2 + padding, true);
};

const createRectification = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const renderRectification = (offset, isFull) => {
    const g = document.createElementNS(xmlns, 'g');

    const width = innerWidth / 2 - padding;

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (offset + padding / 2).toString(10));
    xRect.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
    xRect.setAttribute('width', (width + padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    g.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (offset + padding - 1).toString(10));
    yRect.setAttribute('y', padding.toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', innerHeight.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    g.appendChild(yRect);

    const xText = document.createElementNS(xmlns, 'text');

    xText.textContent = 'Time';

    xText.setAttribute('x', (offset + width + padding).toString(10));
    xText.setAttribute('y', (padding + innerHeight / 2 - 8).toString(10));

    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '16px');

    g.appendChild(xText);

    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = 'Amplitude';

    yText.setAttribute('x', (offset + padding).toString(10));
    yText.setAttribute('y', (padding - 4).toString(10));

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '16px');

    g.appendChild(yText);

    [1, 0, -1].forEach((amplitude, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = amplitude.toString(10);

      text.setAttribute('x', (offset + padding - 8).toString(10));
      text.setAttribute('y', (padding + (innerHeight / 2) * (1 - amplitude) + 12).toString(10));

      text.setAttribute('text-anchor', 'end');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '14px');

      g.appendChild(text);
    });

    const w = 2 * Math.PI;

    const sinePath = document.createElementNS(xmlns, 'path');

    let sinePathD = '';

    for (let n = 0, len = sampleRate; n < len; n++) {
      const v = Math.sin((2 * w * n) / sampleRate);

      const x = (n / len) * width + offset + padding;
      const y = (1 - v) * (innerHeight / 2) + padding;

      if (n === 0) {
        sinePathD += `M${x + lineWidth / 2} ${y}`;
      } else {
        sinePathD += ` L${x} ${y}`;
      }
    }

    sinePath.setAttribute('d', sinePathD);

    sinePath.setAttribute('stroke', alphaWaveColor);
    sinePath.setAttribute('fill', 'none');
    sinePath.setAttribute('stroke-width', lineWidth.toString(10));
    sinePath.setAttribute('stroke-linecap', lineCap);
    sinePath.setAttribute('stroke-linejoin', lineJoin);
    sinePath.setAttribute('stroke-dasharray', '5,5');

    g.appendChild(sinePath);

    const path = document.createElementNS(xmlns, 'path');

    let d = '';

    for (let n = 0, len = sampleRate; n < len; n++) {
      let v = Math.sin((2 * w * n) / sampleRate);

      if (v < 0) {
        v = isFull ? Math.abs(v) : 0;
      }

      const x = (n / len) * width + offset + padding;
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

    g.appendChild(path);

    svg.appendChild(g);
  };

  renderRectification(0, true);
  renderRectification(innerWidth / 2 + padding, false);
};

const createFuzz = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const renderRectifier = (offset, isFull) => {
    const g = document.createElementNS(xmlns, 'g');

    const width = innerWidth / 2 - padding;

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (offset + padding / 2).toString(10));
    xRect.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
    xRect.setAttribute('width', (width + padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    g.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (offset + padding - 1).toString(10));
    yRect.setAttribute('y', padding.toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', innerHeight.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    g.appendChild(yRect);

    const xText = document.createElementNS(xmlns, 'text');

    xText.textContent = 'Time';

    xText.setAttribute('x', (offset + width + padding).toString(10));
    xText.setAttribute('y', (padding + innerHeight / 2 - 8).toString(10));

    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '16px');

    g.appendChild(xText);

    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = 'Amplitude';

    yText.setAttribute('x', (offset + padding).toString(10));
    yText.setAttribute('y', (padding - 4).toString(10));

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '16px');

    g.appendChild(yText);

    [1, 0, -1].forEach((amplitude, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = amplitude.toString(10);

      text.setAttribute('x', (offset + padding - 8).toString(10));
      text.setAttribute('y', (padding + (innerHeight / 2) * (1 - amplitude) + 12).toString(10));

      text.setAttribute('text-anchor', 'end');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '14px');

      g.appendChild(text);
    });

    const w = 2 * Math.PI;

    const sinePath = document.createElementNS(xmlns, 'path');

    let sinePathD = '';

    for (let n = 0, len = sampleRate; n < len; n++) {
      const v = Math.sin((2 * w * n) / sampleRate);

      const x = (n / len) * width + offset + padding;
      const y = (1 - v) * (innerHeight / 2) + padding;

      if (n === 0) {
        sinePathD += `M${x + lineWidth / 2} ${y}`;
      } else {
        sinePathD += ` L${x} ${y}`;
      }
    }

    sinePath.setAttribute('d', sinePathD);

    sinePath.setAttribute('stroke', alphaWaveColor);
    sinePath.setAttribute('fill', 'none');
    sinePath.setAttribute('stroke-width', lineWidth.toString(10));
    sinePath.setAttribute('stroke-linecap', lineCap);
    sinePath.setAttribute('stroke-linejoin', lineJoin);
    sinePath.setAttribute('stroke-dasharray', '5,5');

    g.appendChild(sinePath);

    const path = document.createElementNS(xmlns, 'path');

    let d = '';

    for (let n = 0, len = sampleRate; n < len; n++) {
      let v = Math.sin((2 * w * n) / sampleRate);

      if (v < 0) {
        v = isFull ? Math.abs(v) : 0;
      }

      if (v > 0.5) {
        v = 0.5;
      }

      const x = (n / len) * width + offset + padding;
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

    g.appendChild(path);

    svg.appendChild(g);
  };

  [-0.5, 0.5].forEach((y) => {
    const clippingRect = document.createElementNS(xmlns, 'rect');

    clippingRect.setAttribute('x', padding.toString(10));
    clippingRect.setAttribute('y', (padding + (1 - y) * (innerHeight / 2)).toString(10));
    clippingRect.setAttribute('width', innerWidth.toString(10));
    clippingRect.setAttribute('height', lineWidth.toString(10));
    clippingRect.setAttribute('stroke', 'none');
    clippingRect.setAttribute('fill', alphaLightWaveColor);

    svg.appendChild(clippingRect);
  });

  renderRectifier(0, true);
  renderRectifier(innerWidth / 2 + padding, false);
};

const createNodeConnectionsForAmpSimulator = (svg, withSpeakerSimulator) => {
  const g = document.createElementNS(xmlns, 'g');

  const audioBufferSourceNodeRect = createAudioNode('AudioBufferSourceNode (Input)', 0, 0, 700, 100);

  const preHighpass1NodeRect = createAudioNode('High-Pass Filter', 0, 150, 300, 100);
  const preLowpassNodeRect = createAudioNode('Low-Pass Filter', 0, 300, 300, 100);
  const normallGainNodeRect = createAudioNode('GainNode (Normal)', 0, 450, 300, 100);

  const preHighpass2NodeRect = createAudioNode('High-Pass Filter', 400, 150, 300, 100);
  const highTrebleGainNodeRect = createAudioNode('GainNode (High Treble)', 400, 450, 300, 100);

  const preHighpass3NodeRect = createAudioNode('High-Pass Filter', 0, 650, 700, 100);

  const preClippingNodeRect = createAudioNode('WaveShaperNode (Pre Clipping)', 0, 850, 700, 100);
  const lowpassNodeRect = createAudioNode('Low-Pass Filter', 0, 1000, 700, 100);
  const highpassNodeRect = createAudioNode('High-Pass Filter', 0, 1150, 700, 100);
  const postClippingNodeRect = createAudioNode('WaveShaperNode (Post Clipping)', 0, 1300, 700, 100);

  const postEqualizerNodeRect = createAudioNode('3 Bands Equalizer (Post Equalizer)', 0, 1500, 700, 100);

  g.appendChild(audioBufferSourceNodeRect);
  g.appendChild(preHighpass1NodeRect);
  g.appendChild(preLowpassNodeRect);
  g.appendChild(normallGainNodeRect);

  g.appendChild(preHighpass2NodeRect);
  g.appendChild(highTrebleGainNodeRect);

  g.appendChild(preHighpass3NodeRect);

  g.appendChild(preClippingNodeRect);
  g.appendChild(lowpassNodeRect);
  g.appendChild(highpassNodeRect);
  g.appendChild(postClippingNodeRect);

  g.appendChild(postEqualizerNodeRect);

  const audioBufferSourceNodeAndPreHighpass1NodePath = createConnection(150 - 2, 100, 150 - 2, 150);
  const audioBufferSourceNodeAndPreHighpass1NodeArrow = createConnectionArrow(150 - 2, 150 - 14, 'down');
  const preHighpassNodeAndPreLowpass1NodePath = createConnection(150 - 2, 250, 150 - 2, 300);
  const preHighpassNodeAndPreLowpass1NodeArrow = createConnectionArrow(150 - 2, 300 - 14, 'down');
  const preLowpassNodeAndNormalGainNodePath = createConnection(150 - 2, 400, 150 - 2, 450);
  const preLowpassNodeAndNormalGainNodeArrow = createConnectionArrow(150 - 2, 450 - 14, 'down');
  const normalGainNodeAndPreHighpass3NodePath = createConnection(150 - 2, 550, 150 - 2, 650);
  const normalGainNodeAndPreHighpass3NodeArrow = createConnectionArrow(150 - 2, 650 - 14, 'down');

  g.appendChild(audioBufferSourceNodeAndPreHighpass1NodePath);
  g.appendChild(audioBufferSourceNodeAndPreHighpass1NodeArrow);
  g.appendChild(preHighpassNodeAndPreLowpass1NodePath);
  g.appendChild(preHighpassNodeAndPreLowpass1NodeArrow);
  g.appendChild(preLowpassNodeAndNormalGainNodePath);
  g.appendChild(preLowpassNodeAndNormalGainNodeArrow);
  g.appendChild(normalGainNodeAndPreHighpass3NodePath);
  g.appendChild(normalGainNodeAndPreHighpass3NodeArrow);

  const audioBufferSourceNodeAndPreHighpass2NodePath = createConnection(550 - 2, 100, 550 - 2, 150);
  const audioBufferSourceNodeAndPreHighpass2NodeArrow = createConnectionArrow(550 - 2, 150 - 14, 'down');
  const preHighpass2NodeAndHighTrebleGainNodePath = createConnection(550 - 2, 250, 550 - 2, 450);
  const preHighpass2NodeAndHighTrebleGainNodeArrow = createConnectionArrow(550 - 2, 450 - 14, 'down');
  const highTrebleGainNodeAndPreHighpass3NodePath = createConnection(550 - 2, 550, 550 - 2, 650);
  const highTrebleGainNodeAndPreHighpass3NodeArrow = createConnectionArrow(550 - 2, 650 - 14, 'down');

  g.appendChild(audioBufferSourceNodeAndPreHighpass2NodePath);
  g.appendChild(audioBufferSourceNodeAndPreHighpass2NodeArrow);
  g.appendChild(preHighpass2NodeAndHighTrebleGainNodePath);
  g.appendChild(preHighpass2NodeAndHighTrebleGainNodeArrow);
  g.appendChild(highTrebleGainNodeAndPreHighpass3NodePath);
  g.appendChild(highTrebleGainNodeAndPreHighpass3NodeArrow);

  const preHighpass3NodeAndPreClippingNodePath = createConnection(350 - 2, 750, 350 - 2, 850);
  const preHighpass3NodeAndPreClippingNodeArrow = createConnectionArrow(350 - 2, 850 - 14, 'down');
  const preClippingNodeLowpassNodePath = createConnection(350 - 2, 950, 350 - 2, 1000);
  const preClippingNodeLowpassNodeArrow = createConnectionArrow(350 - 2, 1000 - 14, 'down');
  const lowpassNodeAndHighpassNodePath = createConnection(350 - 2, 1100, 350 - 2, 1150);
  const lowpassNodeAndHighpassNodeArrow = createConnectionArrow(350 - 2, 1150 - 14, 'down');
  const highpassNodePostClippingNodePath = createConnection(350 - 2, 1250, 350 - 2, 1300);
  const highpassNodePostClippingNodeArrow = createConnectionArrow(350 - 2, 1300 - 14, 'down');
  const postClippingNodePostEqualizerNodePath = createConnection(350 - 2, 1400, 350 - 2, 1500);
  const postClippingNodePostEqualizerNodeArrow = createConnectionArrow(350 - 2, 1500 - 14, 'down');

  g.appendChild(preHighpass3NodeAndPreClippingNodePath);
  g.appendChild(preHighpass3NodeAndPreClippingNodeArrow);
  g.appendChild(preClippingNodeLowpassNodePath);
  g.appendChild(preClippingNodeLowpassNodeArrow);
  g.appendChild(lowpassNodeAndHighpassNodePath);
  g.appendChild(lowpassNodeAndHighpassNodeArrow);
  g.appendChild(highpassNodePostClippingNodePath);
  g.appendChild(highpassNodePostClippingNodeArrow);
  g.appendChild(postClippingNodePostEqualizerNodePath);
  g.appendChild(postClippingNodePostEqualizerNodeArrow);

  if (withSpeakerSimulator) {
    const speakerSimulatorNotchNodeRect = createAudioNode('Notch-Filter (Speaker Simulator)', 0, 1700, 700, 100);
    const speakerSimulatorLowpassNodeRect = createAudioNode('Low-Filter (Speaker Simulator)', 0, 1850, 700, 100);

    g.appendChild(speakerSimulatorNotchNodeRect);
    g.appendChild(speakerSimulatorLowpassNodeRect);

    const masterVolumeNodeRect = createAudioNode('GainNode (Master Volume)', 0, 2050, 700, 100);
    const audioDestinationNodeRect = createAudioNode('AudioDestinationNode (Output)', 0, 2250, 700, 100);

    g.appendChild(masterVolumeNodeRect);
    g.appendChild(audioDestinationNodeRect);

    const postEqualizerNodeNotchNodePath = createConnection(350 - 2, 1600, 350 - 2, 1700);
    const postEqualizerNodeNotchNodeArrow = createConnectionArrow(350 - 2, 1700 - 14, 'down');
    const notchNodeAndLowpassNodePath = createConnection(350 - 2, 1800, 350 - 2, 1850);
    const notchNodeAndLowpassNodeArrow = createConnectionArrow(350 - 2, 1850 - 14, 'down');

    g.appendChild(postEqualizerNodeNotchNodePath);
    g.appendChild(postEqualizerNodeNotchNodeArrow);
    g.appendChild(notchNodeAndLowpassNodePath);
    g.appendChild(notchNodeAndLowpassNodeArrow);

    const lowpassNodeAndMasterVolumeNodePath = createConnection(350 - 2, 1950, 350 - 2, 2050);
    const lowpassNodeAndMasterVolumeNodeArrow = createConnectionArrow(350 - 2, 2050 - 14, 'down');
    const masterVolumeNodeAudioDestinationNodePath = createConnection(350 - 2, 2150, 350 - 2, 2250);
    const masterVolumeNodeAudioDestinationNodeArrow = createConnectionArrow(350 - 2, 2250 - 14, 'down');

    g.appendChild(lowpassNodeAndMasterVolumeNodePath);
    g.appendChild(lowpassNodeAndMasterVolumeNodeArrow);
    g.appendChild(masterVolumeNodeAudioDestinationNodePath);
    g.appendChild(masterVolumeNodeAudioDestinationNodeArrow);
  } else {
    const masterVolumeNodeRect = createAudioNode('GainNode (Master Volume)', 0, 1700, 700, 100);
    const audioDestinationNodeRect = createAudioNode('AudioDestinationNode (Output)', 0, 1900, 700, 100);

    g.appendChild(masterVolumeNodeRect);
    g.appendChild(audioDestinationNodeRect);

    const postEqualizerNodeMasterVolumeNodePath = createConnection(350 - 2, 1600, 350 - 2, 1700);
    const postEqualizerNodeMasterVolumeNodeArrow = createConnectionArrow(350 - 2, 1700 - 14, 'down');
    const masterVolumeNodeAudioDestinationNodePath = createConnection(350 - 2, 1800, 350 - 2, 1900);
    const masterVolumeNodeAudioDestinationNodeArrow = createConnectionArrow(350 - 2, 1900 - 14, 'down');

    g.appendChild(postEqualizerNodeMasterVolumeNodePath);
    g.appendChild(postEqualizerNodeMasterVolumeNodeArrow);
    g.appendChild(masterVolumeNodeAudioDestinationNodePath);
    g.appendChild(masterVolumeNodeAudioDestinationNodeArrow);
  }

  svg.appendChild(g);
};

const distortion = () => {
  function createPreampCurve(drive, numberOfSamples) {
    const curves = new Float32Array(numberOfSamples);

    const index = Math.trunc((numberOfSamples - 1) / 2);

    const d = 10 ** (drive / 5.0 - 1.0) - 0.1;
    const c = d / 5.0 + 1.0;

    let peak = 0.4;

    if (c === 1) {
      peak = 1.0;
    } else if (c > 1 && c < 1.04) {
      peak = -15.5 * c + 16.52;
    }

    for (let i = 0; i < index; i++) {
      curves[index + i] = peak * (+1 - c ** -i + (i * c ** -index) / index);
      curves[index - i] = peak * (-1 + c ** -i - (i * c ** -index) / index);
    }

    curves[index] = 0;

    return curves;
  }

  function createAsymmetricalOverdriveCurve(drive, numberOfSamples) {
    if (drive < 0 || drive >= 1) {
      return null;
    }

    const curves = new Float32Array(numberOfSamples);

    const k = (2 * drive) / (1 - drive);

    for (let n = 0; n < numberOfSamples; n++) {
      const x = ((n - 0) * (1 - -1)) / (numberOfSamples - 0) + -1;
      const y = ((1 + k) * x) / (1 + k * Math.abs(x));

      // Asymmetrical clipping curve
      curves[n] = y > 0 ? y : (1 - (drive > 0.5 ? 0.5 : drive)) * y;
    }

    return curves;
  }

  const samples = 127;
  const oversample = '4x';

  const shaper = new WaveShaperNode(audiocontext);
  const gain = new GainNode(audiocontext, { gain: 1 });

  const preLowpass = new BiquadFilterNode(audiocontext, { type: 'lowpass', frequency: 3200, Q: -3 });

  const preHighpass1 = new BiquadFilterNode(audiocontext, { type: 'highpass', frequency: 80, Q: -3 });
  const preHighpass2 = new BiquadFilterNode(audiocontext, { type: 'highpass', frequency: 640, Q: -3 });
  const preHighpass3 = new BiquadFilterNode(audiocontext, { type: 'highpass', frequency: 160, Q: -3 });

  const highTrebleGain = new GainNode(audiocontext, { gain: 0.5 });
  const middleAndBassGain = new GainNode(audiocontext, { gain: 0.5 });

  const preShaper = new WaveShaperNode(audiocontext, { curve: createPreampCurve(5.0, samples), oversample });
  const postShaper = new WaveShaperNode(audiocontext, { curve: createPreampCurve(5.0, samples), oversample });

  const lowpass = new BiquadFilterNode(audiocontext, { type: 'lowpass', frequency: 4000, Q: -3 });
  const highpass = new BiquadFilterNode(audiocontext, { type: 'highpass', frequency: 40, Q: -3 });

  const bass = new BiquadFilterNode(audiocontext, { type: 'lowshelf', frequency: 240 });
  const middle = new BiquadFilterNode(audiocontext, { type: 'peaking', frequency: 500, Q: 1.5 });
  const treble = new BiquadFilterNode(audiocontext, { type: 'highshelf', frequency: 1600 });

  const speakerSimulatorNotch = new BiquadFilterNode(audiocontext, { type: 'notch', frequency: 8000, Q: 1 });
  const speakerSimulatorLowpass = new BiquadFilterNode(audiocontext, { type: 'lowpass', frequency: 3200, Q: 6 });

  const mastervolume = new GainNode(audiocontext, { gain: 0.5 });

  const buttonElementPickingDown = document.getElementById('button-picking-down');
  const buttonElementPickingUp = document.getElementById('button-picking-up');
  const buttonElementChord = document.getElementById('button-chord');

  const checkboxElementPreamp = document.getElementById('checkbox-preamp');
  const checkboxElementSpeakerSimulator = document.getElementById('checkbox-speaker-simulator');

  const rangePreampNormalGainElement = document.getElementById('range-preamp-normal-gain');
  const rangePreampHighTrebleGainElement = document.getElementById('range-preamp-high-treble-gain');
  const rangePreampDriveElement = document.getElementById('range-preamp-drive');
  const rangePreampBassElement = document.getElementById('range-preamp-post-equalizer-bass');
  const rangePreampMiddleElement = document.getElementById('range-preamp-post-equalizer-middle');
  const rangePreampTrebleElement = document.getElementById('range-preamp-post-equalizer-treble');

  const selectEffectorDistortionTypeElement = document.getElementById('select-distortion-type');
  const rangeEffectorDistortionDriveElement = document.getElementById('range-distortion-drive');

  const rangeDistortionMasterVolumeElement = document.getElementById('range-distortion-mastervolume');

  const spanPrintPreampNormalGainElement = document.getElementById('print-preamp-normal-gain-value');
  const spanPrintPreampHighTrebleGainElement = document.getElementById('print-preamp-high-treble-value');
  const spanPrintPreampDriveElement = document.getElementById('print-preamp-drive-value');
  const spanPrintPreampBassElement = document.getElementById('print-preamp-post-equalizer-bass-value');
  const spanPrintPreampMiddleElement = document.getElementById('print-preamp-post-equalizer-middle-value');
  const spanPrintPreampTrebleElement = document.getElementById('print-preamp-post-equalizer-treble-value');

  const spanPrintEffectorDistortionDriveElement = document.getElementById('print-distortion-drive-value');

  const spanPrintDistortionMasterVolumeElement = document.getElementById('print-distortion-mastervolume-value');

  Promise.all([
    fetch('./assets/one-shots/electric-guitar-clean-picking-down.mp3'),
    fetch('./assets/one-shots/electric-guitar-clean-picking-up.mp3'),
    fetch('./assets/one-shots/electric-guitar-clean-chord.mp3')
  ]).then(async (responses) => {
    const audioBuffers = await Promise.all(
      responses.map(async (response) => {
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audiocontext.decodeAudioData(arrayBuffer);

        return audioBuffer;
      })
    );

    const onDown = async (event) => {
      if (audiocontext.state !== 'running') {
        await audiocontext.resume();
      }

      const index = Number(event.target.getAttribute('data-index'));

      const buffer = audioBuffers[index];
      const source = new AudioBufferSourceNode(audiocontext, { buffer });

      gain.disconnect(0);
      shaper.disconnect(0);
      treble.disconnect(0);
      speakerSimulatorLowpass.disconnect(0);

      source.connect(gain);
      gain.connect(shaper);

      if (checkboxElementPreamp.checked && checkboxElementSpeakerSimulator.checked) {
        shaper.connect(preHighpass1);
        preHighpass1.connect(preLowpass);
        preLowpass.connect(middleAndBassGain);
        middleAndBassGain.connect(preHighpass3);

        shaper.connect(preHighpass2);
        preHighpass2.connect(highTrebleGain);
        highTrebleGain.connect(preHighpass3);

        preHighpass3.connect(preShaper);

        preShaper.connect(lowpass);
        lowpass.connect(highpass);

        highpass.connect(postShaper);

        postShaper.connect(bass);
        bass.connect(middle);
        middle.connect(treble);
        treble.connect(speakerSimulatorNotch);

        speakerSimulatorNotch.connect(speakerSimulatorLowpass);
        speakerSimulatorLowpass.connect(mastervolume);
      } else {
        if (checkboxElementPreamp.checked) {
          shaper.connect(preHighpass1);
          preHighpass1.connect(preLowpass);
          preLowpass.connect(middleAndBassGain);
          middleAndBassGain.connect(preHighpass3);

          shaper.connect(preHighpass2);
          preHighpass2.connect(highTrebleGain);
          highTrebleGain.connect(preHighpass3);

          preHighpass3.connect(preShaper);

          preShaper.connect(lowpass);
          lowpass.connect(highpass);

          highpass.connect(postShaper);

          postShaper.connect(bass);
          bass.connect(middle);
          middle.connect(treble);
          treble.connect(mastervolume);
        } else if (checkboxElementSpeakerSimulator.checked) {
          shaper.connect(speakerSimulatorNotch);

          speakerSimulatorNotch.connect(speakerSimulatorLowpass);
          speakerSimulatorLowpass.connect(mastervolume);
        } else {
          shaper.connect(mastervolume);
        }
      }

      mastervolume.connect(audiocontext.destination);

      source.start(0);
    };

    buttonElementPickingDown.addEventListener('mousedown', onDown);
    buttonElementPickingDown.addEventListener('touchstart', onDown);
    buttonElementPickingUp.addEventListener('mousedown', onDown);
    buttonElementPickingUp.addEventListener('touchstart', onDown);
    buttonElementChord.addEventListener('mousedown', onDown);
    buttonElementChord.addEventListener('touchstart', onDown);

    checkboxElementPreamp.addEventListener('change', (event) => {
      if (event.currentTarget.checked) {
        rangePreampNormalGainElement.removeAttribute('disabled');
        rangePreampHighTrebleGainElement.removeAttribute('disabled');
        rangePreampDriveElement.removeAttribute('disabled');
        rangePreampBassElement.removeAttribute('disabled');
        rangePreampMiddleElement.removeAttribute('disabled');
        rangePreampTrebleElement.removeAttribute('disabled');
      } else {
        rangePreampNormalGainElement.setAttribute('disabled', 'disabled');
        rangePreampHighTrebleGainElement.setAttribute('disabled', 'disabled');
        rangePreampDriveElement.setAttribute('disabled', 'disabled');
        rangePreampBassElement.setAttribute('disabled', 'disabled');
        rangePreampMiddleElement.setAttribute('disabled', 'disabled');
        rangePreampTrebleElement.setAttribute('disabled', 'disabled');
      }
    });

    selectEffectorDistortionTypeElement.addEventListener('change', (event) => {
      const drive = rangeEffectorDistortionDriveElement.valueAsNumber;

      rangeEffectorDistortionDriveElement.removeAttribute('disabled');

      switch (event.currentTarget.value) {
        case 'overdrive': {
          shaper.curve = createAsymmetricalOverdriveCurve(drive, samples);
          shaper.oversample = '2x';

          gain.gain.value = 1;
          break;
        }

        case 'fuzz': {
          shaper.curve = new Float32Array([drive, 0, drive]);
          shaper.oversample = '4x';

          gain.gain.value = 2;
          break;
        }

        default: {
          shaper.curve = null;
          shaper.oversample = 'none';

          gain.gain.value = 1;

          rangeEffectorDistortionDriveElement.setAttribute('disabled', 'disabled');
          break;
        }
      }
    });

    rangeEffectorDistortionDriveElement.addEventListener('input', (event) => {
      const drive = event.currentTarget.valueAsNumber;

      switch (selectEffectorDistortionTypeElement.value) {
        case 'overdrive': {
          shaper.curve = createAsymmetricalOverdriveCurve(drive, samples);
          shaper.oversample = '2x';
          break;
        }

        case 'fuzz': {
          shaper.curve = new Float32Array([drive, 0, drive]);
          shaper.oversample = '4x';
          break;
        }

        default: {
          shaper.curve = null;
          shaper.oversample = 'none';
          break;
        }
      }

      spanPrintEffectorDistortionDriveElement.textContent = drive.toFixed(1);
    });

    rangePreampNormalGainElement.addEventListener('input', (event) => {
      const gain = event.currentTarget.valueAsNumber;

      middleAndBassGain.gain.value = gain;

      spanPrintPreampNormalGainElement.textContent = gain.toString(10);
    });

    rangePreampHighTrebleGainElement.addEventListener('input', (event) => {
      const gain = event.currentTarget.valueAsNumber;

      highTrebleGain.gain.value = gain;

      spanPrintPreampHighTrebleGainElement.textContent = gain.toString(10);
    });

    rangePreampDriveElement.addEventListener('input', (event) => {
      const drive = event.currentTarget.valueAsNumber;

      preShaper.curve = createPreampCurve(drive, samples);
      postShaper.curve = createPreampCurve(drive, samples);

      spanPrintPreampDriveElement.textContent = drive.toFixed(1);
    });

    rangePreampBassElement.addEventListener('input', (event) => {
      const gain = event.currentTarget.valueAsNumber;

      bass.gain.value = gain;

      spanPrintPreampBassElement.textContent = `${gain} dB`;
    });

    rangePreampMiddleElement.addEventListener('input', (event) => {
      const gain = event.currentTarget.valueAsNumber;

      middle.gain.value = gain;

      spanPrintPreampMiddleElement.textContent = `${gain} dB`;
    });

    rangePreampTrebleElement.addEventListener('input', (event) => {
      const gain = event.currentTarget.valueAsNumber;

      treble.gain.value = gain;

      spanPrintPreampTrebleElement.textContent = `${gain} dB`;
    });

    rangeDistortionMasterVolumeElement.addEventListener('input', (event) => {
      const gain = event.currentTarget.valueAsNumber;

      mastervolume.gain.value = gain;

      spanPrintDistortionMasterVolumeElement.textContent = gain.toString(10);
    });
  });
};

const createNodeConnectionsForDynamicsCompressorNode = (svg) => {
  const g = document.createElementNS(xmlns, 'g');

  const oscillatorNodeRect = createAudioNode('OscillatorNode', 0, 0);
  const waveShaperNodeRect = createAudioNode('DynamicsCompressorNode', 0, 200);
  const audioDestinationNodeRect = createAudioNode('AudioDestinationNode', 0, 400);

  const oscillatorNodeAndWaveShaperNodePath = createConnection(150 - 2, 100, 150 - 2, 300);
  const waveShaperNodeAndAudiodDestinationNodePath = createConnection(150 - 2, 300, 150 - 2, 400);

  const oscillatorNodeAndWaveShaperNodeArrow = createConnectionArrow(150 - 2, 200 - 14, 'down');
  const waveShaperNodeAndAudiodDestinationNodeArrow = createConnectionArrow(150 - 2, 400 - 14, 'down');

  g.appendChild(oscillatorNodeRect);
  g.appendChild(oscillatorNodeAndWaveShaperNodePath);
  g.appendChild(oscillatorNodeAndWaveShaperNodeArrow);
  g.appendChild(waveShaperNodeRect);
  g.appendChild(waveShaperNodeAndAudiodDestinationNodePath);
  g.appendChild(waveShaperNodeAndAudiodDestinationNodeArrow);
  g.appendChild(audioDestinationNodeRect);

  svg.appendChild(g);
};

const createCompressorParameters = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const rect = document.createElementNS(xmlns, 'rect');

  rect.setAttribute('x', padding.toString(10));
  rect.setAttribute('y', padding.toString(10));
  rect.setAttribute('width', innerWidth.toString(10));
  rect.setAttribute('height', innerHeight.toString(10));
  rect.setAttribute('stroke', lightColor);
  rect.setAttribute('stroke-width', lineWidth.toString(10));
  rect.setAttribute('fill', 'none');

  svg.appendChild(rect);

  const g = document.createElementNS(xmlns, 'g');

  const inputLabel = document.createElementNS(xmlns, 'text');

  inputLabel.textContent = 'Input';

  inputLabel.setAttribute('x', (innerWidth + padding + 40).toString(10));
  inputLabel.setAttribute('y', (padding + innerHeight + 20).toString(10));
  inputLabel.setAttribute('text-anchor', 'middle');
  inputLabel.setAttribute('stroke', 'none');
  inputLabel.setAttribute('fill', baseColor);
  inputLabel.setAttribute('font-size', '16px');

  g.appendChild(inputLabel);

  const outputLabel = document.createElementNS(xmlns, 'text');

  outputLabel.textContent = 'Output';

  outputLabel.setAttribute('x', (padding - 20).toString(10));
  outputLabel.setAttribute('y', (padding - 20).toString(10));
  outputLabel.setAttribute('text-anchor', 'middle');
  outputLabel.setAttribute('stroke', 'none');
  outputLabel.setAttribute('fill', baseColor);
  outputLabel.setAttribute('font-size', '16px');

  g.appendChild(outputLabel);

  ['0.00', '0.25', ' 0.50', '0.75', '1.00'].forEach((x, index) => {
    const text = document.createElementNS(xmlns, 'text');

    text.textContent = x;

    text.setAttribute('x', ((innerWidth / 4) * index + padding).toString(10));
    text.setAttribute('y', (padding + innerHeight + 20).toString(10));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '14px');

    g.appendChild(text);

    if (x === -1 || x === 1) {
      return;
    }

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', ((innerWidth / 4) * index + padding).toString(10));
    xRect.setAttribute('y', padding.toString(10));
    xRect.setAttribute('width', lineWidth.toString(10));
    xRect.setAttribute('height', innerHeight.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', lightColor);

    g.appendChild(xRect);
  });

  ['1.00', '0.75', ' 0.50', '0.25', '0.00'].forEach((y, index) => {
    const text = document.createElementNS(xmlns, 'text');

    text.textContent = y;

    text.setAttribute('x', (padding - 20).toString(10));
    text.setAttribute('y', ((innerHeight / 4) * index + padding).toString(10));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '14px');

    g.appendChild(text);

    if (y === -1 || y === 1) {
      return;
    }

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', padding.toString(10));
    yRect.setAttribute('y', ((innerHeight / 4) * index + padding).toString(10));
    yRect.setAttribute('width', innerWidth.toString(10));
    yRect.setAttribute('height', lineWidth.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', lightColor);

    g.appendChild(yRect);
  });

  const createLinearPath = () => {
    const path = document.createElementNS(xmlns, 'path');

    path.setAttribute('d', `M${padding} ${padding + innerHeight} L${padding + innerWidth} ${padding}`);
    path.setAttribute('stroke', alphaWaveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    return path;
  };

  g.appendChild(createLinearPath());

  svg.appendChild(g);

  let threshold = -24;
  let ratio = 12;
  let knee = 30;

  const path = document.createElementNS(xmlns, 'path');

  path.setAttribute('stroke', lightWaveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  const renderComressorPath = () => {
    if (knee === 0) {
      const baseX = padding + (100 + threshold) * (innerWidth / 100);
      const baseY = padding + Math.abs(threshold) * (innerHeight / 100);

      path.setAttribute(
        'd',
        `M${padding} ${padding + innerHeight} L${baseX} ${baseY} L${padding + innerWidth} ${padding + Math.abs(threshold - threshold * (1 / ratio)) * (innerHeight / 100)}`
      );
      return;
    }

    // |y| =
    //
    // x                                                                    | if (|x| < threshold - (knee / 2))
    // x + (((1 / ratio) - 1)(x - threshold + (knee / 2))^{2}) / (2 * knee) | if ((threshold - (knee / 2)) <= |x| < (threshold + (knee / 2)))
    // threshold + ((x - threshold) / ratio)                                | if ((threshold + (knee / 2)) <= |x|)
    const w = knee / 2;

    let d = `M${padding} ${padding + innerHeight}`;

    for (let x = 0; x <= innerWidth; x++) {
      const normalizedThreshold = (1 - Math.abs(threshold) / 100) * innerWidth;

      if (x < normalizedThreshold - w) {
        const y = x;

        d += ` L${padding + x} ${padding + innerHeight - y}`;
      } else if (x > normalizedThreshold + w) {
        const y = normalizedThreshold + (x - normalizedThreshold) / ratio;

        d += ` L${padding + x} ${padding + innerHeight - y}`;
      } else {
        const startKnee = normalizedThreshold - w;

        const t = (x - startKnee) / knee;

        const y = x + ((1 / ratio - 1) * (x - normalizedThreshold + w) ** 2) / (2 * knee);

        d += ` L${padding + x} ${padding + innerHeight - y}`;
      }
    }

    path.setAttribute('d', d);
  };

  const rangeCompressorThresholdElement = document.getElementById('svg-figure-compressor-range-threshold');
  const rangeCompressorRatioElement = document.getElementById('svg-figure-compressor-range-ratio');
  const rangeCompressorKneeElement = document.getElementById('svg-figure-compressor-range-knee');

  const spanPrintComressorThresholdElement = document.getElementById('svg-figure-compressor-range-threshold-value');
  const spanPrintComressorRatioElement = document.getElementById('svg-figure-compressor-range-ratio-value');
  const spanPrintComressorKneeElement = document.getElementById('svg-figure-compressor-range-knee-value');

  rangeCompressorThresholdElement.addEventListener('input', (event) => {
    threshold = event.currentTarget.valueAsNumber;

    spanPrintComressorThresholdElement.textContent = `${threshold} dB`;

    renderComressorPath();
  });

  rangeCompressorRatioElement.addEventListener('input', (event) => {
    ratio = event.currentTarget.valueAsNumber;

    spanPrintComressorRatioElement.textContent = ratio.toString(10);

    renderComressorPath();
  });

  rangeCompressorKneeElement.addEventListener('input', (event) => {
    knee = event.currentTarget.valueAsNumber;

    spanPrintComressorKneeElement.textContent = `${knee} dB`;

    renderComressorPath();
  });

  renderComressorPath();
};

const createCompressorLowerAndRaiseVolumeByCompressorCurve = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const renderGraph = (offset, raised) => {
    const width = innerWidth / 2 - padding;
    const height = innerHeight;

    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', (offset + padding).toString(10));
    rect.setAttribute('y', padding.toString(10));
    rect.setAttribute('width', width.toString(10));
    rect.setAttribute('height', height.toString(10));
    rect.setAttribute('stroke', lightColor);
    rect.setAttribute('stroke-width', lineWidth.toString(10));
    rect.setAttribute('fill', 'none');

    svg.appendChild(rect);

    const g = document.createElementNS(xmlns, 'g');

    const inputLabel = document.createElementNS(xmlns, 'text');

    inputLabel.textContent = 'Input';

    inputLabel.setAttribute('x', (offset + width + padding + 40).toString(10));
    inputLabel.setAttribute('y', (padding + height + 20).toString(10));
    inputLabel.setAttribute('text-anchor', 'middle');
    inputLabel.setAttribute('stroke', 'none');
    inputLabel.setAttribute('fill', baseColor);
    inputLabel.setAttribute('font-size', '16px');

    g.appendChild(inputLabel);

    const outputLabel = document.createElementNS(xmlns, 'text');

    outputLabel.textContent = 'Output';

    outputLabel.setAttribute('x', (offset + padding - 20).toString(10));
    outputLabel.setAttribute('y', (padding - 20).toString(10));
    outputLabel.setAttribute('text-anchor', 'middle');
    outputLabel.setAttribute('stroke', 'none');
    outputLabel.setAttribute('fill', baseColor);
    outputLabel.setAttribute('font-size', '16px');

    g.appendChild(outputLabel);

    ['0.00', '0.25', ' 0.50', '0.75', '1.00'].forEach((x, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = x;

      text.setAttribute('x', (offset + (width / 4) * index + padding).toString(10));
      text.setAttribute('y', (padding + height + 20).toString(10));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '14px');

      g.appendChild(text);

      if (x === -1 || x === 1) {
        return;
      }

      const xRect = document.createElementNS(xmlns, 'rect');

      xRect.setAttribute('x', (offset + (width / 4) * index + padding).toString(10));
      xRect.setAttribute('y', padding.toString(10));
      xRect.setAttribute('width', lineWidth.toString(10));
      xRect.setAttribute('height', innerHeight.toString(10));
      xRect.setAttribute('stroke', 'none');
      xRect.setAttribute('fill', lightColor);

      g.appendChild(xRect);
    });

    ['1.00', '0.75', ' 0.50', '0.25', '0.00'].forEach((y, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = y;

      text.setAttribute('x', (offset + padding - 20).toString(10));
      text.setAttribute('y', ((height / 4) * index + padding).toString(10));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '14px');

      g.appendChild(text);

      if (y === -1 || y === 1) {
        return;
      }

      const yRect = document.createElementNS(xmlns, 'rect');

      yRect.setAttribute('x', (offset + padding).toString(10));
      yRect.setAttribute('y', ((height / 4) * index + padding).toString(10));
      yRect.setAttribute('width', width.toString(10));
      yRect.setAttribute('height', lineWidth.toString(10));
      yRect.setAttribute('stroke', 'none');
      yRect.setAttribute('fill', lightColor);

      g.appendChild(yRect);
    });

    svg.appendChild(g);

    const path = document.createElementNS(xmlns, 'path');

    path.setAttribute('stroke', lightWaveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    svg.appendChild(path);

    const overlayPath = document.createElementNS(xmlns, 'path');

    overlayPath.setAttribute('stroke', 'none');
    overlayPath.setAttribute('fill', alphaWaveColor);
    overlayPath.setAttribute('stroke-width', lineWidth.toString(10));
    overlayPath.setAttribute('stroke-linecap', lineCap);
    overlayPath.setAttribute('stroke-linejoin', lineJoin);

    svg.appendChild(overlayPath);

    const threshold = -50;
    const ratio = 2;

    const baseX = offset + padding + (100 + threshold) * (width / 100);
    const baseY = padding + Math.abs(threshold) * (innerHeight / 100);

    if (raised) {
      path.setAttribute('d', `M${offset + padding} ${padding + height} L${baseX} ${baseY - height / 4} L${offset + padding + width} ${padding}`);
      overlayPath.setAttribute(
        'd',
        `M${offset + padding + width / 4 + 24} ${padding + height / 2} L${baseX} ${baseY - height / 4} L${offset + padding + width} ${padding} L${offset + padding + width} ${padding + height / 2}`
      );

      return;
    }

    path.setAttribute(
      'd',
      `M${offset + padding} ${padding + height} L${baseX} ${baseY} L${offset + padding + width} ${padding + Math.abs(threshold - threshold * (1 / ratio)) * (height / 100)}`
    );
    overlayPath.setAttribute(
      'd',
      `M${offset + padding + width / 2} ${padding + height / 2} L${offset + padding + width} ${padding + height / 4} L${offset + padding + width} ${padding + height / 2}`
    );
  };

  renderGraph(0, false);
  renderGraph(innerWidth / 2 + padding, true);
};

const createCompressorLowerAndRaiseVolume = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const width = innerWidth / 2 - padding;

  const renderGraph = (offset, raised) => {
    const g = document.createElementNS(xmlns, 'g');

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (offset + padding / 2).toString(10));
    xRect.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
    xRect.setAttribute('width', (width + padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    g.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (offset + padding - 1).toString(10));
    yRect.setAttribute('y', padding.toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', innerHeight.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    g.appendChild(yRect);

    const xText = document.createElementNS(xmlns, 'text');

    xText.textContent = 'Time';

    xText.setAttribute('x', (offset + width + padding).toString(10));
    xText.setAttribute('y', (padding + innerHeight / 2 - 8).toString(10));

    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '16px');

    g.appendChild(xText);

    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = 'Amplitude';

    yText.setAttribute('x', (offset + padding).toString(10));
    yText.setAttribute('y', padding.toString(10));

    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '16px');

    g.appendChild(yText);

    [1, 0, -1].forEach((amplitude, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = amplitude.toString(10);

      text.setAttribute('x', (offset + padding - 12).toString(10));
      text.setAttribute('y', (padding + (innerHeight / 2) * (1 - amplitude) + 16).toString(10));

      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '14px');

      g.appendChild(text);
    });

    const w = 2 * Math.PI;

    if (!raised) {
      const sinePath = document.createElementNS(xmlns, 'path');

      let sinePathD = '';

      for (let n = 0, len = sampleRate; n < len; n++) {
        const v = Math.exp(-((2 * n) / sampleRate)) * Math.sin((16 * w * n) / sampleRate);

        const x = (n / len) * width + offset + padding;
        const y = (1 - v) * (innerHeight / 2) + padding;

        if (n === 0) {
          sinePathD += `M${x + lineWidth / 2} ${y}`;
        } else {
          sinePathD += ` L${x} ${y}`;
        }
      }

      sinePath.setAttribute('d', sinePathD);

      sinePath.setAttribute('stroke', alphaWaveColor);
      sinePath.setAttribute('fill', 'none');
      sinePath.setAttribute('stroke-width', lineWidth.toString(10));
      sinePath.setAttribute('stroke-linecap', lineCap);
      sinePath.setAttribute('stroke-linejoin', lineJoin);

      g.appendChild(sinePath);

      const path = document.createElementNS(xmlns, 'path');

      let d = '';

      for (let n = 0, len = sampleRate; n < len; n++) {
        let v = Math.exp(-((2 * n) / sampleRate)) * Math.sin((16 * w * n) / sampleRate);

        if (Math.abs(v) > 0.5) {
          v = 0.4 * v + (v > 0 ? 0.3 : -0.3);
        }

        const x = (n / len) * width + offset + padding;
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

      g.appendChild(path);
    }

    if (raised) {
      const path = document.createElementNS(xmlns, 'path');

      let d = '';

      for (let n = 0, len = sampleRate; n < len; n++) {
        let v = 1.4 * Math.exp(-((2 * n) / sampleRate)) * Math.sin((16 * w * n) / sampleRate);

        if (n < len / 2) {
          if (Math.abs(v) > 0.5) {
            v = 0.4 * v + (v > 0 ? 0.3 : -0.3);
          }
        } else {
          v *= 1.15;
        }

        const x = (n / len) * width + offset + padding;
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

      g.appendChild(path);
    }

    svg.appendChild(g);
  };

  [-0.5, 0.5].forEach((y) => {
    const thresholdRect = document.createElementNS(xmlns, 'rect');

    thresholdRect.setAttribute('x', padding.toString(10));
    thresholdRect.setAttribute('y', (padding + (1 - y) * (innerHeight / 2)).toString(10));
    thresholdRect.setAttribute('width', innerWidth.toString(10));
    thresholdRect.setAttribute('height', lineWidth.toString(10));
    thresholdRect.setAttribute('stroke', 'none');
    thresholdRect.setAttribute('fill', alphaLightWaveColor);

    svg.appendChild(thresholdRect);

    const text = document.createElementNS(xmlns, 'text');

    text.textContent = 'Threshold';

    text.setAttribute('x', (padding - 28).toString(10));
    text.setAttribute('y', (padding + (1 - y) * (innerHeight / 2)).toString(10));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '12px');

    svg.appendChild(text);
  });

  [-1.0, 1.0].forEach((y) => {
    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttribute('x', padding.toString(10));
    rect.setAttribute('y', (padding + (1 - y) * (innerHeight / 2) + (y > 0 ? 20 : -20)).toString(10));
    rect.setAttribute('width', innerWidth.toString(10));
    rect.setAttribute('height', lineWidth.toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', alphaLightWaveColor);

    svg.appendChild(rect);
  });

  renderGraph(0, false);
  renderGraph(innerWidth / 2 + padding, true);
};

const createNodeConnectionsForAutoPanner = (svg) => {
  const g = document.createElementNS(xmlns, 'g');

  const oscillatorNodeRect = createAudioNode('OscillatorNode', 0, 0);
  const stereoPannerNodeRect = createAudioNode('StereoPannerNode', 0, 200);
  const audioDestinationNodeRect = createAudioNode('AudioDestinationNode', 0, 400);

  const oscillatorNodeAndStereoPannerNodePath = createConnection(150 - 2, 100, 150 - 2, 300);
  const stereoPannerNodeAndAudiodDestinationNodePath = createConnection(150 - 2, 300, 150 - 2, 400);

  const oscillatorNodeAndStereoPannerNodeArrow = createConnectionArrow(150 - 2, 200 - 14, 'down');
  const stereoPannerNodeAndAudiodDestinationNodeArrow = createConnectionArrow(150 - 2, 400 - 14, 'down');

  const lfoRect = createLFO(400, 0);
  const panParamEllipse = createAudioParam('pan', 350, 250);
  const lfoAndPanParamPath1 = createConnection(545, 100 + 2, 545, 250 - 2, lightWaveColor);
  const lfoAndPanParamPath2 = createConnection(430, 250 - 2, 545, 250 - 2, lightWaveColor);
  const lfoAndPanParamArrow = createConnectionArrow(430 + 12, 250 - 2, 'left', lightWaveColor);

  g.appendChild(oscillatorNodeRect);
  g.appendChild(oscillatorNodeAndStereoPannerNodePath);
  g.appendChild(oscillatorNodeAndStereoPannerNodeArrow);
  g.appendChild(stereoPannerNodeRect);
  g.appendChild(stereoPannerNodeAndAudiodDestinationNodePath);
  g.appendChild(stereoPannerNodeAndAudiodDestinationNodeArrow);
  g.appendChild(audioDestinationNodeRect);

  g.appendChild(lfoRect);
  g.appendChild(panParamEllipse);
  g.appendChild(lfoAndPanParamPath1);
  g.appendChild(lfoAndPanParamPath2);
  g.appendChild(lfoAndPanParamArrow);

  svg.appendChild(g);
};

const autopanner = () => {
  let rateValue = 0;

  let oscillator = new OscillatorNode(audiocontext);
  let lfo = new OscillatorNode(audiocontext, { frequency: rateValue });

  let isStop = true;

  const depth = new GainNode(audiocontext);

  const panner = new StereoPannerNode(audiocontext);

  const buttonElement = document.getElementById('button-auto-panner');
  const checkboxElement = document.getElementById('checkbox-auto-panner');

  const rangeDepthElement = document.getElementById('range-auto-panner-depth');
  const rangeRateElement = document.getElementById('range-auto-panner-rate');

  const spanPrintCheckedElement = document.getElementById('print-checked-auto-panner');
  const spanPrintDepthElement = document.getElementById('print-auto-panner-depth-value');
  const spanPrintRateElement = document.getElementById('print-auto-panner-rate-value');

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (!isStop) {
      return;
    }

    if (checkboxElement.checked) {
      oscillator.connect(panner);
      panner.connect(audiocontext.destination);

      oscillator.start(0);
    } else {
      panner.disconnect(0);

      oscillator.connect(audiocontext.destination);

      oscillator.start(0);
    }

    lfo.connect(depth);
    depth.connect(panner.pan);

    lfo.start(0);

    isStop = false;

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (isStop) {
      return;
    }

    oscillator.stop(0);
    lfo.stop(0);

    oscillator = new OscillatorNode(audiocontext);
    lfo = new OscillatorNode(audiocontext, { frequency: rateValue });

    isStop = true;

    buttonElement.textContent = 'start';
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  checkboxElement.addEventListener('click', () => {
    oscillator.disconnect(0);
    lfo.disconnect(0);

    if (checkboxElement.checked) {
      oscillator.connect(panner);
      panner.connect(audiocontext.destination);

      lfo.connect(depth);
      depth.connect(panner.pan);

      spanPrintCheckedElement.textContent = 'ON';
    } else {
      oscillator.connect(audiocontext.destination);

      spanPrintCheckedElement.textContent = 'OFF';
    }
  });

  rangeDepthElement.addEventListener('input', (event) => {
    const depthValue = event.currentTarget.valueAsNumber;

    depth.gain.value = depthValue;

    spanPrintDepthElement.textContent = depthValue.toString(10);
  });

  rangeRateElement.addEventListener('input', (event) => {
    rateValue = event.currentTarget.valueAsNumber;

    if (lfo) {
      lfo.frequency.value = rateValue;
    }

    spanPrintRateElement.textContent = rateValue.toString(10);
  });
};

const createNodeConnectionsForAutoPannerByTremolo = (svg) => {
  const g = document.createElementNS(xmlns, 'g');

  const mediaElementAudioSourceNodeRect = createAudioNode('MediaElementAudioSourceNode', 0, 0, 700, 100);
  const channelSplitterNodeRect = createAudioNode('ChannelSplitterNode', 0, 200, 700, 100);
  const leftGainNodeRect = createAudioNode2LineText('GainNode', 'Left Channel (0)', 0, 400);
  const rightGainNodeRect = createAudioNode2LineText('GainNode', 'Right Channel (1)', 400, 400);
  const channelMergerNodeRect = createAudioNode('ChannelMergerNode', 0, 600, 700, 100);
  const audioDestinationNodeRect = createAudioNode('AudioDestinationNode', 0, 800, 700, 100);

  g.appendChild(mediaElementAudioSourceNodeRect);
  g.appendChild(channelSplitterNodeRect);
  g.appendChild(leftGainNodeRect);
  g.appendChild(rightGainNodeRect);
  g.appendChild(channelMergerNodeRect);
  g.appendChild(audioDestinationNodeRect);

  const mediaElementAudioSourceNodeAndChannelSplitterNodePath = createConnection(350 - 2, 100, 350 - 2, 200);
  const mediaElementAudioSourceNodeAndChannelSplitterNodeArrow = createConnectionArrow(350 - 2, 200 - 14, 'down');

  g.appendChild(mediaElementAudioSourceNodeAndChannelSplitterNodePath);
  g.appendChild(mediaElementAudioSourceNodeAndChannelSplitterNodeArrow);

  const channelSplitterNodeAndLeftGainNodePath = createConnection(150 - 2, 300, 150 - 2, 400);
  const channelSplitterNodeAndLeftGainNodeArrow = createConnectionArrow(150 - 2, 400 - 14, 'down');

  g.appendChild(channelSplitterNodeAndLeftGainNodePath);
  g.appendChild(channelSplitterNodeAndLeftGainNodeArrow);

  const channelSplitterNodeAndRightGainNodePath = createConnection(550 - 2, 300, 550 - 2, 400);
  const channelSplitterNodeAndRightGainNodeArrow = createConnectionArrow(550 - 2, 400 - 14, 'down');

  g.appendChild(channelSplitterNodeAndRightGainNodePath);
  g.appendChild(channelSplitterNodeAndRightGainNodeArrow);

  const leftGainNodeAndChannelMergerNodePath = createConnection(150 - 2, 500, 150 - 2, 600);
  const leftGainNodeAndChannelMergerNodeArrow = createConnectionArrow(150 - 2, 600 - 14, 'down');

  g.appendChild(leftGainNodeAndChannelMergerNodePath);
  g.appendChild(leftGainNodeAndChannelMergerNodeArrow);

  const rightGainNodeAndChannelMergerNodePath = createConnection(550 - 2, 500, 550 - 2, 600);
  const rightGainNodeAndChannelMergerNodeArrow = createConnectionArrow(550 - 2, 600 - 14, 'down');

  g.appendChild(rightGainNodeAndChannelMergerNodePath);
  g.appendChild(rightGainNodeAndChannelMergerNodeArrow);

  const channelMergerNodeAndAudioDestinationNodePath = createConnection(350 - 2, 700, 350 - 2, 800);
  const channelMergerNodeAndAudioDestinationNodeArrow = createConnectionArrow(350 - 2, 800 - 14, 'down');

  g.appendChild(channelMergerNodeAndAudioDestinationNodePath);
  g.appendChild(channelMergerNodeAndAudioDestinationNodeArrow);

  const lfoRect = createLFO(800, 0);
  const leftGainParamEllipse = createAudioParam('gain', 300, 500);
  const rightGainParamEllipse = createAudioParam('gain', 700, 500);
  const lfoChannelSplitterNodeRect = createAudioNode('ChannelSplitterNode', 800, 200, 300, 100);

  g.appendChild(lfoRect);
  g.appendChild(leftGainParamEllipse);
  g.appendChild(rightGainParamEllipse);
  g.appendChild(lfoChannelSplitterNodeRect);

  const lfoAndChannelSplitterNodePath = createConnection(945, 100 + 2, 945, 200 - 2, lightWaveColor);
  const lfoAndChannelSplitterNodeArrow = createConnectionArrow(945 - 2, 200 - 12, 'down', lightWaveColor);

  g.appendChild(lfoAndChannelSplitterNodePath);
  g.appendChild(lfoAndChannelSplitterNodeArrow);

  const lfoAndLeftGainParamPath1 = createConnection(885, 300 + 2, 885, 350 - 2, lightWaveColor);
  const lfoAndLeftGainParamPath2 = createConnection(330, 350 - 2, 885, 350 - 2, lightWaveColor);
  const lfoAndLeftGainParamPath3 = createConnection(330, 350 - 2, 330, 450 - 2, lightWaveColor);
  const lfoAndLeftGainParamArrow = createConnectionArrow(330, 450 - 2, 'down', lightWaveColor);

  g.appendChild(lfoAndLeftGainParamPath1);
  g.appendChild(lfoAndLeftGainParamPath2);
  g.appendChild(lfoAndLeftGainParamPath3);
  g.appendChild(lfoAndLeftGainParamArrow);

  const lfoAndRightGainParamPath1 = createConnection(1005, 300 + 2, 1005, 500 - 2, lightWaveColor);
  const lfoAndRightGainParamPath2 = createConnection(792, 500 - 2, 1005, 500 - 2, lightWaveColor);
  const lfoAndRightGainParamArrow = createConnectionArrow(792, 500 - 2, 'left', lightWaveColor);

  g.appendChild(lfoAndRightGainParamPath1);
  g.appendChild(lfoAndRightGainParamPath2);
  g.appendChild(lfoAndRightGainParamArrow);

  svg.appendChild(g);
};

const autopannerByTremolo = () => {
  const audioElement = document.getElementById('audio-auto-panner-by-tremolo');

  const rangeDepthElement = document.getElementById('range-auto-panner-by-tremolo-depth');
  const rangeRateElement = document.getElementById('range-auto-panner-by-tremolo-rate');

  const spanPrintDepthElement = document.getElementById('print-auto-panner-by-tremolo-depth-value');
  const spanPrintRateElement = document.getElementById('print-auto-panner-by-tremolo-rate-value');

  const amplitudeL = new GainNode(audiocontext, { gain: +1.0 });
  const amplitudeR = new GainNode(audiocontext, { gain: -1.0 });

  const splitter = new ChannelSplitterNode(audiocontext, { numberOfOutputs: 2 });
  const merger = new ChannelMergerNode(audiocontext, { numberOfInputs: 2 });

  const lfoSplitter = new ChannelSplitterNode(audiocontext, { numberOfOutputs: 2 });

  const onPlay = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    rangeDepthElement.removeAttribute('disabled');
    rangeRateElement.removeAttribute('disabled');

    const source = new MediaElementAudioSourceNode(audiocontext, { mediaElement: audioElement });

    const lfo = new OscillatorNode(audiocontext, { frequency: 0 });
    const depth = new GainNode(audiocontext, { gain: 0 });

    source.connect(splitter);
    splitter.connect(amplitudeL, 0, 0);
    splitter.connect(amplitudeR, 1, 0);
    amplitudeL.connect(merger, 0, 0);
    amplitudeR.connect(merger, 0, 1);
    merger.connect(audiocontext.destination);

    lfo.connect(depth);
    depth.connect(lfoSplitter);

    lfoSplitter.connect(amplitudeL.gain, 0);
    lfoSplitter.connect(amplitudeR.gain, 1);

    lfo.start(0);

    rangeDepthElement.addEventListener('input', (event) => {
      const depthValue = event.currentTarget.valueAsNumber;

      depth.gain.value = depthValue;

      spanPrintDepthElement.textContent = depthValue.toString(10);
    });

    rangeRateElement.addEventListener('input', (event) => {
      const rateValue = event.currentTarget.valueAsNumber;

      lfo.frequency.value = rateValue;

      spanPrintRateElement.textContent = rateValue.toString(10);
    });

    audioElement.removeEventListener('play', onPlay);
  };

  audioElement.addEventListener('play', onPlay);
};

const glide = () => {
  const keyboards = document.querySelectorAll('.piano button[type="button"]');

  const frequencyRatio = 2 ** (1 / 12);

  let glideTime = 0;
  let glideType = 'linear';

  let prevFrequency = -1;

  keyboards.forEach((keyboard) => {
    let oscillator = null;

    const onDown = async (event) => {
      if (audiocontext.state !== 'running') {
        await audiocontext.resume();
      }

      const t0 = audiocontext.currentTime;

      if (oscillator !== null) {
        oscillator.frequency.cancelScheduledValues(t0);
        oscillator.stop(t0);
      }

      const pianoIndex = Number(keyboard.getAttribute('data-index'));
      const nextFrequency = 27.5 * frequencyRatio ** pianoIndex;

      oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth', frequency: prevFrequency === -1 ? nextFrequency : prevFrequency });

      oscillator.connect(audiocontext.destination);

      if (prevFrequency !== -1) {
        const t1 = t0 + glideTime;

        oscillator.frequency.setValueAtTime(prevFrequency, t0);

        switch (glideType) {
          case 'linear': {
            oscillator.frequency.linearRampToValueAtTime(nextFrequency, t1);
            break;
          }

          case 'exponential': {
            oscillator.frequency.exponentialRampToValueAtTime(nextFrequency, t1);
            break;
          }
        }
      }

      prevFrequency = nextFrequency;

      oscillator.start(t0);

      keyboard.classList.add('pressed');
    };

    const onUp = () => {
      if (oscillator === null) {
        return;
      }

      oscillator.frequency.cancelScheduledValues(audiocontext.currentTime);
      oscillator.stop(0);

      oscillator = null;

      keyboard.classList.remove('pressed');
    };

    keyboard.addEventListener('mousedown', onDown);
    keyboard.addEventListener('touchstart', onDown);
    keyboard.addEventListener('mouseup', onUp);
    keyboard.addEventListener('touchend', onUp);
  });

  const rangeGlideTimeElement = document.getElementById('range-glide-time');
  const formGlideTypeElement = document.getElementById('form-glide-type');

  const spanPrintGlideTimeElement = document.getElementById('print-glide-time-value');

  rangeGlideTimeElement.addEventListener('input', (event) => {
    glideTime = event.currentTarget.valueAsNumber;

    spanPrintGlideTimeElement.textContent = glideTime.toFixed(2);
  });

  formGlideTypeElement.addEventListener('change', () => {
    const radios = formGlideTypeElement.elements['radio-glide-type'];

    for (const radio of radios) {
      if (radio.checked) {
        glideType = radio.value;
        break;
      }
    }
  });
};

const animateTimeAndFrequencyResolution128 = (svgTime, svgSpectrum) => {
  const innerWidth = Number(svgTime.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svgTime.getAttribute('height')) - padding * 2;

  createCoordinateRect(svgTime);

  const analyser = new AnalyserNode(audiocontext, { fftSize: 128, smoothingTimeConstant: 0.2 });

  const buttonElement = document.getElementById('button-time-and-frequency-resolution-128-fft-size-animation');

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
  xText.setAttribute('font-size', '18px');

  svgSpectrum.appendChild(xText);

  const yText = document.createElementNS(xmlns, 'text');

  yText.textContent = 'Amplitude';

  yText.setAttribute('x', padding.toString(10));
  yText.setAttribute('y', '24');

  yText.setAttribute('text-anchor', 'middle');
  yText.setAttribute('stroke', 'none');
  yText.setAttribute('fill', baseColor);
  yText.setAttribute('font-size', '18px');

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

    for (let n = 0, len = times.length; n < len; n++) {
      const x = (n / len) * innerWidth + padding;
      const y = (1 - times[n]) * (innerHeight / 2) + padding;

      if (n === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }

      if (n % 16 === 0) {
        const t = document.createElementNS(xmlns, 'text');

        t.textContent = `${(n * (1 / audiocontext.sampleRate) * 1000).toFixed(1)} msec`;

        t.setAttribute('x', x.toString(10));
        t.setAttribute('y', (innerHeight / 2 + padding + 12).toString(10));
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('stroke', 'none');
        t.setAttribute('fill', baseColor);
        t.setAttribute('font-size', '12px');

        svgTime.appendChild(t);
      }
    }

    timePath.setAttribute('d', d);

    d = '';

    for (let k = 0, len = spectrums.length; k < len; k++) {
      const x = k * (audiocontext.sampleRate / analyser.fftSize) * (innerWidth / len) + padding;
      const y = (255 - spectrums[k]) * (innerHeight / 255) + padding;

      if (x > padding + innerWidth) {
        break;
      }

      if (k === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }

      const hz = document.createElementNS(xmlns, 'text');

      hz.textContent = `${Math.trunc(k * (audiocontext.sampleRate / analyser.fftSize))} Hz`;

      hz.setAttribute('x', x.toString(10));
      hz.setAttribute('y', (innerHeight + padding + 12).toString(10));
      hz.setAttribute('text-anchor', 'middle');
      hz.setAttribute('stroke', 'none');
      hz.setAttribute('fill', baseColor);
      hz.setAttribute('font-size', '12px');

      svgSpectrum.appendChild(hz);
    }

    spectrumPath.setAttribute('d', d);

    timerId = window.setTimeout(drawOscillator, 125);
  };

  let oscillator = null;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      oscillator.stop(0);
      oscillator = null;
    }

    oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth', frequency: 27.5 });

    oscillator.connect(analyser);
    analyser.connect(audiocontext.destination);

    oscillator.start(0);

    drawOscillator();

    buttonElement.textContent = 'stop';
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
};

const animateTimeAndFrequencyResolution2048 = (svgTime, svgSpectrum) => {
  const innerWidth = Number(svgTime.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svgTime.getAttribute('height')) - padding * 2;

  createCoordinateRect(svgTime);

  const analyser = new AnalyserNode(audiocontext, { fftSize: 2048, smoothingTimeConstant: 0.2 });

  const buttonElement = document.getElementById('button-time-and-frequency-resolution-2048-fft-size-animation');

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
  xText.setAttribute('font-size', '18px');

  svgSpectrum.appendChild(xText);

  const yText = document.createElementNS(xmlns, 'text');

  yText.textContent = 'Amplitude';

  yText.setAttribute('x', padding.toString(10));
  yText.setAttribute('y', '24');

  yText.setAttribute('text-anchor', 'middle');
  yText.setAttribute('stroke', 'none');
  yText.setAttribute('fill', baseColor);
  yText.setAttribute('font-size', '18px');

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

    for (let n = 0, len = times.length; n < len; n++) {
      const x = (n / len) * innerWidth + padding;
      const y = (1 - times[n]) * (innerHeight / 2) + padding;

      if (n === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }

      if (n % 256 === 0) {
        const t = document.createElementNS(xmlns, 'text');

        t.textContent = `${(n * (1 / audiocontext.sampleRate) * 1000).toFixed(1)} msec`;

        t.setAttribute('x', x.toString(10));
        t.setAttribute('y', (innerHeight / 2 + padding + 12).toString(10));
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('stroke', 'none');
        t.setAttribute('fill', baseColor);
        t.setAttribute('font-size', '12px');

        svgTime.appendChild(t);
      }
    }

    timePath.setAttribute('d', d);

    d = '';

    for (let k = 0, len = spectrums.length / 4; k < len; k++) {
      const x = k * (audiocontext.sampleRate / analyser.fftSize) * (innerWidth / len) + padding;
      const y = (255 - spectrums[k]) * (innerHeight / 255) + padding;

      if (x > padding + innerWidth) {
        break;
      }

      if (k === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }

      const hz = document.createElementNS(xmlns, 'text');

      hz.textContent = `${Math.trunc(k * (audiocontext.sampleRate / analyser.fftSize))} Hz`;

      hz.setAttribute('x', x.toString(10));
      hz.setAttribute('y', (innerHeight + padding + 12).toString(10));
      hz.setAttribute('text-anchor', 'middle');
      hz.setAttribute('stroke', 'none');
      hz.setAttribute('fill', baseColor);
      hz.setAttribute('font-size', '12px');

      svgSpectrum.appendChild(hz);
    }

    spectrumPath.setAttribute('d', d);

    timerId = window.setTimeout(drawOscillator, 125);
  };

  let oscillator = null;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      oscillator.stop(0);
      oscillator = null;
    }

    oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth', frequency: 27.5 });

    oscillator.connect(analyser);
    analyser.connect(audiocontext.destination);

    oscillator.start(0);

    drawOscillator();

    buttonElement.textContent = 'stop';
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
};

const createOverlapAddWithoutWindowFunction = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const render = (offset, overlapAdd) => {
    const g = document.createElementNS(xmlns, 'g');

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (padding / 2).toString(10));
    xRect.setAttribute('y', (padding + offset + innerHeight / 4).toString(10));
    xRect.setAttribute('width', (innerWidth + padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (padding - 1).toString(10));
    yRect.setAttribute('y', (padding + offset).toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', (innerHeight / 2).toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    const xText = document.createElementNS(xmlns, 'text');

    xText.textContent = 'Time';

    xText.setAttribute('x', (innerWidth + padding).toString(10));
    xText.setAttribute('y', (padding + offset + innerHeight / 4 - 8).toString(10));

    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '18px');

    if (offset === 0) {
      const yText = document.createElementNS(xmlns, 'text');

      yText.textContent = 'Amplitude';

      yText.setAttribute('x', padding.toString(10));
      yText.setAttribute('y', (padding + offset - 20).toString(10));

      yText.setAttribute('text-anchor', 'middle');
      yText.setAttribute('stroke', 'none');
      yText.setAttribute('fill', baseColor);
      yText.setAttribute('font-size', '18px');

      g.appendChild(yText);
    }

    const amplitudeTexts = document.createElementNS(xmlns, 'g');

    ['1.0', '0.0', '-1.0'].forEach((amplitude) => {
      const amplitudeText = document.createElementNS(xmlns, 'text');

      amplitudeText.textContent = amplitude;

      amplitudeText.setAttribute('x', (padding - 4).toString(10));
      amplitudeText.setAttribute('y', (padding + offset + (innerHeight / 4) * (1 - Number(amplitude)) - 4).toString(10));

      amplitudeText.setAttribute('text-anchor', 'end');
      amplitudeText.setAttribute('stroke', 'none');
      amplitudeText.setAttribute('fill', baseColor);
      amplitudeText.setAttribute('font-size', '14px');

      amplitudeTexts.appendChild(amplitudeText);
    });

    const w = 2 * Math.PI;
    const f = 3;

    if (overlapAdd) {
      const numberOfFrames = 4;

      let startX = 0;
      let endX = 0;

      for (let frame = 0; frame <= numberOfFrames; frame++) {
        const path = document.createElementNS(xmlns, 'path');

        let d = '';

        for (let n = 0, len = f * sampleRate; n < len; n++) {
          if (n > sampleRate * 0.666) {
            endX = (n / len) * innerWidth + (frame > 0 ? (frame / 1.75) * (innerWidth / numberOfFrames) : 0) + padding;
            break;
          }

          const v = Math.sin((w * f * n) / sampleRate);

          const x = (n / len) * innerWidth + (frame > 0 ? (frame / 1.75) * (innerWidth / numberOfFrames) : 0) + padding;

          const y = (1 - v) * (innerHeight / 4) + padding + offset;

          if (n === 0) {
            d += `M${x + lineWidth / 2} ${y}`;

            startX = x + lineWidth / 2;
          } else {
            d += ` L${x} ${y}`;
          }
        }

        path.setAttribute('d', d);

        path.setAttribute('stroke', alphaWaveColor);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', lineWidth.toString(10));
        path.setAttribute('stroke-linecap', lineCap);
        path.setAttribute('stroke-linejoin', lineJoin);

        g.appendChild(path);

        const rect = document.createElementNS(xmlns, 'rect');

        rect.setAttribute('x', startX.toString(10));
        rect.setAttribute('y', (padding + offset).toString(10));
        rect.setAttribute('width', ((innerWidth - padding) / 4).toString(10));
        rect.setAttribute('height', (innerHeight / 2).toString(10));
        rect.setAttribute('stroke', alphaLightWaveColor);
        rect.setAttribute('stroke-width', lineWidth.toString(10));
        rect.setAttribute('stroke-linecap', lineCap);
        rect.setAttribute('stroke-linejoin', lineJoin);
        rect.setAttribute('fill', 'rgba(255 0 255 / 8%)');

        g.appendChild(rect);
      }
    } else {
      const path = document.createElementNS(xmlns, 'path');

      let d = '';

      for (let n = 0, len = f * sampleRate; n < len; n++) {
        const v = Math.sin((w * f * n) / sampleRate);

        const x = (n / len) * innerWidth + padding;
        const y = (1 - v) * (innerHeight / 4) + padding + offset;

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

      g.appendChild(path);

      for (let frame = 0; frame < 4; frame++) {
        const rect = document.createElementNS(xmlns, 'rect');

        rect.setAttribute('x', (padding + frame * (innerWidth / 4) - frame * 16).toString(10));
        rect.setAttribute('y', (padding + offset).toString(10));
        rect.setAttribute('width', ((innerWidth - padding) / 4).toString(10));
        rect.setAttribute('height', (innerHeight / 2).toString(10));
        rect.setAttribute('stroke', alphaLightWaveColor);
        rect.setAttribute('stroke-width', lineWidth.toString(10));
        rect.setAttribute('stroke-linecap', lineCap);
        rect.setAttribute('stroke-linejoin', lineJoin);

        if (frame === 3) {
          rect.setAttribute('fill', 'rgba(255 0 255 / 8%)');
        } else {
          rect.setAttribute('fill', 'none');
        }

        g.appendChild(rect);
      }
    }

    g.appendChild(xRect);
    g.appendChild(yRect);
    g.appendChild(xText);
    g.appendChild(amplitudeTexts);

    svg.appendChild(g);
  };

  render(0, false);
  render((innerHeight + padding) / 2, true);
};

const createDFTSizeAndPeriod = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const render = (offset, isNTimes) => {
    const g = document.createElementNS(xmlns, 'g');

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (padding / 2).toString(10));
    xRect.setAttribute('y', (padding + offset + innerHeight / 4).toString(10));
    xRect.setAttribute('width', (innerWidth + padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (padding - 1).toString(10));
    yRect.setAttribute('y', (padding + offset).toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', (innerHeight / 2).toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    const xText = document.createElementNS(xmlns, 'text');

    xText.textContent = 'Time';

    xText.setAttribute('x', (innerWidth + padding).toString(10));
    xText.setAttribute('y', (padding + offset + innerHeight / 4 - 8).toString(10));

    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '18px');

    if (offset === 0) {
      const yText = document.createElementNS(xmlns, 'text');

      yText.textContent = 'Amplitude';

      yText.setAttribute('x', padding.toString(10));
      yText.setAttribute('y', (padding + offset - 20).toString(10));

      yText.setAttribute('text-anchor', 'middle');
      yText.setAttribute('stroke', 'none');
      yText.setAttribute('fill', baseColor);
      yText.setAttribute('font-size', '18px');

      g.appendChild(yText);
    }

    const amplitudeTexts = document.createElementNS(xmlns, 'g');

    ['1.0', '0.0', '-1.0'].forEach((amplitude) => {
      const amplitudeText = document.createElementNS(xmlns, 'text');

      amplitudeText.textContent = amplitude;

      amplitudeText.setAttribute('x', (padding - 4).toString(10));
      amplitudeText.setAttribute('y', (padding + offset + (innerHeight / 4) * (1 - Number(amplitude)) - 4).toString(10));

      amplitudeText.setAttribute('text-anchor', 'end');
      amplitudeText.setAttribute('stroke', 'none');
      amplitudeText.setAttribute('fill', baseColor);
      amplitudeText.setAttribute('font-size', '14px');

      amplitudeTexts.appendChild(amplitudeText);
    });

    const w = 2 * Math.PI;
    const f = 3;

    if (isNTimes) {
      const path = document.createElementNS(xmlns, 'path');

      let d = '';

      for (let n = 0, len = f * sampleRate; n < len; n++) {
        const v = Math.sin((w * f * n) / sampleRate);

        const x = (n / len) * innerWidth + padding;
        const y = (1 - v) * (innerHeight / 4) + padding + offset;

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

      g.appendChild(path);
    } else {
      for (let m = 0; m < 4; m++) {
        const path = document.createElementNS(xmlns, 'path');

        let d = '';

        for (let n = 0, len = f * sampleRate; n < len / 4.5; n++) {
          const v = Math.sin((w * 2.6 * n) / sampleRate);

          const x = (n / len) * innerWidth + padding + m * 135;
          const y = (1 - v) * (innerHeight / 4) + padding + offset;

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

        g.appendChild(path);
      }
    }

    for (let frame = 0; frame < 4; frame++) {
      const rect = document.createElementNS(xmlns, 'rect');

      rect.setAttribute('x', (padding + frame * (innerWidth / 4) - frame * 16).toString(10));
      rect.setAttribute('y', (padding + offset).toString(10));
      rect.setAttribute('width', ((innerWidth - padding) / 4).toString(10));
      rect.setAttribute('height', (innerHeight / 2).toString(10));
      rect.setAttribute('stroke', alphaLightWaveColor);
      rect.setAttribute('stroke-width', lineWidth.toString(10));
      rect.setAttribute('stroke-linecap', lineCap);
      rect.setAttribute('stroke-linejoin', lineJoin);
      rect.setAttribute('fill', 'none');

      g.appendChild(rect);
    }

    g.appendChild(xRect);
    g.appendChild(yRect);
    g.appendChild(xText);
    g.appendChild(amplitudeTexts);

    svg.appendChild(g);
  };

  render(0, true);
  render((innerHeight + padding) / 2, false);
};

const createWindowFunctionSpectrum = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const renderSamples = 256;

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
  rectMiddle.setAttribute('fill', alphaBaseColor);

  svg.appendChild(rectMiddle);

  const rectBottom = document.createElementNS(xmlns, 'rect');

  rectBottom.setAttribute('x', padding.toString(10));
  rectBottom.setAttribute('y', (padding + innerHeight - 1).toString(10));
  rectBottom.setAttribute('width', innerWidth.toString(10));
  rectBottom.setAttribute('height', lineWidth.toString(10));
  rectBottom.setAttribute('stroke', 'none');
  rectBottom.setAttribute('fill', baseColor);

  svg.appendChild(rectBottom);

  const yRect = document.createElementNS(xmlns, 'rect');

  yRect.setAttribute('x', (padding + innerWidth / 2 - 1).toString(10));
  yRect.setAttribute('y', padding.toString(10));
  yRect.setAttribute('width', lineWidth.toString(10));
  yRect.setAttribute('height', innerHeight.toString(10));
  yRect.setAttribute('stroke', 'none');
  yRect.setAttribute('fill', baseColor);

  svg.appendChild(yRect);

  const xText = document.createElementNS(xmlns, 'text');

  xText.textContent = 'Frequency';

  xText.setAttribute('x', (innerWidth + padding).toString(10));
  xText.setAttribute('y', (padding + innerHeight + 16).toString(10));

  xText.setAttribute('text-anchor', 'middle');
  xText.setAttribute('stroke', 'none');
  xText.setAttribute('fill', baseColor);
  xText.setAttribute('font-size', '16px');

  svg.appendChild(xText);

  const yText = document.createElementNS(xmlns, 'text');

  yText.textContent = 'Amplitude';

  yText.setAttribute('x', padding.toString(10));
  yText.setAttribute('y', '28');

  yText.setAttribute('text-anchor', 'middle');
  yText.setAttribute('stroke', 'none');
  yText.setAttribute('fill', baseColor);
  yText.setAttribute('font-size', '18px');

  svg.appendChild(yText);

  [1, 0.5, 0].forEach((amplitude) => {
    const yText = document.createElementNS(xmlns, 'text');

    yText.setAttribute('x', (padding - 4).toString(10));

    switch (amplitude) {
      case 1: {
        yText.textContent = 'T';

        yText.setAttribute('y', (padding + 2).toString(10));
        break;
      }

      case 0.5: {
        yText.textContent = 'T/2';

        yText.setAttribute('y', (padding + innerHeight / 2 + 2).toString(10));
        break;
      }

      case 0: {
        yText.textContent = '0';

        yText.setAttribute('y', (padding + innerHeight + 2).toString(10));
        break;
      }
    }

    yText.setAttribute('text-anchor', 'end');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '14px');

    svg.appendChild(yText);
  });

  const g = document.createElementNS(xmlns, 'g');

  let m = -3;

  for (let k = 0; k < renderSamples; k++) {
    const x = k * (sampleRate / renderSamples) * (innerWidth / sampleRate) + padding;
    const n = (k - renderSamples / 2) / 32;

    const fText = document.createElementNS(xmlns, 'text');

    if (k !== 0 && k % 32 === 0) {
      if (n === 0) {
        fText.textContent = '0';
      } else if (m === -1) {
        fText.textContent = '-ω';

        m = 1;
      } else if (m === 1) {
        fText.textContent = 'ω';

        ++m;
      } else {
        fText.textContent = `${m}ω`;

        ++m;
      }

      fText.setAttribute('x', x.toString(10));
      fText.setAttribute('y', (padding + innerHeight + 16).toString(10));
      fText.setAttribute('text-anchor', 'middle');
      fText.setAttribute('stroke', 'none');
      fText.setAttribute('fill', baseColor);
      fText.setAttribute('font-size', '14px');

      g.appendChild(fText);
    }
  }

  svg.appendChild(g);

  const renderSpectrum = (windowFunction) => {
    const path = document.createElementNS(xmlns, 'path');

    switch (windowFunction) {
      case 'rect': {
        path.setAttribute('stroke', waveColor);
        break;
      }

      case 'hanning': {
        path.setAttribute('stroke', lightWaveColor);
        break;
      }
    }

    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    let d = '';

    const sinc = (n) => {
      return Math.sin(Math.PI * n) / (Math.PI * n);
    };

    for (let k = 0; k < renderSamples; k++) {
      const x = k * (sampleRate / renderSamples) * (innerWidth / sampleRate) + padding;

      switch (windowFunction) {
        case 'rect': {
          const n = (k - renderSamples / 2) / 32;

          const v = n === 0 ? 1 : Math.abs(Math.sin(Math.PI * n) / (Math.PI * n));
          const y = (1 - v) * innerHeight + padding;

          if (k === 0) {
            d += `M${x + lineWidth / 2} ${y}`;
          } else {
            d += ` L${x} ${y}`;
          }

          break;
        }

        case 'hanning': {
          const a = 0.5;
          const s = 2 * Math.PI * (renderSamples / 32);

          const n = (k - renderSamples / 2) / 64;

          const v = n === 0 ? 0.5 : Math.abs(a * sinc(n) + ((1 - a) / 2) * (sinc(n + s) + sinc(n - s)));
          const y = (1 - v) * innerHeight + padding;

          if (k === 0) {
            d += `M${x + lineWidth / 2} ${y}`;
          } else {
            d += ` L${x} ${y}`;
          }

          if (k === 0) {
            d += `M${x + lineWidth / 2} ${y}`;
          } else {
            d += ` L${x} ${y}`;
          }

          break;
        }
      }
    }

    path.setAttribute('d', d);

    svg.appendChild(path);
  };

  const renderLobe = (windowFunction) => {
    const mainlobeRect = document.createElementNS(xmlns, 'rect');
    const sidelobePath = document.createElementNS(xmlns, 'path');

    sidelobePath.setAttribute('stroke-width', lineWidth.toString(10));
    sidelobePath.setAttribute('stroke-dasharray', '5,5');
    sidelobePath.setAttribute('stroke-linecap', lineCap);
    sidelobePath.setAttribute('stroke-linejoin', lineJoin);
    sidelobePath.setAttribute('fill', 'none');

    switch (windowFunction) {
      case 'rect': {
        mainlobeRect.setAttribute('x', (padding + (3 / 8) * innerWidth).toString(10));
        mainlobeRect.setAttribute('y', padding.toString(10));
        mainlobeRect.setAttribute('width', (innerWidth / 4).toString(10));
        mainlobeRect.setAttribute('height', innerHeight.toString(10));
        mainlobeRect.setAttribute('stroke', 'none');
        mainlobeRect.setAttribute('fill', 'rgba(0 0 255 / 12%)');

        sidelobePath.setAttribute('d', `M${padding} ${padding + (3 / 4) * innerHeight + 8} L${padding + innerWidth} ${padding + (3 / 4) * innerHeight + 8}`);
        sidelobePath.setAttribute('stroke', alphaWaveColor);

        break;
      }

      case 'hanning': {
        mainlobeRect.setAttribute('x', (padding + (1 / 4) * innerWidth).toString(10));
        mainlobeRect.setAttribute('y', (padding + innerHeight / 2).toString(10));
        mainlobeRect.setAttribute('width', (innerWidth / 2).toString(10));
        mainlobeRect.setAttribute('height', (innerHeight / 2).toString(10));
        mainlobeRect.setAttribute('stroke', 'none');
        mainlobeRect.setAttribute('fill', 'rgba(255 0 255 / 12%)');

        sidelobePath.setAttribute('d', `M${padding} ${padding + (7 / 8) * innerHeight + 4} L${padding + innerWidth} ${padding + (7 / 8) * innerHeight + 4}`);
        sidelobePath.setAttribute('stroke', alphaLightWaveColor);

        break;
      }
    }

    svg.appendChild(mainlobeRect);
    svg.appendChild(sidelobePath);
  };

  renderLobe('hanning');
  renderLobe('rect');

  renderSpectrum('hanning');
  renderSpectrum('rect');
};

function sinc(n) {
  if (n === 0) {
    return 1;
  }

  const t = 128;
  const w = (2 * Math.PI) / t;

  return Math.sin(w * n) / (w * n);
}

function FFT(reals, imags, size) {
  const pow2 = (n) => 2 ** n;

  const indexes = new Uint16Array(size); // FFT size is `0` between `65535`.

  const numberOfStages = Math.log2(size);

  for (let stage = 1; stage <= numberOfStages; stage++) {
    for (let i = 0; i < pow2(stage - 1); i++) {
      const rest = numberOfStages - stage;

      for (let j = 0; j < pow2(rest); j++) {
        const n = i * pow2(rest + 1) + j;
        const m = pow2(rest) + n;
        const w = 2.0 * Math.PI * j * pow2(stage - 1);

        const areal = reals[n];
        const aimag = imags[n];
        const breal = reals[m];
        const bimag = imags[m];
        const wreal = Math.cos(w / size);
        const wimag = -1 * Math.sin(w / size); // Clockwise

        if (stage < numberOfStages) {
          reals[n] = areal + breal;
          imags[n] = aimag + bimag;
          reals[m] = wreal * (areal - breal) - wimag * (aimag - bimag);
          imags[m] = wreal * (aimag - bimag) + wimag * (areal - breal);
        } else {
          reals[n] = areal + breal;
          imags[n] = aimag + bimag;
          reals[m] = areal - breal;
          imags[m] = aimag - bimag;
        }
      }
    }
  }

  for (let stage = 1; stage <= numberOfStages; stage++) {
    const rest = numberOfStages - stage;

    for (let i = 0; i < pow2(stage - 1); i++) {
      indexes[pow2(stage - 1) + i] = indexes[i] + pow2(rest);
    }
  }

  for (let k = 0; k < size; k++) {
    if (indexes[k] <= k) {
      continue;
    }

    const real = reals[indexes[k]];
    const imag = imags[indexes[k]];

    reals[indexes[k]] = reals[k];
    imags[indexes[k]] = imags[k];

    reals[k] = real;
    imags[k] = imag;
  }
}

const animateWindowFunctions = (svgTime, svgSpectrum) => {
  const innerWidth = Number(svgTime.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svgTime.getAttribute('height')) - padding * 2;

  createCoordinateRect(svgTime);

  const analyser = new AnalyserNode(audiocontext, { fftSize: 1024 });

  const minDecibels = -100;
  const downSampleRate = 64000;
  const renderSamples = 1024;

  const buttonElement = document.getElementById('button-window-functions');
  const selectWindowFunctionElement = document.getElementById('select-window-functions');

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
  xText.setAttribute('font-size', '16px');

  svgSpectrum.appendChild(xText);

  const yText = document.createElementNS(xmlns, 'text');

  yText.textContent = 'Amplitude';

  yText.setAttribute('x', padding.toString(10));
  yText.setAttribute('y', '28');

  yText.setAttribute('text-anchor', 'middle');
  yText.setAttribute('stroke', 'none');
  yText.setAttribute('fill', baseColor);
  yText.setAttribute('font-size', '18px');

  svgSpectrum.appendChild(yText);

  [0, -50, -100].forEach((dB) => {
    const yText = document.createElementNS(xmlns, 'text');

    yText.textContent = `${dB} dB`;

    yText.setAttribute('x', (padding - 4).toString(10));

    switch (dB) {
      case 0: {
        yText.setAttribute('y', (padding + 2).toString(10));
        break;
      }

      case -50: {
        yText.setAttribute('y', (padding + innerHeight / 2 + 2).toString(10));
        break;
      }

      case -100: {
        yText.setAttribute('y', (padding + innerHeight + 2).toString(10));
        break;
      }
    }

    yText.setAttribute('text-anchor', 'end');
    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '14px');

    svgSpectrum.appendChild(yText);
  });

  const timePath = document.createElementNS(xmlns, 'path');

  timePath.setAttribute('stroke', waveColor);
  timePath.setAttribute('fill', 'none');
  timePath.setAttribute('stroke-width', lineWidth.toString(10));
  timePath.setAttribute('stroke-linecap', lineCap);
  timePath.setAttribute('stroke-linejoin', lineJoin);

  const timeWindowFunctionPath = document.createElementNS(xmlns, 'path');

  timeWindowFunctionPath.setAttribute('stroke', alphaLightWaveColor);
  timeWindowFunctionPath.setAttribute('stroke-width', lineWidth.toString(10));
  timeWindowFunctionPath.setAttribute('stroke-linecap', lineCap);
  timeWindowFunctionPath.setAttribute('stroke-linejoin', lineJoin);
  timeWindowFunctionPath.setAttribute('fill', 'rgba(255 0 255 / 8%)');

  const spectrumPath = document.createElementNS(xmlns, 'path');

  spectrumPath.setAttribute('stroke', waveColor);
  spectrumPath.setAttribute('fill', 'none');
  spectrumPath.setAttribute('stroke-width', lineWidth.toString(10));
  spectrumPath.setAttribute('stroke-linecap', lineCap);
  spectrumPath.setAttribute('stroke-linejoin', lineJoin);

  const spectrumWindowFunctionPath = document.createElementNS(xmlns, 'path');

  spectrumWindowFunctionPath.setAttribute('stroke', lightWaveColor);
  spectrumWindowFunctionPath.setAttribute('fill', 'none');
  spectrumWindowFunctionPath.setAttribute('stroke-width', lineWidth.toString(10));
  spectrumWindowFunctionPath.setAttribute('stroke-linecap', lineCap);
  spectrumWindowFunctionPath.setAttribute('stroke-linejoin', lineJoin);

  svgTime.appendChild(timeWindowFunctionPath);
  svgTime.appendChild(timePath);
  svgSpectrum.appendChild(spectrumWindowFunctionPath);
  svgSpectrum.appendChild(spectrumPath);

  let timerId = null;

  let windowFunction = 'rect';

  const drawOscillator = () => {
    const fftSize = analyser.fftSize;

    const times = new Float32Array(fftSize);

    analyser.getFloatTimeDomainData(times);

    const reals = new Float32Array(fftSize);
    const imags = new Float32Array(fftSize);

    const windowFunctions = new Float32Array(fftSize);

    switch (windowFunction) {
      case 'rect': {
        for (let n = 0; n < fftSize; n++) {
          windowFunctions[n] = 1;
        }

        break;
      }

      case 'hanning': {
        for (let n = 0; n < fftSize; n++) {
          windowFunctions[n] = 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (fftSize - 1));
        }

        break;
      }

      case 'hamming': {
        for (let n = 0; n < fftSize; n++) {
          windowFunctions[n] = 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (fftSize - 1));
        }

        break;
      }

      case 'blackman': {
        const alpha = 0.16;

        for (let n = 0; n < fftSize; n++) {
          windowFunctions[n] = (1 - alpha) / 2 - 0.5 * Math.cos((2 * Math.PI * n) / (fftSize - 1)) + (alpha / 2) * Math.cos((4 * Math.PI * n) / (fftSize - 1));
        }

        break;
      }
    }

    for (let n = 0; n < fftSize; n++) {
      reals[n] = windowFunctions[n] * times[n];
    }

    FFT(reals, imags, fftSize);

    const spectrums = new Float32Array(fftSize);

    for (let k = 0; k < fftSize; k++) {
      spectrums[k] = Math.sqrt(reals[k] ** 2 + imags[k] ** 2);

      if (spectrums[k] === 0) {
        spectrums[k] = minDecibels;
        continue;
      }

      spectrums[k] = 20 * Math.log10(spectrums[k]);
      spectrums[k] = Math.max(spectrums[k], minDecibels);
    }

    timePath.removeAttribute('d');
    timeWindowFunctionPath.removeAttribute('d');
    spectrumPath.removeAttribute('d');
    spectrumWindowFunctionPath.removeAttribute('d');

    let d = '';

    for (let n = 0; n < fftSize; n++) {
      const x = (n / fftSize) * innerWidth + padding;
      const y = (1 - times[n]) * (innerHeight / 2) + padding;

      if (n === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    timePath.setAttribute('d', d);

    d = '';

    for (let n = 0; n < fftSize; n++) {
      const x = (n / fftSize) * innerWidth + padding;
      const y = (1 - windowFunctions[n]) * (innerHeight / 2) + padding;

      if (n === 0) {
        d += `M${x + lineWidth / 2} ${innerHeight / 2 + padding}`;
        d += ` L${x + lineWidth / 2} ${y}`;
      } else if (n === fftSize - 1) {
        d += ` L${x + lineWidth / 2} ${innerHeight / 2 + padding}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    timeWindowFunctionPath.setAttribute('d', d);

    d = '';

    for (let k = 0; k < renderSamples; k++) {
      const x = k * (downSampleRate / renderSamples) * (innerWidth / renderSamples) + padding;
      const v = 1 - spectrums[k] / 64;
      const y = v <= 1 ? v * innerHeight + padding : innerHeight + padding;

      if (k === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }

      const f = Math.trunc(k * (audiocontext.sampleRate / fftSize));

      if (f > 750) {
        break;
      }

      if (k % 2 === 0) {
        const hz = document.createElementNS(xmlns, 'text');

        hz.textContent = `${f} Hz`;

        hz.setAttribute('x', x.toString(10));
        hz.setAttribute('y', (innerHeight + padding + 12).toString(10));
        hz.setAttribute('text-anchor', 'middle');
        hz.setAttribute('stroke', 'none');
        hz.setAttribute('fill', baseColor);
        hz.setAttribute('font-size', '12px');

        svgSpectrum.appendChild(hz);
      }
    }

    spectrumPath.setAttribute('d', d);

    d = '';

    const s = 2 * Math.PI * (renderSamples / 32);

    for (let k = 0; k < renderSamples; k++) {
      const x = k * (downSampleRate / renderSamples) * (innerWidth / downSampleRate) + padding;
      const n = k - renderSamples / 4 - 52;

      switch (windowFunction) {
        case 'rect': {
          const v = Math.abs(sinc(n));
          const y = (1 - v) * innerHeight + padding;

          if (k === 0) {
            d += `M${x + lineWidth / 2} ${y}`;
          } else {
            d += ` L${x} ${y}`;
          }

          break;
        }

        case 'hanning': {
          const a = 0.5;

          const v = Math.abs(n) < 0.67 * s ? Math.abs(a * sinc(n) + ((1 - a) / 2) * (sinc(n + s) + sinc(n - s))) : 0;
          const y = (1 - v) * innerHeight + padding;

          if (k === 0) {
            d += `M${x + lineWidth / 2} ${y}`;
          } else {
            d += ` L${x} ${y}`;
          }

          break;
        }

        case 'hamming': {
          const a = 0.54;

          const v = Math.abs(n) < 0.67 * s ? Math.abs(a * sinc(n) + ((1 - a) / 2) * (sinc(n + s) + sinc(n - s))) : 0;
          const y = (1 - v) * innerHeight + padding;

          if (k === 0) {
            d += `M${x + lineWidth / 2} ${y}`;
          } else {
            d += ` L${x} ${y}`;
          }

          break;
        }

        case 'blackman': {
          const a = 0.42;
          const b = 0.25;
          const c = 0.04;

          const v = Math.abs(n) < 0.67 * s ? Math.abs(a * sinc(n) + b * (sinc(n + s) + sinc(n - s)) + c * (sinc(n + 2 * s) + sinc(n - 2 * s))) : 0;
          const y = (1 - v) * innerHeight + padding;

          if (k === 0) {
            d += `M${x + lineWidth / 2} ${y}`;
          } else {
            d += ` L${x} ${y}`;
          }

          break;
        }
      }
    }

    spectrumWindowFunctionPath.setAttribute('d', d);

    timerId = window.setTimeout(drawOscillator, 125);
  };

  let oscillator = null;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      oscillator.stop(0);
      oscillator = null;
    }

    oscillator = new OscillatorNode(audiocontext, { frequency: 220 });

    oscillator.connect(analyser);
    analyser.connect(audiocontext.destination);

    oscillator.start(0);

    drawOscillator();

    buttonElement.textContent = 'stop';
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

  selectWindowFunctionElement.addEventListener('change', (event) => {
    windowFunction = event.currentTarget.value;
  });
};

const createOverlapAddWithWindowFunction = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const render = (offset, hanning) => {
    const g = document.createElementNS(xmlns, 'g');

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (padding / 2).toString(10));
    xRect.setAttribute('y', (padding + offset + innerHeight / 4).toString(10));
    xRect.setAttribute('width', (innerWidth + padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (padding - 1).toString(10));
    yRect.setAttribute('y', (padding + offset).toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', (innerHeight / 2).toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    const xText = document.createElementNS(xmlns, 'text');

    xText.textContent = 'Time';

    xText.setAttribute('x', (innerWidth + padding).toString(10));
    xText.setAttribute('y', (padding + offset + innerHeight / 4 - 8).toString(10));

    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '18px');

    if (offset === 0) {
      const yText = document.createElementNS(xmlns, 'text');

      yText.textContent = 'Amplitude';

      yText.setAttribute('x', padding.toString(10));
      yText.setAttribute('y', (padding + offset - 20).toString(10));

      yText.setAttribute('text-anchor', 'middle');
      yText.setAttribute('stroke', 'none');
      yText.setAttribute('fill', baseColor);
      yText.setAttribute('font-size', '18px');

      g.appendChild(yText);
    }

    const amplitudeTexts = document.createElementNS(xmlns, 'g');

    ['1.0', '0.0', '-1.0'].forEach((amplitude) => {
      const amplitudeText = document.createElementNS(xmlns, 'text');

      amplitudeText.textContent = amplitude;

      amplitudeText.setAttribute('x', (padding - 4).toString(10));
      amplitudeText.setAttribute('y', (padding + offset + (innerHeight / 4) * (1 - Number(amplitude)) - 4).toString(10));

      amplitudeText.setAttribute('text-anchor', 'end');
      amplitudeText.setAttribute('stroke', 'none');
      amplitudeText.setAttribute('fill', baseColor);
      amplitudeText.setAttribute('font-size', '14px');

      amplitudeTexts.appendChild(amplitudeText);
    });

    const w = 2 * Math.PI;
    const f = 3;

    if (hanning) {
      const numberOfFrames = 4;

      let startX = 0;
      let endX = 0;

      for (let frame = 0; frame <= numberOfFrames; frame++) {
        const path = document.createElementNS(xmlns, 'path');

        let d = '';

        for (let n = 0, len = f * sampleRate; n < len; n++) {
          if (n > sampleRate * 0.666) {
            endX = (n / len) * innerWidth + (frame > 0 ? (frame / 1.75) * (innerWidth / numberOfFrames) : 0) + padding;
            break;
          }

          const v = Math.sin((w * f * n) / sampleRate);

          const x = (n / len) * innerWidth + (frame > 0 ? (frame / 1.75) * (innerWidth / numberOfFrames) : 0) + padding;

          const y = (1 - v) * (innerHeight / 4) + padding + offset;

          if (n === 0) {
            d += `M${x + lineWidth / 2} ${y}`;

            startX = x + lineWidth / 2;
          } else {
            d += ` L${x} ${y}`;
          }
        }

        path.setAttribute('d', d);

        path.setAttribute('stroke', alphaWaveColor);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', lineWidth.toString(10));
        path.setAttribute('stroke-linecap', lineCap);
        path.setAttribute('stroke-linejoin', lineJoin);

        g.appendChild(path);

        const windowFunctionPath = document.createElementNS(xmlns, 'path');

        let windowFunctionPathD = '';

        for (let n = 0, len = innerWidth / numberOfFrames; n < len; n++) {
          const v = 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / len);

          const x = n + padding;
          const y = (1 - v) * (innerHeight / 4) + padding + offset;

          if (n === 0) {
            windowFunctionPathD += `M${x + lineWidth / 2} ${y}`;
          } else {
            windowFunctionPathD += ` L${x} ${y}`;
          }
        }

        windowFunctionPath.setAttribute('d', windowFunctionPathD);
        windowFunctionPath.setAttribute('stroke', alphaLightWaveColor);
        windowFunctionPath.setAttribute('stroke-width', lineWidth.toString(10));
        windowFunctionPath.setAttribute('stroke-linecap', lineCap);
        windowFunctionPath.setAttribute('stroke-linejoin', lineJoin);
        windowFunctionPath.setAttribute('fill', 'rgba(255 0 255 / 8%)');
        windowFunctionPath.setAttribute('transform', `translate(${frame * (innerWidth / 7)} 0)`);

        g.appendChild(windowFunctionPath);
      }
    } else {
      const numberOfFrames = 4;

      let startX = 0;
      let endX = 0;

      for (let frame = 0; frame <= numberOfFrames; frame++) {
        const path = document.createElementNS(xmlns, 'path');

        let d = '';

        for (let n = 0, len = f * sampleRate; n < len; n++) {
          if (n > sampleRate * 0.666) {
            endX = (n / len) * innerWidth + (frame > 0 ? (frame / 1.75) * (innerWidth / numberOfFrames) : 0) + padding;
            break;
          }

          const v = Math.sin((w * f * n) / sampleRate);

          const x = (n / len) * innerWidth + (frame > 0 ? (frame / 1.75) * (innerWidth / numberOfFrames) : 0) + padding;

          const y = (1 - v) * (innerHeight / 4) + padding + offset;

          if (n === 0) {
            d += `M${x + lineWidth / 2} ${y}`;

            startX = x + lineWidth / 2;
          } else {
            d += ` L${x} ${y}`;
          }
        }

        path.setAttribute('d', d);

        path.setAttribute('stroke', alphaWaveColor);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', lineWidth.toString(10));
        path.setAttribute('stroke-linecap', lineCap);
        path.setAttribute('stroke-linejoin', lineJoin);

        g.appendChild(path);

        const rect = document.createElementNS(xmlns, 'rect');

        rect.setAttribute('x', startX.toString(10));
        rect.setAttribute('y', (padding + offset).toString(10));
        rect.setAttribute('width', ((innerWidth - padding) / 4).toString(10));
        rect.setAttribute('height', (innerHeight / 2).toString(10));
        rect.setAttribute('stroke', alphaLightWaveColor);
        rect.setAttribute('stroke-width', lineWidth.toString(10));
        rect.setAttribute('stroke-linecap', lineCap);
        rect.setAttribute('stroke-linejoin', lineJoin);
        rect.setAttribute('fill', 'rgba(255 0 255 / 8%)');

        g.appendChild(rect);
      }
    }

    g.appendChild(xRect);
    g.appendChild(yRect);
    g.appendChild(xText);
    g.appendChild(amplitudeTexts);

    svg.appendChild(g);
  };

  render(0, false);
  render((innerHeight + padding) / 2, true);
};

const createOverlapAddByOverlapAddProcessor = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const g = document.createElementNS(xmlns, 'g');

  const xRect = document.createElementNS(xmlns, 'rect');

  xRect.setAttribute('x', padding.toString(10));
  xRect.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
  xRect.setAttribute('width', (innerWidth + padding).toString(10));
  xRect.setAttribute('height', lineWidth.toString(10));
  xRect.setAttribute('stroke', 'none');
  xRect.setAttribute('fill', baseColor);

  const yRect = document.createElementNS(xmlns, 'rect');

  yRect.setAttribute('x', (padding - 1).toString(10));
  yRect.setAttribute('y', padding.toString(10));
  yRect.setAttribute('width', lineWidth.toString(10));
  yRect.setAttribute('height', innerHeight.toString(10));
  yRect.setAttribute('stroke', 'none');
  yRect.setAttribute('fill', baseColor);

  const xText = document.createElementNS(xmlns, 'text');

  xText.textContent = 'Time';

  xText.setAttribute('x', (innerWidth + padding).toString(10));
  xText.setAttribute('y', (padding + innerHeight / 2 - 8).toString(10));
  xText.setAttribute('text-anchor', 'middle');
  xText.setAttribute('stroke', 'none');
  xText.setAttribute('fill', baseColor);
  xText.setAttribute('font-size', '18px');

  const yText = document.createElementNS(xmlns, 'text');

  yText.textContent = 'Amplitude';

  yText.setAttribute('x', padding.toString(10));
  yText.setAttribute('y', (padding - 20).toString(10));
  yText.setAttribute('text-anchor', 'middle');
  yText.setAttribute('stroke', 'none');
  yText.setAttribute('fill', baseColor);
  yText.setAttribute('font-size', '18px');

  g.appendChild(yText);

  const amplitudeTexts = document.createElementNS(xmlns, 'g');

  ['1.0', '0.0', '-1.0'].forEach((amplitude) => {
    const amplitudeText = document.createElementNS(xmlns, 'text');

    amplitudeText.textContent = amplitude;

    amplitudeText.setAttribute('x', (padding - 4).toString(10));
    amplitudeText.setAttribute('y', (padding + (innerHeight / 2) * (1 - Number(amplitude)) - 4).toString(10));

    amplitudeText.setAttribute('text-anchor', 'end');
    amplitudeText.setAttribute('stroke', 'none');
    amplitudeText.setAttribute('fill', baseColor);
    amplitudeText.setAttribute('font-size', '14px');

    amplitudeTexts.appendChild(amplitudeText);
  });

  const w = 2 * Math.PI;
  const f = 3;

  const numberOfOverlaps = 8;
  const numberOfFrames = 8;

  for (let overlap = 0; overlap < numberOfOverlaps; overlap++) {
    let startX = padding + overlap * (innerWidth / numberOfFrames);

    for (let frame = 0; frame < numberOfFrames; frame++) {
      const path = document.createElementNS(xmlns, 'path');

      let d = '';

      for (let n = 0, len = f * sampleRate; n < len; n++) {
        const v = Math.sin((w * f * n) / sampleRate);
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
      path.setAttribute('stroke-width', lineWidth.toString(10));
      path.setAttribute('stroke-linecap', lineCap);
      path.setAttribute('stroke-linejoin', lineJoin);

      g.appendChild(path);

      if (startX > innerWidth) {
        break;
      }

      const rect = document.createElementNS(xmlns, 'rect');

      rect.setAttribute('x', startX.toString(10));
      rect.setAttribute('y', padding.toString(10));
      rect.setAttribute('width', (innerWidth / numberOfFrames).toString(10));
      rect.setAttribute('height', (innerHeight / 2).toString(10));
      rect.setAttribute('stroke', alphaLightWaveColor);
      rect.setAttribute('stroke-width', lineWidth.toString(10));
      rect.setAttribute('stroke-linecap', lineCap);
      rect.setAttribute('stroke-linejoin', lineJoin);
      rect.setAttribute('fill', 'rgba(255 0 255 / 8%)');

      g.appendChild(rect);

      startX += innerWidth / numberOfFrames;
    }
  }

  g.appendChild(xRect);
  g.appendChild(yRect);
  g.appendChild(xText);
  g.appendChild(amplitudeTexts);

  svg.appendChild(g);
};

const createOverlapAddByOverlapAddProcessorWithWindowFunction = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const g = document.createElementNS(xmlns, 'g');

  const xRect = document.createElementNS(xmlns, 'rect');

  xRect.setAttribute('x', padding.toString(10));
  xRect.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
  xRect.setAttribute('width', (innerWidth + padding).toString(10));
  xRect.setAttribute('height', lineWidth.toString(10));
  xRect.setAttribute('stroke', 'none');
  xRect.setAttribute('fill', baseColor);

  const yRect = document.createElementNS(xmlns, 'rect');

  yRect.setAttribute('x', (padding - 1).toString(10));
  yRect.setAttribute('y', padding.toString(10));
  yRect.setAttribute('width', lineWidth.toString(10));
  yRect.setAttribute('height', innerHeight.toString(10));
  yRect.setAttribute('stroke', 'none');
  yRect.setAttribute('fill', baseColor);

  const xText = document.createElementNS(xmlns, 'text');

  xText.textContent = 'Time';

  xText.setAttribute('x', (innerWidth + padding).toString(10));
  xText.setAttribute('y', (padding + innerHeight / 2 - 8).toString(10));
  xText.setAttribute('text-anchor', 'middle');
  xText.setAttribute('stroke', 'none');
  xText.setAttribute('fill', baseColor);
  xText.setAttribute('font-size', '18px');

  const yText = document.createElementNS(xmlns, 'text');

  yText.textContent = 'Amplitude';

  yText.setAttribute('x', padding.toString(10));
  yText.setAttribute('y', (padding - 20).toString(10));
  yText.setAttribute('text-anchor', 'middle');
  yText.setAttribute('stroke', 'none');
  yText.setAttribute('fill', baseColor);
  yText.setAttribute('font-size', '18px');

  g.appendChild(yText);

  const amplitudeTexts = document.createElementNS(xmlns, 'g');

  ['1.0', '0.0', '-1.0'].forEach((amplitude) => {
    const amplitudeText = document.createElementNS(xmlns, 'text');

    amplitudeText.textContent = amplitude;

    amplitudeText.setAttribute('x', (padding - 4).toString(10));
    amplitudeText.setAttribute('y', (padding + (innerHeight / 2) * (1 - Number(amplitude)) - 4).toString(10));

    amplitudeText.setAttribute('text-anchor', 'end');
    amplitudeText.setAttribute('stroke', 'none');
    amplitudeText.setAttribute('fill', baseColor);
    amplitudeText.setAttribute('font-size', '14px');

    amplitudeTexts.appendChild(amplitudeText);
  });

  const w = 2 * Math.PI;
  const f = 3;

  const numberOfOverlaps = 8;
  const numberOfFrames = 8;

  for (let overlap = 0; overlap < numberOfOverlaps; overlap++) {
    let startX = padding + overlap * (innerWidth / numberOfFrames);

    for (let frame = 0; frame < numberOfFrames; frame++) {
      const path = document.createElementNS(xmlns, 'path');

      let d = '';

      for (let n = 0, len = f * sampleRate; n < len; n++) {
        const v = Math.sin((w * f * n) / sampleRate);
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
      path.setAttribute('stroke-width', lineWidth.toString(10));
      path.setAttribute('stroke-linecap', lineCap);
      path.setAttribute('stroke-linejoin', lineJoin);

      g.appendChild(path);

      if (startX > innerWidth) {
        break;
      }

      const rect = document.createElementNS(xmlns, 'rect');

      rect.setAttribute('x', startX.toString(10));
      rect.setAttribute('y', padding.toString(10));
      rect.setAttribute('width', (innerWidth / numberOfFrames).toString(10));
      rect.setAttribute('height', (innerHeight / 2).toString(10));
      rect.setAttribute('stroke', alphaLightWaveColor);
      rect.setAttribute('stroke-width', lineWidth.toString(10));
      rect.setAttribute('stroke-linecap', lineCap);
      rect.setAttribute('stroke-linejoin', lineJoin);
      rect.setAttribute('fill', 'rgba(255 0 255 / 8%)');

      g.appendChild(rect);

      const windowFunctionPath = document.createElementNS(xmlns, 'path');

      let windowFunctionPathD = '';

      for (let n = 0, len = innerWidth; n < len; n++) {
        const v = 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / len);

        const x = startX + n;
        const y = (1 - v) * (innerHeight / 2) + padding;

        if (n === 0) {
          windowFunctionPathD += `M${x + lineWidth / 2} ${y}`;
        } else {
          windowFunctionPathD += ` L${x} ${y}`;
        }
      }

      windowFunctionPath.setAttribute('d', windowFunctionPathD);
      windowFunctionPath.setAttribute('stroke', lightWaveColor);
      windowFunctionPath.setAttribute('stroke-width', lineWidth.toString(10));
      windowFunctionPath.setAttribute('stroke-linecap', lineCap);
      windowFunctionPath.setAttribute('stroke-linejoin', lineJoin);
      windowFunctionPath.setAttribute('fill', 'rgba(255 0 255 / 1%)');

      g.appendChild(windowFunctionPath);

      startX += innerWidth / numberOfFrames;
    }
  }

  g.appendChild(xRect);
  g.appendChild(yRect);
  g.appendChild(xText);
  g.appendChild(amplitudeTexts);

  svg.appendChild(g);
};

const noisesuppressor = () => {
  const buttonElement = document.getElementById('button-noise-suppressor');
  const rangeElement = document.getElementById('range-noise-suppressor-threshold');
  const spanElement = document.getElementById('print-noise-suppressor-threshold-value');

  let processor = null;
  let mediaStream = null;

  buttonElement.addEventListener('click', async () => {
    buttonElement.setAttribute('disabled', 'disabled');

    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (processor === null) {
      await audiocontext.audioWorklet.addModule('./audio-worklets/noise-suppressor.js');
    }

    if (mediaStream) {
      const audioTracks = mediaStream.getAudioTracks();

      for (const audioTrack of audioTracks) {
        audioTrack.stop();
      }

      mediaStream = null;

      buttonElement.textContent = 'start';
      buttonElement.removeAttribute('disabled');
      return;
    }

    if (mediaStream === null) {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }

    const source = new MediaStreamAudioSourceNode(audiocontext, { mediaStream });

    processor = new AudioWorkletNode(audiocontext, 'NoiseSuppressorProcessor', {
      processorOptions: {
        frameSize: 512
      }
    });

    source.connect(processor);
    processor.connect(audiocontext.destination);

    buttonElement.textContent = 'stop';
    buttonElement.removeAttribute('disabled');
  });

  rangeElement.addEventListener('input', (event) => {
    const threshold = event.currentTarget.valueAsNumber;

    if (processor) {
      processor.port.postMessage({ threshold });
    }

    spanElement.textContent = threshold.toFixed(2);
  });
};

const animateWhiteNoiseSpectrums = (svgTime, svgAmplitudeSpectrum, svgPhaseSpectrum) => {
  const innerWidth = Number(svgTime.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svgTime.getAttribute('height')) - padding * 2;

  const renderSpectrum = (svg, showAmplitude) => {
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
    rectMiddle.setAttribute('fill', alphaBaseColor);

    svg.appendChild(rectMiddle);

    const rectBottom = document.createElementNS(xmlns, 'rect');

    rectBottom.setAttribute('x', padding.toString(10));
    rectBottom.setAttribute('y', (padding + innerHeight - 1).toString(10));
    rectBottom.setAttribute('width', innerWidth.toString(10));
    rectBottom.setAttribute('height', lineWidth.toString(10));
    rectBottom.setAttribute('stroke', 'none');
    rectBottom.setAttribute('fill', baseColor);

    svg.appendChild(rectBottom);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', padding.toString(10));
    yRect.setAttribute('y', padding.toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', innerHeight.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    svg.appendChild(yRect);

    const xText = document.createElementNS(xmlns, 'text');

    xText.textContent = 'Frequency';

    xText.setAttribute('x', (innerWidth + padding).toString(10));
    xText.setAttribute('y', (padding + innerHeight - 8).toString(10));

    xText.setAttribute('text-anchor', 'end');
    xText.setAttribute('stroke', 'none');
    xText.setAttribute('fill', baseColor);
    xText.setAttribute('font-size', '18px');

    svg.appendChild(xText);

    const yText = document.createElementNS(xmlns, 'text');

    if (showAmplitude) {
      yText.textContent = 'Amplitude';
      yText.setAttribute('text-anchor', 'middle');
    } else {
      yText.textContent = 'Phase';
      yText.setAttribute('text-anchor', 'end');
    }

    yText.setAttribute('x', padding.toString(10));
    yText.setAttribute('y', '24');

    yText.setAttribute('stroke', 'none');
    yText.setAttribute('fill', baseColor);
    yText.setAttribute('font-size', '18px');

    svg.appendChild(yText);

    if (showAmplitude) {
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
    } else {
      ['π', '0', '-π'].forEach((rad) => {
        const yText = document.createElementNS(xmlns, 'text');

        yText.textContent = `${rad} rad`;

        yText.setAttribute('x', (padding - 8).toString(10));

        switch (rad) {
          case 'π': {
            yText.setAttribute('y', (padding - 4).toString(10));
            break;
          }

          case '0': {
            yText.setAttribute('y', (padding + innerHeight / 2 - 4).toString(10));
            break;
          }

          case '-π': {
            yText.setAttribute('y', (padding + innerHeight - 4).toString(10));
            break;
          }
        }

        yText.setAttribute('text-anchor', 'end');
        yText.setAttribute('stroke', 'none');
        yText.setAttribute('fill', baseColor);
        yText.setAttribute('font-size', '16px');

        svg.appendChild(yText);
      });
    }
  };

  const timePath = document.createElementNS(xmlns, 'path');

  timePath.setAttribute('stroke', waveColor);
  timePath.setAttribute('fill', 'none');
  timePath.setAttribute('stroke-width', lineWidth.toString(10));
  timePath.setAttribute('stroke-linecap', lineCap);
  timePath.setAttribute('stroke-linejoin', lineJoin);

  const amplitudeSpectrumPath = document.createElementNS(xmlns, 'path');

  amplitudeSpectrumPath.setAttribute('stroke', waveColor);
  amplitudeSpectrumPath.setAttribute('fill', 'none');
  amplitudeSpectrumPath.setAttribute('stroke-width', lineWidth.toString(10));
  amplitudeSpectrumPath.setAttribute('stroke-linecap', lineCap);
  amplitudeSpectrumPath.setAttribute('stroke-linejoin', lineJoin);

  const phaseSpectrumPath = document.createElementNS(xmlns, 'path');

  phaseSpectrumPath.setAttribute('stroke', waveColor);
  phaseSpectrumPath.setAttribute('fill', 'none');
  phaseSpectrumPath.setAttribute('stroke-width', lineWidth.toString(10));
  phaseSpectrumPath.setAttribute('stroke-linecap', lineCap);
  phaseSpectrumPath.setAttribute('stroke-linejoin', lineJoin);

  svgTime.appendChild(timePath);
  svgAmplitudeSpectrum.appendChild(amplitudeSpectrumPath);
  svgPhaseSpectrum.appendChild(phaseSpectrumPath);

  let processor = null;

  const analyse = (data) => {
    timePath.removeAttribute('d');
    amplitudeSpectrumPath.removeAttribute('d');
    phaseSpectrumPath.removeAttribute('d');

    const length = data.length;

    let d = '';

    for (let n = 0; n < length; n++) {
      const x = (n / length) * innerWidth + padding;
      const y = (1 - data[n]) * (innerHeight / 2) + padding;

      if (n === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }

      if (n % 16 === 0) {
        const t = document.createElementNS(xmlns, 'text');

        t.textContent = `${(n * (1 / audiocontext.sampleRate) * 1000).toFixed(1)} msec`;

        t.setAttribute('x', x.toString(10));
        t.setAttribute('y', (innerHeight / 2 + padding + 12).toString(10));
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('stroke', 'none');
        t.setAttribute('fill', baseColor);
        t.setAttribute('font-size', '14px');

        svgTime.appendChild(t);
      }
    }

    timePath.setAttribute('d', d);

    d = '';

    const reals = new Float32Array(length);
    const imags = new Float32Array(length);

    for (let n = 0; n < length; n++) {
      reals[n] = data[n];
    }

    FFT(reals, imags, length);

    const frequencyBinCount = length / 2;

    const amplitudes = new Float32Array(frequencyBinCount);
    const phases = new Float32Array(frequencyBinCount);

    for (let k = 0; k < frequencyBinCount; k++) {
      amplitudes[k] = Math.sqrt(reals[k] ** 2 + imags[k] ** 2) / length;

      if (reals[k] !== 0 && imags[k] !== 0) {
        phases[k] = Math.atan2(imags[k], reals[k]);
      }
    }

    const downSampleRate = 1000;

    for (let k = 0; k < frequencyBinCount; k++) {
      const x = k * (downSampleRate / length) * (innerWidth / frequencyBinCount) + padding;
      const y = (1 - amplitudes[k]) * (innerHeight / 2) + padding;

      if (x > innerWidth + padding) {
        break;
      }

      if (k === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }

      const hz = document.createElementNS(xmlns, 'text');

      hz.textContent = `${Math.trunc(k * (downSampleRate / length))} Hz`;

      hz.setAttribute('x', x.toString(10));
      hz.setAttribute('y', (innerHeight + padding + 16).toString(10));
      hz.setAttribute('text-anchor', 'middle');
      hz.setAttribute('stroke', 'none');
      hz.setAttribute('fill', baseColor);
      hz.setAttribute('font-size', '14px');

      svgAmplitudeSpectrum.appendChild(hz);
    }

    amplitudeSpectrumPath.setAttribute('d', d);

    d = '';

    for (let k = 0; k < frequencyBinCount; k++) {
      const x = k * (downSampleRate / length) * (innerWidth / frequencyBinCount) + padding;
      const y = -1 * (phases[k] / (2 * Math.PI)) * innerHeight + innerHeight / 2 + padding;

      if (x > innerWidth + padding) {
        break;
      }

      if (k === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }

      const hz = document.createElementNS(xmlns, 'text');

      hz.textContent = `${Math.trunc(k * (downSampleRate / length))} Hz`;

      hz.setAttribute('x', x.toString(10));
      hz.setAttribute('y', (innerHeight + padding + 16).toString(10));
      hz.setAttribute('text-anchor', 'middle');
      hz.setAttribute('stroke', 'none');
      hz.setAttribute('fill', baseColor);
      hz.setAttribute('font-size', '14px');

      svgPhaseSpectrum.appendChild(hz);
    }

    phaseSpectrumPath.setAttribute('d', d);
  };

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (processor === null) {
      await audiocontext.audioWorklet.addModule('./audio-worklets/white-noise.js');
    }

    if (processor) {
      processor.port.postMessage({ processing: false });
      processor.disconnect(0);
    }

    processor = new AudioWorkletNode(audiocontext, 'WhiteNoiseGeneratorProcessor');

    processor.connect(audiocontext.destination);

    processor.port.postMessage({ processing: true });
    processor.port.onmessage = (event) => {
      if (event.data) {
        analyse(event.data);
      }
    };

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (processor) {
      processor.port.postMessage({ processing: false });
      processor.disconnect(0);
    }

    buttonElement.textContent = 'start';
  };

  const buttonElement = document.getElementById('button-white-noise-spectrums');

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  createCoordinateRect(svgTime);
  renderSpectrum(svgAmplitudeSpectrum, true);
  renderSpectrum(svgPhaseSpectrum, false);
};

const createResampling = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const a = Number(svg.getAttribute('data-a'));

  const renderSine = (offsetX, offsetY, f, isDown, result, resampled) => {
    const w = innerWidth / 3;
    const h = innerHeight / 4;

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (offsetX + padding).toString(10));
    xRect.setAttribute('y', (offsetY + padding + h / 2 - 1).toString(10));
    xRect.setAttribute('width', (w + padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    svg.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (offsetX + padding - 1).toString(10));
    yRect.setAttribute('y', (offsetY + padding).toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', h.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    svg.appendChild(yRect);

    if (svg.getAttribute('data-parameters') === 'true') {
      const xText = document.createElementNS(xmlns, 'text');

      xText.textContent = 'Time';

      xText.setAttribute('x', (offsetX + w + padding + 24).toString(10));
      xText.setAttribute('y', (offsetY + padding + h / 2 - 8).toString(10));
      xText.setAttribute('text-anchor', 'start');
      xText.setAttribute('stroke', 'none');
      xText.setAttribute('fill', baseColor);
      xText.setAttribute('font-size', '16px');

      svg.appendChild(xText);

      const yText = document.createElementNS(xmlns, 'text');

      yText.textContent = 'Amplitude';

      yText.setAttribute('x', (offsetX + padding).toString(10));
      yText.setAttribute('y', (offsetY + padding / 2).toString(10));
      yText.setAttribute('text-anchor', 'middle');
      yText.setAttribute('stroke', 'none');
      yText.setAttribute('fill', baseColor);
      yText.setAttribute('font-size', '16px');

      svg.appendChild(yText);

      [a, 0, -1 * a].forEach((amplitude, index) => {
        const rect = document.createElementNS(xmlns, 'rect');

        rect.setAttribute('x', (offsetX + padding).toString(10));
        rect.setAttribute('y', (offsetY + padding + (h / 2) * (1 - amplitude)).toString(10));
        rect.setAttribute('width', (w + padding).toString(10));
        rect.setAttribute('height', lineWidth.toString(10));
        rect.setAttribute('stroke', 'none');
        rect.setAttribute('fill', alphaBaseColor);

        svg.appendChild(rect);

        const text = document.createElementNS(xmlns, 'text');

        text.textContent = amplitude.toFixed(1);

        text.setAttribute('x', (offsetX + padding - 4).toString(10));
        text.setAttribute('y', (offsetY + padding / 2 + (h / 2) * (1 - amplitude) + 24).toString(10));
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('stroke', 'none');
        text.setAttribute('fill', baseColor);
        text.setAttribute('font-size', '12px');

        svg.appendChild(text);
      });

      if (isDown) {
        const g = document.createElementNS(xmlns, 'g');

        [0, 0.5, 1, 1.5, 2].forEach((t, index) => {
          const text = document.createElementNS(xmlns, 'text');

          if (result) {
            text.textContent = (t / 2).toFixed(2);
          } else {
            text.textContent = t.toFixed(1);
          }

          text.setAttribute('x', (offsetX + padding + index * (w / 4) + 4).toString(10));
          text.setAttribute('y', (offsetY + padding + h / 2 + 14).toString(10));
          text.setAttribute('text-anchor', 'start');
          text.setAttribute('stroke', 'none');
          text.setAttribute('fill', baseColor);
          text.setAttribute('font-size', '12px');

          g.appendChild(text);
        });

        svg.appendChild(g);
      } else {
        const g = document.createElementNS(xmlns, 'g');

        [0, 0.25, 0.5, 0.75, 1].forEach((t, index) => {
          const text = document.createElementNS(xmlns, 'text');

          if (result) {
            text.textContent = (2 * t).toFixed(1);
          } else {
            text.textContent = t.toFixed(2);
          }

          text.setAttribute('x', (offsetX + padding + index * (w / 4) + 4).toString(10));
          text.setAttribute('y', (offsetY + padding + h / 2 + 14).toString(10));
          text.setAttribute('text-anchor', 'start');
          text.setAttribute('stroke', 'none');
          text.setAttribute('fill', baseColor);
          text.setAttribute('font-size', '12px');

          g.appendChild(text);
        });

        svg.appendChild(g);
      }
    }

    const omega = 2 * Math.PI;

    const path = document.createElementNS(xmlns, 'path');

    let d = '';

    for (let n = 0, len = f * sampleRate; n < len; n++) {
      const v = a * Math.sin((omega * f * n) / sampleRate);

      const x = (n / len) * w + offsetX + padding;
      const y = (1 - v) * (h / 2) + offsetY + padding;

      if (n === 0) {
        d += `M${x + lineWidth / 2} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    path.setAttribute('d', d);

    path.setAttribute('stroke', alphaWaveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    svg.appendChild(path);

    if (isDown) {
      const g = document.createElementNS(xmlns, 'g');

      const n = resampled ? 32 : 64;
      const l = 8 * Math.PI;
      const d = l / n;

      for (let rad = 0; rad < l; rad += d) {
        const path = document.createElementNS(xmlns, 'path');

        const v = Math.sin(rad);
        const x = (rad / d) * (1 / n) * w + offsetX + padding;
        const y = (1 - v) * (h / 2) + offsetY + padding;

        path.setAttribute('d', `M${x} ${y} L${x} ${offsetY + padding + h / 2}`);
        path.setAttribute('stroke', lightWaveColor);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linecap', 'square');

        g.appendChild(path);
      }

      svg.appendChild(g);
    } else {
      const g = document.createElementNS(xmlns, 'g');

      const n = resampled ? 64 : 32;
      const l = 8 * Math.PI;
      const d = l / n;

      for (let rad = 0; rad < l; rad += d) {
        const path = document.createElementNS(xmlns, 'path');

        const v = Math.sin(rad);
        const x = (rad / d) * (1 / n) * w + offsetX + padding;
        const y = (1 - v) * (h / 2) + offsetY + padding;

        path.setAttribute('d', `M${x} ${y} L${x} ${offsetY + padding + h / 2}`);
        path.setAttribute('stroke', lightWaveColor);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linecap', 'square');

        g.appendChild(path);
      }

      svg.appendChild(g);
    }
  };

  const render = (offsetX, isDown) => {
    const baseOffsetY = innerHeight / 3 + padding / 2;

    renderSine(offsetX, 0 * baseOffsetY, 2, isDown, false, false);
    renderSine(offsetX, 1 * baseOffsetY, 2, isDown, false, true);
    renderSine(offsetX, 2 * baseOffsetY, 2, isDown, true, true);
  };

  render(0, true);
  render(padding + innerWidth / 2, false);
};

const createTimeStretchFast = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const a = Number(svg.getAttribute('data-a'));

  const render = (offset, f, overlapAdded) => {
    const h = innerHeight / 3;

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', padding.toString(10));
    xRect.setAttribute('y', (offset + padding + h / 2 - 1).toString(10));
    xRect.setAttribute('width', (innerWidth + padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    svg.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (padding - 1).toString(10));
    yRect.setAttribute('y', (offset + padding).toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', h.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    svg.appendChild(yRect);

    if (svg.getAttribute('data-parameters') === 'true') {
      const xText = document.createElementNS(xmlns, 'text');

      xText.textContent = 'Time';

      xText.setAttribute('x', (innerWidth + padding + 24).toString(10));
      xText.setAttribute('y', (offset + padding + h / 2 - 8).toString(10));
      xText.setAttribute('text-anchor', 'start');
      xText.setAttribute('stroke', 'none');
      xText.setAttribute('fill', baseColor);
      xText.setAttribute('font-size', '16px');

      svg.appendChild(xText);

      const yText = document.createElementNS(xmlns, 'text');

      yText.textContent = 'Amplitude';

      yText.setAttribute('x', padding.toString(10));
      yText.setAttribute('y', (offset + padding / 2 - 8).toString(10));
      yText.setAttribute('text-anchor', 'middle');
      yText.setAttribute('stroke', 'none');
      yText.setAttribute('fill', baseColor);
      yText.setAttribute('font-size', '16px');

      svg.appendChild(yText);

      [a, 0, -1 * a].forEach((amplitude, index) => {
        const rect = document.createElementNS(xmlns, 'rect');

        rect.setAttribute('x', padding.toString(10));
        rect.setAttribute('y', (offset + padding + (h / 2) * (1 - amplitude)).toString(10));
        rect.setAttribute('width', (padding + innerWidth).toString(10));
        rect.setAttribute('height', lineWidth.toString(10));
        rect.setAttribute('stroke', 'none');
        rect.setAttribute('fill', alphaBaseColor);

        svg.appendChild(rect);

        const text = document.createElementNS(xmlns, 'text');

        text.textContent = amplitude.toFixed(1);

        text.setAttribute('x', (padding - 4).toString(10));
        text.setAttribute('y', (offset + padding / 2 + (h / 2) * (1 - amplitude) + 24).toString(10));
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('stroke', 'none');
        text.setAttribute('fill', baseColor);
        text.setAttribute('font-size', '12px');

        svg.appendChild(text);
      });
    }

    const w = 2 * Math.PI;

    const path = document.createElementNS(xmlns, 'path');

    let d = '';

    for (let n = 0, len = f * sampleRate; n < len; n++) {
      const v = a * Math.sin((w * f * n) / sampleRate);

      const x = (n / len) * innerWidth + padding;
      const y = (1 - v) * (h / 2) + offset + padding;

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

    const g = document.createElementNS(xmlns, 'g');

    ['0', 't', '2t', '3t'].forEach((t, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = t;

      text.setAttribute('x', (padding + index * (innerWidth / 3) + 4).toString(10));
      text.setAttribute('y', (offset + padding + h / 2 + 14).toString(10));
      text.setAttribute('text-anchor', 'start');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '12px');

      g.appendChild(text);
    });

    svg.appendChild(g);

    if (overlapAdded) {
      const path1 = document.createElementNS(xmlns, 'path');
      const path2 = document.createElementNS(xmlns, 'path');

      path1.setAttribute(
        'd',
        `M${padding} ${offset + padding + h / 2} L${padding + innerWidth / 3} ${offset + padding + h / 2} L${padding} ${offset + padding}`
      );
      path1.setAttribute('stroke', alphaBaseColor);
      path1.setAttribute('fill', alphaLightWaveColor);
      path1.setAttribute('stroke-width', lineWidth.toString(10));
      path1.setAttribute('stroke-linecap', lineCap);
      path1.setAttribute('stroke-linejoin', lineJoin);

      path2.setAttribute(
        'd',
        `M${padding} ${offset + padding + h / 2} L${padding + innerWidth / 3} ${offset + padding + h / 2} L${padding + innerWidth / 3} ${offset + padding}`
      );
      path2.setAttribute('stroke', alphaBaseColor);
      path2.setAttribute('fill', alphaLightWaveColor);
      path2.setAttribute('stroke-width', lineWidth.toString(10));
      path2.setAttribute('stroke-linecap', lineCap);
      path2.setAttribute('stroke-linejoin', lineJoin);

      svg.appendChild(path1);
      svg.appendChild(path2);

      const path3 = document.createElementNS(xmlns, 'path');
      const path4 = document.createElementNS(xmlns, 'path');

      path3.setAttribute('d', `M${padding} ${padding + h / 2} L${padding} ${offset + padding + h / 2}`);
      path3.setAttribute('stroke', baseColor);
      path3.setAttribute('fill', 'none');
      path3.setAttribute('stroke-width', lineWidth.toString(10));
      path3.setAttribute('stroke-linecap', lineCap);
      path3.setAttribute('stroke-linejoin', lineJoin);
      path3.setAttribute('stroke-dasharray', '5,5');

      path4.setAttribute('d', `M${padding + innerWidth / 3} ${padding + h / 2} L${padding + innerWidth / 3} ${offset + padding + h / 2}`);
      path4.setAttribute('stroke', baseColor);
      path4.setAttribute('fill', 'none');
      path4.setAttribute('stroke-width', lineWidth.toString(10));
      path4.setAttribute('stroke-linecap', lineCap);
      path4.setAttribute('stroke-linejoin', lineJoin);
      path4.setAttribute('stroke-dasharray', '5,5');

      svg.appendChild(path3);
      svg.appendChild(path4);

      const path5 = document.createElementNS(xmlns, 'path');
      const path6 = document.createElementNS(xmlns, 'path');
      const path7 = document.createElementNS(xmlns, 'path');

      path5.setAttribute('d', `M${padding + innerWidth / 3} ${padding + h / 2} L${padding} ${offset + padding + h / 2}`);
      path5.setAttribute('stroke', baseColor);
      path5.setAttribute('fill', 'none');
      path5.setAttribute('stroke-width', lineWidth.toString(10));
      path5.setAttribute('stroke-linecap', lineCap);
      path5.setAttribute('stroke-linejoin', lineJoin);
      path5.setAttribute('stroke-dasharray', '5,5');

      path6.setAttribute('d', `M${padding + 2 * (innerWidth / 3)} ${padding + h / 2} L${padding + innerWidth / 3} ${offset + padding + h / 2}`);
      path6.setAttribute('stroke', baseColor);
      path6.setAttribute('fill', 'none');
      path6.setAttribute('stroke-width', lineWidth.toString(10));
      path6.setAttribute('stroke-linecap', lineCap);
      path6.setAttribute('stroke-linejoin', lineJoin);
      path6.setAttribute('stroke-dasharray', '5,5');

      path7.setAttribute('d', `M${padding + 3 * (innerWidth / 3)} ${padding + h / 2} L${padding + 2 * (innerWidth / 3)} ${offset + padding + h / 2}`);
      path7.setAttribute('stroke', baseColor);
      path7.setAttribute('fill', 'none');
      path7.setAttribute('stroke-width', lineWidth.toString(10));
      path7.setAttribute('stroke-linecap', lineCap);
      path7.setAttribute('stroke-linejoin', lineJoin);
      path7.setAttribute('stroke-dasharray', '5,5');

      svg.appendChild(path5);
      svg.appendChild(path6);
      svg.appendChild(path7);

      const offset10 = document.createElementNS(xmlns, 'text');
      const offset11 = document.createElementNS(xmlns, 'text');

      offset10.textContent = 'Current offset 1';
      offset11.textContent = 'Next offset 1';

      offset10.setAttribute('x', padding.toString(10));
      offset10.setAttribute('y', (offset + padding + h + 16).toString(10));
      offset10.setAttribute('text-anchor', 'middle');
      offset10.setAttribute('stroke', 'none');
      offset10.setAttribute('fill', baseColor);
      offset10.setAttribute('font-size', '12px');

      offset11.setAttribute('x', (padding + 2 * (innerWidth / 3)).toString(10));
      offset11.setAttribute('y', (offset + padding + h + 16).toString(10));
      offset11.setAttribute('text-anchor', 'middle');
      offset11.setAttribute('stroke', 'none');
      offset11.setAttribute('fill', baseColor);
      offset11.setAttribute('font-size', '12px');

      svg.appendChild(offset10);
      svg.appendChild(offset11);
    } else {
      const path1 = document.createElementNS(xmlns, 'path');
      const path2 = document.createElementNS(xmlns, 'path');

      path1.setAttribute('d', `M${padding} ${padding + h / 2} L${padding + innerWidth / 3} ${padding + h / 2} L${padding} ${padding}`);
      path1.setAttribute('stroke', alphaBaseColor);
      path1.setAttribute('fill', alphaLightWaveColor);
      path1.setAttribute('stroke-width', lineWidth.toString(10));
      path1.setAttribute('stroke-linecap', lineCap);
      path1.setAttribute('stroke-linejoin', lineJoin);

      path2.setAttribute(
        'd',
        `M${padding + innerWidth / 3} ${padding + h / 2} L${padding + 2 * (innerWidth / 3)} ${padding + h / 2} L${padding + 2 * (innerWidth / 3)} ${padding}`
      );
      path2.setAttribute('stroke', alphaBaseColor);
      path2.setAttribute('fill', alphaLightWaveColor);
      path2.setAttribute('stroke-width', lineWidth.toString(10));
      path2.setAttribute('stroke-linecap', lineCap);
      path2.setAttribute('stroke-linejoin', lineJoin);

      svg.appendChild(path1);
      svg.appendChild(path2);

      const offset00 = document.createElementNS(xmlns, 'text');
      const offset01 = document.createElementNS(xmlns, 'text');

      offset00.textContent = 'Current offset 0';
      offset01.textContent = 'Next offset 0';

      offset00.setAttribute('x', padding.toString(10));
      offset00.setAttribute('y', (padding - 20).toString(10));
      offset00.setAttribute('text-anchor', 'middle');
      offset00.setAttribute('stroke', 'none');
      offset00.setAttribute('fill', baseColor);
      offset00.setAttribute('font-size', '12px');

      offset01.setAttribute('x', (padding + 3 * (innerWidth / 3)).toString(10));
      offset01.setAttribute('y', (padding - 20).toString(10));
      offset01.setAttribute('text-anchor', 'middle');
      offset01.setAttribute('stroke', 'none');
      offset01.setAttribute('fill', baseColor);
      offset01.setAttribute('font-size', '12px');

      svg.appendChild(offset00);
      svg.appendChild(offset01);
    }
  };

  render(0, 1.74, false);
  render(padding + innerHeight / 2, 1.74, true);
};

const createTimeStretchSlow = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const a = Number(svg.getAttribute('data-a'));

  const render = (offset, f, overlapAdded) => {
    const h = innerHeight / 3;

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', padding.toString(10));
    xRect.setAttribute('y', (offset + padding + h / 2 - 1).toString(10));
    xRect.setAttribute('width', (innerWidth + padding).toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    svg.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (padding - 1).toString(10));
    yRect.setAttribute('y', (offset + padding).toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', h.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    svg.appendChild(yRect);

    if (svg.getAttribute('data-parameters') === 'true') {
      const xText = document.createElementNS(xmlns, 'text');

      xText.textContent = 'Time';

      xText.setAttribute('x', (innerWidth + padding + 24).toString(10));
      xText.setAttribute('y', (offset + padding + h / 2 - 8).toString(10));
      xText.setAttribute('text-anchor', 'start');
      xText.setAttribute('stroke', 'none');
      xText.setAttribute('fill', baseColor);
      xText.setAttribute('font-size', '16px');

      svg.appendChild(xText);

      const yText = document.createElementNS(xmlns, 'text');

      yText.textContent = 'Amplitude';

      yText.setAttribute('x', padding.toString(10));
      yText.setAttribute('y', (offset + padding / 2 - 8).toString(10));
      yText.setAttribute('text-anchor', 'middle');
      yText.setAttribute('stroke', 'none');
      yText.setAttribute('fill', baseColor);
      yText.setAttribute('font-size', '16px');

      svg.appendChild(yText);

      [a, 0, -1 * a].forEach((amplitude, index) => {
        const rect = document.createElementNS(xmlns, 'rect');

        rect.setAttribute('x', padding.toString(10));
        rect.setAttribute('y', (offset + padding + (h / 2) * (1 - amplitude)).toString(10));
        rect.setAttribute('width', (padding + innerWidth).toString(10));
        rect.setAttribute('height', lineWidth.toString(10));
        rect.setAttribute('stroke', 'none');
        rect.setAttribute('fill', alphaBaseColor);

        svg.appendChild(rect);

        const text = document.createElementNS(xmlns, 'text');

        text.textContent = amplitude.toFixed(1);

        text.setAttribute('x', (padding - 4).toString(10));
        text.setAttribute('y', (offset + padding / 2 + (h / 2) * (1 - amplitude) + 24).toString(10));
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('stroke', 'none');
        text.setAttribute('fill', baseColor);
        text.setAttribute('font-size', '12px');

        svg.appendChild(text);
      });
    }

    const w = 2 * Math.PI;

    const path = document.createElementNS(xmlns, 'path');

    let d = '';

    for (let n = 0, len = f * sampleRate; n < len; n++) {
      const v = a * Math.sin((w * f * n) / sampleRate);

      const x = (n / len) * innerWidth + padding;
      const y = (1 - v) * (h / 2) + offset + padding;

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

    const g = document.createElementNS(xmlns, 'g');

    ['0', 't', '2t', '3t'].forEach((t, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = t;

      text.setAttribute('x', (padding + index * (innerWidth / 3) + 4).toString(10));
      text.setAttribute('y', (offset + padding + h / 2 + 14).toString(10));
      text.setAttribute('text-anchor', 'start');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '12px');

      g.appendChild(text);
    });

    svg.appendChild(g);

    if (overlapAdded) {
      const path1 = document.createElementNS(xmlns, 'path');
      const path2 = document.createElementNS(xmlns, 'path');

      path1.setAttribute(
        'd',
        `M${padding + innerWidth / 3} ${offset + padding + h / 2} L${padding + 2 * (innerWidth / 3)} ${offset + padding} L${padding + 2 * (innerWidth / 3)} ${offset + padding + h / 2}`
      );
      path1.setAttribute('stroke', alphaBaseColor);
      path1.setAttribute('fill', alphaLightWaveColor);
      path1.setAttribute('stroke-width', lineWidth.toString(10));
      path1.setAttribute('stroke-linecap', lineCap);
      path1.setAttribute('stroke-linejoin', lineJoin);

      path2.setAttribute(
        'd',
        `M${padding + innerWidth / 3} ${offset + padding} L${padding + 2 * (innerWidth / 3)} ${offset + padding + h / 2} L${padding + innerWidth / 3} ${offset + padding + h / 2}`
      );
      path2.setAttribute('stroke', alphaBaseColor);
      path2.setAttribute('fill', alphaLightWaveColor);
      path2.setAttribute('stroke-width', lineWidth.toString(10));
      path2.setAttribute('stroke-linecap', lineCap);
      path2.setAttribute('stroke-linejoin', lineJoin);

      svg.appendChild(path1);
      svg.appendChild(path2);

      const path3 = document.createElementNS(xmlns, 'path');
      const path4 = document.createElementNS(xmlns, 'path');
      const path5 = document.createElementNS(xmlns, 'path');

      path3.setAttribute('d', `M${padding} ${padding + h / 2} L${padding} ${offset + padding + h / 2}`);
      path3.setAttribute('stroke', baseColor);
      path3.setAttribute('fill', 'none');
      path3.setAttribute('stroke-width', lineWidth.toString(10));
      path3.setAttribute('stroke-linecap', lineCap);
      path3.setAttribute('stroke-linejoin', lineJoin);
      path3.setAttribute('stroke-dasharray', '5,5');

      path4.setAttribute('d', `M${padding + innerWidth / 3} ${padding + h / 2} L${padding + innerWidth / 3} ${offset + padding + h / 2}`);
      path4.setAttribute('stroke', baseColor);
      path4.setAttribute('fill', 'none');
      path4.setAttribute('stroke-width', lineWidth.toString(10));
      path4.setAttribute('stroke-linecap', lineCap);
      path4.setAttribute('stroke-linejoin', lineJoin);
      path4.setAttribute('stroke-dasharray', '5,5');

      path5.setAttribute('d', `M${padding + 2 * (innerWidth / 3)} ${padding + h / 2} L${padding + 2 * (innerWidth / 3)} ${offset + padding + h / 2}`);
      path5.setAttribute('stroke', baseColor);
      path5.setAttribute('fill', 'none');
      path5.setAttribute('stroke-width', lineWidth.toString(10));
      path5.setAttribute('stroke-linecap', lineCap);
      path5.setAttribute('stroke-linejoin', lineJoin);
      path5.setAttribute('stroke-dasharray', '5,5');

      svg.appendChild(path3);
      svg.appendChild(path4);
      svg.appendChild(path5);

      const path6 = document.createElementNS(xmlns, 'path');
      const path7 = document.createElementNS(xmlns, 'path');
      const path8 = document.createElementNS(xmlns, 'path');

      path6.setAttribute('d', `M${padding} ${padding + h / 2} L${padding + innerWidth / 3} ${offset + padding + h / 2}`);
      path6.setAttribute('stroke', baseColor);
      path6.setAttribute('fill', 'none');
      path6.setAttribute('stroke-width', lineWidth.toString(10));
      path6.setAttribute('stroke-linecap', lineCap);
      path6.setAttribute('stroke-linejoin', lineJoin);
      path6.setAttribute('stroke-dasharray', '5,5');

      path7.setAttribute('d', `M${padding + innerWidth / 3} ${padding + h / 2} L${padding + 2 * (innerWidth / 3)} ${offset + padding + h / 2}`);
      path7.setAttribute('stroke', baseColor);
      path7.setAttribute('fill', 'none');
      path7.setAttribute('stroke-width', lineWidth.toString(10));
      path7.setAttribute('stroke-linecap', lineCap);
      path7.setAttribute('stroke-linejoin', lineJoin);
      path7.setAttribute('stroke-dasharray', '5,5');

      path8.setAttribute('d', `M${padding + 2 * (innerWidth / 3)} ${padding + h / 2} L${padding + 3 * (innerWidth / 3)} ${offset + padding + h / 2}`);
      path8.setAttribute('stroke', baseColor);
      path8.setAttribute('fill', 'none');
      path8.setAttribute('stroke-width', lineWidth.toString(10));
      path8.setAttribute('stroke-linecap', lineCap);
      path8.setAttribute('stroke-linejoin', lineJoin);
      path8.setAttribute('stroke-dasharray', '5,5');

      svg.appendChild(path5);
      svg.appendChild(path6);
      svg.appendChild(path7);
      svg.appendChild(path8);

      const offset10 = document.createElementNS(xmlns, 'text');
      const offset11 = document.createElementNS(xmlns, 'text');

      offset10.textContent = 'Current offset 1';
      offset11.textContent = 'Next offset 1';

      offset10.setAttribute('x', padding.toString(10));
      offset10.setAttribute('y', (offset + padding + h + 16).toString(10));
      offset10.setAttribute('text-anchor', 'middle');
      offset10.setAttribute('stroke', 'none');
      offset10.setAttribute('fill', baseColor);
      offset10.setAttribute('font-size', '12px');

      offset11.setAttribute('x', (padding + 2 * (innerWidth / 3)).toString(10));
      offset11.setAttribute('y', (offset + padding + h + 16).toString(10));
      offset11.setAttribute('text-anchor', 'middle');
      offset11.setAttribute('stroke', 'none');
      offset11.setAttribute('fill', baseColor);
      offset11.setAttribute('font-size', '12px');

      svg.appendChild(offset10);
      svg.appendChild(offset11);
    } else {
      const path1 = document.createElementNS(xmlns, 'path');
      const path2 = document.createElementNS(xmlns, 'path');

      path1.setAttribute('d', `M${padding} ${padding + h / 2} L${padding + innerWidth / 3} ${padding + h / 2} L${padding + innerWidth / 3} ${padding}`);
      path1.setAttribute('stroke', alphaBaseColor);
      path1.setAttribute('fill', alphaLightWaveColor);
      path1.setAttribute('stroke-width', lineWidth.toString(10));
      path1.setAttribute('stroke-linecap', lineCap);
      path1.setAttribute('stroke-linejoin', lineJoin);

      path2.setAttribute(
        'd',
        `M${padding + innerWidth / 3} ${padding} L${padding + 2 * (innerWidth / 3)} ${padding + h / 2} L${padding + innerWidth / 3} ${padding + h / 2}`
      );
      path2.setAttribute('stroke', alphaBaseColor);
      path2.setAttribute('fill', alphaLightWaveColor);
      path2.setAttribute('stroke-width', lineWidth.toString(10));
      path2.setAttribute('stroke-linecap', lineCap);
      path2.setAttribute('stroke-linejoin', lineJoin);

      svg.appendChild(path1);
      svg.appendChild(path2);

      const offset00 = document.createElementNS(xmlns, 'text');
      const offset01 = document.createElementNS(xmlns, 'text');

      offset00.textContent = 'Current offset 0';
      offset01.textContent = 'Next offset 0';

      offset00.setAttribute('x', padding.toString(10));
      offset00.setAttribute('y', (padding - 20).toString(10));
      offset00.setAttribute('text-anchor', 'middle');
      offset00.setAttribute('stroke', 'none');
      offset00.setAttribute('fill', baseColor);
      offset00.setAttribute('font-size', '12px');

      offset01.setAttribute('x', (padding + 3 * (innerWidth / 3)).toString(10));
      offset01.setAttribute('y', (padding - 20).toString(10));
      offset01.setAttribute('text-anchor', 'middle');
      offset01.setAttribute('stroke', 'none');
      offset01.setAttribute('fill', baseColor);
      offset01.setAttribute('font-size', '12px');

      svg.appendChild(offset00);
      svg.appendChild(offset01);
    }
  };

  render(0, 1.74, false);
  render(padding + innerHeight / 2, 1.74, true);
};

const pitchshifter = () => {
  const buttonElement = document.getElementById('button-pitch-shifter');

  const rangePitchElement = document.getElementById('range-pitch-shifter');
  const rangeSpeedElement = document.getElementById('range-time-stretch');
  const spanPitchElement = document.getElementById('print-pitch-shifter-value');
  const spanSpeedElement = document.getElementById('print-time-stretch-value');

  let source = null;
  let processor = null;

  let pitch = 1;
  let speed = 1;

  fetch('./assets/medias/Schubert-Symphony-No8-Unfinished-1st-2020-VR.mp3')
    .then((response) => {
      return response.arrayBuffer();
    })
    .then(async (arrayBuffer) => {
      await audiocontext.audioWorklet.addModule('./audio-worklets/pitch-shifter.js');

      const buffer = await audiocontext.decodeAudioData(arrayBuffer);

      buttonElement.removeAttribute('disabled');
      rangePitchElement.removeAttribute('disabled');
      rangeSpeedElement.removeAttribute('disabled');

      buttonElement.addEventListener('click', async () => {
        if (audiocontext.state !== 'running') {
          await audiocontext.resume();
        }

        if (source === null && processor === null) {
          source = new AudioBufferSourceNode(audiocontext, { buffer, playbackRate: speed });
          processor = new AudioWorkletNode(audiocontext, 'PitchShifterProcessor');

          processor.port.postMessage({ pitch, speed });

          source.connect(processor);
          processor.connect(audiocontext.destination);

          source.start(0);

          source.onended = () => {
            source = null;

            if (processor) {
              processor.disconnect();
              processor = null;
            }

            buttonElement.textContent = 'start';
          };

          buttonElement.textContent = 'stop';
        } else {
          source.stop(0);

          source = null;

          if (processor) {
            processor.disconnect();
            processor = null;
          }

          buttonElement.textContent = 'start';
        }
      });

      rangePitchElement.addEventListener('input', (event) => {
        pitch = event.currentTarget.valueAsNumber;

        if (processor) {
          processor.port.postMessage({ pitch });
        }

        spanPitchElement.textContent = pitch.toFixed(2);
      });

      rangeSpeedElement.addEventListener('input', (event) => {
        speed = event.currentTarget.valueAsNumber;

        if (source && processor) {
          source.playbackRate.value = speed;
          processor.port.postMessage({ speed });
        }

        spanSpeedElement.textContent = speed.toFixed(2);
      });
    })
    .catch(console.error);
};

const vocalcanceler = () => {
  const inputElement = document.getElementById('file-vocal-canceler');
  const audioElement = document.getElementById('audio-vocal-canceler');

  const rangeDepthElement = document.getElementById('range-vocal-canceler-depth');
  const rangeMinFrequencyElement = document.getElementById('range-vocal-canceler-min-frequency');
  const rangeRangeElement = document.getElementById('range-vocal-canceler-range');
  const rangeThresholdElement = document.getElementById('range-vocal-canceler-threshold');
  const spanDepthElement = document.getElementById('print-vocal-canceler-depth-value');
  const spanMinFrequencyElement = document.getElementById('print-vocal-canceler-min-frequency-value');
  const spanRangeElement = document.getElementById('print-vocal-canceler-range-value');
  const spanThresholdElement = document.getElementById('print-vocal-canceler-threshold-value');

  let source = null;
  let processor = null;

  let depth = 0;
  let minFrequency = 200;
  let maxFrequency = 7800;
  let threshold = 0.5;

  inputElement.addEventListener(
    'click',
    async () => {
      if (audiocontext.state !== 'running') {
        await audiocontext.resume();
      }

      rangeDepthElement.removeAttribute('disabled');
      rangeMinFrequencyElement.removeAttribute('disabled');
      rangeRangeElement.removeAttribute('disabled');
      rangeThresholdElement.removeAttribute('disabled');

      audiocontext.audioWorklet
        .addModule('./audio-worklets/vocal-canceler-on-spectrum.js')
        .then(() => {
          processor = new AudioWorkletNode(audiocontext, 'SpectrumVocalCancelerProcessor');

          processor.port.postMessage({ depth });
          processor.port.postMessage({ minFrequency });
          processor.port.postMessage({ maxFrequency });
          processor.port.postMessage({ threshold });
        })
        .catch(console.error);
    },
    { once: true }
  );

  inputElement.addEventListener('change', (event) => {
    const file = event.currentTarget.files[0];

    audioElement.src = window.URL.createObjectURL(file);
  });

  audioElement.addEventListener('loadstart', () => {
    if (processor === null) {
      return;
    }

    if (source === null) {
      source = new MediaElementAudioSourceNode(audiocontext, { mediaElement: audioElement });

      source.connect(processor);
      processor.connect(audiocontext.destination);
    }
  });

  rangeDepthElement.addEventListener('input', (event) => {
    depth = event.currentTarget.valueAsNumber;

    if (processor) {
      processor.port.postMessage({ depth });
    }

    spanDepthElement.textContent = depth.toFixed(2);
  });

  rangeMinFrequencyElement.addEventListener('input', (event) => {
    minFrequency = event.currentTarget.valueAsNumber;

    if (processor) {
      processor.port.postMessage({ minFrequency });
    }

    spanMinFrequencyElement.textContent = `${minFrequency} Hz`;
  });

  rangeRangeElement.addEventListener('input', (event) => {
    const range = event.currentTarget.valueAsNumber;

    maxFrequency = minFrequency + range;

    if (processor) {
      processor.port.postMessage({ maxFrequency });
    }

    spanRangeElement.textContent = `${range} Hz (${maxFrequency} Hz)`;
  });

  rangeThresholdElement.addEventListener('input', (event) => {
    threshold = event.currentTarget.valueAsNumber;

    if (processor) {
      processor.port.postMessage({ threshold });
    }

    spanThresholdElement.textContent = threshold.toFixed(2);
  });
};

const create3DimensionalCoordinate = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const xPath = document.createElementNS(xmlns, 'path');

  xPath.setAttribute('d', `M${padding} ${padding + innerHeight / 2 - 2} L${padding + innerWidth} ${padding + innerHeight / 2 - 2}`);
  xPath.setAttribute('stroke', alphaBaseColor);
  xPath.setAttribute('fill', 'none');
  xPath.setAttribute('stroke-width', '4');
  xPath.setAttribute('stroke-linecap', lineCap);
  xPath.setAttribute('stroke-linejoin', lineJoin);

  const yPath = document.createElementNS(xmlns, 'path');

  yPath.setAttribute('d', `M${padding + innerWidth / 2 - 2} ${padding + innerHeight} L${padding + innerWidth / 2 - 2} ${padding}`);
  yPath.setAttribute('stroke', alphaBaseColor);
  yPath.setAttribute('fill', 'none');
  yPath.setAttribute('stroke-width', '4');
  yPath.setAttribute('stroke-linecap', lineCap);
  yPath.setAttribute('stroke-linejoin', lineJoin);

  const zPath = document.createElementNS(xmlns, 'path');

  zPath.setAttribute(
    'd',
    `M${padding + (3 * innerWidth) / 4 - 4} ${padding + innerHeight / 4} L${padding + innerWidth / 4 - 4} ${padding + (3 * innerHeight) / 4}`
  );
  zPath.setAttribute('stroke', alphaBaseColor);
  zPath.setAttribute('fill', 'none');
  zPath.setAttribute('stroke-width', '4');
  zPath.setAttribute('stroke-linecap', lineCap);
  zPath.setAttribute('stroke-linejoin', lineJoin);

  const xArrow = document.createElementNS(xmlns, 'path');

  xArrow.setAttribute(
    'd',
    `M${padding + innerWidth - 12} ${padding + innerHeight / 2 - 2 - 8} L${padding + innerHeight} ${padding + innerHeight / 2 - 2} L${padding + innerWidth - 12} ${padding + innerHeight / 2 - 2 + 8}`
  );
  xArrow.setAttribute('stroke', 'none');
  xArrow.setAttribute('fill', baseColor);

  const yArrow = document.createElementNS(xmlns, 'path');

  yArrow.setAttribute(
    'd',
    `M${padding + innerWidth / 2 - 2} ${padding} L${padding + innerWidth / 2 - 2 - 8} ${padding + 12} L${padding + innerWidth / 2 - 2 + 8} ${padding + 12}`
  );
  yArrow.setAttribute('stroke', 'none');
  yArrow.setAttribute('fill', baseColor);

  const zArrow = document.createElementNS(xmlns, 'path');

  zArrow.setAttribute(
    'd',
    `M${padding + innerWidth / 4 - 4 + 2} ${padding + (3 * innerHeight) / 4 - 12} L${padding + innerWidth / 4 - 4} ${padding + (3 * innerHeight) / 4 + 4} L${padding + innerWidth / 4 - 4 + 18} ${padding + (3 * innerHeight) / 4 + 4 - 12}`
  );
  zArrow.setAttribute('stroke', 'none');
  zArrow.setAttribute('fill', baseColor);

  const x = document.createElementNS(xmlns, 'text');

  x.textContent = 'x';

  x.setAttribute('x', (padding + innerWidth + 4).toString(10));
  x.setAttribute('y', (padding + innerHeight / 2 + 4).toString(10));
  x.setAttribute('text-anchor', 'start');
  x.setAttribute('stroke', 'none');
  x.setAttribute('fill', baseColor);
  x.setAttribute('font-size', '20px');

  const y = document.createElementNS(xmlns, 'text');

  y.textContent = 'y';

  y.setAttribute('x', (padding + innerWidth / 2 - 2).toString(10));
  y.setAttribute('y', (padding - 8).toString(10));
  y.setAttribute('text-anchor', 'middle');
  y.setAttribute('stroke', 'none');
  y.setAttribute('fill', baseColor);
  y.setAttribute('font-size', '20px');

  const z = document.createElementNS(xmlns, 'text');

  z.textContent = 'z';

  z.setAttribute('x', (padding + innerWidth / 4 - 8).toString(10));
  z.setAttribute('y', (padding + (3 * innerHeight) / 4 + 16).toString(10));
  z.setAttribute('text-anchor', 'middle');
  z.setAttribute('stroke', 'none');
  z.setAttribute('fill', baseColor);
  z.setAttribute('font-size', '20px');

  const o = document.createElementNS(xmlns, 'text');

  o.textContent = '(0, 0, 0)';

  o.setAttribute('x', (padding + innerWidth / 2 + 4).toString(10));
  o.setAttribute('y', (padding + innerHeight / 2 + 16).toString(10));
  o.setAttribute('text-anchor', 'start');
  o.setAttribute('stroke', 'none');
  o.setAttribute('fill', baseColor);
  o.setAttribute('font-size', '16px');

  svg.appendChild(xPath);
  svg.appendChild(yPath);
  svg.appendChild(zPath);

  svg.appendChild(xArrow);
  svg.appendChild(yArrow);
  svg.appendChild(zArrow);

  svg.appendChild(x);
  svg.appendChild(y);
  svg.appendChild(z);
  svg.appendChild(o);
};

const animateVectors = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const xPath = document.createElementNS(xmlns, 'path');

  xPath.setAttribute('d', `M${padding} ${padding + innerHeight / 2 - 2} L${padding + innerWidth} ${padding + innerHeight / 2 - 2}`);
  xPath.setAttribute('stroke', alphaBaseColor);
  xPath.setAttribute('fill', 'none');
  xPath.setAttribute('stroke-width', '4');
  xPath.setAttribute('stroke-linecap', lineCap);
  xPath.setAttribute('stroke-linejoin', lineJoin);

  const yPath = document.createElementNS(xmlns, 'path');

  yPath.setAttribute('d', `M${padding + innerWidth / 2 - 2} ${padding + innerHeight} L${padding + innerWidth / 2 - 2} ${padding}`);
  yPath.setAttribute('stroke', alphaBaseColor);
  yPath.setAttribute('fill', 'none');
  yPath.setAttribute('stroke-width', '4');
  yPath.setAttribute('stroke-linecap', lineCap);
  yPath.setAttribute('stroke-linejoin', lineJoin);

  const xArrow = document.createElementNS(xmlns, 'path');

  xArrow.setAttribute(
    'd',
    `M${padding + innerWidth - 12} ${padding + innerHeight / 2 - 2 - 8} L${padding + innerHeight} ${padding + innerHeight / 2 - 2} L${padding + innerWidth - 12} ${padding + innerHeight / 2 - 2 + 8}`
  );
  xArrow.setAttribute('stroke', 'none');
  xArrow.setAttribute('fill', baseColor);

  const yArrow = document.createElementNS(xmlns, 'path');

  yArrow.setAttribute(
    'd',
    `M${padding + innerWidth / 2 - 2} ${padding} L${padding + innerWidth / 2 - 2 - 8} ${padding + 12} L${padding + innerWidth / 2 - 2 + 8} ${padding + 12}`
  );
  yArrow.setAttribute('stroke', 'none');
  yArrow.setAttribute('fill', baseColor);

  const x = document.createElementNS(xmlns, 'text');

  x.textContent = 'x';

  x.setAttribute('x', (padding + innerWidth + 4).toString(10));
  x.setAttribute('y', (padding + innerHeight / 2 + 4).toString(10));
  x.setAttribute('text-anchor', 'start');
  x.setAttribute('stroke', 'none');
  x.setAttribute('fill', baseColor);
  x.setAttribute('font-size', '20px');

  const y = document.createElementNS(xmlns, 'text');

  y.textContent = 'y';

  y.setAttribute('x', (padding + innerWidth / 2 - 2).toString(10));
  y.setAttribute('y', (padding - 8).toString(10));
  y.setAttribute('text-anchor', 'middle');
  y.setAttribute('stroke', 'none');
  y.setAttribute('fill', baseColor);
  y.setAttribute('font-size', '20px');

  const o = document.createElementNS(xmlns, 'text');

  o.textContent = '(0, 0)';

  o.setAttribute('x', (padding + innerWidth / 2 + 4).toString(10));
  o.setAttribute('y', (padding + innerHeight / 2 + 16).toString(10));
  o.setAttribute('text-anchor', 'start');
  o.setAttribute('stroke', 'none');
  o.setAttribute('fill', baseColor);
  o.setAttribute('font-size', '16px');

  const vector = document.createElementNS(xmlns, 'path');

  vector.setAttribute('stroke', lightWaveColor);
  vector.setAttribute('fill', 'none');
  vector.setAttribute('stroke-width', '4');
  vector.setAttribute('stroke-linecap', lineCap);
  vector.setAttribute('stroke-linejoin', lineJoin);

  const vectorX = document.createElementNS(xmlns, 'path');

  vectorX.setAttribute('stroke', alphaWaveColor);
  vectorX.setAttribute('fill', 'none');
  vectorX.setAttribute('stroke-width', '4');
  vectorX.setAttribute('stroke-linecap', lineCap);
  vectorX.setAttribute('stroke-linejoin', lineJoin);

  const vectorY = document.createElementNS(xmlns, 'path');

  vectorY.setAttribute('stroke', alphaWaveColor);
  vectorY.setAttribute('fill', 'none');
  vectorY.setAttribute('stroke-width', '4');
  vectorY.setAttribute('stroke-linecap', lineCap);
  vectorY.setAttribute('stroke-linejoin', lineJoin);

  const vectorArrow = document.createElementNS(xmlns, 'polygon');

  vectorArrow.setAttribute('storke', 'none');
  vectorArrow.setAttribute('fill', lightWaveColor);

  const vectorArrowX = document.createElementNS(xmlns, 'path');

  vectorArrowX.setAttribute('stroke', 'none');
  vectorArrowX.setAttribute('fill', alphaWaveColor);

  const vectorArrowY = document.createElementNS(xmlns, 'path');

  vectorArrowY.setAttribute('stroke', 'none');
  vectorArrowY.setAttribute('fill', alphaWaveColor);

  svg.appendChild(xPath);
  svg.appendChild(yPath);

  svg.appendChild(xArrow);
  svg.appendChild(yArrow);

  svg.appendChild(x);
  svg.appendChild(y);
  svg.appendChild(o);

  svg.appendChild(vector);
  svg.appendChild(vectorX);
  svg.appendChild(vectorY);

  svg.appendChild(vectorArrow);
  svg.appendChild(vectorArrowX);
  svg.appendChild(vectorArrowY);

  const spanPrintVectorXElement = document.getElementById('print-vector-x-value');
  const spanPrintVectorYElement = document.getElementById('print-vector-y-value');
  const spanPrintVectorScalarElement = document.getElementById('print-vector-scalar-value');
  const spanPrintVectorRadianElement = document.getElementById('print-vector-radian-value');

  const cx = padding + innerWidth / 2 - 2;
  const cy = padding + innerHeight / 2 - 2;

  const halfWidth = Number(svg.getAttribute('width')) / 2;
  const halfHeight = Number(svg.getAttribute('height')) / 2;

  const onMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    let x = event.clientX - (rect.x + rect.width) + halfWidth;
    let y = -1 * (event.clientY - (rect.y + rect.height) + halfHeight);

    const scalar = Math.sqrt(x ** 2 + y ** 2);
    const radian = Math.atan2(y, x);

    if (x < padding - halfWidth) {
      x = padding - halfWidth;
    } else if (x > halfWidth - padding) {
      x = halfWidth - padding - 12;
    }

    if (y > halfHeight - padding) {
      y = halfHeight - padding - 12;
    } else if (y < padding - halfHeight) {
      y = padding - halfHeight;
    }

    spanPrintVectorXElement.textContent = (x / 50).toFixed(6);
    spanPrintVectorYElement.textContent = (y / 50).toFixed(6);
    spanPrintVectorScalarElement.textContent = (scalar / 50).toFixed(6);
    spanPrintVectorRadianElement.textContent = radian.toFixed(6);

    if (x === 0 && y === 0) {
      vector.removeAttribute('d');
      vector.removeAttribute('transform');

      vectorArrow.removeAttribute('points');
      vectorArrow.removeAttribute('transform');
    } else {
      vector.setAttribute('d', `M${cx} ${cy} L${cx + x} ${cy - y}`);
      vector.setAttribute('tranform', `rotate(${(radian * 180) / Math.PI} 0 0)`);

      vectorArrow.setAttribute('points', `${cx} ${cy - 8}, ${cx + 12} ${cy}, ${cx} ${cy + 8}`);
      vectorArrow.setAttribute('transform', ` translate(${x} ${-y}) rotate(${(-1 * (radian * 180)) / Math.PI} ${cx} ${cy})`);
    }

    vectorX.setAttribute('d', `M${cx} ${cy} L${cx + x} ${cy}`);
    vectorY.setAttribute('d', `M${cx} ${cy} L${cx} ${cy - y}`);

    if (x === 0) {
      vectorArrowX.removeAttribute('d');
    } else if (x > 0) {
      vectorArrowX.setAttribute('d', `M${cx + x + 12} ${cy} L${cx + x} ${cy - 8} L${cx + x} ${cy + 8}`);
    } else {
      vectorArrowX.setAttribute('d', `M${cx + x - 12} ${cy} L${cx + x} ${cy - 8} L${cx + x} ${cy + 8}`);
    }

    if (y === 0) {
      vectorArrowY.removeAttribute('d');
      vectorArrowY.removeAttribute('transform');
    } else if (y > 0) {
      vectorArrowY.setAttribute('d', `M${cx} ${cy - y + 12} L${cx - 8} ${cy - y + 12} L${cx} ${cy - y} L${cx + 8} ${cy - y + 12}`);
      vectorArrowY.setAttribute('transform', 'translate(0 -12)');
    } else {
      vectorArrowY.setAttribute('d', `M${cx} ${cy - y - 12} L${cx - 8} ${cy - y - 12} L${cx} ${cy - y} L${cx + 8} ${cy - y - 12}`);
      vectorArrowY.setAttribute('transform', 'translate(0 12)');
    }
  };

  svg.addEventListener('mousemove', onMove, true);
  svg.addEventListener('touchmove', onMove, true);
};

const createNodeConnectionsForPannerNode = (svg) => {
  const g = document.createElementNS(xmlns, 'g');

  const oscillatorNodeRect = createAudioNode('OscillatorNode', 0, 0);
  const pannerNodeRect = createAudioNode('PannerNode', 0, 200);
  const audioDestinationNodeRect = createAudioNode('AudioDestinationNode', 0, 400);

  const oscillatorNodeAndPannerNodePath = createConnection(150 - 2, 100, 150 - 2, 300);
  const pannerNodeAndAudiodDestinationNodePath = createConnection(150 - 2, 300, 150 - 2, 400);

  const oscillatorNodeAndWaveShaperNodeArrow = createConnectionArrow(150 - 2, 200 - 14, 'down');
  const pannerNodeAndAudiodDestinationNodeArrow = createConnectionArrow(150 - 2, 400 - 14, 'down');

  g.appendChild(oscillatorNodeRect);
  g.appendChild(oscillatorNodeAndPannerNodePath);
  g.appendChild(oscillatorNodeAndWaveShaperNodeArrow);
  g.appendChild(pannerNodeRect);
  g.appendChild(pannerNodeAndAudiodDestinationNodePath);
  g.appendChild(pannerNodeAndAudiodDestinationNodeArrow);
  g.appendChild(audioDestinationNodeRect);

  svg.appendChild(g);
};

const render3DimensionalCoordinate = (svg, offset, isOrigin, coordinate) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const xPath = document.createElementNS(xmlns, 'path');

  xPath.setAttribute(
    'd',
    `M${offset + padding + 40} ${padding + innerHeight / 2 - 2} L${offset + padding + innerWidth / 2 - 40} ${padding + innerHeight / 2 - 2}`
  );
  xPath.setAttribute('stroke', alphaBaseColor);
  xPath.setAttribute('fill', 'none');
  xPath.setAttribute('stroke-width', '4');
  xPath.setAttribute('stroke-linecap', lineCap);
  xPath.setAttribute('stroke-linejoin', lineJoin);

  const yPath = document.createElementNS(xmlns, 'path');

  yPath.setAttribute('d', `M${offset + padding + innerWidth / 4 - 2} ${padding + innerHeight} L${offset + padding + innerWidth / 4 - 2} ${padding}`);
  yPath.setAttribute('stroke', alphaBaseColor);
  yPath.setAttribute('fill', 'none');
  yPath.setAttribute('stroke-width', '4');
  yPath.setAttribute('stroke-linecap', lineCap);
  yPath.setAttribute('stroke-linejoin', lineJoin);

  const zPath = document.createElementNS(xmlns, 'path');

  zPath.setAttribute(
    'd',
    `M${offset + padding + (3 * innerWidth) / 8 - 4} ${padding + innerHeight / 4} L${offset + padding + innerWidth / 8 - 4} ${padding + (3 * innerHeight) / 4}`
  );
  zPath.setAttribute('stroke', alphaBaseColor);
  zPath.setAttribute('fill', 'none');
  zPath.setAttribute('stroke-width', '4');
  zPath.setAttribute('stroke-linecap', lineCap);
  zPath.setAttribute('stroke-linejoin', lineJoin);

  const xArrow = document.createElementNS(xmlns, 'path');

  xArrow.setAttribute(
    'd',
    `M${offset + padding + innerWidth / 2 - 40 - 12} ${padding + innerHeight / 2 - 2 - 8} L${offset + padding + innerWidth / 2 - 40} ${padding + innerHeight / 2 - 2} L${offset + padding + innerWidth / 2 - 40 - 12} ${padding + innerHeight / 2 - 2 + 8}`
  );
  xArrow.setAttribute('stroke', 'none');
  xArrow.setAttribute('fill', baseColor);

  const yArrow = document.createElementNS(xmlns, 'path');

  yArrow.setAttribute(
    'd',
    `M${offset + padding + innerWidth / 4 - 2} ${padding} L${offset + padding + innerWidth / 4 - 2 - 8} ${padding + 12} L${offset + padding + innerWidth / 4 - 2 + 8} ${padding + 12}`
  );
  yArrow.setAttribute('stroke', 'none');
  yArrow.setAttribute('fill', baseColor);

  const zArrow = document.createElementNS(xmlns, 'path');

  zArrow.setAttribute(
    'd',
    `M${offset + padding + innerWidth / 8 - 4 + 2} ${padding + (3 * innerHeight) / 4 - 12} L${offset + padding + innerWidth / 8 - 4} ${padding + (3 * innerHeight) / 4 + 4} L${offset + padding + innerWidth / 8 - 4 + 18} ${padding + (3 * innerHeight) / 4 + 4 - 12}`
  );
  zArrow.setAttribute('stroke', 'none');
  zArrow.setAttribute('fill', baseColor);

  const x = document.createElementNS(xmlns, 'text');

  x.textContent = 'x';

  x.setAttribute('x', (offset + padding + innerWidth / 2 - 40 + 4).toString(10));
  x.setAttribute('y', (padding + innerHeight / 2 + 4).toString(10));
  x.setAttribute('text-anchor', 'start');
  x.setAttribute('stroke', 'none');
  x.setAttribute('fill', baseColor);
  x.setAttribute('font-size', '20px');

  const y = document.createElementNS(xmlns, 'text');

  y.textContent = 'y';

  y.setAttribute('x', (offset + padding + innerWidth / 4 - 2).toString(10));
  y.setAttribute('y', (padding - 8).toString(10));
  y.setAttribute('text-anchor', 'middle');
  y.setAttribute('stroke', 'none');
  y.setAttribute('fill', baseColor);
  y.setAttribute('font-size', '20px');

  const z = document.createElementNS(xmlns, 'text');

  z.textContent = 'z';

  z.setAttribute('x', (offset + padding + innerWidth / 8 - 8).toString(10));
  z.setAttribute('y', (padding + (3 * innerHeight) / 4 + 16).toString(10));
  z.setAttribute('text-anchor', 'middle');
  z.setAttribute('stroke', 'none');
  z.setAttribute('fill', baseColor);
  z.setAttribute('font-size', '20px');

  const o = document.createElementNS(xmlns, 'text');

  if (isOrigin) {
    o.textContent = '(0, 0, 0)';

    o.setAttribute('x', (offset + padding + innerWidth / 4 + 4).toString(10));
    o.setAttribute('y', (offset + padding + innerHeight / 2 + 16).toString(10));
    o.setAttribute('text-anchor', 'start');
    o.setAttribute('stroke', 'none');
    o.setAttribute('fill', baseColor);
    o.setAttribute('font-size', '16px');
  } else {
    switch (coordinate) {
      case '(-1, 1, 1)': {
        o.textContent = coordinate;

        o.setAttribute('x', (offset + padding + innerWidth / 8).toString(10));
        o.setAttribute('y', (padding + innerHeight / 4 + 12).toString(10));
        o.setAttribute('text-anchor', 'start');
        o.setAttribute('stroke', 'none');
        o.setAttribute('fill', baseColor);
        o.setAttribute('font-size', '16px');

        break;
      }

      case '(1, -√2, 1)': {
        o.textContent = coordinate;

        o.setAttribute('x', (offset + padding + innerWidth / 3).toString(10));
        o.setAttribute('y', (padding + (3 * innerHeight) / 4).toString(10));
        o.setAttribute('text-anchor', 'start');
        o.setAttribute('stroke', 'none');
        o.setAttribute('fill', baseColor);
        o.setAttribute('font-size', '16px');

        break;
      }

      case '(-5, 0, 0)': {
        o.textContent = coordinate;

        o.setAttribute('x', (offset + padding + 48).toString(10));
        o.setAttribute('y', (padding + innerHeight / 2 + 16).toString(10));
        o.setAttribute('text-anchor', 'start');
        o.setAttribute('stroke', 'none');
        o.setAttribute('fill', baseColor);
        o.setAttribute('font-size', '16px');

        break;
      }

      case '(0, 0, -1)': {
        o.textContent = coordinate;

        o.setAttribute('x', (offset + padding + innerWidth / 4).toString(10));
        o.setAttribute('y', (padding + innerHeight / 2 - 20).toString(10));
        o.setAttribute('text-anchor', 'start');
        o.setAttribute('stroke', 'none');
        o.setAttribute('fill', baseColor);
        o.setAttribute('font-size', '16px');

        break;
      }

      case '(0, 0, 1)': {
        o.textContent = coordinate;

        o.setAttribute('x', (offset + padding + innerWidth / 4 - 40).toString(10));
        o.setAttribute('y', (padding + innerHeight / 2 + 20).toString(10));
        o.setAttribute('text-anchor', 'start');
        o.setAttribute('stroke', 'none');
        o.setAttribute('fill', baseColor);
        o.setAttribute('font-size', '16px');

        break;
      }

      case '(0, 1, 0)': {
        o.textContent = coordinate;

        o.setAttribute('x', (offset + padding + innerWidth / 4 + 4).toString(10));
        o.setAttribute('y', (padding + innerHeight / 4 + 24).toString(10));
        o.setAttribute('text-anchor', 'start');
        o.setAttribute('stroke', 'none');
        o.setAttribute('fill', baseColor);
        o.setAttribute('font-size', '16px');

        break;
      }

      case '(1, 1, 0)': {
        o.textContent = coordinate;

        o.setAttribute('x', (offset + padding + innerWidth / 4 + 24).toString(10));
        o.setAttribute('y', (padding + innerHeight / 4 + 24).toString(10));
        o.setAttribute('text-anchor', 'start');
        o.setAttribute('stroke', 'none');
        o.setAttribute('fill', baseColor);
        o.setAttribute('font-size', '16px');

        break;
      }
    }
  }

  svg.appendChild(xPath);
  svg.appendChild(yPath);
  svg.appendChild(zPath);

  svg.appendChild(xArrow);
  svg.appendChild(yArrow);
  svg.appendChild(zArrow);

  svg.appendChild(x);
  svg.appendChild(y);
  svg.appendChild(z);
  svg.appendChild(o);
};

const createPannerNodePosition = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;

  render3DimensionalCoordinate(svg, 0, true);
  render3DimensionalCoordinate(svg, innerWidth / 2 + padding / 2, false, '(-1, 1, 1)');
};

const createPannerNodeOrientation = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;

  render3DimensionalCoordinate(svg, 0, true);
  render3DimensionalCoordinate(svg, innerWidth / 2 + padding / 2, false, '(1, -√2, 1)');
};

const createSoundCone = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const renderOmnidirectionalSoundCone = () => {
    const width = innerWidth / 2;
    const height = innerHeight;

    const baseX = padding + width / 2;
    const baseY = height / 2;

    const outerCircle = document.createElementNS(xmlns, 'circle');

    outerCircle.setAttribute('cx', (padding + width / 2).toString(10));
    outerCircle.setAttribute('cy', (height / 2).toString(10));
    outerCircle.setAttribute('r', '120');
    outerCircle.setAttribute('stroke', lightWaveColor);
    outerCircle.setAttribute('stroke-width', '4');
    outerCircle.setAttribute('fill', alphaLightWaveColor);

    const outerArrow = document.createElementNS(xmlns, 'path');

    outerArrow.setAttribute('d', `M${baseX + 120} ${baseY} L${baseX + 120 - 12} ${baseY} L${baseX + 120} ${baseY - 20} L${baseX + 120 + 12} ${baseY}`);
    outerArrow.setAttribute('stroke', 'none');
    outerArrow.setAttribute('fill', lightWaveColor);

    const outerText = document.createElementNS(xmlns, 'text');

    outerText.textContent = 'coneOuterAngle 360°';

    outerText.setAttribute('x', baseX.toString(10));
    outerText.setAttribute('y', (height / 5 + 8).toString(10));
    outerText.setAttribute('text-anchor', 'middle');
    outerText.setAttribute('stroke', 'none');
    outerText.setAttribute('fill', grayColor);
    outerText.setAttribute('font-size', '18px');

    svg.appendChild(outerCircle);
    svg.appendChild(outerArrow);
    svg.appendChild(outerText);

    const innerCircle = document.createElementNS(xmlns, 'circle');

    innerCircle.setAttribute('cx', (padding + width / 2).toString(10));
    innerCircle.setAttribute('cy', (height / 2).toString(10));
    innerCircle.setAttribute('r', '60');
    innerCircle.setAttribute('stroke', waveColor);
    innerCircle.setAttribute('stroke-width', '4');
    innerCircle.setAttribute('fill', alphaWaveColor);

    const innerArrow = document.createElementNS(xmlns, 'path');

    innerArrow.setAttribute('d', `M${baseX + 60} ${baseY} L${baseX + 60 - 12} ${baseY} L${baseX + 60} ${baseY - 20} L${baseX + 60 + 12} ${baseY}`);
    innerArrow.setAttribute('stroke', 'none');
    innerArrow.setAttribute('fill', waveColor);

    const innerText = document.createElementNS(xmlns, 'text');

    innerText.textContent = 'coneInnerAngle 360°';

    innerText.setAttribute('x', baseX.toString(10));
    innerText.setAttribute('y', (baseY - 72).toString(10));
    innerText.setAttribute('text-anchor', 'middle');
    innerText.setAttribute('stroke', 'none');
    innerText.setAttribute('fill', grayColor);
    innerText.setAttribute('font-size', '18px');

    svg.appendChild(innerCircle);
    svg.appendChild(innerArrow);
    svg.appendChild(innerText);
  };

  const renderDirectionalSoundCone = () => {
    const width = innerWidth / 2;
    const height = innerHeight;
    const offset = innerWidth / 2 + 120;

    const baseX = offset + width / 2;

    const outerEllipse = document.createElementNS(xmlns, 'ellipse');

    outerEllipse.setAttribute('cx', (offset + width / 2).toString(10));
    outerEllipse.setAttribute('cy', height.toString(10));
    outerEllipse.setAttribute('rx', (width / 2).toString(10));
    outerEllipse.setAttribute('ry', (height / 8).toString(10));
    outerEllipse.setAttribute('stroke', 'none');
    outerEllipse.setAttribute('fill', alphaLightWaveColor);

    const outerCone = document.createElementNS(xmlns, 'polygon');

    outerCone.setAttribute('points', `${baseX} ${padding}, ${baseX - 170} ${height}, ${baseX + 170} ${height}`);
    outerCone.setAttribute('stroke', 'none');
    outerCone.setAttribute('fill', 'rgba(255 0 255 / 20%)');

    const outerPath = document.createElementNS(xmlns, 'path');

    outerPath.setAttribute('d', `M0, 0 L-168, 0 a168 66 180 0 1 335, 0 z`);
    outerPath.setAttribute('stroke', lightWaveColor);
    outerPath.setAttribute('fill', 'none');
    outerPath.setAttribute('stroke-width', '4');
    outerPath.setAttribute('stroke-linecap', lineCap);
    outerPath.setAttribute('stroke-linejoin', lineJoin);
    outerPath.setAttribute('transform', `translate(${baseX} ${height})`);

    const outerArrow = document.createElementNS(xmlns, 'path');

    outerArrow.setAttribute(
      'd',
      `M${baseX - 168} ${height - 12} L${baseX - 168 - 12} ${height - 12} L${baseX - 168} ${height} L${baseX - 168 + 20} ${height - 12}`
    );
    outerArrow.setAttribute('stroke', 'none');
    outerArrow.setAttribute('fill', lightWaveColor);

    const outerText = document.createElementNS(xmlns, 'text');

    outerText.textContent = 'coneOuterAngle 180°';

    outerText.setAttribute('x', baseX.toString(10));
    outerText.setAttribute('y', (height - 72).toString(10));
    outerText.setAttribute('text-anchor', 'middle');
    outerText.setAttribute('stroke', 'none');
    outerText.setAttribute('fill', grayColor);
    outerText.setAttribute('font-size', '18px');

    svg.appendChild(outerEllipse);
    svg.appendChild(outerCone);
    svg.appendChild(outerPath);
    svg.appendChild(outerArrow);
    svg.appendChild(outerText);

    const innerEllipse = document.createElementNS(xmlns, 'ellipse');

    innerEllipse.setAttribute('cx', (offset + width / 2).toString(10));
    innerEllipse.setAttribute('cy', height.toString(10));
    innerEllipse.setAttribute('rx', (width / 5).toString(10));
    innerEllipse.setAttribute('ry', (height / 16).toString(10));
    innerEllipse.setAttribute('stroke', 'none');
    innerEllipse.setAttribute('fill', alphaWaveColor);

    const innerCone = document.createElementNS(xmlns, 'polygon');

    innerCone.setAttribute('points', `${offset + width / 2} ${padding}, ${offset + width / 2 - 65} ${height}, ${offset + width / 2 + 65} ${height}`);
    innerCone.setAttribute('stroke', 'none');
    innerCone.setAttribute('fill', 'rgba(0 0 255 / 20%)');

    const innerPath = document.createElementNS(xmlns, 'path');

    innerPath.setAttribute('d', `M0, 0 L-64, 0 a30 14 180 0 1 128, 0 z`);
    innerPath.setAttribute('stroke', waveColor);
    innerPath.setAttribute('fill', 'none');
    innerPath.setAttribute('stroke-width', '4');
    innerPath.setAttribute('stroke-linecap', lineCap);
    innerPath.setAttribute('stroke-linejoin', lineJoin);
    innerPath.setAttribute('transform', `translate(${baseX} ${height})`);

    const innerArrow = document.createElementNS(xmlns, 'path');

    innerArrow.setAttribute(
      'd',
      `M${baseX - 66} ${height - 12} L${baseX - 66 - 12} ${height - 12} L${baseX - 66} ${height} L${baseX - 66 + 20} ${height - 12}`
    );
    innerArrow.setAttribute('stroke', 'none');
    innerArrow.setAttribute('fill', waveColor);

    const innerText = document.createElementNS(xmlns, 'text');

    innerText.textContent = 'coneInnerAngle 180°';

    innerText.setAttribute('x', baseX.toString(10));
    innerText.setAttribute('y', (height - 36).toString(10));
    innerText.setAttribute('text-anchor', 'middle');
    innerText.setAttribute('stroke', 'none');
    innerText.setAttribute('fill', grayColor);
    innerText.setAttribute('font-size', '18px');

    svg.appendChild(innerEllipse);
    svg.appendChild(innerCone);
    svg.appendChild(innerPath);
    svg.appendChild(innerArrow);
    svg.appendChild(innerText);
  };

  renderOmnidirectionalSoundCone();
  renderDirectionalSoundCone();
};

const createAudioListenerPosition = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;

  render3DimensionalCoordinate(svg, 0, true);
  render3DimensionalCoordinate(svg, innerWidth / 2 + padding / 2, false, '(-5, 0, 0)');
};

const createAudioListenerForward = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;

  render3DimensionalCoordinate(svg, 0, false, '(0, 0, -1)');
  render3DimensionalCoordinate(svg, innerWidth / 2 + padding / 2, false, '(0, 0, 1)');
};

const createAudioListenerUp = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;

  render3DimensionalCoordinate(svg, 0, false, '(0, 1, 0)');
  render3DimensionalCoordinate(svg, innerWidth / 2 + padding / 2, false, '(1, 1, 0)');
};

const createMappingAmplitudeAndHeight = (svg, uint8) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  createCoordinateRect(svg);

  if (uint8) {
    const g = document.createElementNS(xmlns, 'g');

    [255, 128, 0].forEach((amplitude) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = amplitude.toString(10);

      text.setAttribute('x', '80');
      text.setAttribute('y', (padding + (1 - amplitude / 255) * innerHeight - 6).toString(10));
      text.setAttribute('text-anchor', 'start');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '16px');

      g.appendChild(text);
    });

    svg.appendChild(g);
  }

  const label = document.createElementNS(xmlns, 'text');

  label.textContent = 'Height';

  label.setAttribute('x', (padding + innerWidth).toString(10));
  label.setAttribute('y', (padding / 2 - 4).toString(10));
  label.setAttribute('text-anchor', 'middle');
  label.setAttribute('stroke', 'none');
  label.setAttribute('fill', baseColor);
  label.setAttribute('font-size', '18px');

  svg.appendChild(label);

  const g = document.createElementNS(xmlns, 'g');

  [0, 0.5, 1].forEach((h) => {
    const text = document.createElementNS(xmlns, 'text');

    let t = '';

    switch (h) {
      case 0: {
        t = '0';
        break;
      }

      case 0.5: {
        t = 'height / 2';
        break;
      }

      case 1: {
        t = 'height';
        break;
      }
    }

    text.textContent = t;

    text.setAttribute('x', (2 * padding + innerWidth).toString(10));
    text.setAttribute('y', (padding + h * innerHeight + (h === 0.5 ? 20 : 0)).toString(10));
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '16px');
    text.setAttribute('font-style', 'italic');

    g.appendChild(text);
  });

  svg.appendChild(g);

  const path = document.createElementNS(xmlns, 'path');

  let d = '';

  for (let n = 0, len = sampleRate; n < len; n++) {
    const v = Math.sin((2 * Math.PI * n) / sampleRate);

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
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);
};

const createSamplingPeriodToTimeText = (svg) => {
  const width = Number(svg.getAttribute('width'));
  const height = Number(svg.getAttribute('height'));

  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const middle = height / 2;

  createCoordinateRect(svg);
  createSinFunctionPath(svg, alphaWaveColor);

  const n = 8;
  const d = (2 * Math.PI) / n;

  const g = document.createElementNS(xmlns, 'g');

  for (let rad = 0, i = 0; rad < 2 * Math.PI; rad += d, i++) {
    const path = document.createElementNS(xmlns, 'path');

    const v = Math.sin(rad);
    const x = (rad / d) * (1 / n) * innerWidth + padding;
    const y = (1 - v) * (innerHeight / 2) + padding;

    path.setAttribute('d', `M${x} ${y} L${x} ${middle}`);
    path.setAttribute('stroke', alphaWaveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('stroke-linecap', 'square');

    g.appendChild(path);

    const text = document.createElementNS(xmlns, 'text');
    const indexText = document.createElementNS(xmlns, 'text');

    if (i < 6) {
      text.textContent = 't';
      indexText.textContent = i.toString(10);
    } else {
      text.textContent = '...';
    }

    if (i === 4) {
      const timeText = document.createElementNS(xmlns, 'text');

      timeText.textContent = '...';

      timeText.setAttribute('x', (x - 4).toString(10));
      timeText.setAttribute('y', (middle - 8).toString(10));
      timeText.setAttribute('stroke', 'none');
      timeText.setAttribute('fill', baseColor);
      timeText.setAttribute('font-size', '16px');
      timeText.setAttribute('font-style', 'italic');

      g.appendChild(timeText);
    }

    if (i === 1 || i === 7) {
      const timeText = document.createElementNS(xmlns, 'text');
      const timeSubText = document.createElementNS(xmlns, 'text');

      if (i === 1) {
        text.textContent = 't';
        indexText.textContent = '1';

        timeText.textContent = 'T';
        timeSubText.textContent = 's';

        timeText.setAttribute('x', (x + 4).toString(10));
        timeSubText.setAttribute('x', (x + 12).toString(10));
      } else {
        text.textContent = 't';
        indexText.textContent = 'n';

        timeText.textContent = 'n・T';
        timeSubText.textContent = 's';

        timeText.setAttribute('x', (x - 16).toString(10));
        timeSubText.setAttribute('x', (x + 18).toString(10));
      }

      timeText.setAttribute('y', (middle - 4).toString(10));
      timeText.setAttribute('stroke', 'none');
      timeText.setAttribute('fill', baseColor);
      timeText.setAttribute('font-size', '16px');
      timeText.setAttribute('font-style', 'italic');

      timeSubText.setAttribute('y', (middle - 4).toString(10));
      timeSubText.setAttribute('stroke', 'none');
      timeSubText.setAttribute('fill', baseColor);
      timeSubText.setAttribute('font-size', '12px');
      timeSubText.setAttribute('font-style', 'italic');

      g.appendChild(timeText);
      g.appendChild(timeSubText);
    }

    text.setAttribute('x', (x - 2).toString(10));
    text.setAttribute('y', (padding - 12).toString(10));
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '16px');
    text.setAttribute('font-style', 'italic');

    indexText.setAttribute('x', (x + 4).toString(10));
    indexText.setAttribute('y', (padding - 8).toString(10));
    indexText.setAttribute('stroke', 'none');
    indexText.setAttribute('fill', baseColor);
    indexText.setAttribute('font-size', '12px');
    indexText.setAttribute('font-style', 'italic');

    g.appendChild(text);
    g.appendChild(indexText);
  }

  svg.appendChild(g);
};

const animateTimeDomainWaveToSVG = (svg, button, displayGraph, displayText) => {
  const analyser = new AnalyserNode(audiocontext, { fftSize: 128 });
  const gain = new GainNode(audiocontext, { gain: 0.9 });

  const width = Number(svg.getAttribute('width') ?? '0');
  const height = Number(svg.getAttribute('height') ?? '0');

  let innerWidth = width;

  if (displayGraph) {
    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', '0');
    xRect.setAttribute('y', (height / 2 - 1).toString(10));
    xRect.setAttribute('width', width.toString(10));
    xRect.setAttribute('height', '2');
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    svg.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', '24');
    yRect.setAttribute('y', '0');
    yRect.setAttribute('width', '2');
    yRect.setAttribute('height', height.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    svg.appendChild(yRect);

    innerWidth -= 24;
  }

  if (displayText) {
    const g = document.createElementNS(xmlns, 'g');

    [1.0, 0.0, -1.0].forEach((amplitude, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = amplitude.toFixed(1);

      let h = 0;

      switch (amplitude) {
        case 1.0: {
          h = 12;
          break;
        }

        case 0.0: {
          h = -4;
          break;
        }

        case -1.0: {
          h = 0;
          break;
        }
      }

      text.setAttribute('x', '24');
      text.setAttribute('y', ((1 - amplitude) * (height / 2) + h).toString(10));
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '12px');

      g.appendChild(text);
    });

    for (let n = 0; n < analyser.fftSize; n++) {
      if (n % 16 !== 0) {
        continue;
      }

      const x = n * (innerWidth / analyser.fftSize) + 24 + 4;

      const text = document.createElementNS(xmlns, 'text');

      text.textContent = `${(n * (1 / sampleRate) * 1000).toFixed(2)} msec`;

      text.setAttribute('x', x);
      text.setAttribute('y', (height / 2 + 12).toString(10));
      text.setAttribute('text-anchor', 'start');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '12px');

      g.appendChild(text);
    }

    svg.appendChild(g);

    const xLabel = document.createElementNS(xmlns, 'text');

    xLabel.textContent = 'Time';

    xLabel.setAttribute('x', width.toString(10));
    xLabel.setAttribute('y', (height / 2 - 8).toString(10));
    xLabel.setAttribute('text-anchor', 'end');
    xLabel.setAttribute('stroke', 'none');
    xLabel.setAttribute('fill', baseColor);
    xLabel.setAttribute('font-size', '14px');

    const yLabel = document.createElementNS(xmlns, 'text');

    yLabel.textContent = 'Amplitude';

    yLabel.setAttribute('x', '28');
    yLabel.setAttribute('y', '12');
    yLabel.setAttribute('text-anchor', 'start');
    yLabel.setAttribute('stroke', 'none');
    yLabel.setAttribute('fill', baseColor);
    yLabel.setAttribute('font-size', '14px');

    svg.appendChild(xLabel);
    svg.appendChild(yLabel);
  }

  const path = document.createElementNS(xmlns, 'path');

  path.setAttribute('stroke', waveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  let animationId = null;

  const render = () => {
    const data = new Float32Array(analyser.fftSize);

    analyser.getFloatTimeDomainData(data);

    path.removeAttribute('d');

    let d = '';

    for (let n = 0; n < analyser.fftSize; n++) {
      const x = n * (innerWidth / analyser.fftSize);
      const y = (1 - data[n]) * (height / 2);

      if (d === '') {
        d += `M${x} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    path.setAttribute('d', d);

    animationId = window.requestAnimationFrame(() => {
      render();
    });
  };

  let oscillator = null;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      return;
    }

    oscillator = new OscillatorNode(audiocontext);

    oscillator.connect(gain);
    gain.connect(analyser);
    analyser.connect(audiocontext.destination);

    oscillator.start(0);

    render();

    button.textContent = 'stop';
  };

  const onUp = () => {
    if (oscillator === null) {
      return;
    }

    oscillator.stop(0);

    oscillator = null;

    if (animationId) {
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }

    button.textContent = 'start';
  };

  button.addEventListener('mousedown', onDown);
  button.addEventListener('touchstart', onDown);
  button.addEventListener('mouseup', onUp);
  button.addEventListener('touchend', onUp);
};

const animateTimeDomainWaveToCanvas = (canvas, button, displayGraph, displayText) => {
  const analyser = new AnalyserNode(audiocontext, { fftSize: 128 });
  const gain = new GainNode(audiocontext, { gain: 0.9 });

  const renderingContext = canvas.getContext('2d');

  const width = canvas.width;
  const height = canvas.height;

  const innerWidth = displayGraph ? width - 24 : width;

  let animationId = null;

  const render = () => {
    const data = new Float32Array(analyser.fftSize);

    analyser.getFloatTimeDomainData(data);

    renderingContext.clearRect(0, 0, width, height);

    if (displayGraph) {
      renderingContext.fillStyle = baseColor;
      renderingContext.fillRect(0, height / 2 - 1, width, 2);
      renderingContext.fillRect(24, 0, 2, height);
    }

    if (displayText) {
      renderingContext.font = 'Roboto 12px';
      renderingContext.fillStyle = baseColor;

      [1.0, 0.0, -1.0].forEach((amplitude, index) => {
        let h = 0;

        switch (amplitude) {
          case 1.0: {
            h = 12;
            break;
          }

          case 0.0: {
            h = -4;
            break;
          }

          case -1.0: {
            h = 0;
            break;
          }
        }

        renderingContext.textAlign = 'end';
        renderingContext.fillText(amplitude.toFixed(1), 24, (1 - amplitude) * (height / 2) + h);
      });

      for (let n = 0; n < analyser.fftSize; n++) {
        if (n % 16 !== 0) {
          continue;
        }

        const x = n * (innerWidth / analyser.fftSize) + 24 + 4;

        renderingContext.textAlign = 'start';
        renderingContext.fillText(`${(n * (1 / sampleRate) * 1000).toFixed(2)} msec`, x, height / 2 + 12);
      }

      renderingContext.font = 'Roboto 14px';

      renderingContext.textAlign = 'end';
      renderingContext.fillText('Time', width, height / 2 - 8);

      renderingContext.textAlign = 'start';
      renderingContext.fillText('Amplitude', 28, 12);
    }

    renderingContext.beginPath();

    for (let n = 0; n < analyser.fftSize; n++) {
      const x = n * (innerWidth / analyser.fftSize);
      const y = (1 - data[n]) * (height / 2);

      if (n === 0) {
        renderingContext.moveTo(x, y);
      } else {
        renderingContext.lineTo(x, y);
      }
    }

    renderingContext.lineWidth = 1.5;
    renderingContext.strokeStyle = waveColor;

    renderingContext.stroke();

    animationId = window.requestAnimationFrame(() => {
      render();
    });
  };

  let oscillator = null;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      return;
    }

    oscillator = new OscillatorNode(audiocontext);

    oscillator.connect(gain);
    gain.connect(analyser);
    analyser.connect(audiocontext.destination);

    oscillator.start(0);

    render();

    button.textContent = 'stop';
  };

  const onUp = () => {
    if (oscillator === null) {
      return;
    }

    oscillator.stop(0);

    oscillator = null;

    if (animationId) {
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }

    button.textContent = 'start';
  };

  button.addEventListener('mousedown', onDown);
  button.addEventListener('touchstart', onDown);
  button.addEventListener('mouseup', onUp);
  button.addEventListener('touchend', onUp);
};

const animateTimeDomainUint8WaveToSVG = (svg) => {
  const analyser = new AnalyserNode(audiocontext, { fftSize: 128 });
  const gain = new GainNode(audiocontext, { gain: 0.9 });

  const width = Number(svg.getAttribute('width') ?? '0');
  const height = Number(svg.getAttribute('height') ?? '0');

  const innerWidth = width - 24;

  const xRect = document.createElementNS(xmlns, 'rect');

  xRect.setAttribute('x', '0');
  xRect.setAttribute('y', (height / 2 - 1).toString(10));
  xRect.setAttribute('width', width.toString(10));
  xRect.setAttribute('height', '2');
  xRect.setAttribute('stroke', 'none');
  xRect.setAttribute('fill', baseColor);

  svg.appendChild(xRect);

  const yRect = document.createElementNS(xmlns, 'rect');

  yRect.setAttribute('x', '24');
  yRect.setAttribute('y', '0');
  yRect.setAttribute('width', '2');
  yRect.setAttribute('height', height.toString(10));
  yRect.setAttribute('stroke', 'none');
  yRect.setAttribute('fill', baseColor);

  svg.appendChild(yRect);

  const g = document.createElementNS(xmlns, 'g');

  [1.0, 0.0, -1.0].forEach((amplitude, index) => {
    const text = document.createElementNS(xmlns, 'text');

    text.textContent = amplitude.toFixed(1);

    let h = 0;

    switch (amplitude) {
      case 1.0: {
        h = 12;
        break;
      }

      case 0.0: {
        h = -4;
        break;
      }

      case -1.0: {
        h = 0;
        break;
      }
    }

    text.setAttribute('x', '24');
    text.setAttribute('y', ((1 - amplitude) * (height / 2) + h).toString(10));
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '12px');

    g.appendChild(text);
  });

  for (let n = 0; n < analyser.fftSize; n++) {
    if (n % 16 !== 0) {
      continue;
    }

    const x = n * (innerWidth / analyser.fftSize) + 24 + 4;

    const text = document.createElementNS(xmlns, 'text');

    text.textContent = `${(n * (1 / sampleRate) * 1000).toFixed(2)} msec`;

    text.setAttribute('x', x);
    text.setAttribute('y', (height / 2 + 12).toString(10));
    text.setAttribute('text-anchor', 'start');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '12px');

    g.appendChild(text);
  }

  svg.appendChild(g);

  const xLabel = document.createElementNS(xmlns, 'text');

  xLabel.textContent = 'Time';

  xLabel.setAttribute('x', width.toString(10));
  xLabel.setAttribute('y', (height / 2 - 8).toString(10));
  xLabel.setAttribute('text-anchor', 'end');
  xLabel.setAttribute('stroke', 'none');
  xLabel.setAttribute('fill', baseColor);
  xLabel.setAttribute('font-size', '14px');

  const yLabel = document.createElementNS(xmlns, 'text');

  yLabel.textContent = 'Amplitude';

  yLabel.setAttribute('x', '28');
  yLabel.setAttribute('y', '12');
  yLabel.setAttribute('text-anchor', 'start');
  yLabel.setAttribute('stroke', 'none');
  yLabel.setAttribute('fill', baseColor);
  yLabel.setAttribute('font-size', '14px');

  svg.appendChild(xLabel);
  svg.appendChild(yLabel);

  const path = document.createElementNS(xmlns, 'path');

  path.setAttribute('stroke', waveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  let animationId = null;

  const render = () => {
    const data = new Uint8Array(analyser.fftSize);

    analyser.getByteTimeDomainData(data);

    path.removeAttribute('d');

    let d = '';

    for (let n = 0; n < analyser.fftSize; n++) {
      const x = n * (innerWidth / analyser.fftSize);
      const y = (1 - data[n] / 255) * height;

      if (d === '') {
        d += `M${x} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    path.setAttribute('d', d);

    animationId = window.requestAnimationFrame(() => {
      render();
    });
  };

  const buttonElement = document.getElementById('button-svg-time-domain-wave-path-with-coordinate-and-texts-in-uint8');

  let oscillator = null;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      return;
    }

    oscillator = new OscillatorNode(audiocontext);

    oscillator.connect(gain);
    gain.connect(analyser);
    analyser.connect(audiocontext.destination);

    oscillator.start(0);

    render();

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (oscillator === null) {
      return;
    }

    oscillator.stop(0);

    oscillator = null;

    if (animationId) {
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }

    buttonElement.textContent = 'start';
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);
};

const animateTimeDomainUint8WaveToCanvas = (canvas) => {
  const analyser = new AnalyserNode(audiocontext, { fftSize: 128 });
  const gain = new GainNode(audiocontext, { gain: 0.9 });

  const renderingContext = canvas.getContext('2d');

  const width = canvas.width;
  const height = canvas.height;

  const innerWidth = width - 24;

  let animationId = null;

  const render = () => {
    const data = new Uint8Array(analyser.fftSize);

    analyser.getByteTimeDomainData(data);

    renderingContext.clearRect(0, 0, width, height);

    renderingContext.fillStyle = baseColor;
    renderingContext.fillRect(0, height / 2 - 1, width, 2);
    renderingContext.fillRect(24, 0, 2, height);

    renderingContext.font = 'Roboto 12px';
    renderingContext.fillStyle = baseColor;

    [1.0, 0.0, -1.0].forEach((amplitude, index) => {
      let h = 0;

      switch (amplitude) {
        case 1.0: {
          h = 12;
          break;
        }

        case 0.0: {
          h = -4;
          break;
        }

        case -1.0: {
          h = 0;
          break;
        }
      }

      renderingContext.textAlign = 'end';
      renderingContext.fillText(amplitude.toFixed(1), 24, (1 - amplitude) * (height / 2) + h);
    });

    for (let n = 0; n < analyser.fftSize; n++) {
      if (n % 16 !== 0) {
        continue;
      }

      const x = n * (innerWidth / analyser.fftSize) + 24 + 4;

      renderingContext.textAlign = 'start';
      renderingContext.fillText(`${(n * (1 / sampleRate) * 1000).toFixed(2)} msec`, x, height / 2 + 12);
    }

    renderingContext.font = 'Roboto 14px';

    renderingContext.textAlign = 'end';
    renderingContext.fillText('Time', width, height / 2 - 8);

    renderingContext.textAlign = 'start';
    renderingContext.fillText('Amplitude', 28, 12);

    renderingContext.beginPath();

    for (let n = 0; n < analyser.fftSize; n++) {
      const x = n * (innerWidth / analyser.fftSize);
      const y = (1 - data[n] / 255) * height;

      if (n === 0) {
        renderingContext.moveTo(x, y);
      } else {
        renderingContext.lineTo(x, y);
      }
    }

    renderingContext.lineWidth = 1.5;
    renderingContext.strokeStyle = waveColor;

    renderingContext.stroke();

    animationId = window.requestAnimationFrame(() => {
      render();
    });
  };

  const buttonElement = document.getElementById('button-canvas-time-domain-wave-path-with-coordinate-and-texts-in-uint8');

  let oscillator = null;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      return;
    }

    oscillator = new OscillatorNode(audiocontext);

    oscillator.connect(gain);
    gain.connect(analyser);
    analyser.connect(audiocontext.destination);

    oscillator.start(0);

    render();

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (oscillator === null) {
      return;
    }

    oscillator.stop(0);

    oscillator = null;

    if (animationId) {
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }

    buttonElement.textContent = 'start';
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);
};

const createMappingAmplitudeSpectrumAndHeight = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const xRect = document.createElementNS(xmlns, 'rect');

  xRect.setAttribute('x', padding.toString(10));
  xRect.setAttribute('y', (padding + innerHeight - 1).toString(10));
  xRect.setAttribute('width', (innerWidth + padding).toString(10));
  xRect.setAttribute('height', lineWidth.toString(10));
  xRect.setAttribute('stroke', 'none');
  xRect.setAttribute('fill', baseColor);

  svg.appendChild(xRect);

  const yRect = document.createElementNS(xmlns, 'rect');

  yRect.setAttribute('x', padding.toString(10));
  yRect.setAttribute('y', padding.toString(10));
  yRect.setAttribute('width', lineWidth.toString(10));
  yRect.setAttribute('height', innerHeight.toString(10));
  yRect.setAttribute('stroke', 'none');
  yRect.setAttribute('fill', baseColor);

  svg.appendChild(yRect);

  const xLabel = document.createElementNS(xmlns, 'text');

  xLabel.textContent = 'Frequency (Hz)';

  xLabel.setAttribute('x', (padding + innerWidth).toString(10));
  xLabel.setAttribute('y', (padding + innerHeight + 20).toString(10));
  xLabel.setAttribute('text-anchor', 'middle');
  xLabel.setAttribute('stroke', 'none');
  xLabel.setAttribute('fill', baseColor);
  xLabel.setAttribute('font-size', '18px');

  svg.appendChild(xLabel);

  const yLabel = document.createElementNS(xmlns, 'text');

  yLabel.textContent = 'Amplitude (dB)';

  yLabel.setAttribute('x', padding.toString(10));
  yLabel.setAttribute('y', (padding - 20).toString(10));
  yLabel.setAttribute('text-anchor', 'middle');
  yLabel.setAttribute('stroke', 'none');
  yLabel.setAttribute('fill', baseColor);
  yLabel.setAttribute('font-size', '18px');

  svg.appendChild(yLabel);

  const hLabel = document.createElementNS(xmlns, 'text');

  hLabel.textContent = 'Height (px)';

  hLabel.setAttribute('x', (padding + innerWidth).toString(10));
  hLabel.setAttribute('y', (padding - 20).toString(10));
  hLabel.setAttribute('text-anchor', 'middle');
  hLabel.setAttribute('stroke', 'none');
  hLabel.setAttribute('fill', baseColor);
  hLabel.setAttribute('font-size', '18px');

  svg.appendChild(hLabel);

  const g = document.createElementNS(xmlns, 'g');

  [0, -10, -20, -30, -40, -50, -60].forEach((dB, index) => {
    const text = document.createElementNS(xmlns, 'text');

    text.textContent = `${dB} dB`;

    text.setAttribute('x', (padding - 4).toString(10));
    text.setAttribute('y', (padding + (innerHeight / 6) * index).toString(10));
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '16px');

    g.appendChild(text);

    const h = document.createElementNS(xmlns, 'text');

    if (dB === 0) {
      h.textContent = '0';
    } else if (dB === -60) {
      h.textContent = 'height';
    } else {
      h.textContent = `${index}/6 × height`;
    }

    h.setAttribute('x', (padding + innerWidth + 60).toString(10));
    h.setAttribute('y', (padding + index * (innerHeight / 6) - (index === 6 ? 8 : 0)).toString(10));
    h.setAttribute('text-anchor', 'end');
    h.setAttribute('stroke', 'none');
    h.setAttribute('fill', baseColor);
    h.setAttribute('font-size', '16px');
    h.setAttribute('font-style', 'italic');

    g.appendChild(h);
  });

  svg.appendChild(g);

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
    const y = v * (innerHeight / 3) + padding + innerHeight / 2;

    if (x > innerWidth) {
      break;
    }

    if (d === '') {
      d += `M${x + lineWidth / 2} ${padding}`;
    } else {
      d += ` L${x} ${y}`;
    }
  }

  path.setAttribute('d', d);

  path.setAttribute('stroke', alphaWaveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);
};

const createFrequencyResolutionToFrequencyText = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const xRect = document.createElementNS(xmlns, 'rect');

  xRect.setAttribute('x', padding.toString(10));
  xRect.setAttribute('y', (padding + innerHeight - 1).toString(10));
  xRect.setAttribute('width', (innerWidth + padding).toString(10));
  xRect.setAttribute('height', lineWidth.toString(10));
  xRect.setAttribute('stroke', 'none');
  xRect.setAttribute('fill', baseColor);

  svg.appendChild(xRect);

  const yRect = document.createElementNS(xmlns, 'rect');

  yRect.setAttribute('x', padding.toString(10));
  yRect.setAttribute('y', padding.toString(10));
  yRect.setAttribute('width', lineWidth.toString(10));
  yRect.setAttribute('height', innerHeight.toString(10));
  yRect.setAttribute('stroke', 'none');
  yRect.setAttribute('fill', baseColor);

  svg.appendChild(yRect);

  const xLabel = document.createElementNS(xmlns, 'text');

  xLabel.textContent = 'Frequency (Hz)';

  xLabel.setAttribute('x', (padding + innerWidth).toString(10));
  xLabel.setAttribute('y', (padding + innerHeight - 12).toString(10));
  xLabel.setAttribute('text-anchor', 'middle');
  xLabel.setAttribute('stroke', 'none');
  xLabel.setAttribute('fill', baseColor);
  xLabel.setAttribute('font-size', '18px');

  svg.appendChild(xLabel);

  const yLabel = document.createElementNS(xmlns, 'text');

  yLabel.textContent = 'Amplitude';

  yLabel.setAttribute('x', padding.toString(10));
  yLabel.setAttribute('y', (padding - 28).toString(10));
  yLabel.setAttribute('text-anchor', 'middle');
  yLabel.setAttribute('stroke', 'none');
  yLabel.setAttribute('fill', baseColor);
  yLabel.setAttribute('font-size', '18px');

  svg.appendChild(yLabel);

  const spectrums = [0.9, 0.75, 0.5, 0.25, 0.25, 0.5, 0.75, 0.9];
  const n = spectrums.length;
  const d = (2 * Math.PI) / n;

  const g = document.createElementNS(xmlns, 'g');

  spectrums.forEach((v, i) => {
    const path = document.createElementNS(xmlns, 'path');

    const x = (i / n) * innerWidth + padding;
    const y = (1 - v) * innerHeight + padding;

    path.setAttribute('d', `M${x} ${y} L${x} ${padding + innerHeight}`);
    path.setAttribute('stroke', alphaWaveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('stroke-linecap', 'square');

    g.appendChild(path);

    const text = document.createElementNS(xmlns, 'text');
    const indexText = document.createElementNS(xmlns, 'text');

    if (i === 2 || i == 3 || i === 6) {
      text.textContent = '...';

      const frequencyText = document.createElementNS(xmlns, 'text');

      frequencyText.textContent = '...';

      frequencyText.setAttribute('x', (x - 4).toString(10));
      frequencyText.setAttribute('y', (padding + innerHeight + 16).toString(10));
      frequencyText.setAttribute('stroke', 'none');
      frequencyText.setAttribute('fill', baseColor);
      frequencyText.setAttribute('font-size', '16px');
      frequencyText.setAttribute('font-style', 'italic');

      g.appendChild(frequencyText);
    } else if (i === 1 || i === 7) {
      const frequencyText = document.createElementNS(xmlns, 'text');
      const frequencySubText = document.createElementNS(xmlns, 'text');

      if (i === 1) {
        text.textContent = 'f';
        indexText.textContent = '1';

        frequencyText.textContent = 'f';
        frequencySubText.textContent = 'resolution';

        frequencyText.setAttribute('x', (x - 12).toString(10));
        frequencySubText.setAttribute('x', (x - 4).toString(10));
      } else {
        text.textContent = 'f';
        indexText.textContent = '(fftSize)';

        frequencyText.textContent = 'fftSize・f';
        frequencySubText.textContent = 'resolution';

        frequencyText.setAttribute('x', (x - 48).toString(10));
        frequencySubText.setAttribute('x', (x + 18).toString(10));

        const fftSizeText = document.createElementNS(xmlns, 'text');

        fftSizeText.textContent = '(fftSize - 1)';

        fftSizeText.setAttribute('x', x.toString(10));
        fftSizeText.setAttribute('y', (padding + 12).toString(10));
        fftSizeText.setAttribute('text-anchor', 'middle');
        fftSizeText.setAttribute('stroke', 'none');
        fftSizeText.setAttribute('fill', baseColor);
        fftSizeText.setAttribute('font-size', '16px');
        fftSizeText.setAttribute('font-style', 'italic');

        g.appendChild(fftSizeText);
      }

      frequencyText.setAttribute('y', (padding + innerHeight + 40).toString(10));
      frequencyText.setAttribute('stroke', 'none');
      frequencyText.setAttribute('fill', baseColor);
      frequencyText.setAttribute('font-size', '16px');
      frequencyText.setAttribute('font-style', 'italic');

      frequencySubText.setAttribute('y', (padding + innerHeight + 40).toString(10));
      frequencySubText.setAttribute('stroke', 'none');
      frequencySubText.setAttribute('fill', baseColor);
      frequencySubText.setAttribute('font-size', '12px');
      frequencySubText.setAttribute('font-style', 'italic');

      g.appendChild(frequencyText);
      g.appendChild(frequencySubText);
    } else if (i === 4) {
      const frequencyText = document.createElementNS(xmlns, 'text');
      const frequencySubText = document.createElementNS(xmlns, 'text');
      const frequencyBinCountText = document.createElementNS(xmlns, 'text');

      text.textContent = 'f';
      indexText.textContent = 'fftSize/2';
      frequencyBinCountText.textContent = '(frequencyBinCount)';

      frequencyBinCountText.setAttribute('x', x.toString(10));
      frequencyBinCountText.setAttribute('y', (padding + 12).toString(10));
      frequencyBinCountText.setAttribute('text-anchor', 'middle');
      frequencyBinCountText.setAttribute('stroke', 'none');
      frequencyBinCountText.setAttribute('fill', baseColor);
      frequencyBinCountText.setAttribute('font-size', '16px');
      frequencyBinCountText.setAttribute('font-style', 'italic');

      frequencyText.textContent = '(fftSize/2)・f';
      frequencySubText.textContent = 'resolution';

      frequencyText.setAttribute('x', (x - 72).toString(10));
      frequencySubText.setAttribute('x', (x + 16).toString(10));

      frequencyText.setAttribute('y', (padding + innerHeight + 40).toString(10));
      frequencyText.setAttribute('stroke', 'none');
      frequencyText.setAttribute('fill', baseColor);
      frequencyText.setAttribute('font-size', '16px');
      frequencyText.setAttribute('font-style', 'italic');

      frequencySubText.setAttribute('y', (padding + innerHeight + 40).toString(10));
      frequencySubText.setAttribute('stroke', 'none');
      frequencySubText.setAttribute('fill', baseColor);
      frequencySubText.setAttribute('font-size', '12px');
      frequencySubText.setAttribute('font-style', 'italic');

      g.appendChild(frequencyBinCountText);

      g.appendChild(frequencyText);
      g.appendChild(frequencySubText);
    } else {
      text.textContent = 'f';
      indexText.textContent = i.toString(10);
    }

    text.setAttribute('x', (x - 2).toString(10));
    text.setAttribute('y', (padding - 12).toString(10));
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '16px');
    text.setAttribute('font-style', 'italic');

    indexText.setAttribute('x', (x + 4).toString(10));
    indexText.setAttribute('y', (padding - 8).toString(10));
    indexText.setAttribute('stroke', 'none');
    indexText.setAttribute('fill', baseColor);
    indexText.setAttribute('font-size', '12px');
    indexText.setAttribute('font-style', 'italic');

    g.appendChild(text);
    g.appendChild(indexText);
  });

  svg.appendChild(g);

  const nyquistFrequencyText = document.createElementNS(xmlns, 'text');

  nyquistFrequencyText.textContent = 'Nyquist Frequency';

  nyquistFrequencyText.setAttribute('x', (padding + innerWidth / 2).toString(10));
  nyquistFrequencyText.setAttribute('y', (padding + innerHeight - 20).toString(10));
  nyquistFrequencyText.setAttribute('text-anchor', 'middle');
  nyquistFrequencyText.setAttribute('stroke', 'none');
  nyquistFrequencyText.setAttribute('fill', lightWaveColor);
  nyquistFrequencyText.setAttribute('font-size', '16px');

  svg.appendChild(nyquistFrequencyText);

  const halfRect = document.createElementNS(xmlns, 'rect');

  halfRect.setAttribute('x', padding.toString(10));
  halfRect.setAttribute('y', padding.toString(10));
  halfRect.setAttribute('width', (innerWidth / 2 - 0.5 * (innerWidth / n)).toString(10));
  halfRect.setAttribute('height', innerHeight.toString(10));
  halfRect.setAttribute('stroke', 'none');
  halfRect.setAttribute('fill', 'rgba(255 0 255 / 8%)');

  svg.appendChild(halfRect);
};

const animateAmplitudeSpectrumToSVG = (svg, button, displayGraph, displayText) => {
  const analyser = new AnalyserNode(audiocontext, { fftSize: 16384 });

  const width = Number(svg.getAttribute('width') ?? '0');
  const height = Number(svg.getAttribute('height') ?? '0');

  let innerWidth = width;
  let innerHeight = height;
  let translateX = 0;
  let translateY = 0;

  const maxDecibels = 0;
  const minDecibels = -60;

  const path = document.createElementNS(xmlns, 'path');

  path.setAttribute('stroke', waveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  if (displayGraph) {
    innerWidth -= 48;
    innerHeight -= 48;
    translateX = 48;
    translateY = 24;

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', translateX.toString(10));
    xRect.setAttribute('y', (height - translateY - 1).toString(10));
    xRect.setAttribute('width', innerWidth.toString(10));
    xRect.setAttribute('height', '2');
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    svg.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', translateX.toString(10));
    yRect.setAttribute('y', translateY.toString(10));
    yRect.setAttribute('width', '2');
    yRect.setAttribute('height', innerHeight.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    svg.appendChild(yRect);
  }

  if (displayText) {
    const g = document.createElementNS(xmlns, 'g');

    [0, -10, -20, -30, -40, -50, -60].forEach((dB, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = `${dB} dB`;

      text.setAttribute('x', '44');
      text.setAttribute('y', (index * (innerHeight / 6) + translateY).toString(10));
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '12px');

      g.appendChild(text);
    });

    for (let k = 0; k < analyser.frequencyBinCount; k++) {
      if (k % 1024 !== 0) {
        continue;
      }

      const x = k * (innerWidth / analyser.frequencyBinCount) + translateX;

      const text = document.createElementNS(xmlns, 'text');

      text.textContent = `${Math.trunc(k * (sampleRate / analyser.fftSize))} Hz`;

      text.setAttribute('x', x);
      text.setAttribute('y', (height - 8).toString(10));
      text.setAttribute('text-anchor', 'start');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '12px');

      g.appendChild(text);
    }

    svg.appendChild(g);

    const xLabel = document.createElementNS(xmlns, 'text');

    xLabel.textContent = 'Frequency (Hz)';

    xLabel.setAttribute('x', width.toString(10));
    xLabel.setAttribute('y', (height - translateY - 8).toString(10));
    xLabel.setAttribute('text-anchor', 'end');
    xLabel.setAttribute('stroke', 'none');
    xLabel.setAttribute('fill', baseColor);
    xLabel.setAttribute('font-size', '14px');

    const yLabel = document.createElementNS(xmlns, 'text');

    yLabel.textContent = 'Amplitude (dB)';

    yLabel.setAttribute('x', '28');
    yLabel.setAttribute('y', '12');
    yLabel.setAttribute('text-anchor', 'start');
    yLabel.setAttribute('stroke', 'none');
    yLabel.setAttribute('fill', baseColor);
    yLabel.setAttribute('font-size', '14px');

    svg.appendChild(xLabel);
    svg.appendChild(yLabel);
  }

  let animationId = null;

  const render = () => {
    const data = new Float32Array(analyser.frequencyBinCount);

    analyser.getFloatFrequencyData(data);

    path.removeAttribute('d');

    let d = '';

    for (let k = 0; k < analyser.frequencyBinCount; k++) {
      if (!Number.isFinite(data[k])) {
        continue;
      }

      const x = k * (innerWidth / analyser.frequencyBinCount) + translateX;
      const y = Math.min((0 - data[k]) * (innerHeight / (maxDecibels - minDecibels)) - translateY, height - translateY);

      if (d === '') {
        d += `M${x} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    path.setAttribute('d', d);

    animationId = window.requestAnimationFrame(() => {
      render();
    });
  };

  let oscillator = null;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      return;
    }

    oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth' });

    oscillator.connect(analyser);
    analyser.connect(audiocontext.destination);

    oscillator.start(0);

    render();

    button.textContent = 'stop';
  };

  const onUp = () => {
    if (oscillator === null) {
      return;
    }

    oscillator.stop(0);

    oscillator = null;

    if (animationId) {
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }

    button.textContent = 'start';
  };

  button.addEventListener('mousedown', onDown);
  button.addEventListener('touchstart', onDown);
  button.addEventListener('mouseup', onUp);
  button.addEventListener('touchend', onUp);
};

const animateAmplitudeSpectrumToCanvas = (canvas, button, displayGraph, displayText) => {
  const analyser = new AnalyserNode(audiocontext, { fftSize: 16384 });

  const renderingContext = canvas.getContext('2d');

  const width = canvas.width;
  const height = canvas.height;

  let innerWidth = width;
  let innerHeight = height;
  let translateX = 0;
  let translateY = 0;

  if (displayGraph) {
    innerWidth -= 48;
    innerHeight -= 48;
    translateX = 48;
    translateY = 24;
  }

  const maxDecibels = 0;
  const minDecibels = -60;

  let animationId = null;

  const render = () => {
    const data = new Float32Array(analyser.frequencyBinCount);

    analyser.getFloatFrequencyData(data);

    renderingContext.clearRect(0, 0, width, height);

    renderingContext.beginPath();

    for (let k = 0; k < analyser.frequencyBinCount; k++) {
      if (!Number.isFinite(data[k])) {
        continue;
      }

      const x = k * (innerWidth / analyser.frequencyBinCount) + translateX;
      const y = Math.min((0 - data[k]) * (innerHeight / (maxDecibels - minDecibels)) - translateY, height - translateY);

      if (k === 0) {
        renderingContext.moveTo(x, y);
      } else {
        renderingContext.lineTo(x, y);
      }
    }

    renderingContext.lineWidth = 1.5;
    renderingContext.strokeStyle = waveColor;

    renderingContext.stroke();

    if (displayGraph) {
      renderingContext.fillStyle = baseColor;
      renderingContext.fillRect(translateX, height - translateY - 1, innerWidth, 2);
      renderingContext.fillRect(translateX, translateY, 2, innerHeight);
    }

    if (displayText) {
      renderingContext.font = 'Roboto 12px';
      renderingContext.fillStyle = baseColor;

      [0, -10, -20, -30, -40, -50, -60].forEach((dB, index) => {
        renderingContext.textAlign = 'end';
        renderingContext.fillText(`${dB} dB`, 44, index * (innerHeight / 6) + translateY);
      });

      for (let k = 0; k < analyser.frequencyBinCount; k++) {
        if (k % 1024 !== 0) {
          continue;
        }

        const x = k * (innerWidth / analyser.frequencyBinCount) + translateX;

        renderingContext.textAlign = 'start';
        renderingContext.fillText(`${k * (sampleRate / analyser.fftSize)} Hz`, x, height - 8);
      }

      renderingContext.font = 'Roboto 16px';

      renderingContext.textAlign = 'end';
      renderingContext.fillText('Frequency (Hz)', width, height - translateY - 8);

      renderingContext.textAlign = 'start';
      renderingContext.fillText('Amplitude (dB)', 28, 12);
    }

    animationId = window.requestAnimationFrame(() => {
      render();
    });
  };

  let oscillator = null;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      return;
    }

    oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth' });

    oscillator.connect(analyser);
    analyser.connect(audiocontext.destination);

    oscillator.start(0);

    render();

    button.textContent = 'stop';
  };

  const onUp = () => {
    if (oscillator === null) {
      return;
    }

    oscillator.stop(0);

    oscillator = null;

    if (animationId) {
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }

    button.textContent = 'start';
  };

  button.addEventListener('mousedown', onDown);
  button.addEventListener('touchstart', onDown);
  button.addEventListener('mouseup', onUp);
  button.addEventListener('touchend', onUp);
};

const createMappingGetFloatFrequencyDataToGetByteFrequencyData = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const render = (offsetX, offsetY, dB) => {
    const width = padding + innerWidth / 3;
    const height = innerHeight / 2;

    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (padding + offsetX).toString(10));
    xRect.setAttribute('y', (padding + offsetY + height - 1).toString(10));
    xRect.setAttribute('width', width.toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    svg.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (padding + offsetX).toString(10));
    yRect.setAttribute('y', (padding + offsetY).toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', height.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    svg.appendChild(yRect);

    const xLabel = document.createElementNS(xmlns, 'text');

    xLabel.textContent = 'Frequency (Hz)';

    xLabel.setAttribute('x', (padding + offsetX + width).toString(10));
    xLabel.setAttribute('y', (padding + offsetY + height + 20).toString(10));
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('stroke', 'none');
    xLabel.setAttribute('fill', baseColor);
    xLabel.setAttribute('font-size', '16px');

    svg.appendChild(xLabel);

    const yLabel = document.createElementNS(xmlns, 'text');

    yLabel.textContent = dB ? 'Amplitude (dB)' : 'Amplitude (unsigned int 8 bits)';

    yLabel.setAttribute('x', (padding + offsetX).toString(10));
    yLabel.setAttribute('y', (padding + offsetY - 20).toString(10));
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('stroke', 'none');
    yLabel.setAttribute('fill', baseColor);
    yLabel.setAttribute('font-size', '16px');

    svg.appendChild(yLabel);

    if (dB) {
      const g = document.createElementNS(xmlns, 'g');

      [0, -10, -20, -30, -40, -50, -60, -70, -80, -90, -100, -110, -120, '...'].forEach((amplitude, index) => {
        const text = document.createElementNS(xmlns, 'text');

        text.textContent = typeof amplitude === 'number' ? `${amplitude} dB` : amplitude;

        text.setAttribute('x', (padding + offsetX - 4).toString(10));
        text.setAttribute('y', (padding + offsetY + index * (innerHeight / 25)).toString(10));
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('stroke', 'none');
        text.setAttribute('fill', baseColor);
        text.setAttribute('font-size', '12px');

        g.appendChild(text);
      });

      svg.appendChild(g);
    } else {
      const g = document.createElementNS(xmlns, 'g');

      [255, 128, 0].forEach((amplitude) => {
        const text = document.createElementNS(xmlns, 'text');

        text.textContent = amplitude.toString(10);

        text.setAttribute('x', (padding + offsetX - 4).toString(10));
        text.setAttribute('y', (padding + offsetY + (1 - amplitude / 255) * height).toString(10));
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('stroke', 'none');
        text.setAttribute('fill', baseColor);
        text.setAttribute('font-size', '12px');

        g.appendChild(text);
      });

      svg.appendChild(g);
    }

    const a = 1;
    const f = 6;

    const w = 2 * Math.PI;

    const path = document.createElementNS(xmlns, 'path');

    let d = '';

    for (let n = 0, len = f * sampleRate; n < len; n++) {
      const c = a * Math.sin((w * f * n) / sampleRate);
      const e = a * Math.sin((w * 1 * n) / sampleRate);
      const v = c * e;

      const x = (n / len) * width + padding + offsetX;
      const y = v * (height / (dB ? 2 : 4)) + padding + height / 2 + offsetY;

      if (d === '') {
        d += `M${x + lineWidth / 2} ${dB ? padding : y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    path.setAttribute('d', d);

    path.setAttribute('stroke', alphaWaveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    svg.appendChild(path);
  };

  render(0, 0, true);
  render(padding + innerWidth / 2, innerHeight / 4, false);

  const maxDecibelsPath = document.createElementNS(xmlns, 'path');
  const minDecibelsPath = document.createElementNS(xmlns, 'path');

  maxDecibelsPath.setAttribute('d', `M${padding} ${padding + 3 * (innerHeight / 26)} L${padding + innerWidth / 2 + 36} ${padding + innerHeight / 4}`);
  minDecibelsPath.setAttribute(
    'd',
    `M${padding} ${padding + 10 * (innerHeight / 26)} L${padding + innerWidth / 2 + 40} ${padding + (3 * innerHeight) / 4 - 4}`
  );

  [maxDecibelsPath, minDecibelsPath].forEach((path) => {
    path.setAttribute('stroke', lightWaveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);
    path.setAttribute('stroke-dasharray', '5,5');

    svg.appendChild(path);
  });

  const maxDecibelsText = document.createElementNS(xmlns, 'text');
  const minDecibelsText = document.createElementNS(xmlns, 'text');

  maxDecibelsText.textContent = 'maxDecibels';
  minDecibelsText.textContent = 'minDecibels';

  maxDecibelsText.setAttribute('x', (padding + innerWidth / 3).toString(10));
  maxDecibelsText.setAttribute('y', padding.toString(10));

  minDecibelsText.setAttribute('x', (padding + innerWidth / 3).toString(10));
  minDecibelsText.setAttribute('y', (padding + innerHeight / 2 + 52).toString(10));

  [maxDecibelsText, minDecibelsText].forEach((text) => {
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '20px');
    text.setAttribute('font-style', 'italic');

    svg.appendChild(text);
  });

  const rangeRect = document.createElementNS(xmlns, 'rect');

  rangeRect.setAttribute('x', padding.toString(10));
  rangeRect.setAttribute('y', (padding + 3 * (innerHeight / 26)).toString(10));
  rangeRect.setAttribute('width', (padding + innerWidth / 3).toString(10));
  rangeRect.setAttribute('height', (7 * (innerHeight / 26)).toString(10));
  rangeRect.setAttribute('stroke', 'none');
  rangeRect.setAttribute('fill', alphaLightWaveColor);

  svg.appendChild(rangeRect);
};

const createMappingNormalizedAmplitudeSpectrumAndHeight = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const xRect = document.createElementNS(xmlns, 'rect');

  xRect.setAttribute('x', padding.toString(10));
  xRect.setAttribute('y', (padding + innerHeight - 1).toString(10));
  xRect.setAttribute('width', (innerWidth + padding).toString(10));
  xRect.setAttribute('height', lineWidth.toString(10));
  xRect.setAttribute('stroke', 'none');
  xRect.setAttribute('fill', baseColor);

  svg.appendChild(xRect);

  const yRect = document.createElementNS(xmlns, 'rect');

  yRect.setAttribute('x', padding.toString(10));
  yRect.setAttribute('y', padding.toString(10));
  yRect.setAttribute('width', lineWidth.toString(10));
  yRect.setAttribute('height', innerHeight.toString(10));
  yRect.setAttribute('stroke', 'none');
  yRect.setAttribute('fill', baseColor);

  svg.appendChild(yRect);

  const xLabel = document.createElementNS(xmlns, 'text');

  xLabel.textContent = 'Frequency (Hz)';

  xLabel.setAttribute('x', (padding + innerWidth).toString(10));
  xLabel.setAttribute('y', (padding + innerHeight + 20).toString(10));
  xLabel.setAttribute('text-anchor', 'middle');
  xLabel.setAttribute('stroke', 'none');
  xLabel.setAttribute('fill', baseColor);
  xLabel.setAttribute('font-size', '18px');

  svg.appendChild(xLabel);

  const yLabel = document.createElementNS(xmlns, 'text');

  yLabel.textContent = 'Amplitude';

  yLabel.setAttribute('x', padding.toString(10));
  yLabel.setAttribute('y', (padding - 20).toString(10));
  yLabel.setAttribute('text-anchor', 'middle');
  yLabel.setAttribute('stroke', 'none');
  yLabel.setAttribute('fill', baseColor);
  yLabel.setAttribute('font-size', '18px');

  svg.appendChild(yLabel);

  const hLabel = document.createElementNS(xmlns, 'text');

  hLabel.textContent = 'Height (px)';

  hLabel.setAttribute('x', (padding + innerWidth).toString(10));
  hLabel.setAttribute('y', (padding - 20).toString(10));
  hLabel.setAttribute('text-anchor', 'middle');
  hLabel.setAttribute('stroke', 'none');
  hLabel.setAttribute('fill', baseColor);
  hLabel.setAttribute('font-size', '18px');

  svg.appendChild(hLabel);

  const g = document.createElementNS(xmlns, 'g');

  [1.0, 0.5, 0].forEach((amplitude, index) => {
    const text = document.createElementNS(xmlns, 'text');

    text.textContent = amplitude.toFixed(1);

    text.setAttribute('x', (padding - 4).toString(10));
    text.setAttribute('y', (padding + index * (innerHeight / 2)).toString(10));
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '16px');

    g.appendChild(text);

    const h = document.createElementNS(xmlns, 'text');

    switch (amplitude) {
      case 1: {
        h.textContent = '0';
        break;
      }

      case 0.5: {
        h.textContent = 'height/2';
        break;
      }

      case 0: {
        h.textContent = 'height';
        break;
      }
    }

    h.setAttribute('x', (padding + innerWidth + 60).toString(10));
    h.setAttribute('y', (padding + index * (innerHeight / 2) - (index === 2 ? 8 : 0)).toString(10));
    h.setAttribute('text-anchor', 'end');
    h.setAttribute('stroke', 'none');
    h.setAttribute('fill', baseColor);
    h.setAttribute('font-size', '16px');
    h.setAttribute('font-style', 'italic');

    g.appendChild(h);
  });

  svg.appendChild(g);

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
    const y = v * (innerHeight / 3) + padding + innerHeight / 2;

    if (x > innerWidth) {
      break;
    }

    if (d === '') {
      d += `M${x + lineWidth / 2} ${padding}`;
    } else {
      d += ` L${x} ${y}`;
    }
  }

  path.setAttribute('d', d);

  path.setAttribute('stroke', alphaWaveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);
};

const animateAmplitudeSpectrumUint8WaveToSVG = (svg) => {
  const analyser = new AnalyserNode(audiocontext, { fftSize: 16384, maxDecibels: 0, minDecibels: -60 });

  const width = Number(svg.getAttribute('width') ?? '0');
  const height = Number(svg.getAttribute('height') ?? '0');

  const innerWidth = width - 48;
  const innerHeight = height - 48;
  const translateX = 48;
  const translateY = 24;

  const path = document.createElementNS(xmlns, 'path');

  path.setAttribute('stroke', waveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  const xRect = document.createElementNS(xmlns, 'rect');

  xRect.setAttribute('x', translateX.toString(10));
  xRect.setAttribute('y', (height - translateY - 1).toString(10));
  xRect.setAttribute('width', innerWidth.toString(10));
  xRect.setAttribute('height', '2');
  xRect.setAttribute('stroke', 'none');
  xRect.setAttribute('fill', baseColor);

  svg.appendChild(xRect);

  const yRect = document.createElementNS(xmlns, 'rect');

  yRect.setAttribute('x', translateX.toString(10));
  yRect.setAttribute('y', translateY.toString(10));
  yRect.setAttribute('width', '2');
  yRect.setAttribute('height', innerHeight.toString(10));
  yRect.setAttribute('stroke', 'none');
  yRect.setAttribute('fill', baseColor);

  svg.appendChild(yRect);

  const g = document.createElementNS(xmlns, 'g');

  [1.0, 0.5, 0.0].forEach((amplitude, index) => {
    const text = document.createElementNS(xmlns, 'text');

    text.textContent = amplitude.toFixed(1);

    text.setAttribute('x', '44');
    text.setAttribute('y', (index * (innerHeight / 2) + translateY).toString(10));
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '12px');

    g.appendChild(text);
  });

  for (let k = 0; k < analyser.frequencyBinCount; k++) {
    if (k % 1024 !== 0) {
      continue;
    }

    const x = k * (innerWidth / analyser.frequencyBinCount) + translateX;

    const text = document.createElementNS(xmlns, 'text');

    text.textContent = `${Math.trunc(k * (sampleRate / analyser.fftSize))} Hz`;

    text.setAttribute('x', x);
    text.setAttribute('y', (height - 8).toString(10));
    text.setAttribute('text-anchor', 'start');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '12px');

    g.appendChild(text);
  }

  svg.appendChild(g);

  const xLabel = document.createElementNS(xmlns, 'text');

  xLabel.textContent = 'Frequency (Hz)';

  xLabel.setAttribute('x', width.toString(10));
  xLabel.setAttribute('y', (height - translateY - 8).toString(10));
  xLabel.setAttribute('text-anchor', 'end');
  xLabel.setAttribute('stroke', 'none');
  xLabel.setAttribute('fill', baseColor);
  xLabel.setAttribute('font-size', '14px');

  const yLabel = document.createElementNS(xmlns, 'text');

  yLabel.textContent = 'Amplitude';

  yLabel.setAttribute('x', '28');
  yLabel.setAttribute('y', '12');
  yLabel.setAttribute('text-anchor', 'start');
  yLabel.setAttribute('stroke', 'none');
  yLabel.setAttribute('fill', baseColor);
  yLabel.setAttribute('font-size', '14px');

  svg.appendChild(xLabel);
  svg.appendChild(yLabel);

  let animationId = null;

  const render = () => {
    const data = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(data);

    path.removeAttribute('d');

    let d = '';

    for (let k = 0; k < analyser.frequencyBinCount; k++) {
      const x = k * (innerWidth / analyser.frequencyBinCount) + translateX;
      const y = (1 - data[k] / 255) * innerHeight + translateY;

      if (d === '') {
        d += `M${x} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    path.setAttribute('d', d);

    animationId = window.requestAnimationFrame(() => {
      render();
    });
  };

  const buttonElement = document.getElementById('button-svg-amplitude-spectrum-path-with-coordinate-and-texts-in-uint8');

  let oscillator = null;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      return;
    }

    oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth' });

    oscillator.connect(analyser);
    analyser.connect(audiocontext.destination);

    oscillator.start(0);

    render();

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (oscillator === null) {
      return;
    }

    oscillator.stop(0);

    oscillator = null;

    if (animationId) {
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }

    buttonElement.textContent = 'start';
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);
};

const animateAmplitudeSpectrumUint8WaveToCanvas = (canvas) => {
  const analyser = new AnalyserNode(audiocontext, { fftSize: 16384, maxDecibels: 0, minDecibels: -60 });

  const renderingContext = canvas.getContext('2d');

  const width = canvas.width;
  const height = canvas.height;

  const innerWidth = width - 48;
  const innerHeight = height - 48;
  const translateX = 48;
  const translateY = 24;

  let animationId = null;

  const render = () => {
    const data = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(data);

    renderingContext.clearRect(0, 0, width, height);

    renderingContext.beginPath();

    for (let k = 0; k < analyser.frequencyBinCount; k++) {
      const x = k * (innerWidth / analyser.frequencyBinCount) + translateX;
      const y = (1 - data[k] / 255) * innerHeight + translateY;

      if (k === 0) {
        renderingContext.moveTo(x, y);
      } else {
        renderingContext.lineTo(x, y);
      }
    }

    renderingContext.lineWidth = 1.5;
    renderingContext.strokeStyle = waveColor;

    renderingContext.stroke();

    renderingContext.fillStyle = baseColor;
    renderingContext.fillRect(translateX, height - translateY - 1, innerWidth, 2);
    renderingContext.fillRect(translateX, translateY, 2, innerHeight);

    renderingContext.font = 'Roboto 12px';
    renderingContext.fillStyle = baseColor;

    [1.0, 0.5, 0.0].forEach((amplitude, index) => {
      renderingContext.textAlign = 'end';
      renderingContext.fillText(amplitude.toFixed(1), 44, index * (innerHeight / 2) + translateY);
    });

    for (let k = 0; k < analyser.frequencyBinCount; k++) {
      if (k % 1024 !== 0) {
        continue;
      }

      const x = k * (innerWidth / analyser.frequencyBinCount) + translateX;

      renderingContext.textAlign = 'start';
      renderingContext.fillText(`${k * (sampleRate / analyser.fftSize)} Hz`, x, height - 8);
    }

    renderingContext.font = 'Roboto 16px';

    renderingContext.textAlign = 'end';
    renderingContext.fillText('Frequency (Hz)', width, height - translateY - 8);

    renderingContext.textAlign = 'start';
    renderingContext.fillText('Amplitude', 28, 12);

    animationId = window.requestAnimationFrame(() => {
      render();
    });
  };

  const buttonElement = document.getElementById('button-canvas-amplitude-spectrum-path-with-coordinate-and-texts-in-uint8');

  let oscillator = null;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      return;
    }

    oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth' });

    oscillator.connect(analyser);
    analyser.connect(audiocontext.destination);

    oscillator.start(0);

    render();

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (oscillator === null) {
      return;
    }

    oscillator.stop(0);

    oscillator = null;

    if (animationId) {
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }

    buttonElement.textContent = 'start';
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);
};

const animatePhaseSpectrumToSVG = (svg, button, isActual) => {
  const fftSize = 2048;

  const numberOfPlots = fftSize / 64;

  const width = Number(svg.getAttribute('width') ?? '0');
  const height = Number(svg.getAttribute('height') ?? '0');

  const innerWidth = width - 48;
  const innerHeight = height - 48;
  const translateX = 48;
  const translateY = 24;

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  path.setAttribute('stroke', 'rgb(0 0 255)');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'miter');

  svg.appendChild(path);

  const xRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  xRect.setAttribute('x', translateX.toString(10));
  xRect.setAttribute('y', (height - translateY - 1).toString(10));
  xRect.setAttribute('width', (width - translateX).toString(10));
  xRect.setAttribute('height', '2');
  xRect.setAttribute('stroke', 'none');
  xRect.setAttribute('fill', 'rgb(153 153 153)');

  svg.appendChild(xRect);

  const yRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  yRect.setAttribute('x', translateX.toString(10));
  yRect.setAttribute('y', translateY.toString(10));
  yRect.setAttribute('width', '2');
  yRect.setAttribute('height', (height - translateX).toString(10));
  yRect.setAttribute('stroke', 'none');
  yRect.setAttribute('fill', 'rgb(153 153 153)');

  svg.appendChild(yRect);

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  ['π', 'π/2', '0', '-π/2', '-π'].forEach((radian, index) => {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    text.textContent = `${radian} rad`;

    text.setAttribute('x', '44');
    text.setAttribute('y', (index * (innerHeight / 4) + translateY).toString(10));
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', 'rgb(153 153 153)');
    text.setAttribute('font-size', '12px');

    g.appendChild(text);
  });

  for (let k = 0; k < numberOfPlots; k++) {
    if (k % 2 !== 0) {
      continue;
    }

    const x = k * (innerWidth / numberOfPlots) + translateX;

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    text.textContent = `${Math.trunc(k * (audiocontext.sampleRate / fftSize))} Hz`;

    text.setAttribute('x', x);
    text.setAttribute('y', (height - 8).toString(10));
    text.setAttribute('text-anchor', 'start');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', 'rgb(153 153 153)');
    text.setAttribute('font-size', '12px');

    g.appendChild(text);
  }

  svg.appendChild(g);

  const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');

  xLabel.textContent = 'Frequency (Hz)';

  xLabel.setAttribute('x', width.toString(10));
  xLabel.setAttribute('y', (height - translateY - 8).toString(10));
  xLabel.setAttribute('text-anchor', 'end');
  xLabel.setAttribute('stroke', 'none');
  xLabel.setAttribute('fill', 'rgb(153 153 153)');
  xLabel.setAttribute('font-size', '14px');

  const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');

  yLabel.textContent = 'Phase (radian)';

  yLabel.setAttribute('x', translateY.toString(10));
  yLabel.setAttribute('y', '12');
  yLabel.setAttribute('text-anchor', 'start');
  yLabel.setAttribute('stroke', 'none');
  yLabel.setAttribute('fill', 'rgb(153 153 153)');
  yLabel.setAttribute('font-size', '14px');

  svg.appendChild(xLabel);
  svg.appendChild(yLabel);

  const render = (data) => {
    path.removeAttribute('d');

    let d = '';

    for (let k = 0; k < numberOfPlots; k++) {
      const x = k * (innerWidth / numberOfPlots) + translateX;
      const y = ((Math.PI - data[k]) / Math.PI) * (innerHeight / 2) + translateY;

      if (d === '') {
        d += `M${x} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    path.setAttribute('d', d);
  };

  let processor = null;
  let oscillator = null;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (processor === null) {
      await audiocontext.audioWorklet.addModule('./audio-worklets/phase-spectrum.js');

      processor = new AudioWorkletNode(audiocontext, 'PhaseSpectrumOverlapAddProcessor', {
        processorOptions: {
          frameSize: fftSize,
          isActual
        }
      });

      processor.port.onmessage = (event) => {
        render(event.data);
      };
    }

    if (oscillator !== null) {
      return;
    }

    oscillator = new OscillatorNode(audiocontext);

    oscillator.connect(processor);
    processor.connect(audiocontext.destination);

    oscillator.start(0);

    button.textContent = 'stop';
  };

  const onUp = () => {
    if (oscillator === null) {
      return;
    }

    oscillator.stop(0);

    oscillator = null;

    button.textContent = 'start';
  };

  button.addEventListener('mousedown', onDown);
  button.addEventListener('touchstart', onDown);
  button.addEventListener('mouseup', onUp);
  button.addEventListener('touchend', onUp);
};

const animateLogarithmicScaleAmplitudeSpectrumToSVG = (svg) => {
  const analyser = new AnalyserNode(audiocontext, { fftSize: 16384 });

  const frequencies = [32, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

  const minFrequency = frequencies[0];
  const maxFrequency = frequencies[frequencies.length - 1];

  const ratio = maxFrequency / minFrequency;
  const log10Ratio = Math.log10(ratio);

  const frequencyResolution = sampleRate / analyser.fftSize;

  const width = Number(svg.getAttribute('width') ?? '0');
  const height = Number(svg.getAttribute('height') ?? '0');

  const innerWidth = width - 48;
  const innerHeight = height - 48;
  const translateX = 48;
  const translateY = 24;

  const maxDecibels = 0;
  const minDecibels = -60;

  const path = document.createElementNS(xmlns, 'path');

  path.setAttribute('stroke', waveColor);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth.toString(10));
  path.setAttribute('stroke-linecap', lineCap);
  path.setAttribute('stroke-linejoin', lineJoin);

  svg.appendChild(path);

  const xRect = document.createElementNS(xmlns, 'rect');

  xRect.setAttribute('x', translateX.toString(10));
  xRect.setAttribute('y', (height - translateY - 1).toString(10));
  xRect.setAttribute('width', (width - translateX).toString(10));
  xRect.setAttribute('height', lineWidth.toString(10));
  xRect.setAttribute('stroke', 'none');
  xRect.setAttribute('fill', baseColor);

  svg.appendChild(xRect);

  const yRect = document.createElementNS(xmlns, 'rect');

  yRect.setAttribute('x', translateX.toString(10));
  yRect.setAttribute('y', translateY.toString(10));
  yRect.setAttribute('width', lineWidth.toString(10));
  yRect.setAttribute('height', (height - translateX).toString(10));
  yRect.setAttribute('stroke', 'none');
  yRect.setAttribute('fill', baseColor);

  svg.appendChild(yRect);

  const g = document.createElementNS(xmlns, 'g');

  [0, -10, -20, -30, -40, -50, -60].forEach((dB, index) => {
    const text = document.createElementNS(xmlns, 'text');

    text.textContent = `${dB} dB`;

    text.setAttribute('x', '44');
    text.setAttribute('y', (index * (innerHeight / 6) + translateY).toString(10));
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '12px');

    g.appendChild(text);
  });

  frequencies.forEach((frequency, index) => {
    const x = index * (innerWidth / frequencies.length) + translateX;
    const y = height - 8;

    const text = document.createElementNS(xmlns, 'text');

    if (frequency >= 1000) {
      text.textContent = `${Math.trunc(frequency / 1000)} kHz`;
    } else {
      text.textContent = `${frequency} Hz`;
    }

    text.setAttribute('x', x.toString(10));
    text.setAttribute('y', y.toString(10));
    text.setAttribute('text-anchor', 'start');
    text.setAttribute('stroke', 'none');
    text.setAttribute('fill', baseColor);
    text.setAttribute('font-size', '12px');

    g.appendChild(text);
  });

  svg.appendChild(g);

  const xLabel = document.createElementNS(xmlns, 'text');

  xLabel.textContent = 'Frequency (Hz)';

  xLabel.setAttribute('x', width.toString(10));
  xLabel.setAttribute('y', (height - translateY - 8).toString(10));
  xLabel.setAttribute('text-anchor', 'end');
  xLabel.setAttribute('stroke', 'none');
  xLabel.setAttribute('fill', baseColor);
  xLabel.setAttribute('font-size', '14px');

  const yLabel = document.createElementNS(xmlns, 'text');

  yLabel.textContent = 'Amplitude (dB)';

  yLabel.setAttribute('x', translateY.toString(10));
  yLabel.setAttribute('y', '12');
  yLabel.setAttribute('text-anchor', 'start');
  yLabel.setAttribute('stroke', 'none');
  yLabel.setAttribute('fill', baseColor);
  yLabel.setAttribute('font-size', '14px');

  svg.appendChild(xLabel);
  svg.appendChild(yLabel);

  let animationId = null;

  const render = () => {
    const data = new Float32Array(analyser.frequencyBinCount);

    analyser.getFloatFrequencyData(data);

    path.removeAttribute('d');

    let d = '';

    for (let k = 0; k < analyser.frequencyBinCount; k++) {
      if (k === 0) {
        continue;
      }

      // for Chrome
      if (!Number.isFinite(data[k])) {
        continue;
      }

      const frequency = k * frequencyResolution;

      const x = (Math.log10(frequency / minFrequency) / log10Ratio) * innerWidth + translateX;
      const y = Math.min((0 - data[k]) * (innerHeight / (maxDecibels - minDecibels)) - translateY, height - translateY);

      if (x < translateX) {
        continue;
      }

      if (d === '') {
        d += `M${translateX} ${translateY + innerHeight}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    path.setAttribute('d', d);

    animationId = window.requestAnimationFrame(() => {
      render();
    });
  };

  const buttonElement = document.getElementById('button-svg-logarithmic-scale-amplitude-spectrum');

  let oscillator = null;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      return;
    }

    oscillator = new OscillatorNode(audiocontext, { type: 'sawtooth' });

    oscillator.connect(analyser);
    analyser.connect(audiocontext.destination);

    oscillator.start(0);

    render();

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (oscillator === null) {
      return;
    }

    oscillator.stop(0);

    oscillator = null;

    if (animationId) {
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }

    buttonElement.textContent = 'start';
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);
};

const animateTimeOverviewAudioData = () => {
  let source = null;
  let audioBuffer = null;

  let rendered = false;

  let animationId = null;
  let startTime = 0;

  const width = 720;
  const height = 180;

  const innerWidth = width - 48;
  const innerHeight = height - 48;
  const translateX = 24;
  const translateY = 24;

  const currentTimeRects = [];

  const render = (svg, data, channelNumber, sampleRate, length) => {
    const samplingPeriod = 1 / sampleRate;

    const plotInterval = Math.max(Math.trunc(sampleRate / 10), 1);
    const textInterval = Math.max(Math.trunc(60 * sampleRate), 1);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    let d = '';

    for (let n = 0; n < length; n++) {
      if (n % plotInterval !== 0) {
        continue;
      }

      const x = n * (innerWidth / length) + translateX;
      const y = (1 - data[n]) * (innerHeight / 2) + translateY;

      if (d === '') {
        d += `M${x} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    path.setAttribute('d', d);

    path.setAttribute('stroke', 'rgba(0 0 255 / 30%)');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'miter');

    svg.appendChild(path);

    const xRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    xRect.setAttribute('x', translateX.toString(10));
    xRect.setAttribute('y', (innerHeight / 2 + translateY - 1).toString(10));
    xRect.setAttribute('width', innerWidth.toString(10));
    xRect.setAttribute('height', '2');
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', 'rgb(99 99 99)');

    svg.appendChild(xRect);

    const yRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    yRect.setAttribute('x', translateX.toString(10));
    yRect.setAttribute('y', translateY.toString(10));
    yRect.setAttribute('width', '2');
    yRect.setAttribute('height', innerHeight.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', 'rgb(99 99 99)');

    svg.appendChild(yRect);

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    [1.0, 0.0, -1.0].forEach((amplitude, index) => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

      text.textContent = amplitude.toFixed(1);
      text.setAttribute('x', (translateX - 4).toString(10));
      text.setAttribute('y', ((1 - amplitude) * (innerHeight / 2) + translateY).toString(10));
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', 'rgb(99 99 99)');
      text.setAttribute('font-size', '12px');

      g.appendChild(text);
    });

    for (let n = 0; n < length; n++) {
      if (n % textInterval !== 0) {
        continue;
      }

      const x = n * (innerWidth / length) + translateX;

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

      text.textContent = `${n * samplingPeriod} sec`;

      text.setAttribute('x', (x + 4).toString(10));
      text.setAttribute('y', (innerHeight / 2 + translateY + 12).toString(10));
      text.setAttribute('text-anchor', 'start');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', 'rgb(99 99 99)');
      text.setAttribute('font-size', '12px');

      g.appendChild(text);
    }

    svg.appendChild(g);

    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    xLabel.textContent = 'Time';

    xLabel.setAttribute('x', innerWidth.toString(10));
    xLabel.setAttribute('y', (innerHeight / 2 + translateY - 8).toString(10));
    xLabel.setAttribute('text-anchor', 'end');
    xLabel.setAttribute('stroke', 'none');
    xLabel.setAttribute('fill', 'rgb(99 99 99)');
    xLabel.setAttribute('font-size', '14px');

    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    yLabel.textContent = 'Amplitude';

    yLabel.setAttribute('x', (translateX / 2).toString(10));
    yLabel.setAttribute('y', (translateY / 2).toString(10));
    yLabel.setAttribute('text-anchor', 'start');
    yLabel.setAttribute('stroke', 'none');
    yLabel.setAttribute('fill', 'rgb(99 99 99)');
    yLabel.setAttribute('font-size', '14px');

    svg.appendChild(xLabel);
    svg.appendChild(yLabel);

    const currentTimeRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    currentTimeRect.setAttribute('x', translateX.toString(10));
    currentTimeRect.setAttribute('y', translateY.toString(10));
    currentTimeRect.setAttribute('width', '0');
    currentTimeRect.setAttribute('height', innerHeight.toString(10));
    currentTimeRect.setAttribute('stroke', 'none');
    currentTimeRect.setAttribute('fill', 'rgba(255 0 255 / 10%)');

    svg.appendChild(currentTimeRect);

    currentTimeRects.push(currentTimeRect);
  };

  fetch('./assets/medias/Schubert-Symphony-No8-Unfinished-1st-2020-VR.mp3')
    .then((response) => {
      return response.arrayBuffer();
    })
    .then(async (arrayBuffer) => {
      const onClick = async () => {
        buttonElement.setAttribute('disabled', 'disabled');

        if (audiocontext.state !== 'running') {
          await audiocontext.resume();
        }

        if (audioBuffer === null) {
          buttonElement.textContent = 'decoding ...';

          audioBuffer = await audiocontext.decodeAudioData(arrayBuffer);
        }

        if (source === null) {
          const sampleRate = audioBuffer.sampleRate;
          const length = audioBuffer.length;
          const duration = audioBuffer.duration;
          const numberOfChannels = audioBuffer.numberOfChannels;

          if (!rendered) {
            buttonElement.textContent = 'rendering ...';

            for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
              render(
                document.getElementById(`svg-animation-time-overview-channel-${channelNumber}`),
                audioBuffer.getChannelData(channelNumber),
                channelNumber,
                sampleRate,
                length
              );
            }

            rendered = true;
          }

          source = new AudioBufferSourceNode(audiocontext, { buffer: audioBuffer });

          source.connect(audiocontext.destination);

          startTime = audiocontext.currentTime;

          source.start(0);

          const animate = () => {
            const currentTime = audiocontext.currentTime - startTime;

            if (currentTime > duration) {
              for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
                currentTimeRects[channelNumber].setAttribute('width', '0');
              }

              window.cancelAnimationFrame(animationId);
              animationId = null;

              buttonElement.textContent = 'start';

              return;
            }

            const width = currentTime * sampleRate * (innerWidth / length);

            for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
              currentTimeRects[channelNumber].setAttribute('width', width.toString(10));
            }

            animationId = window.requestAnimationFrame(animate);
          };

          animationId = animate();

          buttonElement.textContent = 'stop';
        } else {
          source.stop(0);

          source.disconnect();

          source = null;

          window.cancelAnimationFrame(animationId);
          animationId = null;

          buttonElement.textContent = 'start';
        }

        buttonElement.removeAttribute('disabled');
      };

      const buttonElement = document.getElementById('button-svg-animation-time-overview');

      buttonElement.addEventListener('click', onClick);
    })
    .catch(console.error);
};

const animatePeriodicWave = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const analyser = new AnalyserNode(audiocontext, { fftSize: 2048, maxDecibels: -9, minDecibels: -60 });

  const frequencies = [125, 250, 500, 1000, 2000, 4000, 8000];

  const minFrequency = frequencies[0];
  const maxFrequency = frequencies[frequencies.length - 1];

  const ratio = maxFrequency / minFrequency;
  const log10Ratio = Math.log10(ratio);

  const frequencyResolution = sampleRate / analyser.fftSize;

  const numberOfOvertones = 8;

  const width = innerWidth / 3;
  const offset = 1.5 * width;

  const timeDomainPath = document.createElementNS(xmlns, 'path');
  const spectrumPath = document.createElementNS(xmlns, 'path');

  [timeDomainPath, spectrumPath].forEach((path) => {
    path.setAttribute('stroke', waveColor);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', lineWidth.toString(10));
    path.setAttribute('stroke-linecap', lineCap);
    path.setAttribute('stroke-linejoin', lineJoin);

    svg.appendChild(path);
  });

  const renderTimeDomainGraph = (offset, width) => {
    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (offset + padding).toString(10));
    xRect.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
    xRect.setAttribute('width', width.toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    svg.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (offset + padding - 1).toString(10));
    yRect.setAttribute('y', padding.toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', innerHeight.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    svg.appendChild(yRect);

    [1, 0, -1].forEach((amplitude, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = amplitude.toFixed(1);

      text.setAttribute('x', (offset + padding - 4).toString(10));
      text.setAttribute('y', (index * (innerHeight / 2) + padding).toString(10));
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '12px');

      svg.appendChild(text);
    });

    const xLabel = document.createElementNS(xmlns, 'text');

    xLabel.textContent = 'Time';

    xLabel.setAttribute('x', (offset + padding + width).toString(10));
    xLabel.setAttribute('y', (padding + innerHeight / 2 - 8).toString(10));
    xLabel.setAttribute('text-anchor', 'end');
    xLabel.setAttribute('stroke', 'none');
    xLabel.setAttribute('fill', baseColor);
    xLabel.setAttribute('font-size', '14px');

    svg.appendChild(xLabel);

    const yLabel = document.createElementNS(xmlns, 'text');

    yLabel.textContent = 'Amplitude';

    yLabel.setAttribute('x', padding.toString(10));
    yLabel.setAttribute('y', (padding / 2).toString(10));
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('stroke', 'none');
    yLabel.setAttribute('fill', baseColor);
    yLabel.setAttribute('font-size', '14px');

    svg.appendChild(yLabel);
  };

  const renderSpectrumGraph = (offset, width) => {
    const xRect = document.createElementNS(xmlns, 'rect');

    xRect.setAttribute('x', (offset + padding).toString(10));
    xRect.setAttribute('y', (padding + innerHeight).toString(10));
    xRect.setAttribute('width', width.toString(10));
    xRect.setAttribute('height', lineWidth.toString(10));
    xRect.setAttribute('stroke', 'none');
    xRect.setAttribute('fill', baseColor);

    svg.appendChild(xRect);

    const yRect = document.createElementNS(xmlns, 'rect');

    yRect.setAttribute('x', (offset + padding).toString(10));
    yRect.setAttribute('y', padding.toString(10));
    yRect.setAttribute('width', lineWidth.toString(10));
    yRect.setAttribute('height', innerHeight.toString(10));
    yRect.setAttribute('stroke', 'none');
    yRect.setAttribute('fill', baseColor);

    svg.appendChild(yRect);

    const g = document.createElementNS(xmlns, 'g');

    [1, 0.5, 0].forEach((amplitude, index) => {
      const text = document.createElementNS(xmlns, 'text');

      text.textContent = amplitude.toFixed(1);

      text.setAttribute('x', (offset + padding - 4).toString(10));
      text.setAttribute('y', (index * (innerHeight / 2) + padding).toString(10));
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '12px');

      g.appendChild(text);
    });

    frequencies.forEach((frequency, index) => {
      const x = index * (width / frequencies.length) + (offset + padding);
      const y = padding + innerHeight + 12;

      const text = document.createElementNS(xmlns, 'text');

      if (frequency >= 1000) {
        text.textContent = `${Math.trunc(frequency / 1000)} kHz`;
      } else {
        text.textContent = `${frequency} Hz`;
      }

      text.setAttribute('x', x.toString(10));
      text.setAttribute('y', y.toString(10));
      text.setAttribute('text-anchor', 'start');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '12px');

      g.appendChild(text);
    });

    svg.appendChild(g);

    const xLabel = document.createElementNS(xmlns, 'text');

    xLabel.textContent = 'Frequency (Hz)';

    xLabel.setAttribute('x', (offset + padding + width).toString(10));
    xLabel.setAttribute('y', (padding + innerHeight - 8).toString(10));
    xLabel.setAttribute('text-anchor', 'end');
    xLabel.setAttribute('stroke', 'none');
    xLabel.setAttribute('fill', baseColor);
    xLabel.setAttribute('font-size', '14px');

    const yLabel = document.createElementNS(xmlns, 'text');

    yLabel.textContent = 'Amplitude';

    yLabel.setAttribute('x', (offset + padding).toString(10));
    yLabel.setAttribute('y', (padding / 2).toString(10));
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('stroke', 'none');
    yLabel.setAttribute('fill', baseColor);
    yLabel.setAttribute('font-size', '14px');

    svg.appendChild(xLabel);
    svg.appendChild(yLabel);
  };

  let animationId = null;

  const renderTimeDomain = (offset, width) => {
    const data = new Float32Array(analyser.fftSize);

    analyser.getFloatTimeDomainData(data);

    timeDomainPath.removeAttribute('d');

    let d = '';

    for (let n = 0; n < analyser.fftSize; n++) {
      const x = n * (width / analyser.fftSize) + (offset + padding);
      const y = (1 - data[n]) * (innerHeight / 2) + padding;

      if (d === '') {
        d += `M${x} ${y}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    timeDomainPath.setAttribute('d', d);
  };

  const renderSpectrum = (offset, width) => {
    const data = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(data);

    spectrumPath.removeAttribute('d');

    let d = '';

    for (let k = 0; k < analyser.frequencyBinCount; k++) {
      if (k === 0) {
        continue;
      }

      const frequency = k * frequencyResolution;

      const ratio = frequency / minFrequency;

      const x = (Math.log10(ratio) / log10Ratio) * width + (offset + padding);
      const y = (1 - data[k] / 255) * innerHeight + padding;

      if (x < offset + padding || x > offset + padding + width) {
        continue;
      }

      if (d === '') {
        d += `M${offset + padding} ${padding + innerHeight}`;
      } else {
        d += ` L${x} ${y}`;
      }
    }

    spectrumPath.setAttribute('d', d);
  };

  const render = () => {
    renderTimeDomain(0, width);
    renderSpectrum(offset, width);

    animationId = window.requestAnimationFrame(() => {
      render();
    });
  };

  const buttonElement = document.getElementById('button-periodic-wave');
  const rangeOscillatorFrequencyElement = document.getElementById('range-periodic-wave-oscillator-frequency');
  const spanPrintOscillatorFrequencyElement = document.getElementById('print-periodic-wave-oscillator-frequency-value');

  let oscillator = null;
  let frequency = 440;

  const reals = new Float32Array(numberOfOvertones + 1);
  const imags = new Float32Array(numberOfOvertones + 1);

  reals[0] = 0;
  imags[0] = 0;

  reals[1] = 0;
  imags[1] = 1;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      return;
    }

    const periodicWave = new PeriodicWave(audiocontext, { real: reals, imag: imags });

    oscillator = new OscillatorNode(audiocontext, { frequency });

    oscillator.setPeriodicWave(periodicWave);

    oscillator.connect(analyser);
    analyser.connect(audiocontext.destination);

    oscillator.start(0);

    render();

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (oscillator === null) {
      return;
    }

    oscillator.stop(0);

    oscillator = null;

    if (animationId) {
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }

    buttonElement.textContent = 'start';
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);

  rangeOscillatorFrequencyElement.addEventListener('input', (event) => {
    frequency = event.currentTarget.valueAsNumber;

    if (oscillator) {
      oscillator.frequency.value = frequency;
    }

    spanPrintOscillatorFrequencyElement.textContent = `${frequency} Hz`;
  });

  [1, 2, 3, 4, 5, 6, 7, 8].forEach((overtone) => {
    document.getElementById(`range-periodic-wave-real-${overtone}`).addEventListener('input', (event) => {
      const real = event.currentTarget.valueAsNumber;

      reals[overtone] = real;

      const periodicWave = new PeriodicWave(audiocontext, { real: reals, imag: imags });

      if (oscillator) {
        oscillator.setPeriodicWave(periodicWave);
      }

      document.getElementById(`print-periodic-wave-real-${overtone}`).textContent = real.toFixed(2);
    });

    document.getElementById(`range-periodic-wave-imag-${overtone}`).addEventListener('input', (event) => {
      const imag = event.currentTarget.valueAsNumber;

      imags[overtone] = imag;

      const periodicWave = new PeriodicWave(audiocontext, { real: reals, imag: imags });

      if (oscillator) {
        oscillator.setPeriodicWave(periodicWave);
      }

      document.getElementById(`print-periodic-wave-imag-${overtone}`).textContent = imag.toFixed(2);
    });
  });

  renderTimeDomainGraph(0, width);
  renderSpectrumGraph(offset, width);
};

const mediaRecorder = () => {
  const destination = new MediaStreamAudioDestinationNode(audiocontext);

  const recorder = new MediaRecorder(destination.stream);

  const chunks = [];

  const buttonElement = document.getElementById('button-media-stream-audio-destination-node-and-media-recorder');
  const audioElement = document.getElementById('audio-media-stream-audio-destination-node-and-media-recorder');
  const anchorElement = document.getElementById('anchor-media-stream-audio-destination-node-and-media-recorder');

  let oscillator = null;

  buttonElement.addEventListener('click', async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator === null) {
      oscillator = new OscillatorNode(audiocontext);

      oscillator.connect(destination);
      oscillator.connect(audiocontext.destination);

      recorder.start();
      oscillator.start(0);

      buttonElement.textContent = 'stop';
    } else {
      recorder.stop();
      oscillator.stop(0);

      oscillator = null;

      buttonElement.textContent = 'start';
    }
  });

  recorder.ondataavailable = (event) => {
    chunks.push(event.data);
  };

  recorder.onstop = async () => {
    const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
    const url = window.URL.createObjectURL(blob);

    audioElement.setAttribute('src', url);

    anchorElement.setAttribute('href', url);
    anchorElement.setAttribute('download', 'sine.ogg');
  };
};

const selectOutputDeviceBySinkId = () => {
  const constraints = {
    audio: true
  };

  const buttonPermissionElement = document.getElementById('button-output-device-by-sink-id-permission');
  const buttonElement = document.getElementById('button-output-device-by-sink-id');

  buttonPermissionElement.addEventListener('click', async () => {
    buttonPermissionElement.setAttribute('disabled', 'disabled');

    await navigator.mediaDevices.getUserMedia(constraints);

    const deviceInfos = await navigator.mediaDevices.enumerateDevices();

    const outputDeviceInfos = deviceInfos.filter((deviceInfo) => {
      return deviceInfo.kind === 'audiooutput';
    });

    const fragmentOutputDevices = document.createDocumentFragment();

    outputDeviceInfos.forEach((deviceInfo) => {
      const optionElement = document.createElement('option');

      optionElement.setAttribute('value', deviceInfo.deviceId);

      const textNode = document.createTextNode(deviceInfo.label);

      optionElement.appendChild(textNode);

      fragmentOutputDevices.appendChild(optionElement);
    });

    const selectOutputDevicesElement = document.getElementById('select-output-device-by-sink-id');

    selectOutputDevicesElement.appendChild(fragmentOutputDevices);

    selectOutputDevicesElement.addEventListener('change', async (event) => {
      const deviceId = event.target.value;

      if (typeof audiocontext.setSinkId === 'function') {
        await audiocontext.setSinkId(deviceId);
      }

      if ('onsinkchange' in audiocontext) {
        audiocontext.onsinkchange = (event) => {
          console.dir(event);
        };
      }

      if ('onerror' in audiocontext) {
        audiocontext.onerror = (error) => {
          console.dir(error);
        };
      }
    });
  });

  let oscillator = null;

  const onDown = async () => {
    if (audiocontext.state !== 'running') {
      await audiocontext.resume();
    }

    if (oscillator !== null) {
      return;
    }

    oscillator = new OscillatorNode(audiocontext);

    // OscillatorNode (Input) -> AudioDestinationNode (Output)
    oscillator.connect(audiocontext.destination);

    // Start immediately
    oscillator.start(0);

    buttonElement.textContent = 'stop';
  };

  const onUp = () => {
    if (oscillator === null) {
      return;
    }

    oscillator.stop(0);
    oscillator.disconnect(0);

    oscillator = null;

    buttonElement.textContent = 'start';
  };

  buttonElement.addEventListener('mousedown', onDown);
  buttonElement.addEventListener('touchstart', onDown);
  buttonElement.addEventListener('mouseup', onUp);
  buttonElement.addEventListener('touchend', onUp);
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

createNodeConnectionsForTremolo(document.getElementById('svg-figure-node-connections-for-tremolo'));

tremolo();

createNodeConnectionsForRingmodulator(document.getElementById('svg-figure-node-connections-for-ringmodulator'));

ringmodulator();

animateAM(document.getElementById('svg-animation-amplitude-modulation-time'), document.getElementById('svg-animation-amplitude-modulation-spectrum'));

renderFrequencyResponse(document.getElementById('svg-figure-filter-response-lowpass'), 'lowpass');
renderFrequencyResponse(document.getElementById('svg-figure-filter-response-highpass'), 'highpass');
renderFrequencyResponse(document.getElementById('svg-figure-filter-response-bandpass'), 'bandpass');
renderFrequencyResponse(document.getElementById('svg-figure-filter-response-lowshelf'), 'lowshelf');
renderFrequencyResponse(document.getElementById('svg-figure-filter-response-highshelf'), 'highshelf');
renderFrequencyResponse(document.getElementById('svg-figure-filter-response-peaking'), 'peaking');
renderFrequencyResponse(document.getElementById('svg-figure-filter-response-notch'), 'notch');
renderFrequencyResponse(document.getElementById('svg-figure-filter-response-allpass'), 'allpass');

createIIRFilter(document.getElementById('svg-figure-iir-filter'));

createNodeConnectionsFor3BandsEqualizer(document.getElementById('svg-figure-node-connections-for-3-bands-equalizer'));

renderFrequencyResponse3BandsEqualizer(document.getElementById('svg-figure-filter-response-3-bands-equalizer'));

equalizer3bands();

createNodeConnectionsForGraphicEqualizer(document.getElementById('svg-figure-node-connections-for-graphic-equalizer'));

renderFrequencyResponseGraphicEqualizer(document.getElementById('svg-figure-filter-response-graphic-equalizer'));

equalizerGraphic();

renderWahPrinciple(document.getElementById('svg-figure-wah-principle'));

createNodeConnectionsForPedalWah(document.getElementById('svg-figure-node-connections-for-pedal-wah'));

pedalWah();

vcfAutoWah();

createNodeConnectionsForAutoWah(document.getElementById('svg-figure-node-connections-for-auto-wah'));

autoWah();

createClipping(document.getElementById('svg-figure-clipping'));
createCurveTable(document.getElementById('svg-figure-wave-shaper-node-curve'));
createNodeConnectionsForWaveShaperNode(document.getElementById('svg-figure-node-connections-for-wave-shaper-node'));

createAsymmetricalClipping(document.getElementById('svg-figure-asymmetrical-clipping'));
createSoftAndHardClipping(document.getElementById('svg-figure-soft-and-hard-clipping'));

createRectification(document.getElementById('svg-figure-rectification'));
createFuzz(document.getElementById('svg-figure-fuzz'));

createNodeConnectionsForAmpSimulator(document.getElementById('svg-figure-node-connections-for-pre-amplifier'), false);
createNodeConnectionsForAmpSimulator(document.getElementById('svg-figure-node-connections-for-amp-simulator'), true);

distortion();

createNodeConnectionsForDynamicsCompressorNode(document.getElementById('svg-figure-node-connections-for-dynamics-compressor-node'));
createCompressorParameters(document.getElementById('svg-figure-compressor-parameters'));
createCompressorLowerAndRaiseVolumeByCompressorCurve(document.getElementById('svg-figure-compressor-lower-volume-and-raise-volume-by-compressor-curve'));
createCompressorLowerAndRaiseVolume(document.getElementById('svg-figure-compressor-lower-volume-and-raise-volume'));

createNodeConnectionsForAutoPanner(document.getElementById('svg-figure-node-connections-for-auto-panner'));

autopanner();

createNodeConnectionsForAutoPannerByTremolo(document.getElementById('svg-figure-node-connections-for-auto-panner-by-tremolo'));

autopannerByTremolo();

glide();

animateTimeAndFrequencyResolution128(
  document.getElementById('svg-animation-time-and-frequency-high-resolution-time'),
  document.getElementById('svg-animation-time-and-frequency-low-resolution-spectrum')
);

animateTimeAndFrequencyResolution2048(
  document.getElementById('svg-animation-time-and-frequency-low-resolution-time'),
  document.getElementById('svg-animation-time-and-frequency-high-resolution-spectrum')
);

createOverlapAddWithoutWindowFunction(document.getElementById('svg-figure-overlap-add-without-window-function'));
createDFTSizeAndPeriod(document.getElementById('svg-figure-dft-size-and-period'));

createWindowFunctionSpectrum(document.getElementById('svg-figure-window-function-spectrum'));

animateWindowFunctions(document.getElementById('svg-animation-window-functions-time'), document.getElementById('svg-animation-window-functions-spectrum'));

createOverlapAddWithWindowFunction(document.getElementById('svg-figure-overlap-add-with-window-function'));
createOverlapAddByOverlapAddProcessor(document.getElementById('svg-figure-overlap-add-by-overlap-add-processor'));
createOverlapAddByOverlapAddProcessorWithWindowFunction(document.getElementById('svg-figure-overlap-add-by-overlap-add-processor-with-window-function'));

noisesuppressor();

animateWhiteNoiseSpectrums(
  document.getElementById('svg-animation-white-noise-time'),
  document.getElementById('svg-animation-white-noise-amplitude-spectrum'),
  document.getElementById('svg-animation-white-noise-phase-spectrum')
);

createResampling(document.getElementById('svg-figure-resampling'));
createTimeStretchFast(document.getElementById('svg-figure-time-stretch-fast'));
createTimeStretchSlow(document.getElementById('svg-figure-time-stretch-slow'));

pitchshifter();

vocalcanceler();

create3DimensionalCoordinate(document.getElementById('svg-figure-3-dimensional-coordinate'));

animateVectors(document.getElementById('svg-animation-vectors'));

createNodeConnectionsForPannerNode(document.getElementById('svg-figure-node-connections-for-panner-node'));

createPannerNodePosition(document.getElementById('svg-figure-panner-node-position'));

createPannerNodeOrientation(document.getElementById('svg-figure-panner-node-orientation'));

createSoundCone(document.getElementById('svg-figure-sound-cone'));

createAudioListenerPosition(document.getElementById('svg-figure-audio-listener-position'));

createAudioListenerForward(document.getElementById('svg-figure-audio-listener-forward'));

createAudioListenerUp(document.getElementById('svg-figure-audio-listener-up'));

createMappingAmplitudeAndHeight(document.getElementById('svg-figure-mapping-amplitude-and-height-in-float32'), false);

createSamplingPeriodToTimeText(document.getElementById('svg-figure-sampling-period-to-time-text'));

animateTimeDomainWaveToSVG(
  document.getElementById('svg-animation-time-domain-wave-path'),
  document.getElementById('button-svg-time-domain-wave-path'),
  false,
  false
);

animateTimeDomainWaveToCanvas(
  document.getElementById('canvas-animation-time-domain-wave-path'),
  document.getElementById('button-canvas-time-domain-wave-path'),
  false,
  false
);

animateTimeDomainWaveToSVG(
  document.getElementById('svg-animation-time-domain-wave-path-with-coordinate'),
  document.getElementById('button-svg-time-domain-wave-path-with-coordinate'),
  true,
  false
);

animateTimeDomainWaveToCanvas(
  document.getElementById('canvas-animation-time-domain-wave-path-with-coordinate'),
  document.getElementById('button-canvas-time-domain-wave-path-with-coordinate'),
  true,
  false
);

animateTimeDomainWaveToSVG(
  document.getElementById('svg-animation-time-domain-wave-path-with-coordinate-and-texts'),
  document.getElementById('button-svg-time-domain-wave-path-with-coordinate-and-texts'),
  true,
  true
);

animateTimeDomainWaveToCanvas(
  document.getElementById('canvas-animation-time-domain-wave-path-with-coordinate-and-texts'),
  document.getElementById('button-canvas-time-domain-wave-path-with-coordinate-and-texts'),
  true,
  true
);

createMappingAmplitudeAndHeight(document.getElementById('svg-figure-mapping-amplitude-and-height-in-uint8'), true);

animateTimeDomainUint8WaveToSVG(document.getElementById('svg-animation-time-domain-wave-path-with-coordinate-and-texts-in-uint8'));
animateTimeDomainUint8WaveToCanvas(document.getElementById('canvas-animation-time-domain-wave-path-with-coordinate-and-texts-in-uint8'));

createMappingAmplitudeSpectrumAndHeight(document.getElementById('svg-figure-mapping-amplitude-spectrum-and-height-in-float32'));

createFrequencyResolutionToFrequencyText(document.getElementById('svg-figure-frequency-resolution-to-frequency-text'));

animateAmplitudeSpectrumToSVG(
  document.getElementById('svg-animation-amplitude-spectrum-path'),
  document.getElementById('button-svg-animation-spectrum-path'),
  false,
  false
);

animateAmplitudeSpectrumToCanvas(
  document.getElementById('canvas-animation-amplitude-spectrum-path'),
  document.getElementById('button-canvas-animation-spectrum-path'),
  false,
  false
);

animateAmplitudeSpectrumToSVG(
  document.getElementById('svg-animation-amplitude-spectrum-path-with-coordinate'),
  document.getElementById('button-svg-amplitude-spectrum-path-with-coordinate'),
  true,
  false
);

animateAmplitudeSpectrumToCanvas(
  document.getElementById('canvas-animation-amplitude-spectrum-path-with-coordinate'),
  document.getElementById('button-canvas-amplitude-spectrum-path-with-coordinate'),
  true,
  false
);

animateAmplitudeSpectrumToSVG(
  document.getElementById('svg-animation-amplitude-spectrum-path-with-coordinate-and-texts'),
  document.getElementById('button-svg-amplitude-spectrum-path-with-coordinate-and-texts'),
  true,
  true
);

animateAmplitudeSpectrumToCanvas(
  document.getElementById('canvas-animation-amplitude-spectrum-path-with-coordinate-and-texts'),
  document.getElementById('button-canvas-amplitude-spectrum-path-with-coordinate-and-texts'),
  true,
  true
);

createMappingGetFloatFrequencyDataToGetByteFrequencyData(document.getElementById('svg-figure-relation-get-float-frequency-data-and-get-byte-frequency-data'));
createMappingNormalizedAmplitudeSpectrumAndHeight(document.getElementById('svg-figure-mapping-amplitude-spectrum-and-height-in-uint8'));

animateAmplitudeSpectrumUint8WaveToSVG(document.getElementById('svg-animation-amplitude-spectrum-path-with-coordinate-and-texts-in-uint8'));
animateAmplitudeSpectrumUint8WaveToCanvas(document.getElementById('canvas-animation-amplitude-spectrum-path-with-coordinate-and-texts-in-uint8'));

animatePhaseSpectrumToSVG(
  document.getElementById('svg-animation-phase-spectrum-path-with-coordinate-and-texts'),
  document.getElementById('button-svg-phase-spectrum-path-with-coordinate-and-texts'),
  true
);

animatePhaseSpectrumToSVG(
  document.getElementById('svg-animation-440-hz-sin-phase-spectrum-path-with-coordinate-and-texts'),
  document.getElementById('button-svg-440-hz-sin-phase-spectrum-path-with-coordinate-and-texts'),
  false
);

animateLogarithmicScaleAmplitudeSpectrumToSVG(document.getElementById('svg-animation-logarithmic-scale-amplitude-spectrum'));

animateTimeOverviewAudioData();

animatePeriodicWave(document.getElementById('svg-animation-periodic-wave'));

mediaRecorder();

selectOutputDeviceBySinkId();
