import Link from "next/link";
import { formatDate, isLive } from "@/lib/utils";
import LiveIndicator from "./LiveIndicator";

export default function SessionCard({ session, speakers = [] }) {
  const id = session.sessionId || session.id;
  const live = isLive(session.startTime, session.endTime);

  return (
    <div className="rounded-xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm p-4 shadow-lg shadow-blue-900/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-900/30 hover:border-blue-500/50">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{session.title}</h3>
            <LiveIndicator isLive={live} />
          </div>
          <p className="mt-0.5 text-sm text-blue-200/70">
            {formatDate(session.date)} - {session.startTime} — {session.endTime}
            {session.roomName && ` - ${session.roomName}`}
          </p>
          <p className="mt-1 text-sm text-blue-300/60 line-clamp-2">
            {session.description}
          </p>
          {speakers.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {speakers.map((sp) => (
                <span
                  key={sp.id}
                  className="rounded-full bg-slate-800/50 px-2.5 py-0.5 text-xs text-blue-300/60"
                >
                  {sp.firstName} {sp.lastName}
                </span>
              ))}
            </div>
          )}
        </div>
        <Link
          href={`/sessions/${id}`}
          className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/40"
        >
          Watch
        </Link>
      </div>
    </div>
  );
}