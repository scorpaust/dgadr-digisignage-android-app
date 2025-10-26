import { ref, get, onValue, off } from "firebase/database";
import { db } from "../config";
import { NewsletterCollection, NewsletterIssue } from "../types/newsletter";

export class NewsletterService {
  private static instance: NewsletterService;
  private listeners: Map<string, (data: NewsletterCollection[]) => void> =
    new Map();

  static getInstance(): NewsletterService {
    if (!NewsletterService.instance) {
      NewsletterService.instance = new NewsletterService();
    }
    return NewsletterService.instance;
  }

  /**
   * Fetch all newsletter collections once
   */
  async getNewsletterCollections(): Promise<NewsletterCollection[]> {
    try {
      const newslettersRef = ref(db, "newsletters");
      const snapshot = await get(newslettersRef);

      if (!snapshot.exists()) {
        console.log("No newsletter data found");
        return [];
      }

      const data = snapshot.val();
      return this.transformFirebaseData(data);
    } catch (error) {
      console.error("Error fetching newsletters:", error);
      return [];
    }
  }

  /**
   * Subscribe to real-time updates of newsletter collections
   */
  subscribeToNewsletters(
    callback: (data: NewsletterCollection[]) => void
  ): string {
    const listenerId = Math.random().toString(36).substr(2, 9);
    const newslettersRef = ref(db, "newsletters");

    const unsubscribe = onValue(
      newslettersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const newsletters = this.transformFirebaseData(data);
          callback(newsletters);
        } else {
          callback([]);
        }
      },
      (error) => {
        console.error("Error in newsletter subscription:", error);
        callback([]);
      }
    );

    this.listeners.set(listenerId, callback);
    return listenerId;
  }

  /**
   * Unsubscribe from newsletter updates
   */
  unsubscribeFromNewsletters(listenerId: string): void {
    if (this.listeners.has(listenerId)) {
      const newslettersRef = ref(db, "newsletters");
      off(newslettersRef);
      this.listeners.delete(listenerId);
    }
  }

  /**
   * Get a specific newsletter collection by ID
   */
  async getNewsletterCollection(
    collectionId: string
  ): Promise<NewsletterCollection | null> {
    try {
      const collectionRef = ref(db, `newsletters/${collectionId}`);
      const snapshot = await get(collectionRef);

      if (!snapshot.exists()) {
        return null;
      }

      const data = snapshot.val();
      return this.transformSingleCollection(data);
    } catch (error) {
      console.error(
        `Error fetching newsletter collection ${collectionId}:`,
        error
      );
      return null;
    }
  }

  /**
   * Transform Firebase data structure to app data structure
   */
  private transformFirebaseData(firebaseData: any): NewsletterCollection[] {
    if (!firebaseData) return [];

    return Object.values(firebaseData).map((collection: any) =>
      this.transformSingleCollection(collection)
    );
  }

  /**
   * Transform a single collection from Firebase format
   */
  private transformSingleCollection(collection: any): NewsletterCollection {
    const issues: NewsletterIssue[] = collection.issues
      ? Object.values(collection.issues).map((issue: any) => ({
          id: issue.id,
          title: issue.title,
          description: issue.description || "",
          publishedAt: issue.publishedAt,
          url: issue.url || "",
          coverImagePath: issue.coverImagePath || "",
        }))
      : [];

    // Sort issues by publishedAt date (newest first)
    issues.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return {
      id: collection.id,
      name: collection.name,
      color: collection.color,
      issues,
    };
  }
}

export const newsletterService = NewsletterService.getInstance();
