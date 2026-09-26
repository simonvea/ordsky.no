import { createCloudSvg } from './createCloud';

describe('createCloudSvg', () => {
  it('when the cloud has no words, then the transform contains no NaN', () => {
    // Act
    const svg = createCloudSvg([], { upscale: true });

    // Assert
    expect(svg).not.toContain('NaN');
  });
});
