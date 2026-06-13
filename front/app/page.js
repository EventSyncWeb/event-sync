import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-4xl font-bold text-indigo-600">EventSync</h1>
      <p className="mb-8 max-w-md text-gray-600">
        Plateforme interactive de gestion d&apos;événements en temps réel.
        Consultez le programme, posez vos questions et interagissez avec les
        intervenants.
      </p>
      <Link
        href="/events"
        className="rounded bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
      >
        Voir les événements
      </Link>
    </div>
  );
}
