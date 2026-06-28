"use client";

import { useState, useCallback, use, Suspense } from "react";
import { getQuestionsBySessionId } from "@/services/questionService";
import QuestionForm from "./questionForm";
import QuestionList from "./questionList";

function QuestionsView({ promise, onUpvote }) {
  const questions = use(promise);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-blue-200/80">
          {questions.length > 0
            ? `${questions.length} question${questions.length > 1 ? "s" : ""}`
            : "Questions"}
        </h3>
      </div>
      {questions.length === 0 ? (
        <p className="text-center text-blue-300/40 py-8">
          Be the first to ask a question!
        </p>
      ) : (
        <QuestionList questions={questions} onUpvote={onUpvote} />
      )}
    </>
  );
}

export default function QuestionSection({ sessionId, live }) {
  const [promise, setPromise] = useState(() => getQuestionsBySessionId(sessionId));

  const handleRefresh = useCallback(() => {
    setPromise(getQuestionsBySessionId(sessionId));
  }, [sessionId]);

  const handleQuestionAdded = () => {
    handleRefresh();
  };

  const handleUpvote = (id) => {
    handleRefresh();
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-10 w-200">
      {live && (
        <div className="rounded-2xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm p-6 mb-6 shadow-xl shadow-blue-900/20">
          <QuestionForm sessionId={sessionId} onQuestionAdded={handleQuestionAdded} />
        </div>
      )}
      <div className="rounded-2xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm p-6 mb-6 shadow-xl shadow-blue-900/20">
        <QuestionForm sessionId={sessionId} onQuestionAdded={handleQuestionAdded} />
      </div>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handleRefresh}
          title="Rafraîchir"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-blue-800/30 bg-slate-800/50 text-blue-300/50 transition-all duration-200 hover:bg-slate-700/50 hover:text-white hover:border-blue-500/50"
        >
          ↻
        </button>
      </div>
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3 py-12 text-blue-300/40">
            <span className="w-7 h-7 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm">Loading questions...</p>
          </div>
        }
      >
        <QuestionsView promise={promise} onUpvote={handleUpvote} />
      </Suspense>
    </section>
  );
}