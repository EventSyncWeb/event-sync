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
      .catch(() => setError("Unable to load rooms"));
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-white">Rooms</h1>
          <Link
            href="/admin/rooms/new"
            className="w-full sm:w-auto rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/40 text-center"
          >
            New room
          </Link>
        </div>
        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</p>
        )}
        {rooms.length === 0 ? (
          <div className="rounded-lg border border-dashed border-blue-800/30 py-16 text-center">
            <p className="text-blue-200/60">No rooms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm shadow-xl shadow-blue-900/20">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-blue-800/30 bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-blue-200/80">Name</th>
                  <th className="px-4 py-3 font-medium text-blue-200/80">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.id} className="border-b border-blue-800/20 last:border-0">
                    <td className="px-4 py-3 text-blue-200/70">{r.name}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/rooms/${r.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}