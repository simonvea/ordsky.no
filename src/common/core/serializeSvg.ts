const SVG_NS = "http://www.w3.org/2000/svg";

export type SerializeOptions = {
  background?: string;
  fontFaceCss?: string;
};

export type SvgSize = { width: number; height: number };

const parseViewBox = (svg: SVGElement): number[] =>
  (svg.getAttribute("viewBox") ?? "")
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number);

export const svgSize = (svg: SVGElement): SvgSize => {
  const viewBox = parseViewBox(svg);
  const viewBoxWidth = viewBox[2];
  const viewBoxHeight = viewBox[3];

  return {
    width: Number(svg.getAttribute("width")) || viewBoxWidth || 500,
    height: Number(svg.getAttribute("height")) || viewBoxHeight || 500,
  };
};

// Standalone viewers need an explicit size, which the inline svg on the page
// doesn't carry. XMLSerializer adds the xmlns declaration by itself; setting it
// as an attribute too makes some browsers emit it twice.
export const serializeSvg = (
  svg: SVGElement,
  { background, fontFaceCss }: SerializeOptions = {},
): string => {
  const clone = svg.cloneNode(true) as SVGElement;
  const { width, height } = svgSize(svg);

  clone.setAttribute("width", clone.getAttribute("width") || String(width));
  clone.setAttribute("height", clone.getAttribute("height") || String(height));

  if (fontFaceCss) {
    const style = document.createElementNS(SVG_NS, "style");
    style.textContent = fontFaceCss;
    clone.prepend(style);
  }

  // The rect spans the viewBox rather than width/height, which may differ.
  if (background) {
    const [minX = 0, minY = 0, boxWidth = width, boxHeight = height] =
      parseViewBox(svg);
    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("x", String(minX));
    rect.setAttribute("y", String(minY));
    rect.setAttribute("width", String(boxWidth));
    rect.setAttribute("height", String(boxHeight));
    rect.setAttribute("fill", background);
    clone.prepend(rect);
  }

  return new XMLSerializer().serializeToString(clone);
};
