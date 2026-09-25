"use client";
import Link from "next/link";
import { use, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Template } from "@/lib/types";
import { activeTemplates, useLibrary } from "@/lib/library";
import { TemplateCard, TemplateModal } from "@/components/ui/TemplateCard";

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { library, ready } = useLibrary();
  const [open, setOpen] = useState<Template | null>(null);
  const cat = library.categories.find((c) => c.id === id);
  const list = activeTemplates(library, id);

  if (ready && !cat) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy">هذا التصنيف غير موجود</h1>
        <p className="text-ink-soft mt-2">ربما حُذف أو تغير اسمه.</p>
        <Link href="/" className="btn-primary mt-6">العودة للتصنيفات</Link>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-navy"><ChevronRight size={16} />كل التصنيفات</Link>
      <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-navy">{cat?.name}</h1>
      <p className="mt-2 text-ink-soft">{cat?.description}</p>
      {list.length === 0 ? (
        <div className="mt-10 panel p-10 text-center">
          <p className="font-bold text-navy">لا توجد قوالب في هذا التصنيف بعد</p>
          <p className="text-ink-soft mt-1">استخدم التصميم العام حتى تُضاف قوالب هنا.</p>
          <Link href="/c/general" className="btn-teal mt-5">التصميم العام</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {list.map((t, i) => <TemplateCard key={t.id} t={t} onOpen={setOpen} priority={i < 4} />)}
        </div>
      )}
      <TemplateModal t={open} onClose={() => setOpen(null)} />
    </main>
  );
}
