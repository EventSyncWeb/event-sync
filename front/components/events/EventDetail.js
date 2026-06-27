import { formatDate } from "@/lib/utils";

export default function EventDetail({ event }) {
  return (
    <div className="space-y-3 rounded-xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm p-6 shadow-xl shadow-blue-900/20">
      <h1 className="text-3xl font-bold text-white">{event.title}</h1>
      <p className="text-blue-200/70">{event.description}</p>
      <p className="text-sm text-blue-300/50">
        {event.location} — {formatDate(event.startDate)} au{" "}
        {formatDate(event.endDate)}
      </p>
    </div>
  );
}