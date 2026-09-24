import { del, entries, get, set } from "idb-keyval";
import type { Draft } from "./types";

/**
 * مخزن المسودات. الإصدار الحالي يحفظ في متصفح المستخدم (IndexedDB).
 * لإضافة قاعدة بيانات وحسابات لاحقاً: اكتب تنفيذاً آخر لنفس الواجهة وبدّل السطر الأخير فقط.
 */
export interface DraftStore {
  list(): Promise<Draft[]>;
  get(id: string): Promise<Draft | undefined>;
  save(d: Draft): Promise<void>;
  remove(id: string): Promise<void>;
}

const PREFIX = "awasir:draft:";

const browserStore: DraftStore = {
  async list() {
    const all = await entries<string, Draft>();
    return all
      .filter(([k]) => typeof k === "string" && k.startsWith(PREFIX))
      .map(([, v]) => v)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  get: (id) => get<Draft>(PREFIX + id),
  save: (d) => set(PREFIX + d.id, d),
  remove: (id) => del(PREFIX + id),
};

export const drafts: DraftStore = browserStore;

export const newId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));

// ---- إحصاءات الاستخدام المحلية (لمعرفة القوالب الأكثر استخداماً) ----
const USAGE = "awasir:usage";
export async function bumpUsage(templateId: string) {
  try {
    const u = (await get<Record<string, number>>(USAGE)) ?? {};
    u[templateId] = (u[templateId] ?? 0) + 1;
    await set(USAGE, u);
  } catch { /* الإحصاء ليس ضرورياً */ }
}
export const getUsage = async () => (await get<Record<string, number>>(USAGE)) ?? {};
