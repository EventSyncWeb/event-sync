import Link from "next/link";
import { getEvents } from "@/services/eventService";
import EventTable from "@/components/events/EventTable";

export default async function AdminEventsPage() {
  let events = [];
  let error = null;
  try {
    events = await getEvents();
  } catch (e) {
    error = e.message;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Événements</h1>
        <Link
          href="/admin/events/new"
          className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
        >
          Nouvel événement
        </Link>
      </div>
      <EventTable events={events} error={error} />
    </div>
  );
}
