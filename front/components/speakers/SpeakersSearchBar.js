"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SpeakersSearchBar({ query }) {
  const [value, setValue] = useState(query || "");
  const router = useRouter();

  function handleSearch() {
    const params = new URLSearchParams();
    if (value) params.set("q", value);
    router.push(`/speakers?${params.toString()}`);
  }

  function handleClear() {
    setValue("");
    router.push("/speakers");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search a speaker..."
        className="w-64 rounded-lg border-0 bg-slate-700/50 px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      />
      <button
        onClick={handleSearch}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/40"
      >
        Search
      </button>
      {value && (
        <button
          onClick={handleClear}
          className="rounded-lg border border-blue-800/30 bg-slate-800/50 px-4 py-2 text-sm font-medium text-blue-200/70 transition-all duration-200 hover:bg-slate-700/50 hover:text-white"
        >
          Delete
        </button>
      )}
    </div>
  );
}
