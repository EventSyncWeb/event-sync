import { apiGet, apiPost, apiPut } from "./api";

export async function getAllQuestions() {
  return apiGet("/question");
}

export async function getQuestionsBySessionId(sessionId) {
  try {
    return await apiGet(`/question/session/${sessionId}`);
  } catch {
    return [];
  }
}

export async function getQuestionById(id) {
  return apiGet(`/question/${id}`);
}

export async function createQuestion(questionData) {
  return apiPost("/question", questionData);
}

export async function createQuestionForSession(sessionId, questionData) {
  return apiPost(`/question/session/${sessionId}`, questionData);
}

export async function upvoteQuestion(id) {
  return apiPut(`/question/${id}/upvote`);
}
