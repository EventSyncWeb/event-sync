import SessionCard from "./SessionCard";

export default function SessionList({ sessions, speakersBySession = {} }) {
  if (sessions.length === 0) {
    return <p className="text-gray-500">No scheduled sessions.</p>;
  }

  return (
    <div className="space-y-4">
      {sessions.map((s) => {
        const id = s.sessionId || s.id;
        return (
          <SessionCard
            key={id}
            session={s}
            speakers={speakersBySession[id] || []}
          />
        );
      })}
    </div>
  );
}
