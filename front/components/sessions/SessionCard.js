import Link from "next/link";
import { isLive } from "@/lib/utils";
import LiveIndicator from "./LiveIndicator";

export default function SessionCard({ session, speakers = [] }) {
  const id = session.sessionId || session.id;
  const live = isLive(session.startTime, session.endTime);

  return (
    <div className="rounded border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{session.title}</h3>
            <LiveIndicator isLive={live} />
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            {session.startTime} — {session.endTime}
            {session.roomName && ` · salle ${session.roomName}`}
          </p>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {session.description}
          </p>
          {speakers.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {speakers.map((sp) => (
                <span
                  key={sp.id}
                  className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700"
                >
                  {sp.firstName} {sp.lastName}
                </span>
              ))}
            </div>
          )}
        </div>
        <Link
          href={`/sessions/${id}`}
          className="shrink-0 rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
        >
          Voir
        </Link>
      </div>
    </div>
  );
}
