import SessionList from "./SessionList";

export default function SessionTimeline({ sessions, speakersBySession }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-white">Program</h2>
      <SessionList sessions={sessions} speakersBySession={speakersBySession} />
    </section>
  );
}