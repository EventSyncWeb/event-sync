"use client";

import { useState, useEffect } from "react";
import { getAllQuestions } from "@/services/questionService";

export default function SessionQuestionsPage({ params: paramsPromise }) {
  const [params, setParams] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (!params) return;
    getAllQuestions()
      .then(setQuestions)
      .catch((e) => setError(e.message));
  }, [params]);

  if (!params) return <p className="text-gray-500">Chargement...</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Questions</h1>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      {questions.length === 0 ? (
        <p className="text-gray-500">Aucune question.</p>
      ) : (
        <div className="space-y-3">
          {questions
            .sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0))
            .map((q) => (
              <div key={q.id} className="rounded border bg-white p-4 shadow-sm">
                <p className="font-medium">{q.content}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {q.authorName || "Anonyme"} — {q.upvoteCount || 0} votes
                </p>
              </div>
            ))}
        </div>
      )}
      <div className="mt-4">
        <button
          onClick={() => window.history.back()}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Retour
        </button>
      </div>
    </div>
  );
}
