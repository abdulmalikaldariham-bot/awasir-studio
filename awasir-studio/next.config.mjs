/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  devIndicators: false,
  async headers() {
    return [
      // الصور المصغرة: روابطها تحمل بصمة المحتوى (?v=) فتُخزَّن سنة كاملة بلا إعادة تحقق
      { source: "/assets/:occasion/thumbs/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      // ملفات الشعار: أسبوع، مع تحديث هادئ في الخلفية عند تغييرها
      { source: "/assets/awaser/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }] },
    ];
  },
};
export default nextConfig;
