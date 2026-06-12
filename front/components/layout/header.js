"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { admin, logout } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          EventSync
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/events"
            className="text-sm text-gray-600 hover:text-indigo-600"
          >
            Événements
          </Link>
          {admin ? (
            <>
              <Link
                href="/admin"
                className="text-sm text-gray-600 hover:text-indigo-600"
              >
                Admin
              </Link>
              <span className="text-sm text-gray-400">
                {admin.firstName || admin.email}
              </span>
              <button
                onClick={logout}
                className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
            >
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
