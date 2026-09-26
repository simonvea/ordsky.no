import { cloudBounds } from './cloudBounds';
import { Cloud } from './cloud.types';

const word = (overrides: Partial<Cloud>): Cloud =>
  ({ x: 0, y: 0, x0: -10, x1: 10, y0: -5, y1: 5, ...overrides }) as Cloud;

describe('cloudBounds', () => {
  it('when a word is placed off-center, then bounds are its position plus its own box', () => {
    // Arrange
    const cloud = [word({ x: 100, y: -40, x0: -30, x1: 30, y0: -10, y1: 10 })];

    // Act
    const bounds = cloudBounds(cloud);

    // Assert
    expect(bounds).toEqual({ minX: 70, maxX: 130, minY: -50, maxY: -30 });
  });

  it('when there are several words, then bounds enclose all of them', () => {
    // Arrange
    const cloud = [
      word({ x: -100, y: 0 }),
      word({ x: 50, y: 60 }),
    ];

    // Act
    const bounds = cloudBounds(cloud);

    // Assert
    expect(bounds).toEqual({ minX: -110, maxX: 60, minY: -5, maxY: 65 });
  });
});
