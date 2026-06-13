export default function SpeakerCard({ speaker }) {
  return (
    <div className="rounded border bg-white px-4 py-3 shadow-sm">
      <p className="font-medium">
        {speaker.firstName} {speaker.lastName}
      </p>
      {speaker.company && (
        <p className="text-sm text-gray-500">{speaker.company}</p>
      )}
      {speaker.email && (
        <p className="text-xs text-gray-400">{speaker.email}</p>
      )}
      {(speaker.biography || speaker.description) && (
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {speaker.biography || speaker.description}
        </p>
      )}
    </div>
  );
}
