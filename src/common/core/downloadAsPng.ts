export const downloadAsPng = (xml: string): void => {
  const canvas = document.createElement('canvas');
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    '2d'
  ) as CanvasRenderingContext2D;
  canvas.height = 500;
  canvas.width = 500;
  // If you want a non transparent background for the wordCloud;
  // ctx.fillStyle = 'white';
  // ctx.fillRect(0, 0, canvas.width, canvas.height);

  const img = new Image();
  img.addEventListener('load', () => {
    ctx.drawImage(img, 0, 0);
    const url = canvas.toDataURL();
    downloadOrdsky(url);
  });

  img.src = xml;
};

function downloadOrdsky(url: string): void {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  const a = document.createElement('a');
  a.setAttribute('download', 'ordsky.png');
  a.setAttribute('href', url);
  a.setAttribute('target', '_blank');
  a.dispatchEvent(event);
}

export function svgDataURL(svg: SVGElement): string {
  const svgAsXML = new XMLSerializer().serializeToString(svg);
  return `data:image/svg+xml,${encodeURIComponent(svgAsXML)}`;
}
