"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { LogoFile } from "@/lib/types";
import { useLibrary } from "@/lib/library";
import { HexGrid, HexRings, logoSrc } from "@/components/design/parts";

const LOGOS: { file: LogoFile; name: string; bg: string }[] = [
  { file: "vertical-light", name: "رأسي على خلفية فاتحة", bg: "#FFFFFF" },
  { file: "vertical-dark", name: "رأسي على الكحلي", bg: "#1C3F4E" },
  { file: "vertical-white", name: "أبيض على الفيروزي", bg: "#336D6E" },
  { file: "horizontal-light", name: "أفقي على خلفية فاتحة", bg: "#FFFFFF" },
  { file: "horizontal-dark", name: "أفقي على الكحلي", bg: "#1C3F4E" },
  { file: "mark", name: "الرمز وحده", bg: "#F3F8F8" },
];

const RULES = [
  "استخدم الشعار الملوّن على الخلفيات الفاتحة والكحلية، والأبيض على الفيروزي.",
  "اترك حول الشعار مساحة فارغة لا تقل عن ارتفاع حرف الألف في كلمة «أواصر».",
  "لا تغيّر ألوان الشعار، ولا تمدّه أو تضغطه، ولا تضف عليه ظلالاً أو إطارات.",
  "لا تضع الشعار فوق صورة مزدحمة؛ استخدم طبقة لونية من ألوان الهوية تحته.",
  "الرمز وحده يُستخدم في المساحات الصغيرة أو حين يظهر الاسم في مكان آخر من التصميم.",
];

export default function BrandPage() {
  const { library } = useLibrary();
  const c = library.brand.colors;
  const colors = [
    { name: "الكحلي", role: "اللون الأساسي للخلفيات والنصوص", hex: c.navy },
    { name: "الفيروزي", role: "الإبراز والأزرار والخلفيات الثانوية", hex: c.teal },
    { name: "الفيروزي الفاتح", role: "العناصر الزخرفية والتفاصيل على الداكن", hex: c.light },
  ];
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-16">
      <header>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">هوية أواصر</h1>
        <p className="mt-2 text-ink-soft max-w-2xl leading-8">مرجع مختصر لعناصر الهوية البصرية كما يستخدمها الاستوديو. كل قالب في الموقع مبني على هذه العناصر فقط.</p>
      </header>

      <section>
        <h2 className="text-xl font-bold text-navy mb-5">الشعار</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {LOGOS.map((l) => (
            <figure key={l.file} className="rounded-2xl ring-1 ring-line overflow-hidden bg-white">
              <div className="aspect-[4/3] grid place-items-center p-8" style={{ background: l.bg }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoSrc(library.brand, l.file)} alt={l.name} className="max-h-full max-w-full" />
              </div>
              <figcaption className="px-4 py-3 text-sm font-semibold text-ink-soft flex items-center justify-between gap-2">
                {l.name}
                <a href={logoSrc(library.brand, l.file)} download={`awasir-${l.file}.svg`} className="text-teal hover:underline text-xs">تحميل SVG</a>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-navy mb-5">الألوان</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {colors.map((col) => <Swatch key={col.hex} {...col} />)}
        </div>
        <p className="text-sm text-ink-faint mt-3">درجات أفتح من هذه الألوان مسموحة للخلفيات الهادئة. لا تُستخدم ألوان من خارج الهوية إلا كعنصر موسمي محدود.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-navy mb-5">الخط: Cairo</h2>
        <div className="panel divide-y divide-line">
          {[[900, "Black", "عناوين قصيرة ولافتة"], [800, "ExtraBold", "العناوين الرئيسية والأسماء"], [700, "Bold", "التفاصيل المهمة والتوقيع"], [500, "Medium", "النصوص والرسائل"]].map(([w, n, role]) => (
            <div key={n} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 px-5 py-4">
              <span className="w-28 text-sm text-ink-faint">{n} · {w}</span>
              <span className="text-3xl text-navy" style={{ fontWeight: Number(w) }}>أواصر تجمعنا</span>
              <span className="text-sm text-ink-soft ms-auto">{role}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-navy mb-5">النمط السداسي</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <figure className="panel overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden" style={{ background: c.navy }}>
              <HexRings stroke="rgba(140,192,199,.4)" count={9} className="absolute -left-16 -bottom-20 w-80 h-80" />
            </div>
            <figcaption className="px-4 py-3 text-sm text-ink-soft"><b className="text-navy">حلقات متداخلة</b> تخرج من حافة التصميم</figcaption>
          </figure>
          <figure className="panel overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "#E8F2F3" }}>
              <HexGrid stroke="rgba(51,109,110,.25)" cell={16} />
            </div>
            <figcaption className="px-4 py-3 text-sm text-ink-soft"><b className="text-navy">شبكة خلايا</b> خلفية هادئة للبطاقات</figcaption>
          </figure>
          <figure className="panel overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden grid place-items-center" style={{ background: `linear-gradient(155deg, ${c.navy}, ${c.teal})` }}>
              <HexRings stroke="rgba(140,192,199,.35)" count={9} className="absolute w-[130%] h-[130%]" />
            </div>
            <figcaption className="px-4 py-3 text-sm text-ink-soft"><b className="text-navy">حلقات مركزية</b> خلف النص في الأشكال الفاخرة</figcaption>
          </figure>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-navy mb-5">قواعد استخدام الشعار</h2>
        <ul className="panel divide-y divide-line">
          {RULES.map((r) => <li key={r} className="px-5 py-4 text-ink leading-8">{r}</li>)}
        </ul>
      </section>
    </main>
  );
}

function Swatch({ name, role, hex }: { name: string; role: string; hex: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="panel overflow-hidden">
      <div className="h-32" style={{ background: hex }} />
      <div className="p-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-navy">{name}</p>
          <p className="text-sm text-ink-soft">{role}</p>
        </div>
        <button className="btn-ghost btn-sm shrink-0 font-mono" dir="ltr"
          onClick={() => { navigator.clipboard?.writeText(hex); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>
          {copied ? <Check size={14} /> : <Copy size={14} />}{hex}
        </button>
      </div>
    </div>
  );
}
