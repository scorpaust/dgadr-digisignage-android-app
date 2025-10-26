import { useState, useEffect } from "react";
import { NewsletterCollection } from "../types/newsletter";
import { newsletterService } from "./newsletterService";

export function useNewsletters() {
  const [newsletters, setNewsletters] = useState<NewsletterCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let listenerId: string | null = null;

    const setupSubscription = () => {
      try {
        listenerId = newsletterService.subscribeToNewsletters((data) => {
          setNewsletters(data);
          setLoading(false);
          setError(null);
        });
      } catch (err) {
        console.error("Error setting up newsletter subscription:", err);
        setError("Failed to load newsletters");
        setLoading(false);
      }
    };

    setupSubscription();

    return () => {
      if (listenerId) {
        newsletterService.unsubscribeFromNewsletters(listenerId);
      }
    };
  }, []);

  const refreshNewsletters = async () => {
    try {
      setLoading(true);
      const data = await newsletterService.getNewsletterCollections();
      setNewsletters(data);
      setError(null);
    } catch (err) {
      console.error("Error refreshing newsletters:", err);
      setError("Failed to refresh newsletters");
    } finally {
      setLoading(false);
    }
  };

  return {
    newsletters,
    loading,
    error,
    refreshNewsletters,
  };
}

export function useNewsletterCollection(collectionId: string) {
  const [collection, setCollection] = useState<NewsletterCollection | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);
        const data = await newsletterService.getNewsletterCollection(
          collectionId
        );
        setCollection(data);
        setError(null);
      } catch (err) {
        console.error(
          `Error fetching newsletter collection ${collectionId}:`,
          err
        );
        setError("Failed to load newsletter collection");
      } finally {
        setLoading(false);
      }
    };

    if (collectionId) {
      fetchCollection();
    }
  }, [collectionId]);

  return {
    collection,
    loading,
    error,
  };
}
