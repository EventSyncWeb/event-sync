"use client";

import { useState, useEffect } from "react";
import { toggleFavoriteSession, getFavoriteStatus } from "@/services/sessionService";

export default function FavoriteButton({ sessionId, className = "" }) {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavoriteStatus(sessionId)
      .then((res) => setFavorited(res.favorited))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId]);

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await toggleFavoriteSession(sessionId);
      setFavorited(res.favorited);
    } catch {
      setFavorited((prev) => !prev);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <button disabled className={`shrink-0 rounded-lg p-2 text-sm transition-all duration-200 ${className}`}>
        <svg className="h-5 w-5 animate-pulse text-blue-400/50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`shrink-0 rounded-lg p-2 text-sm transition-all duration-200 ${
        favorited
          ? "text-red-400 hover:text-red-300"
          : "text-blue-400/50 hover:text-red-400"
      } ${className}`}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth={favorited ? 0 : 2}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
}
