import { ref, set } from "firebase/database";
import { db } from "../config";
import { FALLBACK_NEWSLETTER_COLLECTIONS } from "../data/newsletters";

/**
 * Script to migrate newsletter data to Firebase Realtime Database
 * Run this once to populate your Firebase database with existing data
 */
export async function migrateNewslettersToFirebase() {
  try {
    console.log("Starting newsletter migration to Firebase...");

    // Transform data to Firebase structure
    const firebaseData: any = {};

    FALLBACK_NEWSLETTER_COLLECTIONS.forEach((collection) => {
      const issuesObject: any = {};

      collection.issues.forEach((issue) => {
        issuesObject[issue.id] = {
          id: issue.id,
          title: issue.title,
          description: issue.description || "",
          publishedAt: issue.publishedAt,
          url: issue.url || "",
          coverImagePath: issue.coverImagePath || "",
        };
      });

      firebaseData[collection.id] = {
        id: collection.id,
        name: collection.name,
        color: collection.color,
        issues: issuesObject,
      };
    });

    // Write to Firebase
    const newslettersRef = ref(db, "newsletters");
    await set(newslettersRef, firebaseData);

    console.log("Newsletter migration completed successfully!");
    console.log("Data structure in Firebase:");
    console.log(JSON.stringify(firebaseData, null, 2));

    return true;
  } catch (error) {
    console.error("Error migrating newsletters to Firebase:", error);
    return false;
  }
}

/**
 * Add a new newsletter issue to Firebase
 */
export async function addNewsletterIssue(
  collectionId: string,
  issue: {
    id: string;
    title: string;
    description?: string;
    publishedAt: string;
    url?: string;
    coverImagePath?: string;
  }
) {
  try {
    const issueRef = ref(db, `newsletters/${collectionId}/issues/${issue.id}`);
    await set(issueRef, {
      id: issue.id,
      title: issue.title,
      description: issue.description || "",
      publishedAt: issue.publishedAt,
      url: issue.url || "",
      coverImagePath: issue.coverImagePath || "",
    });

    console.log(`Newsletter issue ${issue.id} added successfully!`);
    return true;
  } catch (error) {
    console.error("Error adding newsletter issue:", error);
    return false;
  }
}

/**
 * Add a new newsletter collection to Firebase
 */
export async function addNewsletterCollection(collection: {
  id: string;
  name: string;
  color: string;
}) {
  try {
    const collectionRef = ref(db, `newsletters/${collection.id}`);
    await set(collectionRef, {
      id: collection.id,
      name: collection.name,
      color: collection.color,
      issues: {},
    });

    console.log(`Newsletter collection ${collection.id} added successfully!`);
    return true;
  } catch (error) {
    console.error("Error adding newsletter collection:", error);
    return false;
  }
}
