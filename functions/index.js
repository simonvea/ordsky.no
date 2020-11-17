const functions = require('firebase-functions');
const { createCloud } = require('./createCloud');

exports.createCloud = functions
  .region('europe-west3')
  .https.onCall(async (data, context) => {
    const { words, config } = data;

    const cloud = await createCloud(words, config);

    return cloud;
  });
