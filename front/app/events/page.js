"use client";

import { useState, useEffect, useRef } from "react";
import { getEvents } from "@/services/eventService";
import { getAllSessions } from "@/services/sessionService";
import EventList from "@/components/events/EventList";
import SessionCard from "@/components/sessions/SessionCard";
import { isLive } from "@/lib/utils";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [liveSessions, setLiveSessions] = useState([]);
  const inputRef = useRef(null);

  function loadEvents(q) {
    getEvents(q || undefined)
      .then(setEvents)
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    loadEvents();
    getAllSessions()
      .then((sessions) => {
        setLiveSessions(sessions.filter((s) => isLive(s.startTime, s.endTime, s.date)));
      })
      .catch(() => {});
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
        <p className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">
          Error: {error}
        </p>
      </div>
    );
  }


  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-white">Events</h1>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              defaultValue={query}
              onKeyDown={handleKeyDown}
              placeholder="Search an event..."
              className="w-64 rounded-lg border-0 bg-slate-700/50 px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button
              onClick={handleSearch}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              Search
            </button>
            {query && (
              <button
                onClick={handleClear}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {events.length === 0 ? (
          <p className="text-gray-400">
            {query
              ? "No events match your search."
              : "No events."}
          </p>
        ) : (
          <EventList events={events} />
        )}

        {liveSessions.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-white">Sessions on Live</h2>
            <div className="space-y-4">
              {liveSessions.map((s) => (
                <SessionCard
                  key={s.sessionId || s.id}
                  session={s}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}