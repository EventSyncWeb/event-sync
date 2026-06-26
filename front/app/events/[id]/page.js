import Link from "next/link";
import EventDetail from "@/components/events/EventDetail";
import SessionTimeline from "@/components/sessions/SessionTimeline";

async function getEvent(id) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const res = await fetch(`${base}/api/events/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Événement introuvable");
  return res.json();
}

async function getSessions(eventId) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const res = await fetch(`${base}/api/session/event/${eventId}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

async function getSpeakers(sessionId) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const res = await fetch(`${base}/speakers/session/${sessionId}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function EventDetailPage({ params }) {
  const { id } = await params;

  let event, sessions;
  try {
    event = await getEvent(id);
    sessions = await getSessions(id);
  } catch {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <p className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">Event not found.</p>
          <Link href="/events" className="mt-4 inline-block text-blue-400 hover:text-blue-300 transition-colors duration-200">
            ← Back to events
          </Link>
        </div>
      </div>
    );
  }

  const speakersBySession = {};
  for (const s of sessions) {
    try {
      speakersBySession[s.sessionId || s.id] = await getSpeakers(
        s.sessionId || s.id
      );
    } catch {
      speakersBySession[s.sessionId || s.id] = [];
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/events" className="inline-block text-blue-400 hover:text-blue-300 transition-colors duration-200 mb-4">
          ← All events
        </Link>
        <EventDetail event={event} />
        <div className="mt-8">
          <SessionTimeline
            sessions={sessions}
            speakersBySession={speakersBySession}
          />
        </div>
      </div>
    </div>
  );
}