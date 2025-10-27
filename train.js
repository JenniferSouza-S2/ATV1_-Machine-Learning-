const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const { SkLearn } = require('scikitjs'); 
require('@tensorflow/tfjs-node');

const {
  IN_LEN,
  OUT_LEN,
  CHARSET_LEN,
  generateAutoSamples,
  strToOneHotArray
} = require('./utils');

const MODEL_DIR = path.join(__dirname, 'model_onehot');

async function buildAndTrainModel(datasetX, datasetY) {
  if (!fs.existsSync(MODEL_DIR)) fs.mkdirSync(MODEL_DIR);

  // Transformar em tensores 2D
  const inputTensor = tf.tensor2d(datasetX);
  const outputTensor = tf.tensor2d(datasetY);

  // Rede neural
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [IN_LEN * CHARSET_LEN], units: 256, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 256, activation: 'relu' }));
  model.add(tf.layers.dense({ units: OUT_LEN * CHARSET_LEN, activation: 'softmax' }));

  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  console.log(" Treinando modelo principal...");
  await model.fit(inputTensor, outputTensor, {
    epochs: 300,
    batchSize: Math.min(32, datasetX.length),
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if ((epoch + 1) % 20 === 0)
          console.log(`Epoch ${epoch + 1}: loss=${logs.loss.toFixed(4)}, acc=${logs.acc.toFixed(4)}`);
      }
    }
  });

  // Salvar modelo
  const savePath = `file://${MODEL_DIR}/`; 
  await model.save(savePath);
  console.log(" Modelo salvo em:", MODEL_DIR);

  inputTensor.dispose();
  outputTensor.dispose();

  return model;
}

async function runTraining() {
  const datasetX = [];
  const datasetY = [];
  generateAutoSamples(datasetX, datasetY);

  // Converter strings Base64 e senhas para one-hot
  const X_onehot = datasetX.map(str => strToOneHotArray(str, IN_LEN));
  const Y_onehot = datasetY.map(str => strToOneHotArray(str, OUT_LEN));

  console.log(` Dataset gerado com ${datasetX.length} amostras`);
  await buildAndTrainModel(X_onehot, Y_onehot);

  console.log('🎉 Treinamento concluído!');
}

async function runScikitExample() {
  const sk = new SkLearn();
  await sk.setBackend('tensorflow');

  console.log('\n Rodando exemplo ScikitJS (regressão linear)...');
  const X = [[1], [2], [3], [4]];
  const y = [2, 4, 6, 8];

  const model = new sk.LinearRegression();
  model.fit(X, y);
  console.log(' Exemplo ScikitJS: previsão(5) =', model.predict([[5]])[0]);
}

(async () => {
  await runTraining();
  await runScikitExample();
})();
