import { wordCountToCloudInput } from './wordCountToCloudInput';
import wordcount from './wordcount.json';
import cloudInput from './cloudInput.json';

describe('wordCountToCloudInput', () => {
  test('transforms word count to CloudInput', () => {
    // Time to beat: 0.011 - 0.022 seconds.
    // After improvement: 0.001 - 0.004 seconds.
    const start = new Date();
    const output = wordCountToCloudInput(wordcount);
    const finished = new Date();

    const seconds = (Number(finished) - Number(start)) / 1000;
    // eslint-disable-next-line no-console
    console.log('spent', seconds);
    output.forEach((input, i) => {
      expect(input.text).toEqual(cloudInput[i].text);
    });
  });
});
