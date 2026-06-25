import Link from "next/link";
import { isLive } from "@/lib/utils";
import LiveIndicator from "@/components/sessions/LiveIndicator";
import SpeakerList from "@/components/speakers/SpeakerList";
import QuestionSection from "@/components/question/questionSection";

async function getSession(id) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const res = await fetch(`${base}/api/session/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Session introuvable");
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

export default async function SessionPage({ params }) {
  const { id } = await params;

  let session, speakers;
  try {
    session = await getSession(id);
    speakers = await getSpeakers(id);
  } catch {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-red-600">Session introuvable.</p>
        <Link href="/events" className="text-sm text-indigo-600 hover:underline">
          ← Retour
        </Link>
      </div>
    );
  }

  const live = isLive(session.startTime, session.endTime);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/events/${session.eventId}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Retour à l&apos;événement
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-3xl font-bold">{session.title}</h1>
          <LiveIndicator isLive={live} />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {session.startTime} — {session.endTime}
          {session.roomName && ` · salle ${session.roomName}`}
        </p>
        <p className="mt-2 text-gray-600">{session.description}</p>
      </div>

      {speakers.length > 0 && (
        <div className="mb-6">
          <SpeakerList speakers={speakers} />
        </div>
      )}

      {live ? (
        <div className="rounded border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Questions en direct</h2>
          <QuestionSection />
        </div>
      ) : (
        <div className="rounded border bg-gray-50 p-6 text-center text-gray-500 shadow-sm">
          Les questions seront disponibles lorsque la session sera en direct.
        </div>
      )}
    </div>
  );
}
