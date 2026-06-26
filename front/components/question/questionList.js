"use client";

import { useState } from "react";
import { upvoteQuestion } from "@/services/questionService";

export default function QuestionList({ questions, onUpvote }) {
  const [upvotedIds, setUpvotedIds] = useState(new Set());
  const [loadingId, setLoadingId] = useState(null);

  const handleUpvote = async (id) => {
    if (upvotedIds.has(id) || loadingId) return;
    setLoadingId(id);
    try {
      await upvoteQuestion(id);
      setUpvotedIds((prev) => new Set([...prev, id]));
      onUpvote?.(id);
    } catch (err) {
      console.error("Upvote failed :", err.message);
    } finally {
      setLoadingId(null);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-blue-300/40 text-center">
        <span className="text-4xl">💬</span>
        <p className="text-sm font-medium">No questions yet.</p>
        <p className="text-xs">Be the first to ask a question!</p>
      </div>
    );
  }

  const sorted = [...questions].sort(
    (a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0),
  );

  return (
    <ul className="flex flex-col gap-3">
      {sorted.map((q) => (
        <li
          key={q.id}
          className="rounded-xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm px-5 py-4 flex flex-col gap-2 shadow-lg shadow-blue-900/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-900/30 hover:border-blue-500/50"
        >
          {/* Meta */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-400">
              {q.author || "Anonymous"}
            </span>
            {q.createdAt && (
              <span className="text-xs text-blue-300/40">
                ·{" "}
                {new Date(q.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>

          {/* Content */}
          <p className="text-sm text-blue-200/80 leading-relaxed">{q.content}</p>

          {/* Upvote */}
          <button
            onClick={() => handleUpvote(q.id)}
            disabled={upvotedIds.has(q.id) || loadingId === q.id}
            aria-label="Voter pour cette question"
            className={`self-start flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200
              ${
                upvotedIds.has(q.id)
                  ? "border-blue-400 text-blue-400 bg-blue-500/20"
                  : "border-blue-800/30 text-blue-300/50 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-500/10"
              }
              disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <span className="text-[10px]">▲</span>
            <span>{(q.upvotes ?? 0) + (upvotedIds.has(q.id) ? 1 : 0)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}