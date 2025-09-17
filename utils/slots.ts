// utils/slots.ts
export const SLOT_KEY = "lastFetchedSlotISO"; // ex: "2025-09-08T13:00:00.000Z"

const SLOT_HOURS = [10, 13];

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function copyAtHour(source: Date, hour: number) {
  const d = new Date(source);
  d.setHours(hour, 0, 0, 0);
  return d;
}

export function latestSlotBefore(now = new Date()): Date {
  const reference = new Date(now);
  reference.setMilliseconds(0);

  for (let offset = 0; offset < 14; offset += 1) {
    const day = new Date(reference);
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - offset);

    if (isWeekend(day)) {
      continue;
    }

    for (let i = SLOT_HOURS.length - 1; i >= 0; i -= 1) {
      const candidate = copyAtHour(day, SLOT_HOURS[i]);
      if (candidate <= now) {
        return candidate;
      }
    }
  }

  // fallback defensive: return earliest slot today
  return copyAtHour(reference, SLOT_HOURS[0]);
}
