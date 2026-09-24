import { NextResponse, type NextRequest } from "next/server";

/**
 * حماية بكلمة مرور (Basic Auth):
 * - ADMIN_PASSWORD يحمي لوحة الإدارة /admin (مطلوب في النشر؛ بدونه تُغلق اللوحة).
 * - SITE_PASSWORD اختياري: يحمي الموقع كله إذا أردت قصره على أفراد الأسرة.
 * اسم المستخدم لا يهم؛ تُفحص كلمة المرور فقط.
 */
function check(req: NextRequest, password: string, realm: string) {
  const h = req.headers.get("authorization") ?? "";
  if (h.startsWith("Basic ")) {
    try {
      const decoded = atob(h.slice(6));
      const pass = decoded.slice(decoded.indexOf(":") + 1);
      if (pass === password) return null;
    } catch { /* ترويسة غير صالحة */ }
  }
  return new NextResponse("مطلوب تسجيل الدخول", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${realm}", charset="UTF-8"`, "Content-Type": "text/plain; charset=utf-8" },
  });
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const site = process.env.SITE_PASSWORD;
  const admin = process.env.ADMIN_PASSWORD;

  if (pathname.startsWith("/admin") || pathname.startsWith("/lab")) {
    if (!admin) {
      if (process.env.NODE_ENV !== "production") return NextResponse.next(); // أثناء التطوير
      return new NextResponse("لوحة الإدارة مغلقة: أضف ADMIN_PASSWORD في إعدادات Vercel ثم أعد النشر.", {
        status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    return check(req, admin, "awasir-admin") ?? NextResponse.next();
  }
  if (site) return check(req, site, "awasir") ?? NextResponse.next();
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|brand/|icon.svg|favicon.ico).*)"],
};
