"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/services/roomService";

export default function NewRoomPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Le nom de la salle est requis.");
      return;
    }
    setLoading(true);
    try {
      await createRoom({ name: name.trim() });
      router.push("/admin/rooms");
    } catch (err) {
      setError(err.message || "Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-2xl font-bold text-white">New room</h1>
        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-blue-200/80">
              Name of the room
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border-0 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
              placeholder="ex: Amphitheater A"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/rooms")}
              className="w-full sm:w-auto rounded-lg border border-blue-800/30 bg-slate-800/50 px-6 py-2.5 text-sm font-medium text-blue-200/70 transition-all duration-200 hover:bg-slate-700/50 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}