import fs from 'fs';

const monedasPath = './data/monedas.json';
const nivelesPath = './data/niveles.json';
const xpPath = './data/xp.json';

function readJSON(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
  } catch {
    return {};
  }
}

function writeJSON(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

export const monedas = {
  get: () => readJSON(monedasPath),
  save: (data) => writeJSON(monedasPath, data)
};

export const niveles = {
  get: () => readJSON(nivelesPath),
  save: (data) => writeJSON(nivelesPath, data)
};

export const xp = {
  get: () => readJSON(xpPath),
  save: (data) => writeJSON(xpPath, data)
};