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
