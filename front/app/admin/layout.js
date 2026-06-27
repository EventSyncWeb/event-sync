"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }) {
  const { admin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!admin) {
      router.push("/login");
    }
  }, [admin, router]);

  if (!admin) return null;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 mx-auto max-w-7xl gap-6 px-4 py-6 flex flex-col md:flex-row">
      <aside className="md:w-48 shrink-0">
        <nav className="space-y-1">
          <Link
            href="/admin"
            className="block rounded-lg px-4 py-2.5 text-sm font-medium text-blue-200/70 transition-all duration-200 hover:bg-slate-800/50 hover:text-white border border-transparent hover:border-blue-800/30"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/events"
            className="block rounded-lg px-4 py-2.5 text-sm font-medium text-blue-200/70 transition-all duration-200 hover:bg-slate-800/50 hover:text-white border border-transparent hover:border-blue-800/30"
          >
            Events
          </Link>
          <Link
            href="/admin/rooms"
            className="block rounded-lg px-4 py-2.5 text-sm font-medium text-blue-200/70 transition-all duration-200 hover:bg-slate-800/50 hover:text-white border border-transparent hover:border-blue-800/30"
          >
            Rooms
          </Link>
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}