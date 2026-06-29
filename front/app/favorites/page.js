"use client";

import { useState, useEffect } from "react";
import { getFavoriteSessions } from "@/services/sessionService";
import Link from "next/link";
import { formatDate, isLive } from "@/lib/utils";
import LiveIndicator from "@/components/sessions/LiveIndicator";
import FavoriteButton from "@/components/sessions/FavoriteButton";

export default function FavoritesPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getFavoriteSessions()
      .then((data) => { if (!cancelled) setSessions(data); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <svg className="w-7 h-7 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            My Favorites
          </h1>
          <p className="mt-1 text-sm text-blue-200/70">Sessions you have favorited</p>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-blue-800/30 bg-slate-800/50 p-4">
                <div className="h-5 w-3/4 rounded bg-slate-700/50 mb-3"></div>
                <div className="h-3 w-1/2 rounded bg-slate-700/50 mb-2"></div>
                <div className="h-3 w-full rounded bg-slate-700/50"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">
            Error: {error}
          </p>
        )}

        {!loading && !error && sessions.length === 0 && (
          <div className="rounded-xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-blue-400/30 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <p className="text-blue-200/70">No favorite sessions yet.</p>
            <p className="mt-1 text-sm text-blue-200/50">
              Browse sessions and click the heart icon to add your favorites.
            </p>
            <Link
              href="/events"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-all"
            >
              Browse Events
            </Link>
          </div>
        )}

        {!loading && !error && sessions.length > 0 && (
          <div className="space-y-4">
            {sessions.map((s) => {
              const id = s.sessionId || s.id;
              const live = isLive(s.startTime, s.endTime, s.date);
              return (
                <div
                  key={id}
                  className="rounded-xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm p-4 shadow-lg shadow-blue-900/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-900/30 hover:border-blue-500/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                        <LiveIndicator isLive={live} />
                      </div>
                      <p className="mt-0.5 text-sm text-blue-200/70">
                        {formatDate(s.date)} - {s.startTime} — {s.endTime}
                        {s.roomName && ` - ${s.roomName}`}
                      </p>
                      <p className="mt-1 text-sm text-blue-300/60 line-clamp-2">{s.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <FavoriteButton sessionId={id} />
                      <Link
                        href={`/sessions/${id}`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/40"
                      >
                        Watch
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
