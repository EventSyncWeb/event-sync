import Link from "next/link";

async function getSpeaker(id) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const res = await fetch(`${base}/api/speakers/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Speaker not found");
  return res.json();
}

export default async function SpeakerDetailPage({ params }) {
  const { id } = await params;

  let speaker;
  try {
    speaker = await getSpeaker(id);
  } catch {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <p className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">Speaker not found.</p>
          <Link href="/speakers" className="mt-4 inline-block text-blue-400 hover:text-blue-300 transition-colors duration-200">
            ← Back to speakers
          </Link>
        </div>
      </div>
    );
  }

  const fullName = `${speaker.firstName ?? ""} ${speaker.lastName ?? ""}`.trim();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/speakers"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 mb-6"
        >
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          All speakers
        </Link>

        <div className="rounded-xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm p-6 shadow-xl shadow-blue-900/20">
          <div className="flex items-center gap-4 mb-6">
            {speaker.profilePic ? (
              <img
                src={speaker.profilePic}
                alt={fullName}
                className="h-16 w-16 rounded-full object-cover border-2 border-indigo-500/50"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600/20 text-2xl font-bold text-indigo-400">
                {speaker.firstName?.[0]}{speaker.lastName?.[0]}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">{fullName}</h1>
              {speaker.company && (
                <p className="mt-1 text-sm text-blue-200/70">{speaker.company}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {(speaker.biography || speaker.description) && (
              <div>
                <h2 className="text-sm font-semibold text-blue-200/80 uppercase tracking-wide">Biography</h2>
                <p className="mt-1 text-sm text-blue-300/60 leading-relaxed">
                  {speaker.biography || speaker.description}
                </p>
              </div>
            )}

            {speaker.email && (
              <div>
                <h2 className="text-sm font-semibold text-blue-200/80 uppercase tracking-wide">Email</h2>
                <p className="mt-1 text-sm text-blue-300/60">{speaker.email}</p>
              </div>
            )}

            {speaker.linkedIn && (
              <div>
                <h2 className="text-sm font-semibold text-blue-200/80 uppercase tracking-wide">LinkedIn</h2>
                <a
                  href={speaker.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  {speaker.linkedIn}
                </a>
              </div>
            )}
          </div>
        </div>

        {speaker.sessions && speaker.sessions.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-white">
              Sessions ({speaker.sessions.length})
            </h2>
            <div className="space-y-3">
              {speaker.sessions.map((s) => (
                <Link
                  key={s.id}
                  href={`/sessions/${s.id}`}
                  className="block rounded-xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm p-4 shadow-lg shadow-blue-900/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-900/30 hover:border-blue-500/50"
                >
                  <h3 className="font-semibold text-white">{s.title || "Untitled session"}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {(!speaker.sessions || speaker.sessions.length === 0) && (
          <div className="mt-8 rounded-xl border border-dashed border-blue-800/30 p-8 text-center">
            <p className="text-blue-200/60">This speaker is not assigned to any session.</p>
          </div>
        )}
      </div>
    </div>
  );
}
