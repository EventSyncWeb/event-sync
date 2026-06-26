"use client";

import { useState, useEffect, useRef } from "react";
import { getEvents } from "@/services/eventService";
import EventList from "@/components/events/EventList";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  function loadEvents(q) {
    getEvents(q || undefined)
      .then(setEvents)
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function handleSearch() {
    const val = inputRef.current ? inputRef.current.value : "";
    setQuery(val);
    loadEvents(val);
  }

  function handleClear() {
    setQuery("");
    if (inputRef.current) inputRef.current.value = "";
    loadEvents();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">Error : {error}</p>
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Événements</h1>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            defaultValue={query}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher un événement..."
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

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold text-white">Events</h1>
        <EventList events={events} />
      </div>
      {error && <p className="mb-4 text-red-600">Erreur : {error}</p>}

      {events.length === 0 && !error ? (
        <p className="text-gray-500">
          {query
            ? "Aucun événement ne correspond à votre recherche."
            : "Aucun événement à venir."}
        </p>
      ) : (
        <EventList events={events} />
      )}
    </div>
  );
