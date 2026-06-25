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
        <p className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">Error : {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold text-white">Events</h1>
        <EventList events={events} />
      </div>
    </div>
  );
}