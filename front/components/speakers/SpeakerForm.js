"use client";

import { useState } from "react";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  biography: "",
  profilePic: "",
};

export default function SpeakerForm({ initialValues, onSubmit, submitLabel }) {
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
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Prénom</label>
          <input
            name="firstName"
            required
            value={form.firstName}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Nom</label>
          <input
            name="lastName"
            required
            value={form.lastName}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Entreprise</label>
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Photo de profil (URL)</label>
        <input
          name="profilePic"
          value={form.profilePic || ""}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Biographie</label>
        <textarea
          name="biography"
          rows={3}
          value={form.biography}
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
          {loading ? "Enregistrement..." : submitLabel || "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
