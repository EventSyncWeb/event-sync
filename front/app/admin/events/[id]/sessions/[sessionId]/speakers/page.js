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

  if (!params) return <p className="text-gray-500">Chargement...</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Intervenants</h1>
        <Link
          href={`/admin/events/${params.id}/sessions/${params.sessionId}/speakers/new`}
          className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
        >
          Ajouter
        </Link>
      </div>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      {speakers.length === 0 ? (
        <p className="text-gray-500">Aucun intervenant.</p>
      ) : (
        <div className="space-y-3">
          {speakers.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded border bg-white p-4 shadow-sm"
            >
              <div className="flex-1">
                <SpeakerCard speaker={s} />
              </div>
              <Link
                href={`/admin/events/${params.id}/sessions/${params.sessionId}/speakers/${s.id}`}
                className="ml-4 shrink-0 text-sm text-indigo-600 hover:underline"
              >
                Détails
              </Link>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4">
        <Link
          href={`/admin/events/${params.id}/sessions`}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Retour aux sessions
        </Link>
      </div>
    </div>
  );
}
