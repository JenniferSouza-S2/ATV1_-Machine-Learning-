const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const { IN_LEN, OUT_LEN, CHARSET, CHARSET_LEN, strToOneHotArray, base64Encode } = require('./utils');

const MODEL_DIR = path.join(__dirname, 'model_onehot');

async function loadModel() {
  const modelPath = path.join(MODEL_DIR, 'model.json');

  if (!fs.existsSync(modelPath)) {
    console.log('Arquivo model.json não encontrado:', modelPath);
    return null;
  }

  const model = await tf.loadLayersModel(`file:///${modelPath}`);
  console.log('Modelo carregado com sucesso!');
  return model;
}

async function predictPwd(model, inputStr) {
  // converter Base64 para vetor one-hot
  const x = tf.tensor2d([strToOneHotArray(inputStr, IN_LEN)]);

  const ypred = model.predict(x);
  const arr = ypred.arraySync()[0];
  const chars = [];

  for (let i = 0; i < OUT_LEN; i++) {
    const slice = arr.slice(i * CHARSET_LEN, (i + 1) * CHARSET_LEN);
    const idx = slice.indexOf(Math.max(...slice));
    chars.push(CHARSET[idx] || '');
  }

  x.dispose();
  return chars.join('').trim();
}

module.exports = { loadModel, predictPwd };
