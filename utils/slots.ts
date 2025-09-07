// utils/slots.ts
export const SLOT_KEY = "lastFetchedSlotISO"; // ex: "2025-09-08T13:00:00.000Z"

export function latestSlotBefore(now = new Date()): Date {
  const d = new Date(now);
  const slot = new Date(d);
  slot.setMinutes(0, 0, 0);
  slot.setHours(d.getHours() >= 13 ? 13 : 0);
  // recua fins-de-semana para a 6ª às 13h
  while ([0, 6].includes(slot.getDay())) {
    slot.setDate(slot.getDate() - 1);
    slot.setHours(13, 0, 0, 0);
  }
  return slot;
}
