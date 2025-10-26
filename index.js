const { base64Encode } = require('./utils');
const { loadModel, predictPwd } = require('./predict');

(async () => {
  const model = await loadModel();
  if (!model) {
    console.log('Modelo não encontrado. Rode `npm run train` primeiro.');
    return;
  }

  const testPwd = "cor";
  const testB64 = base64Encode(testPwd);
  const pred = await predictPwd(model, testB64);
 
  console.clear(); // limpa o terminal antes de começar
  console.log('----------------------------------------');
  console.log(`Senha original: "${testPwd}"`);
  console.log(`Base64: "${testB64}"`);
  console.log(`Senha prevista pelo modelo: "${pred}"`);
  console.log('----------------------------------------');
})();
