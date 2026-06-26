import Link from "next/link";
import { getSessionsByEvent } from "@/services/sessionService";

async function getSpeakers(sessionId) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const res = await fetch(`${base}/speakers/session/${sessionId}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function SessionsPage({ params }) {
  const { id } = await params;

  let sessions = [];
  let error = null;
  try {
    sessions = await getSessionsByEvent(id);
  } catch (e) {
    error = e.message;
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
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-white">Sessions</h1>
          <Link
            href={`/admin/events/${id}/sessions/new`}
            className="w-full sm:w-auto rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/40 text-center"
          >
            New session
          </Link>
        </div>
        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</p>
        )}
        {sessions.length === 0 && !error ? (
          <div className="rounded-lg border border-dashed border-blue-800/30 py-16 text-center">
            <p className="text-blue-200/60">No session.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => {
              const sid = s.sessionId || s.id;
              return (
                <div
                  key={sid}
                  className="rounded-xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm p-4 shadow-lg shadow-blue-900/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-900/30 hover:border-blue-500/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{s.title}</h3>
                      <p className="text-sm text-blue-200/70">
                        {s.startTime} - {s.endTime}
                      </p>
                      {(speakersBySession[sid] || []).length > 0 && (
                        <p className="mt-1 text-xs text-blue-300/40">
                          {speakersBySession[sid].map((sp) => `${sp.firstName} ${sp.lastName}`).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/events/${id}/sessions/${sid}`}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/events/${id}/sessions/${sid}/speakers`}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      >
                        Speakers
                      </Link>
                      <Link
                        href={`/admin/events/${id}/sessions/${sid}/questions`}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      >
                        Questions
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-4">
          <Link
            href={`/admin/events/${id}`}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            ← Back to the event
          </Link>
        </div>
      </div>
    </div>
  );
}