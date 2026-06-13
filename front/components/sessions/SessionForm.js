"use client";

import { useState } from "react";

const EMPTY_FORM = {
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  room: "",
  capacity: "",
};

export default function SessionForm({ initialValues, onSubmit, submitLabel }) {
  const [form, setForm] = useState(initialValues || EMPTY_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium">Titre</label>
        <input
          name="title"
          required
          value={form.title}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          name="description"
          required
          rows={3}
          value={form.description}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Début</label>
          <input
            type="datetime-local"
            name="startTime"
            required
            value={form.startTime}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Fin</label>
          <input
            type="datetime-local"
            name="endTime"
            required
            value={form.endTime}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Salle</label>
          <input
            name="room"
            value={form.room}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Capacité</label>
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : submitLabel || "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
