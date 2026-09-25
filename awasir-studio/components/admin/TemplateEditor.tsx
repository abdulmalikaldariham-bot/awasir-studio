"use client";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { DetailSlot, Field, FieldType, IconName, Library, SizeId, StatSlot, StyleId, Template, ThemeId } from "@/lib/types";
import { SIZES, SIZE_ORDER, STYLE_INFO, THEME_NAMES } from "@/lib/design";
import { sampleValues } from "@/lib/library";
import { Preview } from "@/components/design/Preview";
import { OCCASIONS, OCCASION_ORDER, occasionOf, type ArtId, type OccasionId } from "@/lib/occasions";
import { ART_NAMES } from "@/components/design/art";

const FIELD_TYPES: [FieldType, string][] = [["text", "نص قصير"], ["textarea", "نص طويل"], ["date", "تاريخ"], ["select", "اختيار"], ["url", "رابط"], ["number", "رقم"]];
const ICONS: IconName[] = ["calendar", "clock", "pin", "building", "user", "users", "link", "info", "phone", "star", "book", "flag"];
const ICON_AR: Record<IconName, string> = { calendar: "تقويم", clock: "ساعة", pin: "موقع", building: "مبنى", user: "شخص", users: "أشخاص", link: "رابط", info: "معلومة", phone: "هاتف", star: "نجمة", book: "كتاب", flag: "راية" };

export function TemplateEditor({ initial, library, onSave, onCancel }: {
  initial: Template; library: Library; onSave: (t: Template) => void; onCancel: () => void;
}) {
  const [t, setT] = useState<Template>(initial);
  const [previewStyle, setPreviewStyle] = useState(0);
  const set = (p: Partial<Template>) => setT((x) => ({ ...x, ...p }));
  const setSlot = (k: keyof Template["slots"], v: unknown) => setT((x) => ({ ...x, slots: { ...x.slots, [k]: v } }));
  const values = useMemo(() => sampleValues(t, library), [t, library]);
  const keys = t.fields.map((f) => f.key);
  const idTaken = t.id !== initial.id && library.templates.some((x) => x.id === t.id);
  const errors = [
    !t.name.trim() && "اسم القالب مطلوب",
    !/^[a-z0-9-]+$/.test(t.id) && "المعرّف يُكتب بحروف إنجليزية صغيرة وأرقام وشرطات فقط",
    idTaken && "هذا المعرّف مستخدم لقالب آخر",
    t.styles.length === 0 && "أضف شكلاً واحداً على الأقل",
    t.sizes.length === 0 && "اختر مقاساً واحداً على الأقل",
    new Set(keys).size !== keys.length && "يوجد حقلان بنفس المفتاح",
    keys.some((k) => !/^[a-zA-Z][a-zA-Z0-9]*$/.test(k)) && "مفتاح الحقل يُكتب بحروف إنجليزية وأرقام فقط",
  ].filter(Boolean) as string[];

  const move = <T,>(arr: T[], i: number, d: number) => {
    const a = [...arr]; const j = i + d;
    if (j < 0 || j >= a.length) return a;
    [a[i], a[j]] = [a[j], a[i]]; return a;
  };

  return (
    <div className="grid xl:grid-cols-[1fr_380px] gap-6 items-start">
      <div className="space-y-6">
        <Box title="المعلومات الأساسية">
          <div className="grid sm:grid-cols-2 gap-4">
            <L label="اسم القالب"><input className="input" value={t.name} onChange={(e) => set({ name: e.target.value })} /></L>
            <L label="المعرّف (يظهر في الرابط)"><input className="input text-left" dir="ltr" value={t.id} onChange={(e) => set({ id: e.target.value.trim() })} /></L>
            <L label="التصنيف">
              <select className="input" value={t.category} onChange={(e) => set({ category: e.target.value })}>
                {library.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </L>
            <L label="طابع المناسبة البصري">
              <select className="input" value={t.occasion ?? ""} onChange={(e) => set({ occasion: (e.target.value || undefined) as OccasionId | undefined })}>
                <option value="">حسب التصنيف ({occasionOf({ category: t.category }).name})</option>
                {OCCASION_ORDER.map((o) => <option key={o} value={o}>{OCCASIONS[o].name}</option>)}
              </select>
            </L>
            <L label="العنصر الرئيسي">
              <select className="input" value={t.art ?? ""} onChange={(e) => set({ art: (e.target.value || undefined) as ArtId | undefined })}>
                <option value="">حسب المناسبة ({ART_NAMES[occasionOf(t).hero]})</option>
                {(Object.keys(ART_NAMES) as ArtId[]).map((a) => <option key={a} value={a}>{ART_NAMES[a]}</option>)}
              </select>
            </L>
            <L label="الصورة">
              <select className="input" value={t.image} onChange={(e) => set({ image: e.target.value as Template["image"] })}>
                <option value="none">بدون صورة</option><option value="optional">صورة اختيارية</option><option value="recommended">يُنصح بصورة</option>
              </select>
            </L>
            <L label="وصف قصير" className="sm:col-span-2"><input className="input" value={t.description ?? ""} onChange={(e) => set({ description: e.target.value })} /></L>
            <L label="مجموعة النصوص الجاهزة">
              <select className="input" value={t.presetGroup ?? ""} onChange={(e) => set({ presetGroup: e.target.value || undefined })}>
                <option value="">بدون</option>
                {library.presets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </L>
            <div className="flex items-end gap-4 pb-2">
              <Check label="مفعّل" checked={t.status === "active"} onChange={(v) => set({ status: v ? "active" : "paused" })} />
              <Check label="من الأكثر استخداماً" checked={Boolean(t.featured)} onChange={(v) => set({ featured: v })} />
            </div>
          </div>
        </Box>

        <Box title="الحقول" hint="ما يكتبه المستخدم. استخدم مفتاح الحقل داخل نصوص التصميم هكذا: {{key}}">
          <div className="space-y-3">
            {t.fields.map((f, i) => {
              const up = (p: Partial<Field>) => set({ fields: t.fields.map((x, j) => (j === i ? { ...x, ...p } : x)) });
              return (
                <div key={i} className="rounded-xl ring-1 ring-line p-3 bg-mist-50">
                  <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_130px_auto] gap-2 items-end">
                    <L label="العنوان"><input className="input !h-10" value={f.label} onChange={(e) => up({ label: e.target.value })} /></L>
                    <L label="المفتاح"><input className="input !h-10 text-left" dir="ltr" value={f.key} onChange={(e) => up({ key: e.target.value.trim() })} /></L>
                    <L label="النوع">
                      <select className="input !h-10" value={f.type} onChange={(e) => up({ type: e.target.value as FieldType })}>
                        {FIELD_TYPES.map(([id, n]) => <option key={id} value={id}>{n}</option>)}
                      </select>
                    </L>
                    <div className="flex gap-1 col-span-2 md:col-span-1 justify-end">
                      <button className="btn-ghost btn-sm !px-2" onClick={() => set({ fields: move(t.fields, i, -1) })} aria-label="أعلى"><ArrowUp size={15} /></button>
                      <button className="btn-ghost btn-sm !px-2" onClick={() => set({ fields: move(t.fields, i, 1) })} aria-label="أسفل"><ArrowDown size={15} /></button>
                      <button className="btn-ghost btn-sm !px-2" onClick={() => set({ fields: t.fields.filter((_, j) => j !== i) })} aria-label="حذف"><Trash2 size={15} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 mt-2 items-center">
                    <input className="input !h-10" placeholder="مثال يظهر داخل الحقل" value={f.placeholder ?? ""} onChange={(e) => up({ placeholder: e.target.value || undefined })} />
                    <div className="flex flex-wrap gap-3">
                      <Check label="مطلوب" checked={Boolean(f.required)} onChange={(v) => up({ required: v || undefined })} />
                      {f.type === "textarea" && <Check label="نصوص جاهزة" checked={Boolean(f.presets)} onChange={(v) => up({ presets: v || undefined })} />}
                      {f.type === "url" && <Check label="رمز QR" checked={Boolean(f.qr)} onChange={(v) => up({ qr: v || undefined })} />}
                    </div>
                  </div>
                  {f.type === "select" && (
                    <input className="input !h-10 mt-2" placeholder="الخيارات مفصولة بفاصلة: ذكر، أنثى" value={(f.options ?? []).join("، ")}
                      onChange={(e) => up({ options: e.target.value.split(/[،,]/).map((s) => s.trim()).filter(Boolean) })} />
                  )}
                </div>
              );
            })}
            <button className="btn-ghost btn-sm" onClick={() => set({ fields: [...t.fields, { key: `field${t.fields.length + 1}`, label: "حقل جديد", type: "text" }] })}>
              <Plus size={15} />إضافة حقل
            </button>
          </div>
        </Box>

        <Box title="نصوص التصميم" hint="[[ ... ]] يُخفى المقطع كاملاً إذا كان حقله فارغاً. للتاريخ: {{date|full}} أو |hijri أو |gregorian أو |weekday. للجنس: {{gender|g:ابنه:ابنته}}. {{signature}} توقيع الأسرة الافتراضي.">
          <div className="text-xs text-ink-soft mb-3 flex flex-wrap gap-1.5" dir="ltr">
            {keys.map((k) => <code key={k} className="rounded bg-mist-100 px-1.5 py-0.5">{`{{${k}}}`}</code>)}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {([["eyebrow", "العنوان الصغير"], ["title", "العنوان الرئيسي"], ["subtitle", "السطر الثانوي"], ["footer", "التوقيع"]] as const).map(([k, n]) => (
              <L key={k} label={n}><input className="input" value={t.slots[k] ?? ""} onChange={(e) => setSlot(k, e.target.value)} /></L>
            ))}
            <L label="النص" className="sm:col-span-2"><input className="input" value={t.slots.body ?? ""} onChange={(e) => setSlot("body", e.target.value)} /></L>
            <L label="ملاحظة" className="sm:col-span-2"><input className="input" value={t.slots.note ?? ""} onChange={(e) => setSlot("note", e.target.value)} /></L>
            <L label="حقل رمز QR">
              <select className="input" value={t.slots.qr ?? ""} onChange={(e) => setSlot("qr", e.target.value || undefined)}>
                <option value="">بدون</option>
                {t.fields.filter((f) => f.type === "url").map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
              </select>
            </L>
            <L label="عبارة بجانب QR"><input className="input" value={t.slots.qrLabel ?? ""} onChange={(e) => setSlot("qrLabel", e.target.value)} /></L>
            <L label="الترتيب الافتراضي">
              <select className="input" value={t.slots.order ?? "title-first"} onChange={(e) => setSlot("order", e.target.value)}>
                <option value="title-first">العنوان ثم النص</option><option value="body-first">النص ثم العنوان</option>
              </select>
            </L>
          </div>

          <p className="label mt-5">سطور التفاصيل</p>
          <div className="space-y-2">
            {(t.slots.details ?? []).map((d, i) => {
              const arr = t.slots.details ?? [];
              const up = (p: Partial<DetailSlot>) => setSlot("details", arr.map((x, j) => (j === i ? { ...x, ...p } : x)));
              return (
                <div key={i} className="grid grid-cols-[110px_120px_1fr_auto] gap-2">
                  <select className="input !h-10" value={d.icon} onChange={(e) => up({ icon: e.target.value as IconName })}>
                    {ICONS.map((ic) => <option key={ic} value={ic}>{ICON_AR[ic]}</option>)}
                  </select>
                  <input className="input !h-10" placeholder="تسمية" value={d.label} onChange={(e) => up({ label: e.target.value })} />
                  <input className="input !h-10" placeholder="{{date|full}}" value={d.value} onChange={(e) => up({ value: e.target.value })} />
                  <button className="btn-ghost btn-sm !px-2" onClick={() => setSlot("details", arr.filter((_, j) => j !== i))} aria-label="حذف"><Trash2 size={15} /></button>
                </div>
              );
            })}
            <button className="btn-ghost btn-sm" onClick={() => setSlot("details", [...(t.slots.details ?? []), { icon: "info", label: "", value: "" }])}><Plus size={15} />سطر تفاصيل</button>
          </div>

          <p className="label mt-5">الأرقام (للتقارير)</p>
          <div className="space-y-2">
            {(t.slots.stats ?? []).map((s, i) => {
              const arr = t.slots.stats ?? [];
              const up = (p: Partial<StatSlot>) => setSlot("stats", arr.map((x, j) => (j === i ? { ...x, ...p } : x)));
              return (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <input className="input !h-10" placeholder="التسمية" value={s.label} onChange={(e) => up({ label: e.target.value })} />
                  <input className="input !h-10" placeholder="{{s1}}" value={s.value} onChange={(e) => up({ value: e.target.value })} />
                  <button className="btn-ghost btn-sm !px-2" onClick={() => setSlot("stats", arr.filter((_, j) => j !== i))} aria-label="حذف"><Trash2 size={15} /></button>
                </div>
              );
            })}
            <button className="btn-ghost btn-sm" onClick={() => setSlot("stats", [...(t.slots.stats ?? []), { label: "", value: "" }])}><Plus size={15} />رقم</button>
          </div>
        </Box>

        <Box title="الأشكال" hint="من ٣ إلى ٦ أشكال. الاسم يظهر للمستخدم عند الاختيار.">
          <div className="space-y-2">
            {t.styles.map((s, i) => {
              const up = (p: Partial<typeof s>) => set({ styles: t.styles.map((x, j) => (j === i ? { ...x, ...p } : x)) });
              return (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                  <select className="input !h-10" value={s.style} onChange={(e) => up({ style: e.target.value as StyleId, theme: STYLE_INFO[e.target.value as StyleId].defaultTheme })}>
                    {(Object.keys(STYLE_INFO) as StyleId[]).map((id) => <option key={id} value={id}>{STYLE_INFO[id].name}</option>)}
                  </select>
                  <select className="input !h-10" value={s.theme} onChange={(e) => up({ theme: e.target.value as ThemeId })}>
                    {(Object.keys(THEME_NAMES) as ThemeId[]).map((id) => <option key={id} value={id}>{THEME_NAMES[id]}</option>)}
                  </select>
                  <input className="input !h-10" value={s.label} onChange={(e) => up({ label: e.target.value })} placeholder="الاسم الظاهر" />
                  <div className="flex gap-1">
                    <button className="btn-ghost btn-sm !px-2" onClick={() => setPreviewStyle(i)} aria-label="معاينة">عرض</button>
                    <button className="btn-ghost btn-sm !px-2" onClick={() => set({ styles: t.styles.filter((_, j) => j !== i) })} aria-label="حذف"><Trash2 size={15} /></button>
                  </div>
                </div>
              );
            })}
            {t.styles.length < 6 && (
              <button className="btn-ghost btn-sm" onClick={() => set({ styles: [...t.styles, { style: "minimal", theme: "light", label: "بسيط" }] })}><Plus size={15} />شكل</button>
            )}
          </div>
          <p className="label mt-5">المقاسات المتاحة</p>
          <div className="flex flex-wrap gap-3">
            {SIZE_ORDER.map((s: SizeId) => (
              <Check key={s} label={SIZES[s].name} checked={t.sizes.includes(s)}
                onChange={(v) => set({ sizes: v ? SIZE_ORDER.filter((x) => x === s || t.sizes.includes(x)) : t.sizes.filter((x) => x !== s) })} />
            ))}
          </div>
        </Box>
      </div>

      <div className="xl:sticky xl:top-24 space-y-4">
        <div className="panel p-3">
          <p className="text-sm font-semibold text-ink-soft mb-2 px-1">معاينة ببيانات تجريبية</p>
          {t.styles.length > 0 && (
            <Preview template={t} values={values} styleIndex={Math.min(previewStyle, t.styles.length - 1)} size="portrait" className="w-full rounded-lg overflow-hidden" />
          )}
        </div>
        {errors.length > 0 && (
          <ul className="rounded-xl bg-amber-50 text-amber-800 text-sm p-3 space-y-1">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
        )}
        <div className="flex gap-2">
          <button className="btn-primary flex-1" disabled={errors.length > 0} onClick={() => onSave(t)}>حفظ القالب</button>
          <button className="btn-ghost" onClick={onCancel}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

function Box({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="panel p-5">
      <h3 className="font-bold text-navy">{title}</h3>
      {hint && <p className="text-xs text-ink-faint mt-1 leading-6">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
function L({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`block ${className ?? ""}`}><span className="label !text-[13px]">{label}</span>{children}</label>;
}
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
      <input type="checkbox" className="h-4 w-4 accent-teal" checked={checked} onChange={(e) => onChange(e.target.checked)} />{label}
    </label>
  );
}
