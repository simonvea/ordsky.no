import { contrastRatio, randomReadableColor } from './contrast';

describe('contrastRatio', () => {
  it('when comparing black to white, then the ratio is 21', () => {
    // Act
    const ratio = contrastRatio('#000000', '#ffffff');

    // Assert
    expect(ratio).toBeCloseTo(21, 5);
  });

  it('when comparing a color to itself, then the ratio is 1', () => {
    // Act
    const ratio = contrastRatio('#6da34d', '#6da34d');

    // Assert
    expect(ratio).toBeCloseTo(1, 5);
  });
});

describe('randomReadableColor', () => {
  it('when drawing many colors, then each has at least 3:1 contrast with both the dark page and white paper', () => {
    // Arrange
    const backgrounds = ['#373737', '#ffffff'];

    // Act
    const ratios = Array.from({ length: 1000 }, () => {
      const color = randomReadableColor(backgrounds);
      return Math.min(...backgrounds.map((bg) => contrastRatio(color, bg)));
    });

    // Assert
    expect(Math.min(...ratios)).toBeGreaterThanOrEqual(3);
  });
});
