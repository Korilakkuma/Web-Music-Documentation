'use strict';

const sampleRate = 48000;

const xmlns = 'http://www.w3.org/2000/svg';

const padding = 60;

const lineWidth = 2;
const lineCap = 'round';
const lineJoin = 'miter';

const baseColor = 'rgba(153 153 153)';

const createCoordinateRect = (svg) => {
  const innerWidth = Number(svg.getAttribute('width')) - padding * 2;
  const innerHeight = Number(svg.getAttribute('height')) - padding * 2;

  const a = Number(svg.getAttribute('data-a'));
  const f = Number(svg.getAttribute('data-f'));

  const xRect = document.createElementNS(xmlns, 'rect');

  xRect.setAttribute('x', (padding / 2).toString(10));
  xRect.setAttribute('y', (padding + innerHeight / 2 - 1).toString(10));
  xRect.setAttribute('width', (innerWidth + padding).toString(10));
  xRect.setAttribute('height', lineWidth);
  xRect.setAttribute('stroke', 'none');
  xRect.setAttribute('fill', baseColor);

  svg.appendChild(xRect);

  const yRect = document.createElementNS(xmlns, 'rect');

  yRect.setAttribute('x', (padding - 1).toString(10));
  yRect.setAttribute('y', padding.toString(10));
  yRect.setAttribute('width', lineWidth);
  yRect.setAttribute('height', innerHeight);
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

    [a, -1 * a].forEach((amplitude, index) => {
      const rect = document.createElementNS(xmlns, 'rect');

      rect.setAttribute('x', (padding / 2).toString(10));
      rect.setAttribute('y', (padding + (innerHeight / 2) * (1 - amplitude)).toString(10));
      rect.setAttribute('width', (innerWidth + padding).toString(10));
      rect.setAttribute('height', lineWidth);
      rect.setAttribute('stroke', 'none');
      rect.setAttribute('fill', 'rgba(153 153 153 / 30%)');

      svg.appendChild(rect);

      const text = document.createElementNS(xmlns, 'text');

      text.textContent = amplitude.toString(10);

      text.setAttribute('x', (padding + 8).toString(10));
      text.setAttribute('y', (padding + (innerHeight / 2) * (1 - amplitude) + 16).toString(10));

      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('stroke', 'none');
      text.setAttribute('fill', baseColor);
      text.setAttribute('font-size', '16px');

      svg.appendChild(text);
    });
  }
};

const createSinFunctionPath = (svg, withParameters) => {
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

  path.setAttribute('stroke', 'rgba(0, 0, 255, 1.0)');
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

  path.setAttribute('stroke', 'rgba(0, 0, 255, 1.0)');
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

  path.setAttribute('stroke', 'rgba(0, 0, 255, 1.0)');
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

  path.setAttribute('stroke', 'rgba(0, 0, 255, 1.0)');
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
