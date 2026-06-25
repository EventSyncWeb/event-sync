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
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">Nouvel événement</h1>
      <EventForm onSubmit={handleSubmit} submitLabel="Créer" />
    </div>
  );
}
