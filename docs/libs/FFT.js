function pow2(n) {
  return 2 ** n;
}

/**
 * FFT
 *
 * @param {Float32Array} reals This argument is instance of `Float32Array` for real number.
 * @param {Float32Array} imags This argument is instance of `Float32Array` for imaginary number.
 * @param {number} size This argument is FFT size (power of two).
 */
export function FFT(reals, imags, size) {
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
        const wreal = 0 + Math.cos(w / size);
        const wimag = 0 - Math.sin(w / size); // Clockwise

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

/**
 * IFFT
 *
 * @param {Float32Array} reals This argument is instance of `Float32Array` for real number.
 * @param {Float32Array} imags This argument is instance of `Float32Array` for imaginary number.
 * @param {number} size This argument is IFFT size (power of two).
 */
export function IFFT(reals, imags, size) {
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
        const wreal = 0 + Math.cos(w / size);
        const wimag = 0 + Math.sin(w / size); // Counterclockwise

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

  for (let k = 0; k < size; k++) {
    reals[k] /= size;
    imags[k] /= size;
  }
}
