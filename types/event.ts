export type EventRecord = {
  id: string;
  title: string;
  summary: string;
  location?: string;
  startDate: string; // ISO date, e.g. "2026-07-21"
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  eventUrl?: string;
  imagePath?: string;
  createdAt?: string;
  updatedAt?: string;
};
