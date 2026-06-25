import { formatDate } from "@/lib/utils";

export default function EventDetail({ event }) {
  return (
    <div>
      <h1 className="mt-4 text-3xl font-bold">{event.title}</h1>
      <p className="mt-2 text-gray-600">{event.description}</p>
      <p className="mt-1 text-sm text-gray-500">
        {event.location} — {formatDate(event.startDate)} au{" "}
        {formatDate(event.endDate)}
      </p>
    </div>
  );
}
