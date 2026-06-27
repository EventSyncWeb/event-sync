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
    if (!confirm("Delete this room ?")) return;
    try {
      await deleteEvent(params.id);
      router.push("/admin/events");
    } catch (err) {
      setError(err.message);
    }
  }

  if (!params || (!event && !error)) {
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
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-white">Edit the event</h1>
          <button
            onClick={handleDelete}
            className="w-full sm:w-auto rounded-lg bg-red-600/80 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-red-600/20 transition-all duration-200 hover:bg-red-700 hover:shadow-red-600/40"
          >
            Delete
          </button>
        </div>
        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</p>
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
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            Manage sessions
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path
                  d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}