'use strict';

const { wordCountToCloudInput } = require('./wordCountToCloudInput');
const wordcount = require('./wordcount.json');
const cloudInput = require('./cloudInput.json');

describe('wordCountToCloudInput', () => {
  test('transforms word count to CloudInput', () => {
    // Time to beat: 0.011 - 0.022 seconds.
    // After improvement: 0.001 - 0.004 seconds.
    const start = new Date();
    const output = wordCountToCloudInput(wordcount);
    const finished = new Date();

    const seconds = (finished - start) / 1000;
    console.log('spent', seconds);
    output.forEach((input, i) => {
      expect(input.text).toEqual(cloudInput[i].text);
      expect(input.size).toEqual(cloudInput[i].size);
    });
  });
});
