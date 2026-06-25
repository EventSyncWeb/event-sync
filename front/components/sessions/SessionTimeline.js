import SessionList from "./SessionList";

export default function SessionTimeline({ sessions, speakersBySession }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Programme</h2>
      <SessionList sessions={sessions} speakersBySession={speakersBySession} />
    </section>
  );
}
