
export function getClassDate(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function getClassStatus(item, now = new Date()) {
  const start = getClassDate(item.time);
  const end = new Date(start.getTime() + item.duration * 60000);

  if (now < start) return "upcoming";
  if (now < end) return "ongoing";
  return "completed";
}

export function getCountdown(targetDate) {
  const remaining = targetDate.getTime() - Date.now();

  if (remaining <= 0) return "00:00:00";

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return [hours, minutes, seconds]
    .map(value => String(value).padStart(2, "0"))
    .join(":");
}

export function scheduleReminder(item, callback) {
  const start = getClassDate(item.time);
  const delay = start.getTime() - Date.now();

  if (delay <= 0) return null;

  return setTimeout(callback, delay);
}
