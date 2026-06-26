"use client";

import { useRouter } from "next/navigation";
import { createEvent } from "@/services/eventService";
import EventForm from "@/components/events/EventForm";

export default function NewEventPage() {
  const router = useRouter();

  async function handleSubmit(form) {
    await createEvent(form);
    router.push("/admin/events");
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-2xl font-bold text-white">New event</h1>
        <EventForm onSubmit={handleSubmit} submitLabel="Créer" />
      </div>
    </div>
  );
}