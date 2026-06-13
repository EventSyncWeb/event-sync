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
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-red-600">Événement introuvable.</p>
        <Link href="/events" className="text-sm text-indigo-600 hover:underline">
          ← Retour aux événements
        </Link>
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/events" className="text-sm text-indigo-600 hover:underline">
        ← Tous les événements
      </Link>
      <EventDetail event={event} />
      <div className="mt-8">
        <SessionTimeline
          sessions={sessions}
          speakersBySession={speakersBySession}
        />
      </div>
    </div>
  );
}
