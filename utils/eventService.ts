import { ref, get, onValue, off } from "firebase/database";
import { db } from "../config";
import { EventRecord } from "../types/event";

export class EventService {
  private static instance: EventService;
  private listeners: Map<string, (data: EventRecord[]) => void> = new Map();

  static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }

  /**
   * Fetch all events once
   */
  async getEvents(): Promise<EventRecord[]> {
    try {
      const eventsRef = ref(db, "events");
      const snapshot = await get(eventsRef);

      if (!snapshot.exists()) {
        return [];
      }

      return this.transformFirebaseData(snapshot.val());
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }

  /**
   * Subscribe to real-time updates of events
   */
  subscribeToEvents(callback: (data: EventRecord[]) => void): string {
    const listenerId = Math.random().toString(36).substr(2, 9);
    const eventsRef = ref(db, "events");

    onValue(
      eventsRef,
      (snapshot) => {
        callback(
          snapshot.exists() ? this.transformFirebaseData(snapshot.val()) : []
        );
      },
      (error) => {
        console.error("Error in events subscription:", error);
        callback([]);
      }
    );

    this.listeners.set(listenerId, callback);
    return listenerId;
  }

  /**
   * Unsubscribe from event updates
   */
  unsubscribeFromEvents(listenerId: string): void {
    if (this.listeners.has(listenerId)) {
      const eventsRef = ref(db, "events");
      off(eventsRef);
      this.listeners.delete(listenerId);
    }
  }

  /**
   * Transform Firebase data structure to app data structure
   */
  private transformFirebaseData(firebaseData: any): EventRecord[] {
    if (!firebaseData) return [];

    return Object.entries(firebaseData).map(([key, value]: [string, any]) => ({
      id: value?.id || key,
      title: value?.title || "",
      summary: value?.summary || "",
      location: value?.location || "",
      startDate: value?.startDate || "",
      contactName: value?.contactName || "",
      contactEmail: value?.contactEmail || "",
      contactPhone: value?.contactPhone || "",
      eventUrl: value?.eventUrl || "",
      imagePath: value?.imagePath || "",
      createdAt: value?.createdAt || "",
      updatedAt: value?.updatedAt || "",
    }));
  }
}

export const eventService = EventService.getInstance();
