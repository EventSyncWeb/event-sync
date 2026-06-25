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
      setError("Le nom de la salle est requis.");
      return;
    }
    setLoading(true);
    try {
      await updateRoom(params.id, { name: name.trim() });
      router.push("/admin/rooms");
    } catch (err) {
      setError(err.message || "Erreur lors de la modification.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Supprimer cette salle ?")) return;
    try {
      await deleteRoom(params.id);
      router.push("/admin/rooms");
    } catch (err) {
      setError(err.message);
    }
  }

  if (!params) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Modifier la salle</h1>
        <button
          onClick={handleDelete}
          className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
        >
          Supprimer
        </button>
      </div>
      {error && (
        <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nom de la salle
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            autoFocus
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/rooms")}
            className="rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
