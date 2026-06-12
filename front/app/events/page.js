import { getEvents } from "@/services/eventService";
import EventList from "@/components/events/EventList";

export default async function EventsPage() {
  let events = [];
  let error = null;

  try {
    events = await getEvents();
  } catch (e) {
    error = e.message;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-red-600">Erreur : {error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Événements</h1>
      <EventList events={events} />
    </div>
  );
}
