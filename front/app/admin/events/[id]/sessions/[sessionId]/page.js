"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSession, updateSession } from "@/services/sessionService";
import SessionForm from "@/components/sessions/SessionForm";

export default function EditSessionPage({ params: paramsPromise }) {
  const router = useRouter();
  const [params, setParams] = useState(null);
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (!params) return;
    getSession(params.sessionId)
      .then(setSession)
      .catch((e) => setError(e.message));
  }, [params]);

  async function handleSubmit(form) {
    await updateSession(params.sessionId, form);
    router.push(`/admin/events/${params.id}/sessions`);
  }

  if (!params || (!session && !error)) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">Modifier la session</h1>
      {error && (
        <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
      )}
      {session && (
        <SessionForm
          initialValues={{
            title: session.title || "",
            description: session.description || "",
            startTime: session.startTime || "",
            endTime: session.endTime || "",
            room: session.room || "",
            capacity: session.capacity || "",
          }}
          onSubmit={handleSubmit}
          submitLabel="Enregistrer"
        />
      )}
      <div className="mt-6 space-x-4">
        <Link
          href={`/admin/events/${params.id}/sessions/${params.sessionId}/speakers`}
          className="text-sm text-indigo-600 hover:underline"
        >
          Gérer les intervenants →
        </Link>
        <Link
          href={`/admin/events/${params.id}/sessions/${params.sessionId}/questions`}
          className="text-sm text-indigo-600 hover:underline"
        >
          Questions →
        </Link>
      </div>
    </div>
  );
}
