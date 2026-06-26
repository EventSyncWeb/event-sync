"use client";

import { useState, useEffect, useRef } from "react";
import { getAllSpeakers } from "@/services/speakerService";
import SpeakerCard from "@/components/speakers/SpeakerCard";

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  function loadSpeakers(q) {
    getAllSpeakers(q || undefined)
      .then(setSpeakers)
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    loadSpeakers();
  }, []);

  function handleSearch() {
    const val = inputRef.current ? inputRef.current.value : "";
    setQuery(val);
    loadSpeakers(val);
  }

  function handleClear() {
    setQuery("");
    if (inputRef.current) inputRef.current.value = "";
    loadSpeakers();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-white">Speakers</h1>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              defaultValue={query}
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
            {query && (
              <button
                onClick={handleClear}
                className="rounded-lg border border-blue-800/30 bg-slate-800/50 px-4 py-2 text-sm font-medium text-blue-200/70 transition-all duration-200 hover:bg-slate-700/50 hover:text-white"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-red-400">Error : {error}</p>
        )}

        {speakers.length === 0 && !error ? (
          <p className="text-blue-200/60">
            {query
              ? "No speaker matches your search."
              : "No speakers."}
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {speakers.map((s) => (
              <SpeakerCard key={s.id} speaker={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}