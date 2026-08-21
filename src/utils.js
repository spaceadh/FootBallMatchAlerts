export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retry(fn, retries = 3, delay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        await sleep(delay * attempt);
      }
    }
  }

  throw lastError;
}

export function getDateString(date = new Date()) {
  return date.toISOString().split("T")[0];
}

export function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function minutesUntil(date) {
  return (
    (new Date(date).getTime() - Date.now()) / 60000
  );
}

export function minutesSince(date) {
  return (
    (Date.now() - new Date(date).getTime()) / 60000
  );
}

export function formatTime(date) {
  return new Intl.DateTimeFormat("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Nairobi"
  }).format(new Date(date));
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Nairobi"
  }).format(new Date(date));
}