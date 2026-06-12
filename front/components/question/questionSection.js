"use client";

import { useState, useCallback, use, Suspense } from "react";
import { getAllQuestions } from "@/app/services/questionService";
import QuestionForm from "./questionForm";
import QuestionList from "./questionList";

function QuestionsView({ promise, onUpvote }) {
  const questions = use(promise);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">
          {questions.length > 0
            ? `${questions.length} question${questions.length > 1 ? "s" : ""}`
            : "Questions"}
        </h3>
      </div>
      {questions.length === 0 ? (
        <p className="text-center text-slate-400 py-8">
          Soyez le premier a poser une question !
        </p>
      ) : (
        <QuestionList questions={questions} onUpvote={onUpvote} />
      )}
    </>
  );
}

export default function QuestionSection() {
  const [promise, setPromise] = useState(() => getAllQuestions());

  const handleRefresh = useCallback(() => {
    setPromise(getAllQuestions());
  }, []);

  const handleQuestionAdded = () => {
    handleRefresh();
  };

  const handleUpvote = (id) => {
    handleRefresh();
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-10 w-200">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm w-200">
        <QuestionForm onQuestionAdded={handleQuestionAdded} />
      </div>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handleRefresh}
          title="Rafraîchir"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition text-base"
        >
          ↻
        </button>
      </div>
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
            <span className="w-7 h-7 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-sm">Chargement des questions...</p>
          </div>
        }
      >
        <QuestionsView promise={promise} onUpvote={handleUpvote} />
      </Suspense>
    </section>
  );
}
