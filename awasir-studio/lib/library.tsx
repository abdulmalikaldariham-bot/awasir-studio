"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { del, get, set } from "idb-keyval";
import seed from "@/data/library.json";
import type { Library, Template } from "./types";

const SEED = seed as unknown as Library;
const DRAFT_KEY = "awasir:library-draft";

interface Ctx {
  library: Library;
  /** true إذا كانت هناك تعديلات من لوحة الإدارة لم تُنشر بعد في هذا المتصفح */
  hasLocalChanges: boolean;
  ready: boolean;
  save: (next: Library) => Promise<void>;
  discard: () => Promise<void>;
}

const LibraryContext = createContext<Ctx | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [library, setLibrary] = useState<Library>(SEED);
  const [hasLocalChanges, setHas] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    get<Library>(DRAFT_KEY)
      .then((d) => {
        // نسخة المكتبة المنشورة أحدث من التعديل المحلي؟ نعتمد المنشورة
        if (d && d.updatedAt >= SEED.updatedAt) { setLibrary(d); setHas(true); }
      })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  const save = useCallback(async (next: Library) => {
    const stamped = { ...next, updatedAt: new Date().toISOString() };
    setLibrary(stamped);
    setHas(true);
    await set(DRAFT_KEY, stamped);
  }, []);

  const discard = useCallback(async () => {
    await del(DRAFT_KEY);
    setLibrary(SEED);
    setHas(false);
  }, []);

  return <LibraryContext.Provider value={{ library, hasLocalChanges, ready, save, discard }}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const c = useContext(LibraryContext);
  if (!c) throw new Error("LibraryProvider missing");
  return c;
}

export const activeTemplates = (lib: Library, category?: string) =>
  lib.templates.filter((t) => t.status === "active" && (!category || t.category === category));

/** قيم تجريبية للمعاينات المصغرة: القيم الافتراضية + الأمثلة + أول نص جاهز */
export function sampleValues(t: Template, lib: Library): Record<string, string> {
  const v: Record<string, string> = {};
  for (const f of t.fields) {
    const ph = f.placeholder ?? "";
    if (f.type === "date") v[f.key] = "2026-06-25";
    else if (f.type === "url") v[f.key] = f.qr ? "https://maps.app.goo.gl/awasir" : "";
    else if (f.type === "select") v[f.key] = f.options?.[0] ?? "";
    else if (SAMPLE[f.key]) v[f.key] = SAMPLE[f.key];
    else if (ph && !/\.\.\.|…|اختياري|^مثال|^الاسم|^https?:/.test(ph)) v[f.key] = ph;
  }
  const g = lib.presets.find((p) => p.id === t.presetGroup);
  const textField = t.fields.find((f) => f.presets);
  if (g && textField) v[textField.key] = g.texts[0]?.text ?? "";
  return { ...v, ...t.defaults };
}

const SAMPLE: Record<string, string> = {
  groomName: "عبدالله", personName: "سارة بنت خالد", venue: "قاعة الريم", time: "٨:٠٠ مساءً",
  deceasedName: "محمد بن عبدالله آل دريهم", babyName: "خالد", fatherName: "فهد بن محمد",
  title: "مهارات القيادة للشباب", presenter: "أ. عبدالملك آل دريهم", guest: "د. عبدالرحمن", destination: "العلا",
  mosque: "جامع الراجحي", headline: "عنوان التصميم", occasionName: "عشاء الأسرة السنوي",
  meetingPoint: "منزل الأسرة", achievement: "المركز الأول في مسابقة القرآن", newTitle: "مدير إدارة",
  jobTitle: "مهندس برمجيات", s1: "٤٥٬٠٠٠ ر.س", s2: "١٢", s3: "٣٠٬٠٠٠ ر.س", s4: "٤٫٢٪",
  period: "الربع الثالث ٢٠٢٦", condolencePlace: "منزل الأسرة بحي النرجس", prayer: "بعد صلاة العصر",
};
