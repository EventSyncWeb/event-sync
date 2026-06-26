import EventCard from "./EventCard";

export default function EventList({ events }) {
  if (events.length === 0) {
    return <p className="text-gray-500">No upcoming events.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id || event.is} event={event} />
      ))}
    </div>
  );
}
