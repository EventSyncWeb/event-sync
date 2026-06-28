"use client";

import { useState, useEffect } from "react";
import { getQuestionsBySessionId } from "@/services/questionService";

export default function SessionQuestionsPage({ params: paramsPromise }) {
  const [params, setParams] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (!params) return;
    getQuestionsBySessionId(params.sessionId)
      .then(setQuestions)
      .catch((e) => setError(e.message));
  }, [params]);

  if (!params) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-2xl font-bold text-white">Questions</h1>
        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</p>
        )}
        {questions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-blue-800/30 py-16 text-center">
            <p className="text-blue-200/60">No question.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions
              .sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0))
              .map((q) => (
                <div key={q.id} className="rounded-xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm p-4 shadow-lg shadow-blue-900/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-900/30 hover:border-blue-500/50">
                  <p className="font-medium text-white">{q.content}</p>
                  <p className="mt-1 text-sm text-blue-200/70">
                    {q.authorName || "Anonymous"} — {q.upvoteCount || 0} votes
                  </p>
                </div>
              ))}
          </div>
        )}
        <div className="mt-4">
          <button
            onClick={() => window.history.back()}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}