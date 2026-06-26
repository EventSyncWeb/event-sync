import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function EventCard({ event }) {
  const id = event.id || event.is;
  return (
    <Link
      href={`/events/${id}`}
      className="block rounded-lg border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm p-4 shadow-lg shadow-blue-900/20 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/30 hover:border-blue-500/50"
    >
      <h2 className="text-lg font-semibold text-white">{event.title}</h2>
      <p className="mt-1 text-sm text-blue-200/70">{event.location}</p>
      <p className="mt-0.5 text-xs text-blue-300/40">
        {formatDate(event.startDate)} — {formatDate(event.endDate)}
      </p>
    </Link>
  );
}