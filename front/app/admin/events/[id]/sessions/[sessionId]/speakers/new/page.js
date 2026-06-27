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

  if (!params) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-2xl font-bold text-white">Add a speaker</h1>
        <SpeakerForm onSubmit={handleSubmit} submitLabel="Ajouter" />
      </div>
    </div>
  );
}