const copyWithSelection = (text: string): boolean => {
  const area = document.createElement("textarea");
  area.value = text;
  area.style.position = "fixed";
  area.style.opacity = "0";
  // iOS Safari refuses to select readonly fields and zooms on fields under 16px.
  area.style.fontSize = "16px";
  document.body.append(area);
  area.select();
  area.setSelectionRange(0, text.length);
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    area.remove();
  }
};

// navigator.clipboard is undefined on insecure origins and rejects when the
// document lacks focus or permission; execCommand still works in those cases.
export const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return copyWithSelection(text);
  }
};
