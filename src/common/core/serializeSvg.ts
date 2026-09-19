// Standalone viewers need an explicit size, which the inline svg on the page
// doesn't carry. XMLSerializer adds the xmlns declaration by itself; setting it
// as an attribute too makes some browsers emit it twice.
export const serializeSvg = (svg: SVGElement): string => {
  const clone = svg.cloneNode(true) as SVGElement;
  const [viewBoxWidth, viewBoxHeight] = (clone.getAttribute("viewBox") ?? "")
    .split(/[\s,]+/)
    .slice(2);

  clone.setAttribute(
    "width",
    clone.getAttribute("width") || viewBoxWidth || "500",
  );
  clone.setAttribute(
    "height",
    clone.getAttribute("height") || viewBoxHeight || "500",
  );

  return new XMLSerializer().serializeToString(clone);
};
