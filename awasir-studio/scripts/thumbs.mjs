// يولّد الصور المصغرة للقوالب (WebP بمقاسين) من التصاميم الحقيقية.
// الاستخدام: شغّل الموقع محلياً (npm run dev) ثم في نافذة أخرى: npm run thumbs
// المتصفح: يستخدم Chrome المثبت، أو حدد مساره في CHROME_PATH.
import { chromium } from "playwright-core";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const candidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/opt/pw-browsers/chromium",
].filter(Boolean);
const executablePath = candidates.find((p) => fs.existsSync(p));
if (!executablePath) { console.error("لم يُعثر على Chrome. حدد مساره في CHROME_PATH"); process.exit(1); }

const SIZES = { sm: 240, md: 480 };
const browser = await chromium.launch({ executablePath, args: ["--no-sandbox"] });
// على نسخة الإنتاج المحلية تحتاج صفحة /lab كلمة مرور الإدارة: مررها في ADMIN_PASSWORD
const httpCredentials = process.env.ADMIN_PASSWORD ? { username: "admin", password: process.env.ADMIN_PASSWORD, send: "always" } : undefined;
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: SIZES.md / 1080, httpCredentials });
await page.goto(`${BASE}/lab/thumbs`, { waitUntil: "networkidle", timeout: 180000 });
await page.waitForFunction(() => window.__thumbs && document.fonts.status === "loaded");
await page.waitForTimeout(800);
const list = await page.evaluate(() => window.__thumbs);

// نحذف الصور القديمة ثم نولد الجديدة
for (const d of new Set(list.map((t) => t.dir))) fs.rmSync(path.join(root, "public", d), { recursive: true, force: true });
const manifest = {};
let bytes = 0, files = 0;
for (const t of list) {
  const dir = path.join(root, "public", t.dir);
  fs.mkdirSync(dir, { recursive: true });
  for (let i = 0; i < t.n; i++) {
    const el = page.locator(`[data-thumb="${t.id}-${i}"]`);
    await el.scrollIntoViewIfNeeded();
    const png = await el.screenshot({ type: "png" });
    for (const [name, w] of Object.entries(SIZES)) {
      const out = path.join(dir, `${t.id}-${i}-${name}.webp`);
      await sharp(png).resize({ width: w }).webp({ quality: name === "sm" ? 72 : 78, effort: 6 }).toFile(out);
      bytes += fs.statSync(out).size; files++;
    }
  }
  manifest[t.id] = { k: t.k, n: t.n };
  process.stdout.write(".");
}
fs.writeFileSync(path.join(root, "data", "thumbs.json"), JSON.stringify(manifest, null, 1) + "\n");
console.log(`\nتم: ${files} صورة، المجموع ${(bytes / 1024).toFixed(0)} ك.ب`);
await browser.close();
