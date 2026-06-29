import Link from "next/link";
import { isLive } from "@/lib/utils";
import LiveIndicator from "@/components/sessions/LiveIndicator";
import SpeakerList from "@/components/speakers/SpeakerList";
import QuestionSection from "@/components/question/questionSection";
import FavoriteButton from "@/components/sessions/FavoriteButton";

async function getSession(id) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const res = await fetch(`${base}/api/sessions/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Session introuvable");
  return res.json();
}

async function getSpeakers(sessionId) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const res = await fetch(`${base}/api/speakers/session/${sessionId}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

async function getEvent(eventId) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const res = await fetch(`${base}/api/events/${eventId}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function SessionPage({ params }) {
  const { id } = await params;

  let session, speakers, event;
  try {
    session = await getSession(id);
    speakers = await getSpeakers(id);
    event = await getEvent(session.eventId);
  } catch {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <p className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">Session not found.</p>
          <Link href="/events" className="mt-4 inline-block text-blue-400 hover:text-blue-300 transition-colors duration-200">
            ← Back
          </Link>
        </div>
      </div>
    );
  }

 
  const live = isLive(session.startTime, session.endTime, session.date);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href={`/events/${session.eventId}`}
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to '{event.title}'
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{session.title}</h1>
            <LiveIndicator isLive={live} />
            <FavoriteButton sessionId={id} />
          </div>
          <p className="mt-1 text-sm text-blue-200/70">
            {session.startTime} — {session.endTime}
            {session.roomName && ` · ${session.roomName}`}
          </p>
          <p className="mt-2 text-blue-300/60">{session.description}</p>
          {event && (
            <h2 className="mt-2 font-bold text-blue-200/70">
                {event.title}
            </h2>
          )}
        </div>

        {speakers.length > 0 && (
          <div className="mb-6">
            <SpeakerList speakers={speakers} />
          </div>
        )}

         {live ? (
          <div className="rounded-xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm p-6 shadow-xl shadow-blue-900/20">
            <h2 className="mb-4 text-center text-2xl font-bold text-white">Feel free to ask a question</h2>
            <QuestionSection sessionId={id} live={live} />
          </div>
        ) : ( 
          <div className="rounded-xl border border-blue-800/30 bg-slate-800/30 backdrop-blur-sm p-6  shadow-xl shadow-blue-900/20">
            <p className="text-blue-300/50">Questions available only when the session is live.</p>
        <div className="rounded-xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm p-6 shadow-xl shadow-blue-900/20">
          <h2 className="mb-4 text-lg font-bold text-white text">Questions</h2>
          <QuestionSection  sessionId={id} live={live} />
        </div>  
        </div>)}
        </div>
      </div>
   
  );
}