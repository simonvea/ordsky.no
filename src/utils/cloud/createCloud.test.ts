import { CloudInput } from './cloud.types';
import { reduceTooBigWords } from './createCloud';

describe('s', () => {
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
        i.size - reduceFontWith > minSize ? i.size - reduceFontWith : minSize,
    }));

    const result = reduceTooBigWords(input, maxPixels, minSize);

    expect(result).toEqual(expected);
  });
});
