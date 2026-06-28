import Link from "next/link";

export default function SpeakerCard({ speaker }) {
  return (
    <Link
      href={`/speakers/${speaker.id}`}
      className="block rounded-xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm px-4 py-3 shadow-lg shadow-blue-900/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-900/30 hover:border-blue-500/50"
    >
      <p className="font-medium text-white">
        {speaker.firstName} {speaker.lastName}
      </p>
      {speaker.sessionTitle && (
        <p className="text-xs text-blue-400">Session : {speaker.sessionTitle}</p>
      )}
      {speaker.company && (
        <p className="text-sm text-blue-200/70">{speaker.company}</p>
      )}
      {speaker.email && (
        <p className="text-xs text-blue-300/40">{speaker.email}</p>
      )}
      {(speaker.biography || speaker.description) && (
        <p className="mt-1 text-sm text-blue-300/60 line-clamp-2">
          {speaker.biography || speaker.description}
        </p>
      )}
    </Link>
  );
}