// شخصية كل مناسبة: هوية أواصر ثابتة في كل التصاميم، وتضيف المناسبة طبقتها الخاصة
// (عناصر بصرية، ألوان مساندة، زخرفة، طريقة إبراز العنوان) دون أن تغير نظام التخطيط.
import type { Template } from "./types";

export type OccasionId =
  | "wedding" | "ramadan" | "eid-fitr" | "eid-adha" | "condolence" | "birth"
  | "success" | "career" | "family" | "program" | "trip" | "competition"
  | "celebrate" | "general" | "fund";

/** العناصر البصرية المتاحة (رسوم متجهة داخل الكود، بلا صور خارجية) */
export type ArtId =
  | "dallah" | "seal" | "rings-pair"
  | "lantern" | "crescent" | "mihrab" | "quran-stand"
  | "gift" | "burst" | "mosque" | "star8"
  | "moon-clouds" | "cradle-stars"
  | "cap" | "diploma" | "medal" | "rosette"
  | "briefcase" | "steps" | "certificate"
  | "majlis" | "calendar" | "pin"
  | "screen" | "mic" | "papers"
  | "compass" | "tent" | "mountains"
  | "trophy" | "podium"
  | "megaphone" | "bell" | "news"
  | "hex" | "chart";

export type Hang = "lanterns" | "bunting" | "stars" | "none";
export type Ground = "mosque" | "najdi" | "mountains" | "dunes" | "none";
export type Sprinkle = "stars" | "confetti" | "sparkles" | "none";
export type TitleMode = "regal" | "serene" | "festive" | "quiet" | "soft" | "honor" | "pro" | "warm" | "bold" | "brand";

export interface Occasion {
  id: OccasionId;
  name: string;
  /** اللون المساند (ذهبي، كهرماني...) ويُستخدم بقدر محدود */
  gold: string;
  /** لون المساند على الخلفيات الفاتحة (أغمق ليبقى واضحاً) */
  goldOnLight: string;
  hero: ArtId;       // العنصر الرئيسي
  emblem: ArtId;     // رمز صغير فوق العنوان
  hang: Hang;        // عناصر معلقة من الأعلى
  ground: Ground;    // شريط سفلي
  sprinkle: Sprinkle;
  frame: "arch" | "double" | "najdi" | "rect" | "none";
  title: TitleMode;
  /** النمط السداسي الافتراضي: بعض المناسبات تحتاج هدوءاً أكثر */
  pattern: "rings" | "grid" | "none";
  /** تعديل طفيف لدرجة الخلفية الداكنة (يبقى ضمن عائلة الكحلي/الفيروزي) */
  deep?: string;
  /** درجة الخلفية الفاتحة */
  paper?: string;
  glow?: boolean;
}

const GOLD = "#C9A45C";
const GOLD_DARK = "#9A7A3A";

export const OCCASIONS: Record<OccasionId, Occasion> = {
  wedding: {
    id: "wedding", name: "الزواج", gold: GOLD, goldOnLight: GOLD_DARK,
    hero: "seal", emblem: "rings-pair", hang: "none", ground: "none", sprinkle: "none",
    frame: "arch", title: "regal", pattern: "rings", deep: "#183845", paper: "#F7F4EC",
  },
  ramadan: {
    id: "ramadan", name: "رمضان", gold: "#E2BE7A", goldOnLight: "#8E6B2E",
    hero: "crescent", emblem: "lantern", hang: "lanterns", ground: "none", sprinkle: "stars",
    frame: "none", title: "serene", pattern: "none", deep: "#132F3B", paper: "#F1F5F2", glow: true,
  },
  "eid-fitr": {
    id: "eid-fitr", name: "عيد الفطر", gold: "#E7C77F", goldOnLight: "#9A7A3A",
    hero: "gift", emblem: "burst", hang: "bunting", ground: "none", sprinkle: "confetti",
    frame: "none", title: "festive", pattern: "none", paper: "#F2F8F6",
  },
  "eid-adha": {
    id: "eid-adha", name: "عيد الأضحى", gold: "#D8B77A", goldOnLight: "#8C6A33",
    hero: "star8", emblem: "star8", hang: "none", ground: "mosque", sprinkle: "sparkles",
    frame: "none", title: "festive", pattern: "none", deep: "#1D3B45", paper: "#F8F3E9",
  },
  condolence: {
    id: "condolence", name: "التعزية", gold: "#A9BCC1", goldOnLight: "#5E747B",
    hero: "hex", emblem: "hex", hang: "none", ground: "none", sprinkle: "none",
    frame: "rect", title: "quiet", pattern: "none", deep: "#22353D", paper: "#F4F6F6",
  },
  birth: {
    id: "birth", name: "المواليد", gold: "#E9CF9B", goldOnLight: "#A0824A",
    hero: "moon-clouds", emblem: "cradle-stars", hang: "stars", ground: "none", sprinkle: "stars",
    frame: "none", title: "soft", pattern: "none", paper: "#F3F9FA",
  },
  success: {
    id: "success", name: "التخرج والنجاح", gold: GOLD, goldOnLight: GOLD_DARK,
    hero: "cap", emblem: "medal", hang: "none", ground: "none", sprinkle: "sparkles",
    frame: "double", title: "honor", pattern: "rings",
  },
  career: {
    id: "career", name: "الترقيات والوظائف", gold: "#B8C4C8", goldOnLight: "#336D6E",
    hero: "briefcase", emblem: "briefcase", hang: "none", ground: "none", sprinkle: "none",
    frame: "rect", title: "pro", pattern: "grid",
  },
  family: {
    id: "family", name: "الاجتماعات العائلية", gold: "#D9B97E", goldOnLight: "#8C6A33",
    hero: "majlis", emblem: "majlis", hang: "none", ground: "najdi", sprinkle: "none",
    frame: "najdi", title: "warm", pattern: "grid", paper: "#F6F3EC",
  },
  program: {
    id: "program", name: "الدورات والبرامج", gold: "#8CC0C7", goldOnLight: "#336D6E",
    hero: "screen", emblem: "papers", hang: "none", ground: "none", sprinkle: "none",
    frame: "none", title: "pro", pattern: "grid",
  },
  trip: {
    id: "trip", name: "الرحلات والفعاليات", gold: "#E0B36A", goldOnLight: "#9A6B25",
    hero: "compass", emblem: "pin", hang: "none", ground: "mountains", sprinkle: "none",
    frame: "none", title: "bold", pattern: "none", paper: "#F7F2E8",
  },
  competition: {
    id: "competition", name: "المسابقات والبطولات", gold: "#E3BF6A", goldOnLight: "#8E6A1F",
    hero: "trophy", emblem: "medal", hang: "none", ground: "none", sprinkle: "confetti",
    frame: "none", title: "bold", pattern: "none",
  },
  celebrate: {
    id: "celebrate", name: "التهاني", gold: GOLD, goldOnLight: GOLD_DARK,
    hero: "rosette", emblem: "burst", hang: "none", ground: "none", sprinkle: "sparkles",
    frame: "double", title: "honor", pattern: "rings",
  },
  general: {
    id: "general", name: "الإعلانات العامة", gold: "#8CC0C7", goldOnLight: "#336D6E",
    hero: "megaphone", emblem: "hex", hang: "none", ground: "none", sprinkle: "none",
    frame: "none", title: "brand", pattern: "rings",
  },
  fund: {
    id: "fund", name: "صندوق أواصر", gold: "#8CC0C7", goldOnLight: "#336D6E",
    hero: "chart", emblem: "hex", hang: "none", ground: "none", sprinkle: "none",
    frame: "rect", title: "brand", pattern: "grid",
  },
};

export const OCCASION_ORDER = Object.keys(OCCASIONS) as OccasionId[];

const BY_CATEGORY: Record<string, OccasionId> = {
  wedding: "wedding", ramadan: "ramadan", "eid-fitr": "eid-fitr", "eid-adha": "eid-adha",
  condolences: "condolence", births: "birth", success: "success", meetings: "family", family: "family",
  programs: "program", events: "trip", announcements: "general", greetings: "celebrate",
  general: "general", fund: "fund",
};

export function occasionOf(t: Pick<Template, "category" | "occasion">): Occasion {
  return OCCASIONS[t.occasion ?? BY_CATEGORY[t.category] ?? "general"] ?? OCCASIONS.general;
}
