"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSpeaker } from "@/services/speakerService";
import SpeakerForm from "@/components/speakers/SpeakerForm";

export default function NewSpeakerPage({ params: paramsPromise }) {
  const router = useRouter();
  const [params, setParams] = useState(null);

  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  async function handleSubmit(form) {
    await createSpeaker({ ...form, sessionId: params.sessionId });
    router.push(
      `/admin/events/${params.id}/sessions/${params.sessionId}/speakers`
    );
  }

  if (!params) return <p className="text-gray-500">Chargement...</p>;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">Ajouter un intervenant</h1>
      <SpeakerForm onSubmit={handleSubmit} submitLabel="Ajouter" />
    </div>
  );
}
