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
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-white">Events</h1>
          <Link
            href="/admin/events/new"
            className="w-full sm:w-auto rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/40 text-center"
          >
            New event
          </Link>
        </div>
        <EventTable events={events} error={error} />
      </div>
    </div>
  );
}