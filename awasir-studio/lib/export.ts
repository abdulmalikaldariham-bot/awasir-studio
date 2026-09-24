import { getFontEmbedCSS, toCanvas } from "html-to-image";
import { SIZES } from "./design";
import type { SizeId } from "./types";

export type ExportFormat = "png" | "jpg" | "pdf";
export type ExportQuality = "normal" | "high";

let fontCSS: Promise<string> | null = null;

async function render(node: HTMLElement, quality: ExportQuality, bg?: string) {
  await document.fonts.ready;
  // الخطوط تُضمَّن داخل الصورة، فيبقى النص العربي بنفس شكل المعاينة تماماً
  fontCSS ??= getFontEmbedCSS(node);
  const fontEmbedCSS = await fontCSS;
  const opts = {
    pixelRatio: quality === "high" ? 2 : 1,
    cacheBust: false,
    fontEmbedCSS,
    backgroundColor: bg,
    width: node.offsetWidth,
    height: node.offsetHeight,
    style: { transform: "none" },
  };
  // الرسم الأول يسخّن الصور والخطوط في بعض المتصفحات (سفاري خصوصاً)
  await toCanvas(node, opts);
  return toCanvas(node, opts);
}

function download(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function exportDesign(node: HTMLElement, format: ExportFormat, quality: ExportQuality, size: SizeId, baseName: string) {
  const name = baseName.replace(/[\\/:*?"<>|]+/g, "").trim() || "تصميم-أواصر";
  const canvas = await render(node, quality, format === "png" ? undefined : "#FFFFFF");
  if (format === "png") {
    download(canvas.toDataURL("image/png"), `${name}.png`);
    return;
  }
  if (format === "jpg") {
    download(canvas.toDataURL("image/jpeg", quality === "high" ? 0.95 : 0.9), `${name}.jpg`);
    return;
  }
  const { jsPDF } = await import("jspdf");
  const spec = SIZES[size];
  const isA4 = size === "a4";
  // ‎A4 بمقاسه الورقي، وباقي المقاسات بحجم البكسل (٠٫٧٥ نقطة لكل بكسل)
  const pdf = isA4
    ? new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true })
    : new jsPDF({ orientation: spec.w > spec.h ? "landscape" : "portrait", unit: "pt", format: [spec.w * 0.75, spec.h * 0.75], compress: true });
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();
  pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, w, h, undefined, "FAST");
  pdf.setProperties({ title: name, creator: "استوديو أواصر" });
  pdf.save(`${name}.pdf`);
}
