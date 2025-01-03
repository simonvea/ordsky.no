import {
  reduceTooBigWords,
  wordCountToCloudInput,
} from './wordCountToCloudInput';
import wordcount from './wordcount.json';
import cloudInput from './cloudInput.json';
import { CloudInput, WordCount } from './cloud.types';

describe('wordCountToCloudInput', () => {
  test('transforms word count to CloudInput', () => {
    // Time to beat: 0.011 - 0.022 seconds.
    // After improvement: 0.001 - 0.004 seconds.
    const start = new Date();
    const output = wordCountToCloudInput(wordcount);
    const finished = new Date();

    const seconds = (Number(finished) - Number(start)) / 1000;
     
    console.log('spent', seconds);
    output.forEach((input, i) => {
      expect(input.text).toEqual(cloudInput[i].text);
    });
  });

  it('given wordCount, when called then original wordcount stays the same', () => {
    // This is due to runtime errors when trying to sort an immutable array, which it will be in production
    // Arrange
    const count = Object.freeze([
      { text: 'dgsadg', count: 1 },
      { text: 'asdgasdg', count: 2 },
    ]);

    // Act

    wordCountToCloudInput(count as WordCount);

    // Assert
    expect(count).toBeDefined();
  });
});

describe('reduceTooBigWords', () => {
  it('reduces size if size*text.length exceeds max pixels', () => {
    const input: CloudInput = {
      text: 'seventy',
      size: 70,
      fill: 'doesntmatter',
    };

    const maxPixels = 200;

    const expectedSize = Math.floor(maxPixels / input.text.length);

    const result = reduceTooBigWords([input], maxPixels);

    expect(result[0].size).toEqual(expectedSize);
  });

  it('does not reduce size if size*text.length does not exceeds max pixels', () => {
    const input: CloudInput = {
      text: 'Hei',
      size: 30,
      fill: 'doesntmatter',
    };

    const maxPixels = 200;

    const result = reduceTooBigWords([input], maxPixels);

    expect(result[0].size).toEqual(input.size);
  });

  it('when one number exceeds max size, then all sizes below in list are reduced by same size', () => {
    const input: CloudInput[] = [
      {
        text: 'seventy',
        size: 70,
        fill: 'doesntmatter',
      },
      {
        text: 'Hei',
        size: 62,
        fill: 'doesntmatter',
      },
    ];

    const maxPixels = 200;

    const reduceFontWith = Math.ceil(
      input[0].size - maxPixels / input[0].text.length
    );

    const expected = input.map((i) => ({
      ...i,
      size: i.size - reduceFontWith,
    }));

    const result = reduceTooBigWords(input, maxPixels);

    expect(result).toEqual(expected);
  });

  it('size does not become less than min size', () => {
    const input: CloudInput[] = [
      {
        text: 'Alllooooooongwoooord',
        size: 70,
        fill: 'doesntmatter',
      },
      {
        text: 'Hei',
        size: 10,
        fill: 'doesntmatter',
      },
    ];

    const maxPixels = 200;
    const minSize = 20;

    const reduceFontWith = input[0].size - maxPixels / input[0].text.length;

    const expected = input.map((i) => ({
      ...i,
      size:
        Math.max(i.size - reduceFontWith, minSize),
    }));

    const result = reduceTooBigWords(input, maxPixels, minSize);

    expect(result).toEqual(expected);
  });
});
