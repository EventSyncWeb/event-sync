"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSpeakersBySession } from "@/services/speakerService";
import SpeakerCard from "@/components/speakers/SpeakerCard";

export default function SpeakersPage({ params: paramsPromise }) {
  const [params, setParams] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (!params) return;
    getSpeakersBySession(params.sessionId)
      .then(setSpeakers)
      .catch((e) => setError(e.message));
  }, [params]);

  if (!params) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-white">Speakers</h1>
          <Link
            href={`/admin/events/${params.id}/sessions/${params.sessionId}/speakers/new`}
            className="w-full sm:w-auto rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/40 text-center"
          >
            Add
          </Link>
        </div>
        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</p>
        )}
        {speakers.length === 0 ? (
          <div className="rounded-lg border border-dashed border-blue-800/30 py-16 text-center">
            <p className="text-blue-200/60">No Speaker.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {speakers.map((s) => (
              <div
                key={s.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm p-4 shadow-lg shadow-blue-900/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-900/30 hover:border-blue-500/50"
              >
                <div className="flex-1 w-full">
                  <SpeakerCard speaker={s} />
                </div>
                <Link
                  href={`/admin/events/${params.id}/sessions/${params.sessionId}/speakers/${s.id}`}
                  className="mt-3 sm:mt-0 sm:ml-4 shrink-0 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Details →
                </Link>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <Link
            href={`/admin/events/${params.id}/sessions`}
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            ← Back to all sessions
          </Link>
        </div>
      </div>
    </div>
  );
}