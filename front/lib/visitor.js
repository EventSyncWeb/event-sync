const VISITOR_KEY = "eventsync_visitor_id";

export function getVisitorId() {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}
