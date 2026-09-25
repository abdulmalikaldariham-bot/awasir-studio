"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Copy, Pencil, Repeat, Trash2 } from "lucide-react";
import type { Draft } from "@/lib/types";
import { drafts, newId } from "@/lib/drafts";
import { useLibrary } from "@/lib/library";
import { SIZES } from "@/lib/design";
import { Preview } from "@/components/design/Preview";
import { WhenVisible } from "@/components/ui/Thumb";

const when = (iso: string) =>
  new Intl.DateTimeFormat("ar-SA-u-nu-arab", { day: "numeric", month: "long", hour: "numeric", minute: "2-digit" }).format(new Date(iso));

export default function DraftsPage() {
  const { library } = useLibrary();
  const [list, setList] = useState<Draft[] | null>(null);
  const load = () => drafts.list().then(setList).catch(() => setList([]));
  useEffect(() => { load(); }, []);

  const remove = async (d: Draft) => {
    if (!confirm(`حذف «${d.name}» من مسوداتك؟ لا يمكن التراجع.`)) return;
    await drafts.remove(d.id);
    load();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">مسوداتي</h1>
      <p className="mt-2 text-ink-soft">التصاميم التي حفظتها، محفوظة في هذا المتصفح على هذا الجهاز.</p>

      {list === null ? (
        <p className="mt-10 text-ink-faint">جارٍ التحميل…</p>
      ) : list.length === 0 ? (
        <div className="mt-10 panel p-10 text-center max-w-xl">
          <p className="text-lg font-bold text-navy">لا توجد مسودات بعد</p>
          <p className="text-ink-soft mt-1">عند العمل على تصميم اضغط «حفظ في مسوداتي» لتعود إليه لاحقاً.</p>
          <Link href="/" className="btn-primary mt-6">ابدأ تصميماً</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {list.map((d) => {
            const t = library.templates.find((x) => x.id === d.templateId);
            if (!t) {
              return (
                <div key={d.id} className="panel p-4 text-sm">
                  <p className="font-bold text-navy">{d.name}</p>
                  <p className="text-ink-soft mt-1">قالب هذه المسودة لم يعد متاحاً.</p>
                  <button className="btn-ghost btn-sm mt-3" onClick={() => remove(d)}><Trash2 size={15} />حذف</button>
                </div>
              );
            }
            return (
              <div key={d.id}>
                <Link href={`/editor/${t.id}?draft=${d.id}`} className="block rounded-2xl bg-white p-2 ring-1 ring-line hover:ring-teal hover:shadow-lift transition">
                  <div className="aspect-[4/5] grid place-items-center overflow-hidden rounded-xl bg-mist-50">
                    <WhenVisible className="h-full w-full">
                      <Preview template={t} values={d.values} styleIndex={d.styleIndex} size={d.size} custom={d.custom} fit="contain" className="h-full w-full" />
                    </WhenVisible>
                  </div>
                </Link>
                <p className="font-bold text-navy mt-2.5 px-1 truncate">{d.name}</p>
                <p className="text-xs text-ink-faint px-1">{t.name} · {SIZES[d.size].name} · {when(d.updatedAt)}</p>
                <div className="flex gap-1 mt-2">
                  <Link href={`/editor/${t.id}?draft=${d.id}`} className="btn-ghost btn-sm !px-2.5" title="تعديل"><Pencil size={15} /><span className="sr-only">تعديل</span></Link>
                  <button className="btn-ghost btn-sm !px-2.5" title="نسخ" onClick={async () => {
                    const now = new Date().toISOString();
                    await drafts.save({ ...d, id: newId(), name: `${d.name} (نسخة)`, createdAt: now, updatedAt: now });
                    load();
                  }}><Copy size={15} /><span className="sr-only">نسخ</span></button>
                  <Link href={`/editor/${t.id}?draft=${d.id}&copy=1`} className="btn-ghost btn-sm !px-2.5" title="إعادة استخدام كتصميم جديد"><Repeat size={15} /><span className="sr-only">إعادة استخدام</span></Link>
                  <button className="btn-ghost btn-sm !px-2.5 ms-auto hover:!text-amber-700" title="حذف" onClick={() => remove(d)}><Trash2 size={15} /><span className="sr-only">حذف</span></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
