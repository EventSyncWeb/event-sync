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
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-slate-400 text-center">
        <span className="text-4xl">💬</span>
        <p className="text-sm font-medium">No questions yet.</p>
        <p className="text-xs">Be the first to ask a question !</p>
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
          className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Meta */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-indigo-600">
              {q.author || "Anonymous"}
            </span>
            {q.createdAt && (
              <span className="text-xs text-slate-400">
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
          <p className="text-sm text-slate-700 leading-relaxed">{q.content}</p>

          {/* Upvote */}
          <button
            onClick={() => handleUpvote(q.id)}
            disabled={upvotedIds.has(q.id) || loadingId === q.id}
            aria-label="Voter pour cette question"
            className={`self-start flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition
              ${
                upvotedIds.has(q.id)
                  ? "border-indigo-400 text-indigo-600 bg-indigo-50"
                  : "border-slate-200 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50"
              }
              disabled:cursor-not-allowed`}
          >
            <span className="text-[10px]">▲</span>
            <span>{(q.upvotes ?? 0) + (upvotedIds.has(q.id) ? 1 : 0)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
