"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLibrary } from "@/lib/library";

const NAV = [
  { href: "/", label: "التصاميم" },
  { href: "/drafts", label: "مسوداتي" },
  { href: "/brand", label: "هوية أواصر" },
];

export function Header() {
  const path = usePathname();
  const { hasLocalChanges } = useLibrary();
  if (path.startsWith("/editor")) return null; // المحرر له شريطه الخاص
  return (
    <>
      {hasLocalChanges && (
        <div className="bg-teal text-white text-sm text-center py-2 px-4">
          هذا المتصفح يعرض تعديلات من لوحة الإدارة لم تُنشر بعد.{" "}
          <Link href="/admin?tab=publish" className="underline underline-offset-4 font-semibold">طريقة النشر</Link>
        </div>
      )}
      <header className="sticky top-0 z-30 bg-mist-50/85 backdrop-blur border-b border-line">
        <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="استوديو أواصر">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/mark.svg" alt="" className="h-8 w-auto" />
            <span className="text-lg font-bold text-navy">استوديو أواصر</span>
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {NAV.map((n) => {
              const on = n.href === "/" ? path === "/" || path.startsWith("/c/") : path.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href}
                  className={`px-3 h-9 inline-flex items-center rounded-lg text-[15px] font-semibold whitespace-nowrap transition-colors ${on ? "bg-white text-navy ring-1 ring-line" : "text-ink-soft hover:text-navy"}`}>
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}
