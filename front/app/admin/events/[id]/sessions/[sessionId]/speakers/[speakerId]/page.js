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
        <h1 className="mb-6 text-2xl font-bold text-white">Speaker details</h1>
        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</p>
        )}
        {speaker && <SpeakerCard speaker={speaker} />}
        <button
          onClick={() => router.back()}
          className="mt-4 rounded-lg border border-blue-800/30 bg-slate-800/50 px-6 py-2.5 text-sm font-medium text-blue-200/70 transition-all duration-200 hover:bg-slate-700/50 hover:text-white"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}