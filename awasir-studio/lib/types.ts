import type { ArtId, OccasionId } from "./occasions";

// أنواع البيانات الأساسية لاستوديو أواصر.
// كل القوالب والتصنيفات والنصوص مخزنة كبيانات في data/library.json
// ولا يحتاج إضافة قالب جديد أي تعديل في الكود.

export type FieldType = "text" | "textarea" | "date" | "select" | "url" | "number";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: string[]; // للقوائم المنسدلة
  qr?: boolean; // للروابط: يولد رمز QR تلقائياً
  presets?: boolean; // حقل نص يمكن تعبئته من مكتبة النصوص
}

export type IconName =
  | "calendar" | "clock" | "pin" | "building" | "user" | "link"
  | "info" | "phone" | "star" | "users" | "book" | "flag";

export interface DetailSlot { icon: IconName; label: string; value: string }
export interface StatSlot { label: string; value: string }

// خانات المحتوى: نصوص فيها متغيرات {{key}} و[[مقطع اختياري]]
export interface Slots {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  details?: DetailSlot[];
  stats?: StatSlot[];
  note?: string;
  qr?: string; // اسم حقل الرابط
  qrLabel?: string;
  footer?: string;
  order?: "title-first" | "body-first";
}

export type StyleId = "formal" | "minimal" | "premium" | "split" | "photo" | "family";
export type ThemeId = "navy" | "teal" | "light";

export interface StyleOption { style: StyleId; label: string; theme: ThemeId }

export type SizeId = "post" | "portrait" | "story" | "whatsapp" | "a4" | "wide";

export interface Template {
  id: string;
  category: string;
  name: string;
  description?: string;
  status: "active" | "paused";
  featured?: boolean;
  fields: Field[];
  defaults: Record<string, string>;
  slots: Slots;
  presetGroup?: string;
  styles: StyleOption[];
  sizes: SizeId[];
  image: "none" | "optional" | "recommended";
  /** شخصية المناسبة البصرية (افتراضياً حسب التصنيف) */
  occasion?: OccasionId;
  /** العنصر الرئيسي في التصميم (افتراضياً حسب المناسبة) */
  art?: ArtId;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
  hidden?: boolean;
}

export type Tone = "formal" | "family" | "short" | "friendly";
export interface PresetGroup { id: string; name: string; texts: { tone: Tone; text: string }[] }

export interface Background { id: string; name: string; src: string } // صورة data URL

export interface Brand {
  name: string;
  signature: string; // التوقيع الافتراضي
  digits: "arabic" | "latin";
  colors: { navy: string; teal: string; light: string };
  logos?: Partial<Record<LogoFile, string>>; // استبدال الشعار من لوحة الإدارة
}

export type LogoFile =
  | "mark" | "mark-white" | "vertical-light" | "vertical-dark" | "vertical-white"
  | "horizontal-light" | "horizontal-dark" | "horizontal-white";

export interface Library {
  version: number;
  updatedAt: string;
  brand: Brand;
  categories: Category[];
  templates: Template[];
  presets: PresetGroup[];
  backgrounds: Background[];
}

// إعدادات التخصيص الآمنة التي يغيرها المستخدم
export interface Custom {
  hidden: string[]; // خانات مخفية
  titleScale: number;
  bodyScale: number;
  align?: "center" | "start"; // بدون قيمة = حسب النمط
  logo: "full" | "mark" | "none";
  theme?: ThemeId;
  accent?: "teal" | "light" | "navy" | "white";
  pattern: "auto" | "rings" | "grid" | "none" | string; // auto = حسب المناسبة، أو معرف خلفية
  order?: "title-first" | "body-first";
  /** src: النسخة عالية الدقة للتصدير، preview: نسخة خفيفة للمعاينة */
  image?: { src: string; preview?: string; zoom: number; x: number; y: number };
}

export interface Draft {
  id: string;
  templateId: string;
  name: string;
  values: Record<string, string>;
  styleIndex: number;
  size: SizeId;
  custom: Custom;
  createdAt: string;
  updatedAt: string;
}
