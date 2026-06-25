import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function EventCard({ event }) {
  const id = event.id || event.is;
  return (
    <Link
      href={`/events/${id}`}
      className="block rounded border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <h2 className="text-lg font-semibold text-gray-900">{event.title}</h2>
      <p className="mt-1 text-sm text-gray-500">{event.location}</p>
      <p className="mt-0.5 text-xs text-gray-400">
        {formatDate(event.startDate)} — {formatDate(event.endDate)}
      </p>
    </Link>
  );
}
