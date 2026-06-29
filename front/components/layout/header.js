"use client";

import Link from "next/link";


export default function Header() {


  return (
    <header className="sticky top-0 z-50  bg-slate-900 backdrop-blur-sm border-b border-blue-800/30 shadow-lg shadow-blue-900/20">
      <div className="mx-auto  flex max-w-7xl items-center justify-between px-6 py-3.5">

        <Link
          href="/"
          className="group flex items-center gap-3 text-2xl font-bold transition-all duration-200"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30 transition-all duration-200 group-hover:shadow-blue-600/50">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-white">
            EventSync
          </span>
        </Link>


        <nav className="flex items-center gap-1">
          <Link
            href="/events"
            className="group relative px-4 py-2 text-sm font-medium text-blue-200/70 transition-all duration-200 hover:text-white"
          >
            <span>Events</span>
            <span className="absolute inset-x-4 bottom-0 h-0.5 bg-blue-500 scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
          </Link>
          <Link
            href="/dashboard"
            className="group relative px-4 py-2 text-sm font-medium text-blue-200/70 transition-all duration-200 hover:text-white"
          >
            Program
            <span className="absolute inset-x-4 bottom-0 h-0.5 bg-blue-500 scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
          </Link>
          <Link
            href="/speakers"
            className="group relative px-4 py-2 text-sm font-medium text-blue-200/70 transition-all duration-200 hover:text-white"
          >
            <span>Speakers</span>
            <span className="absolute inset-x-4 bottom-0 h-0.5 bg-blue-500 scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
          </Link>
          <Link
            href="/favorites"
            className="group relative px-4 py-2 text-sm font-medium text-blue-200/70 transition-all duration-200 hover:text-white"
          >
            <span className="flex items-center gap-1.5">
              Favorites
            </span>
            <span className="absolute inset-x-4 bottom-0 h-0.5 bg-blue-500 scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
          </Link>    

            <Link
              href="http://localhost:5173"
              className="ml-2 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/40"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login
            </Link>
       
        </nav>
      </div>
    </header>
  );
}