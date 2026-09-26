import { downloadFile, todayStamp } from "./downloadFile";
import { SerializeOptions, serializeSvg } from "./serializeSvg";

export async function downloadAsSvg(
  svg: SVGElement,
  options: SerializeOptions = {},
): Promise<void> {
  const blob = new Blob([serializeSvg(svg, options)], {
    type: "image/svg+xml",
  });
  await downloadFile(URL.createObjectURL(blob), `ordsky-${todayStamp()}.svg`);
}
