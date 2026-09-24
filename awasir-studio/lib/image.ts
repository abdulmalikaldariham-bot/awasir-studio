/** يقرأ الصورة ويصغّرها (أقصى ضلع ٢٠٠٠ بكسل) لتبقى المسودات خفيفة والتصدير سريعاً */
export async function readImage(file: File, max = 2000): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("الملف ليس صورة. اختر صورة بصيغة JPG أو PNG أو WEBP.");
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error("تعذرت قراءة الصورة. جرّب صورة أخرى."));
      i.src = url;
    });
    const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * s);
    c.height = Math.round(img.naturalHeight * s);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    const keepAlpha = file.type === "image/png" || file.type === "image/svg+xml";
    return keepAlpha ? c.toDataURL("image/png") : c.toDataURL("image/jpeg", 0.88);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(new Error("تعذرت قراءة الملف"));
    r.readAsDataURL(file);
  });
}
