"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSpeaker } from "@/services/speakerService";
import SpeakerCard from "@/components/speakers/SpeakerCard";

export default function SpeakerDetailPage({ params: paramsPromise }) {
  const router = useRouter();
  const [params, setParams] = useState(null);
  const [speaker, setSpeaker] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (!params) return;
    getSpeaker(params.speakerId)
      .then(setSpeaker)
      .catch((e) => setError(e.message));
  }, [params]);

  if (!params || (!speaker && !error)) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">Détails de l&apos;intervenant</h1>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      {speaker && <SpeakerCard speaker={speaker} />}
      <button
        onClick={() => router.back()}
        className="mt-4 rounded bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
      >
        ← Retour
      </button>
    </div>
  );
}
