"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getEvent, updateEvent, deleteEvent } from "@/services/eventService";
import EventForm from "@/components/events/EventForm";

export default function EditEventPage({ params: paramsPromise }) {
  const router = useRouter();
  const [params, setParams] = useState(null);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (!params) return;
    getEvent(params.id)
      .then(setEvent)
      .catch((e) => setError(e.message));
  }, [params]);

  async function handleSubmit(form) {
    await updateEvent(form);
    router.push("/admin/events");
  }

  async function handleDelete() {
    if (!confirm("Supprimer cet événement ?")) return;
    try {
      await deleteEvent(params.id);
      router.push("/admin/events");
    } catch (err) {
      setError(err.message);
    }
  }

  if (!params || (!event && !error)) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Modifier l&apos;événement</h1>
        <button
          onClick={handleDelete}
          className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
        >
          Supprimer
        </button>
      </div>
      {error && (
        <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
      )}
      {event && (
        <EventForm
          initialValues={{
            title: event.title || "",
            description: event.description || "",
            startDate: event.startDate || "",
            endDate: event.endDate || "",
            location: event.location || "",
          }}
          onSubmit={handleSubmit}
          submitLabel="Enregistrer"
        />
      )}
      <div className="mt-6">
        <Link
          href={`/admin/events/${params.id}/sessions`}
          className="text-sm text-indigo-600 hover:underline"
        >
          Gérer les sessions →
        </Link>
      </div>
    </div>
  );
}
