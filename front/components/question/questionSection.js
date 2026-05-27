"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllQuestions } from "@/app/services/questionService";
import QuestionForm from "./questionForm";
import QuestionList from "./questionList";

export default function QuestionSection() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllQuestions();
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleQuestionAdded = (newQuestion) => {
    setQuestions((prev) => [newQuestion, ...prev]);
  };

  const handleUpvote = (id) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, upvotes: (q.upvotes ?? 0) + 1 } : q
      )
    );
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-10 w-200">
      {/* Header */}
    

      {/* Form card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm w-200">
        <QuestionForm onQuestionAdded={handleQuestionAdded} />
      </div>

      {/* List header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">
          {questions.length > 0
            ? `${questions.length} question${questions.length > 1 ? "s" : ""}`
            : "Questions"}
        </h3>
        <button
          onClick={fetchQuestions}
          title="Rafraîchir"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition text-base"
        >
          ↻
        </button>
      </div>

      {/* List content */}
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
          <span className="w-7 h-7 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm">loading questions...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
          <p className="text-sm text-red-500">⚠ {error}</p>
          <button
            onClick={fetchQuestions}
            className="text-sm border border-red-300 text-red-500 rounded-lg px-4 py-1.5 hover:bg-red-50 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <QuestionList questions={questions} onUpvote={handleUpvote} />
      )}
    </section>
  );
}