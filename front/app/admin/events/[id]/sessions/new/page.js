"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "@/services/sessionService";
import SessionForm from "@/components/sessions/SessionForm";

export default function NewSessionPage({ params: paramsPromise }) {
  const router = useRouter();
  const [params, setParams] = useState(null);

  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  async function handleSubmit(form) {
    await createSession({ ...form, eventId: params.id });
    router.push(`/admin/events/${params.id}/sessions`);
  }

  if (!params) return <p className="text-gray-500">Chargement...</p>;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">Nouvelle session</h1>
      <SessionForm onSubmit={handleSubmit} submitLabel="Créer" />
    </div>
  );
}
