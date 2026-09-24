"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AdminApp } from "@/components/admin/AdminApp";

function Inner() {
  const sp = useSearchParams();
  return <AdminApp initialTab={sp.get("tab") ?? undefined} />;
}
export default function AdminPage() { return <Suspense><Inner /></Suspense>; }
