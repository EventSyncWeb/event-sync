export function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("T")[0].split("-");
  if (!y || !m || !d) return dateStr;
  const date = new Date(+y, +m - 1, +d);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(timeStr) {
  if (!timeStr) return "";
  if (/^\d{2}:\d{2}/.test(timeStr)) {
    return timeStr.slice(0, 5);
  }
  const d = new Date(timeStr);
  if (isNaN(d)) return timeStr;
  return d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "";
  return `${formatDate(dateStr)} à ${formatTime(dateStr)}`;
}

export function isLive(startTime, endTime, sessionDate) {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  if (sessionDate && sessionDate !== today) {
    return false;
  }

  const start = new Date(`${today}T${startTime}`);
  const end = new Date(`${today}T${endTime}`);

  return now >= start && now <= end;
}

export function isUpcoming(dateTime) {
  return new Date(dateTime) > new Date();
}
