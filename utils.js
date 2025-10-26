const CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";
const CHARSET_LEN = CHARSET.length;

const IN_LEN = 16;   // tamanho do vetor Base64
const OUT_LEN = 3;   // tamanho máximo da senha

// Converte string para array de índices one-hot
function strToOneHotArray(str, length) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    const charArr = new Array(CHARSET_LEN).fill(0);
    if (i < str.length) {
      const idx = CHARSET.indexOf(str[i]);
      if (idx >= 0) charArr[idx] = 1;
    }
    arr.push(...charArr);
  }
  return arr;
}

// Converte Base64 para string
function base64Decode(b64) {
  return Buffer.from(b64, 'base64').toString('utf-8');
}

// Converte string para Base64
function base64Encode(str) {
  return Buffer.from(str, 'utf-8').toString('base64');
}

// Adiciona uma amostra ao dataset
function addSample(datasetX, datasetY, pwd) {
  const b64 = base64Encode(pwd);
  datasetX.push(b64);
  datasetY.push(pwd);
  return { pwd, b64 };
}

// Gera dataset automático
function generateAutoSamples(datasetX, datasetY) {
  const samples = [
    "cor","porta","java","node","react","css","html","senha","admin","root",
    "script","loop","input","output","byte","array","valor","teste","code","git"
  ];
  for (const s of samples) addSample(datasetX, datasetY, s);
}

module.exports = {
  CHARSET,
  CHARSET_LEN,
  IN_LEN,
  OUT_LEN,
  strToOneHotArray,
  base64Encode,
  base64Decode,
  addSample,
  generateAutoSamples
};
