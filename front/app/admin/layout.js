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
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
      <aside className="w-48 shrink-0">
        <nav className="space-y-1">
          <Link
            href="/admin"
            className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
          >
            Tableau de bord
          </Link>
          <Link
            href="/admin/events"
            className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
          >
            Événements
          </Link>
          <Link
            href="/admin/rooms"
            className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
          >
            Salles
          </Link>
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
