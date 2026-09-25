// معالجة الصور في الخلفية: فك الترميز، التصغير بجودة عالية، والضغط، دون تعطيل الواجهة.
export interface ImageJob { file: Blob; targets: { max: number; type: string; quality: number }[] }
export interface ImageResult { ok: true; blobs: Blob[]; width: number; height: number }

async function scale(bmp: ImageBitmap, max: number) {
  const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * s)), h = Math.max(1, Math.round(bmp.height * s));
  // تصغير تدريجي (النصف كل مرة) يحافظ على الحدة ويمنع التشويش في الصور الكبيرة جداً
  let src: ImageBitmap | OffscreenCanvas = bmp;
  let cw = bmp.width, ch = bmp.height;
  while (cw / 2 >= w && ch / 2 >= h) {
    cw = Math.round(cw / 2); ch = Math.round(ch / 2);
    const step = new OffscreenCanvas(cw, ch);
    const c = step.getContext("2d")!;
    c.imageSmoothingQuality = "high";
    c.drawImage(src, 0, 0, cw, ch);
    src = step;
  }
  const out = new OffscreenCanvas(w, h);
  const ctx = out.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, 0, 0, w, h);
  return out;
}

self.onmessage = async (e: MessageEvent<ImageJob>) => {
  try {
    const bmp = await createImageBitmap(e.data.file);
    const blobs: Blob[] = [];
    for (const t of e.data.targets) {
      const c = await scale(bmp, t.max);
      let b = await c.convertToBlob({ type: t.type, quality: t.quality });
      // بعض المتصفحات لا تدعم الترميز المطلوب فتعيد PNG: نرجع إلى JPEG
      if (b.type !== t.type && t.type !== "image/png") b = await c.convertToBlob({ type: "image/jpeg", quality: t.quality });
      blobs.push(b);
    }
    (self as unknown as Worker).postMessage({ ok: true, blobs, width: bmp.width, height: bmp.height } satisfies ImageResult);
    bmp.close();
  } catch (err) {
    (self as unknown as Worker).postMessage({ ok: false, error: String(err) });
  }
};
