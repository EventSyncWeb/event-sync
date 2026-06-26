"use client";

import { useState } from "react";

const EMPTY_FORM = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  location: "",
};

export default function EventForm({ initialValues, onSubmit, submitLabel }) {
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
          <label className="mb-1 block text-sm font-medium">Beginning</label>
          <input
            type="date"
            name="startDate"
            required
            value={form.startDate}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">End</label>
          <input
            type="date"
            name="endDate"
            required
            value={form.endDate}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Location</label>
        <input
          name="location"
          required
          value={form.location}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : submitLabel || "save"}
        </button>
      </div>
    </form>
  );
}
