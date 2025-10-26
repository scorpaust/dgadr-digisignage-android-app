import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { firebase } from "../config";
import { MediaItem } from "../types/media-item";

export class StorageService {
  private static instance: StorageService;
  private storage = getStorage(
    firebase,
    "gs://dgadr-digisignage-app.appspot.com"
  );
  private cache: Map<string, MediaItem[]> = new Map();

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Load all images from a Firebase Storage folder
   */
  async loadImagesFromFolder(
    folderPath: string,
    shuffle: boolean = false
  ): Promise<MediaItem[]> {
    try {
      // Check cache first
      const cacheKey = `${folderPath}_${shuffle}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey)!;
      }

      const listRef = ref(this.storage, folderPath);
      const res = await listAll(listRef);

      const urlPromises = res.items.map(async (itemRef, index) => {
        const url = await getDownloadURL(ref(this.storage, itemRef.fullPath));
        return {
          id: `${folderPath}_${index}`,
          uri: url,
          type: "photo" as const,
          name: itemRef.name,
          fullPath: itemRef.fullPath,
        };
      });

      let mediaItems = await Promise.all(urlPromises);

      // Sort by name to ensure consistent order
      mediaItems.sort((a, b) => a.name.localeCompare(b.name));

      if (shuffle) {
        mediaItems = this.shuffleArray(mediaItems);
      }

      // Cache the result
      this.cache.set(cacheKey, mediaItems);

      return mediaItems;
    } catch (error) {
      console.error(`Error loading images from folder ${folderPath}:`, error);
      throw error;
    }
  }

  /**
   * Load images from multiple folders
   */
  async loadImagesFromFolders(
    folderPaths: string[],
    shuffle: boolean = false
  ): Promise<MediaItem[]> {
    try {
      const allPromises = folderPaths.map((folder) =>
        this.loadImagesFromFolder(folder, false)
      );
      const allResults = await Promise.all(allPromises);

      let allImages = allResults.flat();

      if (shuffle) {
        allImages = this.shuffleArray(allImages);
      }

      return allImages;
    } catch (error) {
      console.error("Error loading images from multiple folders:", error);
      throw error;
    }
  }

  /**
   * Get image URLs only (for components that expect string arrays)
   */
  async getImageUrls(
    folderPath: string,
    shuffle: boolean = false
  ): Promise<string[]> {
    const mediaItems = await this.loadImagesFromFolder(folderPath, shuffle);
    return mediaItems.map((item) => item.uri);
  }

  /**
   * Clear cache for a specific folder or all cache
   */
  clearCache(folderPath?: string): void {
    if (folderPath) {
      const keysToDelete = Array.from(this.cache.keys()).filter((key) =>
        key.startsWith(folderPath)
      );
      keysToDelete.forEach((key) => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }

  /**
   * Refresh cache for a folder
   */
  async refreshFolder(
    folderPath: string,
    shuffle: boolean = false
  ): Promise<MediaItem[]> {
    this.clearCache(folderPath);
    return this.loadImagesFromFolder(folderPath, shuffle);
  }

  /**
   * Shuffle array utility
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    let currentIndex = shuffled.length;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [shuffled[currentIndex], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[currentIndex],
      ];
    }

    return shuffled;
  }
}

export const storageService = StorageService.getInstance();
