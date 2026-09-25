/**
 * تجهيز الصورة المرفوعة:
 * - نسخة للتصدير (أقصى ضلع ٢٤٠٠ بكسل) تكفي حتى لطباعة A4 بجودة عالية،
 * - ونسخة خفيفة للمعاينة (٩٠٠ بكسل) فيبقى التحرير سريعاً.
 * المعالجة تتم في Web Worker إن توفر، وإلا في الصفحة نفسها.
 */
export const EXPORT_MAX = 2400;
export const PREVIEW_MAX = 900;

export interface ProcessedImage { src: string; preview: string; before: number; after: number; width: number; height: number }

export async function readImage(file: File): Promise<ProcessedImage> {
  if (!file.type.startsWith("image/")) throw new Error("الملف ليس صورة. اختر صورة بصيغة JPG أو PNG أو WEBP.");
  const alpha = file.type === "image/png" || file.type === "image/webp" || file.type === "image/svg+xml" || file.type === "image/gif";
  const hiType = alpha ? "image/webp" : "image/jpeg";
  const targets = [
    { max: EXPORT_MAX, type: hiType, quality: 0.9 },
    { max: PREVIEW_MAX, type: hiType, quality: 0.8 },
  ];
  let blobs: Blob[]; let width = 0, height = 0;
  try {
    ({ blobs, width, height } = await inWorker(file, targets));
  } catch {
    ({ blobs, width, height } = await onMainThread(file, targets));
  }
  const [src, preview] = await Promise.all(blobs.map(blobToDataURL));
  return { src, preview, before: file.size, after: blobs[0].size, width, height };
}

function inWorker(file: File, targets: { max: number; type: string; quality: number }[]) {
  if (typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined") return Promise.reject(new Error("no worker"));
  return new Promise<{ blobs: Blob[]; width: number; height: number }>((res, rej) => {
    const w = new Worker(new URL("./image.worker.ts", import.meta.url));
    const t = setTimeout(() => { w.terminate(); rej(new Error("timeout")); }, 30000);
    w.onmessage = (e) => { clearTimeout(t); w.terminate(); e.data.ok ? res(e.data) : rej(new Error(e.data.error)); };
    w.onerror = (e) => { clearTimeout(t); w.terminate(); rej(e); };
    w.postMessage({ file, targets });
  });
}

async function onMainThread(file: File, targets: { max: number; type: string; quality: number }[]) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error("تعذرت قراءة الصورة. جرّب صورة أخرى."));
      i.src = url;
    });
    const blobs: Blob[] = [];
    for (const t of targets) {
      const s = Math.min(1, t.max / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * s);
      c.height = Math.round(img.naturalHeight * s);
      const ctx = c.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, c.width, c.height);
      let b = await new Promise<Blob | null>((r) => c.toBlob(r, t.type, t.quality));
      if (!b || (b.type !== t.type && t.type !== "image/png")) b = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", t.quality));
      if (!b) throw new Error("تعذرت معالجة الصورة");
      blobs.push(b);
    }
    return { blobs, width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function blobToDataURL(b: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(new Error("تعذرت قراءة الملف"));
    r.readAsDataURL(b);
  });
}

export async function readFileAsDataURL(file: File): Promise<string> {
  return blobToDataURL(file);
}

export const fmtSize = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} م.ب` : `${Math.max(1, Math.round(n / 1024))} ك.ب`);

/** نسخة واحدة بمقاس محدد (لخلفيات لوحة الإدارة) */
export async function readImageSized(file: File, max: number, quality = 0.85): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("الملف ليس صورة.");
  const targets = [{ max, type: "image/jpeg", quality }];
  const { blobs } = await inWorker(file, targets).catch(() => onMainThread(file, targets));
  return blobToDataURL(blobs[0]);
}
