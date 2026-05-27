const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function handleResponse(res) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API Error");
  }
  return res.json();
}

export async function getAllQuestions() {
  const res = await fetch(`${API_BASE_URL}/question`, {
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function getQuestionById(id) {
  const res = await fetch(`${API_BASE_URL}/question/${id}`, {
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function createQuestion(questionData) {
  const res = await fetch(`${API_BASE_URL}/question`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(questionData),
  });
  return handleResponse(res);
}

export async function upvoteQuestion(id) {
  const res = await fetch(
    `${API_BASE_URL}/question/${id}/upvote`,
    {
      method: "PUT",
    }
  );

  if (!res.ok) throw new Error("Upvote failed");
  return res.text();
}