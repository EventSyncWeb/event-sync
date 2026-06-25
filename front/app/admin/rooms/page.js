"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/rooms")
      .then((r) => r.json())
      .then(setRooms)
      .catch(() => setError("Impossible de charger les salles"));
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Salles</h1>
        <Link
          href="/admin/rooms/new"
          className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
        >
          Nouvelle salle
        </Link>
      </div>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      {rooms.length === 0 ? (
        <p className="text-gray-500">Aucune salle.</p>
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-2 font-medium">Nom</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/admin/rooms/${r.id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
