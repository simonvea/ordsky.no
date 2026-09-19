import { serializeSvg } from "./serializeSvg";

// Built through innerHTML, the same way CloudDisplay renders the cloud.
const createSvg = (attributes: string): SVGElement => {
  const container = document.createElement("div");
  container.innerHTML = `<svg ${attributes}><text>ord</text></svg>`;
  return container.firstChild as SVGElement;
};

describe("serializeSvg", () => {
  describe("given an svg with a viewBox and no size", () => {
    it("when serialized, then width and height are taken from the viewBox", () => {
      // Arrange
      const svg = createSvg('viewBox="0 0 500 300"');

      // Act
      const output = serializeSvg(svg);

      // Assert
      expect(output).toContain('width="500"');
      expect(output).toContain('height="300"');
    });

    it("when the viewBox is comma separated, then width and height are still taken from it", () => {
      // Arrange
      const svg = createSvg('viewBox="0,0,500,300"');

      // Act
      const output = serializeSvg(svg);

      // Assert
      expect(output).toContain('width="500"');
      expect(output).toContain('height="300"');
    });

    it("when serialized, then the output declares the svg namespace so it opens as a standalone file", () => {
      // Arrange
      const svg = createSvg('viewBox="0 0 500 300"');

      // Act
      const output = serializeSvg(svg);

      // Assert
      expect(output).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    it("when serialized, then the svg shown on the page is left untouched", () => {
      // Arrange
      const svg = createSvg('viewBox="0 0 500 300"');

      // Act
      serializeSvg(svg);

      // Assert
      expect(svg).not.toHaveAttribute("width");
      expect(svg).not.toHaveAttribute("height");
    });
  });

  describe("given an svg with an explicit size", () => {
    it("when serialized, then that size is kept", () => {
      // Arrange
      const svg = createSvg('viewBox="0 0 500 300" width="1000" height="600"');

      // Act
      const output = serializeSvg(svg);

      // Assert
      expect(output).toContain('width="1000"');
      expect(output).toContain('height="600"');
    });
  });

  describe("given an svg with neither viewBox nor size", () => {
    it("when serialized, then it falls back to 500 by 500", () => {
      // Arrange
      const svg = createSvg("");

      // Act
      const output = serializeSvg(svg);

      // Assert
      expect(output).toContain('width="500"');
      expect(output).toContain('height="500"');
    });
  });
});
