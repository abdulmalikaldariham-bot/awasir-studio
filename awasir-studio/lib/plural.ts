/** صيغة العدد مع المعدود بالعربية: قالب واحد، قالبان، ٣ قوالب، ١١ قالباً */
export function countAr(n: number, one: string, two: string, few: string, many: string) {
  if (n === 0) return `لا ${few}`;
  if (n === 1) return `${one} واحد`;
  if (n === 2) return two;
  if (n <= 10) return `${n} ${few}`;
  return `${n} ${many}`;
}
export const templatesCount = (n: number) => countAr(n, "قالب", "قالبان", "قوالب", "قالباً");
