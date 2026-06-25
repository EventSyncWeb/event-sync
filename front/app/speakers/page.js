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
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Intervenants</h1>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            defaultValue={query}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher un intervenant..."
            className="w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            Rechercher
          </button>
          {query && (
            <button
              onClick={handleClear}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {error && <p className="mb-4 text-red-600">Erreur : {error}</p>}

      {speakers.length === 0 && !error ? (
        <p className="text-gray-500">
          {query
            ? "Aucun intervenant ne correspond à votre recherche."
            : "Aucun intervenant."}
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {speakers.map((s) => (
            <SpeakerCard key={s.id} speaker={s} />
          ))}
        </div>
      )}
    </div>
  );
}
