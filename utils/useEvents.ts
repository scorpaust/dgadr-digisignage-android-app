import { useEffect, useState } from "react";
import { EventRecord } from "../types/event";
import { eventService } from "./eventService";

export function useEvents() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let listenerId: string | null = null;

    try {
      listenerId = eventService.subscribeToEvents((data) => {
        setEvents(data);
        setLoading(false);
        setError(null);
      });
    } catch (err) {
      console.error("Error setting up events subscription:", err);
      setError("Failed to load events");
      setLoading(false);
    }

    return () => {
      if (listenerId) {
        eventService.unsubscribeFromEvents(listenerId);
      }
    };
  }, []);

  return { events, loading, error };
}
