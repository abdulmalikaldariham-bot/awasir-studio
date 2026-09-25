"use client";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, RotateCcw, Trash2 } from "lucide-react";
import type { Custom, Library, Template, ThemeId } from "@/lib/types";
import { STYLE_INFO, THEME_NAMES, accentOptions, palette } from "@/lib/design";
import { fmtSize, readImage } from "@/lib/image";
import { occasionOf } from "@/lib/occasions";

const SLOT_NAMES: Record<string, string> = {
  eyebrow: "العنوان الصغير", subtitle: "السطر الثانوي", body: "النص", details: "التفاصيل",
  stats: "الأرقام", note: "الملاحظات", qr: "رمز QR", footer: "التوقيع", pattern: "النمط السداسي", decor: "زخارف المناسبة", image: "الصورة",
};

export function Customize({ template, styleIndex, custom, onChange, library }: {
  template: Template; styleIndex: number; custom: Custom; onChange: (c: Custom) => void; library: Library;
}) {
  const set = (patch: Partial<Custom>) => onChange({ ...custom, ...patch });
  const opt = template.styles[styleIndex];
  const theme: ThemeId = custom.theme ?? opt.theme ?? STYLE_INFO[opt.style].defaultTheme;
  const slotKeys = Object.keys(SLOT_NAMES).filter((k) => {
    if (k === "pattern" || k === "decor") return true;
    if (k === "image") return template.image !== "none" && custom.image;
    if (k === "qr") return Boolean(template.slots.qr);
    const v = template.slots[k as keyof Template["slots"]];
    return Array.isArray(v) ? v.length > 0 : Boolean(v);
  });
  const toggle = (k: string) => set({ hidden: custom.hidden.includes(k) ? custom.hidden.filter((x) => x !== k) : [...custom.hidden, k] });

  return (
    <div className="space-y-7">
      {template.image !== "none" && <ImageControls custom={custom} set={set} library={library} recommended={template.image === "recommended"} />}

      <Group title="الألوان">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(THEME_NAMES) as ThemeId[]).map((t) => {
            const p = palette(t, library.brand);
            return (
              <button key={t} type="button" onClick={() => set({ theme: t, accent: undefined })}
                className={`chip gap-2 ${theme === t ? "chip-on" : ""}`}>
                <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: p.bg }} />{THEME_NAMES[t]}
              </button>
            );
          })}
        </div>
        <p className="text-xs font-semibold text-ink-soft mt-4 mb-2">لون الإبراز</p>
        <div className="flex flex-wrap gap-2">
          {accentOptions(theme, library.brand).map((a) => (
            <button key={a.id} type="button" onClick={() => set({ accent: a.id })} title={a.name} aria-label={a.name}
              className={`h-9 w-9 rounded-full ring-2 ring-offset-2 transition ${custom.accent === a.id ? "ring-teal" : "ring-transparent hover:ring-line"}`}
              style={{ background: a.color, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)" }} />
          ))}
        </div>
      </Group>

      <Group title="الخلفية">
        <div className="flex flex-wrap gap-2">
          {[["auto", `حسب المناسبة (${occasionOf(template).name})`], ["rings", "حلقات سداسية"], ["grid", "شبكة سداسية"], ["none", "بدون نمط"]].map(([id, name]) => (
            <button key={id} type="button" onClick={() => set({ pattern: id })} className={`chip ${(custom.pattern || "auto") === id ? "chip-on" : ""}`}>{name}</button>
          ))}
        </div>
        {library.backgrounds.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {library.backgrounds.map((b) => (
              <button key={b.id} type="button" onClick={() => set({ pattern: b.id })} title={b.name}
                className={`aspect-square rounded-lg bg-cover bg-center ring-2 ring-offset-1 ${custom.pattern === b.id ? "ring-teal" : "ring-line"}`}
                style={{ backgroundImage: `url(${b.src})` }} aria-label={b.name} />
            ))}
          </div>
        )}
      </Group>

      <Group title="الشعار">
        <div className="flex flex-wrap gap-2">
          {[["full", "الشعار كاملاً"], ["mark", "الرمز فقط"], ["none", "بدون شعار"]].map(([id, name]) => (
            <button key={id} type="button" onClick={() => set({ logo: id as Custom["logo"] })} className={`chip ${custom.logo === id ? "chip-on" : ""}`}>{name}</button>
          ))}
        </div>
      </Group>

      <Group title="النصوص">
        <Slider label="حجم العنوان" value={custom.titleScale} onChange={(v) => set({ titleScale: v })} />
        <Slider label="حجم النص" value={custom.bodyScale} onChange={(v) => set({ bodyScale: v })} />
        <p className="text-xs font-semibold text-ink-soft mt-4 mb-2">المحاذاة</p>
        <div className="flex gap-2">
          {[[undefined, "حسب الشكل"], ["center", "وسط"], ["start", "يمين"]].map(([id, name]) => (
            <button key={String(id)} type="button" onClick={() => set({ align: id as Custom["align"] })}
              className={`chip ${custom.align === id ? "chip-on" : ""}`}>{name}</button>
          ))}
        </div>
        {template.slots.body && template.slots.title && (
          <>
            <p className="text-xs font-semibold text-ink-soft mt-4 mb-2">الترتيب</p>
            <div className="flex gap-2">
              {[["title-first", "العنوان أولاً"], ["body-first", "النص أولاً"]].map(([id, name]) => {
                const cur = custom.order ?? template.slots.order ?? "title-first";
                return <button key={id} type="button" onClick={() => set({ order: id as Custom["order"] })} className={`chip ${cur === id ? "chip-on" : ""}`}>{name}</button>;
              })}
            </div>
          </>
        )}
      </Group>

      <Group title="إظهار العناصر">
        <div className="grid grid-cols-2 gap-2">
          {slotKeys.map((k) => (
            <label key={k} className="flex items-center gap-2 rounded-lg bg-white ring-1 ring-line px-3 h-10 text-sm cursor-pointer">
              <input type="checkbox" className="accent-teal h-4 w-4" checked={!custom.hidden.includes(k)} onChange={() => toggle(k)} />
              {SLOT_NAMES[k]}
            </label>
          ))}
        </div>
      </Group>

      <button type="button" className="btn-ghost btn-sm" onClick={() => onChange({ hidden: [], titleScale: 1, bodyScale: 1, logo: "full", pattern: "auto", image: custom.image })}>
        <RotateCcw size={16} />إعادة التخصيص الافتراضي
      </button>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h3 className="text-[15px] font-bold text-navy mb-3">{title}</h3>{children}</section>;
}

function Slider({ label, value, onChange, min = 0.8, max = 1.3, step = 0.05, fmt = (v: number) => `${Math.round(v * 100)}٪` }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; fmt?: (v: number) => string;
}) {
  return (
    <label className="block mb-3">
      <span className="flex justify-between text-sm text-ink-soft mb-1"><span>{label}</span><span className="font-semibold text-navy tabular-nums">{fmt(value)}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-teal" />
    </label>
  );
}

function ImageControls({ custom, set, library, recommended }: { custom: Custom; set: (p: Partial<Custom>) => void; library: Library; recommended: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState("");
  const img = custom.image;
  const pick = async (file?: File) => {
    if (!file) return;
    setErr(""); setSaving(""); setBusy(true);
    try {
      // المعالجة في الخلفية: نسخة للتصدير ونسخة خفيفة للمعاينة
      const r = await readImage(file);
      set({ image: { src: r.src, preview: r.preview, zoom: 1, x: 50, y: 50 }, hidden: custom.hidden.filter((h) => h !== "image") });
      if (r.before > r.after * 1.2) setSaving(`حُسّنت الصورة تلقائياً: ${fmtSize(r.before)} ← ${fmtSize(r.after)}`);
    }
    catch (e) { setErr(e instanceof Error ? e.message : "تعذر رفع الصورة"); }
    finally { setBusy(false); }
  };
  return (
    <Group title="الصورة">
      {!img && <p className="text-sm text-ink-soft mb-3">{recommended ? "هذا القالب يظهر أجمل مع صورة." : "الصورة اختيارية."} بدون صورة يظهر عنصر المناسبة ونمط أواصر.</p>}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn-teal btn-sm" onClick={() => input.current?.click()} disabled={busy} aria-busy={busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          {busy ? "جارٍ تجهيز الصورة…" : img ? "استبدال الصورة" : "رفع صورة"}
        </button>
        {img && !busy && <button type="button" className="btn-ghost btn-sm" onClick={() => { set({ image: undefined }); setSaving(""); }}><Trash2 size={16} />إزالة</button>}
      </div>
      {busy && <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist-100"><div className="skeleton h-full w-full" /></div>}
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
      {err && <p className="text-sm text-amber-700 mt-2">{err}</p>}
      {saving && <p className="text-xs text-teal mt-2">{saving}</p>}
      {library.backgrounds.length > 0 && !img && (
        <>
          <p className="text-xs font-semibold text-ink-soft mt-4 mb-2">أو اختر صورة معتمدة</p>
          <div className="grid grid-cols-4 gap-2">
            {library.backgrounds.map((b) => (
              <button key={b.id} type="button" onClick={() => set({ image: { src: b.src, zoom: 1, x: 50, y: 50 } })}
                className="aspect-square rounded-lg bg-cover bg-center ring-1 ring-line hover:ring-teal" style={{ backgroundImage: `url(${b.src})` }} aria-label={b.name} />
            ))}
          </div>
        </>
      )}
      {img && (
        <div className="mt-4">
          <Slider label="التكبير" value={img.zoom} min={1} max={3} step={0.05} fmt={(v) => `${v.toFixed(1)}×`} onChange={(v) => set({ image: { ...img, zoom: v } })} />
          <Slider label="الموضع أفقياً" value={img.x} min={0} max={100} step={1} fmt={(v) => `${Math.round(v)}٪`} onChange={(v) => set({ image: { ...img, x: v } })} />
          <Slider label="الموضع رأسياً" value={img.y} min={0} max={100} step={1} fmt={(v) => `${Math.round(v)}٪`} onChange={(v) => set({ image: { ...img, y: v } })} />
        </div>
      )}
    </Group>
  );
}
