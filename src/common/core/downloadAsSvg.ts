import { downloadFile, todayStamp } from "./downloadFile";
import { serializeSvg } from "./serializeSvg";

export async function downloadAsSvg(svg: SVGElement): Promise<void> {
  const blob = new Blob([serializeSvg(svg)], { type: "image/svg+xml" });
  await downloadFile(URL.createObjectURL(blob), `ordsky-${todayStamp()}.svg`);
}
