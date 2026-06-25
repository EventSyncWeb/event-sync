import { getAllSpeakers } from "@/services/speakerService";
import SpeakerList from "@/components/speakers/SpeakerList";

export default async function SpeakersPage() {
  let speakers = [];
  let error = null;

  try {
    speakers = await getAllSpeakers();
  } catch (e) {
    error = e.message;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-red-600">Erreur : {error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Intervenants</h1>
      {speakers.length === 0 ? (
        <p className="text-gray-500">Aucun intervenant.</p>
      ) : (
        <div className="space-y-3">
          {speakers.map((s) => (
            <SpeakerList key={s.id} speakers={[s]} />
          ))}
        </div>
      )}
    </div>
  );
}
