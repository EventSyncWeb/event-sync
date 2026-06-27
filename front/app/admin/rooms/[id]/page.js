"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRoom, updateRoom, deleteRoom } from "@/services/roomService";

export default function EditRoomPage({ params: paramsPromise }) {
  const router = useRouter();
  const [params, setParams] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (!params) return;
    getRoom(params.id)
      .then((room) => setName(room.name || ""))
      .catch((e) => setError(e.message));
  }, [params]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("The name of the room is required.");
      return;
    }
    setLoading(true);
    try {
      await updateRoom(params.id, { name: name.trim() });
      router.push("/admin/rooms");
    } catch (err) {
      setError(err.message || "Error editing.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this room ?")) return;
    try {
      await deleteRoom(params.id);
      router.push("/admin/rooms");
    } catch (err) {
      setError(err.message);
    }
  }

  if (!params) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-white">Edit the room</h1>
          <button
            onClick={handleDelete}
            className="w-full sm:w-auto rounded-lg bg-red-600/80 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-red-600/20 transition-all duration-200 hover:bg-red-700 hover:shadow-red-600/40"
          >
            Delete
          </button>
        </div>
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
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save"}
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