"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Copy, Download, EyeOff, Pencil, Plus, Trash2, Upload } from "lucide-react";
import type { Brand, Category, Library, LogoFile, PresetGroup, Template, Tone } from "@/lib/types";
import { useLibrary } from "@/lib/library";
import { getUsage } from "@/lib/drafts";
import { readFileAsDataURL, readImageSized } from "@/lib/image";
import { logoSrc } from "@/components/design/parts";
import { TemplateEditor } from "./TemplateEditor";

type Tab = "templates" | "categories" | "presets" | "brand" | "backgrounds" | "usage" | "publish";
const TABS: [Tab, string][] = [
  ["templates", "القوالب"], ["categories", "التصنيفات"], ["presets", "النصوص الجاهزة"],
  ["brand", "الهوية والشعار"], ["backgrounds", "الخلفيات والصور"], ["usage", "الاستخدام"], ["publish", "النشر"],
];
const TONE_AR: Record<Tone, string> = { formal: "رسمية", family: "عائلية", short: "مختصرة", friendly: "ودية" };

export function AdminApp({ initialTab }: { initialTab?: string }) {
  const { library, save, hasLocalChanges, ready } = useLibrary();
  const [tab, setTab] = useState<Tab>((TABS.find(([t]) => t === initialTab)?.[0]) ?? "templates");
  const commit = (next: Library) => save(next);
  if (!ready) return <p className="p-10 text-ink-faint">جارٍ التحميل…</p>;

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy">لوحة الإدارة</h1>
          <p className="text-ink-soft mt-1">{library.templates.length} قالباً في {library.categories.length} تصنيفاً. التعديلات تُحفظ في هذا المتصفح حتى تنشرها.</p>
        </div>
        {hasLocalChanges && <button className="btn-teal" onClick={() => setTab("publish")}>نشر التعديلات للجميع</button>}
      </div>
      <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map(([id, name]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 pb-3 pt-1 text-[15px] font-bold whitespace-nowrap border-b-2 -mb-px ${tab === id ? "border-teal text-navy" : "border-transparent text-ink-faint hover:text-navy"}`}>{name}</button>
        ))}
      </nav>
      <div className="mt-6">
        {tab === "templates" && <TemplatesTab library={library} commit={commit} />}
        {tab === "categories" && <CategoriesTab library={library} commit={commit} />}
        {tab === "presets" && <PresetsTab library={library} commit={commit} />}
        {tab === "brand" && <BrandTab library={library} commit={commit} />}
        {tab === "backgrounds" && <BackgroundsTab library={library} commit={commit} />}
        {tab === "usage" && <UsageTab library={library} commit={commit} />}
        {tab === "publish" && <PublishTab library={library} commit={commit} />}
      </div>
    </main>
  );
}

type TabProps = { library: Library; commit: (l: Library) => void };

// ---------------- القوالب ----------------
function TemplatesTab({ library, commit }: TabProps) {
  const [editing, setEditing] = useState<{ t: Template; isNew: boolean } | null>(null);
  const [cat, setCat] = useState("");
  const list = library.templates.filter((t) => !cat || t.category === cat);
  const catName = (id: string) => library.categories.find((c) => c.id === id)?.name ?? "—";
  const upsert = (t: Template, originalId: string) => {
    const exists = library.templates.some((x) => x.id === originalId);
    commit({ ...library, templates: exists ? library.templates.map((x) => (x.id === originalId ? t : x)) : [...library.templates, t] });
    setEditing(null);
  };
  const uniqueId = (base: string) => { let i = 2, id = base; while (library.templates.some((t) => t.id === id)) id = `${base}-${i++}`; return id; };

  if (editing) {
    return (
      <div>
        <h2 className="text-xl font-bold text-navy mb-4">{editing.isNew ? "قالب جديد" : `تعديل: ${editing.t.name}`}</h2>
        <TemplateEditor initial={editing.t} library={library} onCancel={() => setEditing(null)} onSave={(t) => upsert(t, editing.isNew ? "\u0000" : editing.t.id)} />
      </div>
    );
  }
  const blank: Template = {
    id: uniqueId("new-template"), category: library.categories[0]?.id ?? "general", name: "قالب جديد", status: "paused",
    fields: [{ key: "headline", label: "العنوان", type: "text", required: true }, { key: "text", label: "النص", type: "textarea", presets: true }],
    defaults: {}, slots: { title: "{{headline}}", body: "{{text}}", footer: "{{signature}}" }, presetGroup: "announcement",
    styles: [{ style: "formal", theme: "navy", label: "رسمي" }, { style: "minimal", theme: "light", label: "بسيط" }, { style: "premium", theme: "navy", label: "فاخر" }],
    sizes: ["post", "portrait", "story", "whatsapp", "a4", "wide"], image: "optional",
  };
  return (
    <div>
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <select className="input !w-auto" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="تصفية حسب التصنيف">
          <option value="">كل التصنيفات</option>
          {library.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn-primary ms-auto" onClick={() => setEditing({ t: blank, isNew: true })}><Plus size={18} />قالب جديد</button>
      </div>
      <div className="panel overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-ink-soft text-right bg-mist-50">
            <tr><th className="p-3">القالب</th><th className="p-3">التصنيف</th><th className="p-3">الحالة</th><th className="p-3">الأشكال</th><th className="p-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((t) => (
              <tr key={t.id} className={t.status === "paused" ? "text-ink-faint" : ""}>
                <td className="p-3"><p className="font-bold text-navy">{t.name}</p><p className="text-xs text-ink-faint" dir="ltr">{t.id}</p></td>
                <td className="p-3">{catName(t.category)}</td>
                <td className="p-3">
                  <button className={`chip !h-8 ${t.status === "active" ? "!text-teal" : ""}`}
                    onClick={() => commit({ ...library, templates: library.templates.map((x) => (x.id === t.id ? { ...x, status: x.status === "active" ? "paused" : "active" } : x)) })}>
                    {t.status === "active" ? "مفعّل" : "موقوف مؤقتاً"}
                  </button>
                </td>
                <td className="p-3">{t.styles.length}</td>
                <td className="p-3">
                  <div className="flex gap-1 justify-end">
                    <button className="btn-ghost btn-sm !px-2" title="تعديل" onClick={() => setEditing({ t, isNew: false })}><Pencil size={15} /></button>
                    <button className="btn-ghost btn-sm !px-2" title="نسخ كقالب جديد"
                      onClick={() => setEditing({ t: { ...structuredClone(t), id: uniqueId(`${t.id}-copy`), name: `${t.name} (نسخة)`, status: "paused" }, isNew: true })}><Copy size={15} /></button>
                    <button className="btn-ghost btn-sm !px-2 hover:!text-amber-700" title="حذف"
                      onClick={() => confirm(`حذف قالب «${t.name}»؟ المسودات المبنية عليه لن تفتح بعد الحذف. إذا أردت إخفاءه مؤقتاً استخدم «إيقاف».`) &&
                        commit({ ...library, templates: library.templates.filter((x) => x.id !== t.id) })}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- التصنيفات ----------------
function CategoriesTab({ library, commit }: TabProps) {
  const cats = [...library.categories].sort((a, b) => a.order - b.order);
  const write = (next: Category[]) => commit({ ...library, categories: next.map((c, i) => ({ ...c, order: i })) });
  const up = (id: string, p: Partial<Category>) => write(cats.map((c) => (c.id === id ? { ...c, ...p } : c)));
  const move = (i: number, d: number) => { const a = [...cats]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; write(a); };
  const [newName, setNewName] = useState("");
  return (
    <div className="space-y-3 max-w-4xl">
      {cats.map((c, i) => {
        const count = library.templates.filter((t) => t.category === c.id).length;
        return (
          <div key={c.id} className={`panel p-3 grid grid-cols-1 md:grid-cols-[1fr_1.4fr_auto] gap-2 items-center ${c.hidden ? "opacity-60" : ""}`}>
            <input className="input !h-10 font-bold" value={c.name} onChange={(e) => up(c.id, { name: e.target.value })} aria-label="اسم التصنيف" />
            <input className="input !h-10" value={c.description} onChange={(e) => up(c.id, { description: e.target.value })} aria-label="الوصف" />
            <div className="flex gap-1 items-center justify-end">
              <span className="text-xs text-ink-faint w-14 text-center">{count} قالب</span>
              <button className="btn-ghost btn-sm !px-2" onClick={() => move(i, -1)} aria-label="أعلى"><ArrowUp size={15} /></button>
              <button className="btn-ghost btn-sm !px-2" onClick={() => move(i, 1)} aria-label="أسفل"><ArrowDown size={15} /></button>
              <button className={`btn-ghost btn-sm !px-2 ${c.hidden ? "!text-teal" : ""}`} title={c.hidden ? "إظهار" : "إخفاء"} onClick={() => up(c.id, { hidden: !c.hidden })}><EyeOff size={15} /></button>
              <button className="btn-ghost btn-sm !px-2" title="حذف" disabled={count > 0}
                onClick={() => confirm(`حذف تصنيف «${c.name}»؟`) && write(cats.filter((x) => x.id !== c.id))}><Trash2 size={15} /></button>
            </div>
          </div>
        );
      })}
      <p className="text-xs text-ink-faint">لا يمكن حذف تصنيف فيه قوالب؛ انقل قوالبه أو احذفها أولاً، أو أخفِ التصنيف.</p>
      <div className="flex gap-2 max-w-md pt-2">
        <input className="input" placeholder="اسم التصنيف الجديد" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button className="btn-primary" disabled={!newName.trim()} onClick={() => {
          let id = `cat-${Date.now().toString(36)}`;
          while (cats.some((c) => c.id === id)) id += "x";
          write([...cats, { id, name: newName.trim(), description: "", order: cats.length }]);
          setNewName("");
        }}><Plus size={16} />إضافة</button>
      </div>
    </div>
  );
}

// ---------------- النصوص الجاهزة ----------------
function PresetsTab({ library, commit }: TabProps) {
  const [gid, setGid] = useState(library.presets[0]?.id ?? "");
  const g = library.presets.find((p) => p.id === gid);
  const writeGroup = (next: PresetGroup) => commit({ ...library, presets: library.presets.map((p) => (p.id === next.id ? next : p)) });
  const usedBy = library.templates.filter((t) => t.presetGroup === gid).map((t) => t.name);
  return (
    <div className="grid md:grid-cols-[260px_1fr] gap-6">
      <div className="panel p-2 max-h-[70dvh] overflow-auto">
        {library.presets.map((p) => (
          <button key={p.id} onClick={() => setGid(p.id)} className={`w-full text-start rounded-lg px-3 py-2 text-sm ${p.id === gid ? "bg-navy text-white" : "hover:bg-mist-50"}`}>
            {p.name} <span className="opacity-60">({p.texts.length})</span>
          </button>
        ))}
        <button className="btn-ghost btn-sm w-full mt-2" onClick={() => {
          const id = `group-${Date.now().toString(36)}`;
          commit({ ...library, presets: [...library.presets, { id, name: "مجموعة جديدة", texts: [] }] });
          setGid(id);
        }}><Plus size={15} />مجموعة جديدة</button>
      </div>
      {g && (
        <div className="space-y-3">
          <input className="input font-bold max-w-sm" value={g.name} onChange={(e) => writeGroup({ ...g, name: e.target.value })} aria-label="اسم المجموعة" />
          <p className="text-xs text-ink-faint">{usedBy.length ? `تستخدمها: ${usedBy.join("، ")}` : "لا يستخدمها أي قالب بعد."}</p>
          {g.texts.map((t, i) => (
            <div key={i} className="panel p-3 grid md:grid-cols-[120px_1fr_auto] gap-2 items-start">
              <select className="input !h-10" value={t.tone} onChange={(e) => writeGroup({ ...g, texts: g.texts.map((x, j) => (j === i ? { ...x, tone: e.target.value as Tone } : x)) })}>
                {(Object.keys(TONE_AR) as Tone[]).map((k) => <option key={k} value={k}>{TONE_AR[k]}</option>)}
              </select>
              <textarea className="input" rows={2} value={t.text} onChange={(e) => writeGroup({ ...g, texts: g.texts.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })} />
              <button className="btn-ghost btn-sm !px-2" onClick={() => writeGroup({ ...g, texts: g.texts.filter((_, j) => j !== i) })} aria-label="حذف"><Trash2 size={15} /></button>
            </div>
          ))}
          <button className="btn-ghost btn-sm" onClick={() => writeGroup({ ...g, texts: [...g.texts, { tone: "formal", text: "" }] })}><Plus size={15} />نص جديد</button>
        </div>
      )}
    </div>
  );
}

// ---------------- الهوية ----------------
const LOGO_FILES: [LogoFile, string, string][] = [
  ["vertical-light", "رأسي - خلفية فاتحة", "#fff"], ["vertical-dark", "رأسي - خلفية كحلية", "#1C3F4E"], ["vertical-white", "رأسي - أبيض", "#336D6E"],
  ["horizontal-light", "أفقي - خلفية فاتحة", "#fff"], ["horizontal-dark", "أفقي - خلفية كحلية", "#1C3F4E"], ["horizontal-white", "أفقي - أبيض", "#336D6E"],
  ["mark", "الرمز", "#F3F8F8"], ["mark-white", "الرمز - أبيض", "#336D6E"],
];
function BrandTab({ library, commit }: TabProps) {
  const b = library.brand;
  const setB = (p: Partial<Brand>) => commit({ ...library, brand: { ...b, ...p } });
  return (
    <div className="space-y-8 max-w-4xl">
      <section className="panel p-5 grid sm:grid-cols-2 gap-4">
        <label className="block"><span className="label">التوقيع الافتراضي</span><input className="input" value={b.signature} onChange={(e) => setB({ signature: e.target.value })} /></label>
        <label className="block"><span className="label">الأرقام في التواريخ</span>
          <select className="input" value={b.digits} onChange={(e) => setB({ digits: e.target.value as Brand["digits"] })}>
            <option value="arabic">عربية (١٢٣)</option><option value="latin">لاتينية (123)</option>
          </select>
        </label>
      </section>
      <section className="panel p-5">
        <h3 className="font-bold text-navy">ألوان الهوية</h3>
        <p className="text-xs text-ink-faint mt-1">تغييرها يغيّر كل القوالب. القيم الرسمية: ‎#1C3F4E ‎#336D6E ‎#8CC0C7</p>
        <div className="mt-4 flex flex-wrap gap-6">
          {([["navy", "الكحلي"], ["teal", "الفيروزي"], ["light", "الفيروزي الفاتح"]] as const).map(([k, n]) => (
            <label key={k} className="flex items-center gap-3">
              <input type="color" value={b.colors[k]} onChange={(e) => setB({ colors: { ...b.colors, [k]: e.target.value.toUpperCase() } })} className="h-11 w-14 rounded-lg ring-1 ring-line cursor-pointer" />
              <span><span className="block text-sm font-semibold">{n}</span><span className="text-xs text-ink-faint font-mono" dir="ltr">{b.colors[k]}</span></span>
            </label>
          ))}
        </div>
        <button className="btn-ghost btn-sm mt-4" onClick={() => setB({ colors: { navy: "#1C3F4E", teal: "#336D6E", light: "#8CC0C7" } })}>استعادة الألوان الرسمية</button>
      </section>
      <section className="panel p-5">
        <h3 className="font-bold text-navy">ملفات الشعار</h3>
        <p className="text-xs text-ink-faint mt-1">ارفع نسخة SVG أو PNG شفافة لتحديث الشعار في كل التصاميم.</p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {LOGO_FILES.map(([f, n, bg]) => <LogoSlot key={f} file={f} name={n} bg={bg} brand={b} onChange={(src) => {
            const logos = { ...(b.logos ?? {}) };
            if (src) logos[f] = src; else delete logos[f];
            setB({ logos });
          }} />)}
        </div>
      </section>
    </div>
  );
}
function LogoSlot({ file, name, bg, brand, onChange }: { file: LogoFile; name: string; bg: string; brand: Brand; onChange: (src?: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const custom = Boolean(brand.logos?.[file]);
  return (
    <div className="rounded-xl ring-1 ring-line overflow-hidden">
      <div className="aspect-[4/3] grid place-items-center p-4" style={{ background: bg }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc(brand, file)} alt={name} className="max-h-full max-w-full" />
      </div>
      <div className="p-2">
        <p className="text-xs font-semibold">{name}</p>
        <div className="flex gap-1 mt-1.5">
          <button className="btn-ghost btn-sm !h-8 !px-2 !text-xs" onClick={() => ref.current?.click()}><Upload size={13} />استبدال</button>
          {custom && <button className="btn-ghost btn-sm !h-8 !px-2 !text-xs" onClick={() => onChange(undefined)}>الأصلي</button>}
        </div>
        <input ref={ref} type="file" accept="image/svg+xml,image/png" className="hidden" onChange={async (e) => {
          const f = e.target.files?.[0]; e.target.value = "";
          if (f) onChange(await readFileAsDataURL(f));
        }} />
      </div>
    </div>
  );
}

// ---------------- الخلفيات ----------------
function BackgroundsTab({ library, commit }: TabProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="max-w-4xl">
      <p className="text-ink-soft leading-7">الصور هنا تظهر للمستخدمين كخلفيات معتمدة في «تخصيص التصميم»، وكصور جاهزة في القوالب التي تقبل صورة. تُضغط تلقائياً لتبقى المكتبة خفيفة. استخدم صوراً تملك الأسرة حق استخدامها.</p>
      <button className="btn-primary mt-4" disabled={busy} onClick={() => ref.current?.click()}><Upload size={16} />{busy ? "جارٍ الرفع…" : "رفع صورة"}</button>
      <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
        const files = Array.from(e.target.files ?? []); e.target.value = "";
        if (!files.length) return;
        setBusy(true);
        const added = [];
        for (const f of files) {
          try { added.push({ id: `bg-${Date.now().toString(36)}-${added.length}`, name: f.name.replace(/\.[^.]+$/, ""), src: await readImageSized(f, 1600) }); }
          catch { alert(`تعذرت قراءة ${f.name}`); }
        }
        commit({ ...library, backgrounds: [...library.backgrounds, ...added] });
        setBusy(false);
      }} />
      {library.backgrounds.length === 0 ? (
        <p className="mt-8 panel p-8 text-center text-ink-soft">لا توجد خلفيات بعد.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {library.backgrounds.map((bg) => (
            <div key={bg.id} className="panel overflow-hidden">
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${bg.src})` }} />
              <div className="p-2 flex gap-1">
                <input className="input !h-9 text-sm" value={bg.name} aria-label="اسم الخلفية"
                  onChange={(e) => commit({ ...library, backgrounds: library.backgrounds.map((x) => (x.id === bg.id ? { ...x, name: e.target.value } : x)) })} />
                <button className="btn-ghost btn-sm !px-2" aria-label="حذف" onClick={() => commit({ ...library, backgrounds: library.backgrounds.filter((x) => x.id !== bg.id) })}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- الاستخدام ----------------
function UsageTab({ library, commit }: TabProps) {
  const [usage, setUsage] = useState<Record<string, number>>({});
  useEffect(() => { getUsage().then(setUsage); }, []);
  const rows = [...library.templates].sort((a, b) => (usage[b.id] ?? 0) - (usage[a.id] ?? 0));
  return (
    <div className="max-w-3xl">
      <p className="text-ink-soft leading-7">عدد مرات التحميل من هذا المتصفح. حدّد القوالب التي تظهر في قسم «الأكثر استخداماً» في الصفحة الرئيسية (يظهر أول ستة).</p>
      <div className="panel mt-4 divide-y divide-line">
        {rows.map((t) => (
          <label key={t.id} className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer">
            <input type="checkbox" className="h-4 w-4 accent-teal" checked={Boolean(t.featured)}
              onChange={(e) => commit({ ...library, templates: library.templates.map((x) => (x.id === t.id ? { ...x, featured: e.target.checked } : x)) })} />
            <span className="flex-1 font-semibold">{t.name}</span>
            <span className="text-ink-faint tabular-nums">{usage[t.id] ?? 0} تحميل</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ---------------- النشر ----------------
function PublishTab({ library, commit }: TabProps) {
  const { hasLocalChanges, discard } = useLibrary();
  const ref = useRef<HTMLInputElement>(null);
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(library, null, 1)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "library.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const size = new Blob([JSON.stringify(library)]).size;
  return (
    <div className="max-w-3xl space-y-6">
      <section className="panel p-6">
        <h3 className="font-bold text-navy text-lg">كيف تصل تعديلاتك لكل المستخدمين</h3>
        <p className="text-ink-soft mt-1 leading-7">تعديلات لوحة الإدارة تُحفظ أولاً في هذا المتصفح فقط، حتى تراجعها بهدوء. لنشرها:</p>
        <ol className="mt-4 space-y-2 list-decimal pr-5 leading-7">
          <li>اضغط «تحميل ملف المكتبة» أدناه.</li>
          <li>في مستودع المشروع على GitHub افتح مجلد <code className="bg-mist-100 rounded px-1" dir="ltr">data</code>، ثم Add file ثم Upload files، وارفع الملف <code className="bg-mist-100 rounded px-1" dir="ltr">library.json</code> ليستبدل القديم.</li>
          <li>اضغط Commit changes. ينشر Vercel التحديث تلقائياً خلال دقيقة أو دقيقتين.</li>
        </ol>
        <div className="mt-5 flex flex-wrap gap-2">
          <button className="btn-primary" onClick={exportJson}><Download size={17} />تحميل ملف المكتبة</button>
          <button className="btn-ghost" onClick={() => ref.current?.click()}><Upload size={17} />استيراد ملف مكتبة</button>
        </div>
        <p className="text-xs text-ink-faint mt-3">حجم المكتبة الحالي {(size / 1024).toFixed(0)} كيلوبايت{size > 3_000_000 ? " — كبير؛ قلّل عدد الخلفيات أو حجمها ليبقى الموقع سريعاً" : ""}.</p>
        <input ref={ref} type="file" accept="application/json" className="hidden" onChange={async (e) => {
          const f = e.target.files?.[0]; e.target.value = "";
          if (!f) return;
          try {
            const data = JSON.parse(await f.text()) as Library;
            if (!Array.isArray(data.templates) || !Array.isArray(data.categories) || !data.brand) throw new Error();
            if (confirm(`استيراد مكتبة فيها ${data.templates.length} قالباً؟ ستحل محل التعديلات الحالية في هذا المتصفح.`)) commit(data);
          } catch { alert("الملف ليس ملف مكتبة صالحاً لاستوديو أواصر."); }
        }} />
      </section>
      {hasLocalChanges && (
        <section className="panel p-6">
          <h3 className="font-bold text-navy">التراجع عن التعديلات</h3>
          <p className="text-ink-soft mt-1 leading-7">يحذف كل تعديلات هذا المتصفح غير المنشورة ويعيد المكتبة المنشورة حالياً.</p>
          <button className="btn-ghost mt-4 hover:!text-amber-700" onClick={() => confirm("حذف كل التعديلات غير المنشورة؟") && discard()}>تراجع عن كل التعديلات</button>
        </section>
      )}
    </div>
  );
}
