"use client";

import { useState } from "react";
import { createQuestion } from "@/services/questionService";

export default function QuestionForm({ onQuestionAdded }) {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const newQuestion = await createQuestion({
        content: content.trim(),
        author: author.trim() || "Anonymous",
      });
      setContent("");
      setAuthor("");
      setSuccess(true);
      onQuestionAdded?.(newQuestion);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Questions</h2>
      </div>
      {/* Author */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="author"
          className="text-sm font-semibold text-slate-700"
        >
          Name <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Anonymous"
          maxLength={60}
          disabled={loading}
          className="border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="content"
          className="text-sm font-semibold text-slate-700"
        >
          Question <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ask your question here..."
          rows={3}
          maxLength={500}
          required
          disabled={loading}
          className="border border-slate-200 rounded-lg px-2.5 py-2.5 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition resize-y"
        />
        <span className="text-xs text-slate-400 text-right">
          {content.length}/500
        </span>
      </div>

      {/* Feedback */}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          ⚠ {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          Question posted successfully !
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="self-end flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          "Post"
        )}
      </button>
    </form>
  );
}
