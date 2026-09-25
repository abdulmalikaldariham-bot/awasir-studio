"use client";
import { useState } from "react";
import { Download, Loader2, FileImage, FileText, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { exportDesign, type ExportFormat, type ExportQuality } from "@/lib/export";
import { SIZES } from "@/lib/design";
import type { SizeId } from "@/lib/types";

const FORMATS: { id: ExportFormat; name: string; note: string; Icon: typeof FileImage }[] = [
  { id: "png", name: "PNG", note: "أعلى وضوح للنشر", Icon: FileImage },
  { id: "jpg", name: "JPG", note: "حجم أصغر للواتساب", Icon: ImageIcon },
  { id: "pdf", name: "PDF", note: "للطباعة والمشاركة", Icon: FileText },
];

/** قسم تحميل التصميم: آخر خطوة في رحلة الإنشاء */
export function ExportBar({ getNode, size, name, missing, onExported }: {
  getNode: () => HTMLElement | null; size: SizeId; name: string; missing: string[]; onExported?: () => void;
}) {
  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState<ExportQuality>("high");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const spec = SIZES[size];
  const px = quality === "high" ? 2 : 1;

  const run = async () => {
    const node = getNode();
    if (!node) return;
    setBusy(true); setMsg(null);
    try {
      await exportDesign(node, format, quality, size, name);
      setMsg({ ok: true, text: "تم تحميل التصميم" });
      onExported?.();
    } catch (e) {
      console.error(e);
      setMsg({ ok: false, text: "تعذر تجهيز الملف. جرّب الجودة العادية، أو صورة أصغر حجماً." });
    } finally { setBusy(false); }
  };

  return (
    <div className="mt-3 rounded-2xl bg-navy p-4 sm:p-5 text-white shadow-lift">
      {missing.length > 0 && (
        <p className="mb-4 rounded-lg bg-amber-50 text-amber-800 text-sm px-3 py-2 leading-6">
          حقول مطلوبة لم تُكتب بعد: {missing.join("، ")}
        </p>
      )}
      <p className="text-sm font-semibold text-white/75 mb-2">صيغة الملف</p>
      <div role="radiogroup" aria-label="صيغة الملف" className="grid grid-cols-3 gap-2">
        {FORMATS.map(({ id, name: n, note, Icon }) => (
          <button key={id} type="button" role="radio" aria-checked={format === id} onClick={() => setFormat(id)}
            className={`rounded-xl p-3 text-start ring-1 transition ${format === id ? "bg-white text-navy ring-white" : "bg-white/5 ring-white/20 hover:ring-white/50"}`}>
            <Icon size={18} className={format === id ? "text-teal" : "text-mist"} />
            <span className="block font-bold mt-1">{n}</span>
            <span className={`block text-xs leading-5 ${format === id ? "text-ink-soft" : "text-white/65"}`}>{note}</span>
          </button>
        ))}
      </div>
      <p className="text-sm font-semibold text-white/75 mt-4 mb-2">الجودة</p>
      <div role="radiogroup" aria-label="الجودة" className="inline-flex rounded-xl bg-white/10 p-1">
        {([["high", "عالية (مضاعفة)"], ["normal", "عادية"]] as const).map(([id, n]) => (
          <button key={id} type="button" role="radio" aria-checked={quality === id} onClick={() => setQuality(id)}
            className={`h-9 px-3.5 rounded-lg text-sm font-semibold transition ${quality === id ? "bg-white text-navy" : "text-white/80 hover:text-white"}`}>
            {n}
          </button>
        ))}
      </div>
      <p className="text-xs text-white/60 mt-2 tabular-nums">
        {format === "pdf" && size === "a4" ? "ملف PDF بمقاس A4 جاهز للطباعة" : `${spec.name}: ${spec.w * px} × ${spec.h * px} بكسل`}
      </p>
      <button type="button" onClick={run} disabled={busy}
        className="btn w-full mt-4 h-12 text-base bg-[#8CC0C7] text-navy hover:bg-white">
        {busy ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
        {busy ? "جارٍ تجهيز الملف…" : `تحميل التصميم (${FORMATS.find((f) => f.id === format)!.name})`}
      </button>
      {msg && (
        <p className={`mt-3 text-sm font-semibold flex items-center gap-1.5 ${msg.ok ? "text-mist" : "text-amber-300"}`} role="status">
          {msg.ok && <CheckCircle2 size={16} />}{msg.text}
        </p>
      )}
    </div>
  );
}
