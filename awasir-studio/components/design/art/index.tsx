// مكتبة العناصر البصرية، مرتبة حسب المناسبة. كلها رسوم متجهة خفيفة داخل الكود:
// لا تحتاج طلبات شبكة، وتبقى حادة في أي مقاس تصدير.
import type { ComponentType } from "react";
import type { ArtId } from "@/lib/occasions";
import type { ArtProps } from "./base";
import { Dallah, RingsPair, Seal } from "./wedding";
import { Crescent, Lantern, Mihrab, QuranStand } from "./ramadan";
import { Burst, Gift, Mosque, Star8 } from "./eid";
import { Briefcase, Cap, Certificate, CradleStars, Diploma, Medal, MoonClouds, Rosette, Steps } from "./milestones";
import { Bell, Calendar, Chart, Compass, Hex, Majlis, Megaphone, Mic, Mountains, News, Papers, Pin, Podium, Screen, Tent, Trophy } from "./gathering";

export const ART: Record<ArtId, ComponentType<ArtProps>> = {
  dallah: Dallah, seal: Seal, "rings-pair": RingsPair,
  lantern: Lantern, crescent: Crescent, mihrab: Mihrab, "quran-stand": QuranStand,
  gift: Gift, burst: Burst, mosque: Mosque, star8: Star8,
  "moon-clouds": MoonClouds, "cradle-stars": CradleStars,
  cap: Cap, diploma: Diploma, medal: Medal, rosette: Rosette,
  briefcase: Briefcase, steps: Steps, certificate: Certificate,
  majlis: Majlis, calendar: Calendar, pin: Pin,
  screen: Screen, mic: Mic, papers: Papers,
  compass: Compass, tent: Tent, mountains: Mountains,
  trophy: Trophy, podium: Podium,
  megaphone: Megaphone, bell: Bell, news: News,
  hex: Hex, chart: Chart,
};

export const ART_NAMES: Record<ArtId, string> = {
  dallah: "الدلة والفنجال", seal: "الختم", "rings-pair": "الخاتمان",
  lantern: "الفانوس", crescent: "الهلال", mihrab: "المحراب", "quran-stand": "الرحل والمصحف",
  gift: "الهدايا", burst: "إشراقة", mosque: "أفق المسجد", star8: "النجمة الثمانية",
  "moon-clouds": "القمر والغيوم", "cradle-stars": "الهلال والنجوم",
  cap: "قبعة التخرج", diploma: "الشهادة الملفوفة", medal: "الوسام", rosette: "شارة التكريم",
  briefcase: "حقيبة العمل", steps: "درجات صاعدة", certificate: "الشهادة",
  majlis: "المجلس النجدي", calendar: "التقويم", pin: "الموقع",
  screen: "شاشة العرض", mic: "الميكروفون", papers: "أوراق وقلم",
  compass: "البوصلة", tent: "الخيمة", mountains: "الجبال والطريق",
  trophy: "الكأس", podium: "منصة التتويج",
  megaphone: "مكبر الصوت", bell: "الجرس", news: "الخبر",
  hex: "الرمز السداسي", chart: "الرسم البياني",
};

export function Art({ id, className, style }: { id: ArtId } & ArtProps) {
  const C = ART[id] ?? Hex;
  return <C className={className} style={style} />;
}
