import Link from "next/link";

export default function EventTable({ events, error }) {
  if (error) return <p className="mb-4 text-red-600">{error}</p>;

  if (events.length === 0) {
    return <p className="text-gray-500">Aucun événement.</p>;
  }

  return (
    <div className="overflow-x-auto rounded border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium">Titre</th>
            <th className="px-4 py-3 font-medium">Lieu</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id || event.is} className="border-b last:border-0">
              <td className="px-4 py-3">{event.title}</td>
              <td className="px-4 py-3 text-gray-500">{event.location}</td>
              <td className="space-x-2 px-4 py-3">
                <Link
                  href={`/admin/events/${event.id || event.is}`}
                  className="text-indigo-600 hover:underline"
                >
                  Modifier
                </Link>
                <Link
                  href={`/admin/events/${event.id || event.is}/sessions`}
                  className="text-indigo-600 hover:underline"
                >
                  Sessions
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
