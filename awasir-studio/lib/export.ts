import { getFontEmbedCSS, toCanvas } from "html-to-image";
import { SIZES } from "./design";
import type { SizeId } from "./types";

export type ExportFormat = "png" | "jpg" | "pdf";
export type ExportQuality = "normal" | "high";

let fontCSS: Promise<string> | null = null;

/**
 * المعاينة تستخدم صوراً خفيفة، وقبل الالتقاط نبدّلها بنسخ الدقة الكاملة (data-hires)
 * ثم نعيدها بعد التصدير. فالمعاينة سريعة والملف النهائي بأعلى جودة.
 */
async function withHiRes<T>(node: HTMLElement, fn: () => Promise<T>): Promise<T> {
  const imgs = Array.from(node.querySelectorAll<HTMLImageElement>("img[data-hires]"));
  const saved = imgs.map((i) => i.src);
  try {
    await Promise.all(imgs.map(async (i) => {
      i.src = i.dataset.hires!;
      try { await i.decode(); } catch { /* نكمل بالصورة المتاحة */ }
    }));
    return await fn();
  } finally {
    imgs.forEach((i, k) => { i.src = saved[k]; });
  }
}

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
  // رسم تمهيدي بدقة صغيرة جداً يسخّن الصور والخطوط في بعض المتصفحات (سفاري خصوصاً)
  await toCanvas(node, { ...opts, pixelRatio: 0.2 });
  return toCanvas(node, opts);
}

function download(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  if (url.startsWith("blob:")) setTimeout(() => URL.revokeObjectURL(url), 4000);
}

const toBlob = (c: HTMLCanvasElement, type: string, q?: number) =>
  new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), type, q));

export async function exportDesign(node: HTMLElement, format: ExportFormat, quality: ExportQuality, size: SizeId, baseName: string) {
  const name = baseName.replace(/[\\/:*?"<>|]+/g, "").trim() || "تصميم-أواصر";
  const canvas = await withHiRes(node, () => render(node, quality, format === "png" ? undefined : "#FFFFFF"));
  if (format === "png") {
    download(URL.createObjectURL(await toBlob(canvas, "image/png")), `${name}.png`);
    return;
  }
  if (format === "jpg") {
    download(URL.createObjectURL(await toBlob(canvas, "image/jpeg", quality === "high" ? 0.95 : 0.9)), `${name}.jpg`);
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
