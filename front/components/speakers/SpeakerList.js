import SpeakerCard from "./SpeakerCard";

export default function SpeakerList({ speakers }) {
  if (speakers.length === 0) return null;

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold text-slate-200">Speakers :</h2>
      <div className="flex flex-wrap gap-3">
        {speakers.map((sp) => (
          <SpeakerCard key={sp.id} speaker={sp} />
        ))}
      </div>
    </div>
  );
}
