// sv-SE formats as YYYY-MM-DD in local time; toISOString would be UTC and
// give yesterday's date just after midnight in Norway.
export const todayStamp = (): string => new Date().toLocaleDateString("sv-SE");

export async function downloadFile(
  url: string,
  filename: string,
): Promise<void> {
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.style.display = "none";

  (document.body as ParentNode).append(link);

  try {
    link.click();
  } finally {
    // Revoking a blob URL too soon can cancel the download in Firefox/Safari.
    setTimeout(() => {
      URL.revokeObjectURL(url);
      link.remove();
    }, 1000);
  }
}
