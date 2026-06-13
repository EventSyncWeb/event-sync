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
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sessions</h1>
        <Link
          href={`/admin/events/${id}/sessions/new`}
          className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
        >
          Nouvelle session
        </Link>
      </div>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      {sessions.length === 0 && !error ? (
        <p className="text-gray-500">Aucune session.</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => {
            const sid = s.sessionId || s.id;
            return (
              <div
                key={sid}
                className="rounded border bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="text-sm text-gray-500">
                      {s.startTime} - {s.endTime}
                    </p>
                    {(speakersBySession[sid] || []).length > 0 && (
                      <p className="mt-1 text-xs text-gray-400">
                        {speakersBySession[sid].map((sp) => `${sp.firstName} ${sp.lastName}`).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="space-x-2">
                    <Link
                      href={`/admin/events/${id}/sessions/${sid}`}
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      Modifier
                    </Link>
                    <Link
                      href={`/admin/events/${id}/sessions/${sid}/speakers`}
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      Intervenants
                    </Link>
                    <Link
                      href={`/admin/events/${id}/sessions/${sid}/questions`}
                      className="text-sm text-indigo-600 hover:underline"
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
          className="text-sm text-gray-600 hover:underline"
        >
          ← Retour à l&apos;événement
        </Link>
      </div>
    </div>
  );
}
