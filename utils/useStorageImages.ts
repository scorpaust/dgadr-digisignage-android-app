import { useState, useEffect } from "react";
import { MediaItem } from "../types/media-item";
import { storageService } from "./storageService";

interface UseStorageImagesOptions {
  shuffle?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

export function useStorageImages(
  folderPath: string,
  options: UseStorageImagesOptions = {}
) {
  const {
    shuffle = false,
    autoRefresh = false,
    refreshInterval = 300000,
  } = options; // 5 min default

  const [images, setImages] = useState<MediaItem[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadImages = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const mediaItems = await storageService.loadImagesFromFolder(
        folderPath,
        shuffle
      );
      const urls = mediaItems.map((item) => item.uri);

      setImages(mediaItems);
      setImageUrls(urls);
    } catch (err) {
      console.error(`Error loading images from ${folderPath}:`, err);
      setError(`Failed to load images from ${folderPath}`);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const refreshImages = async () => {
    try {
      setError(null);
      const mediaItems = await storageService.refreshFolder(
        folderPath,
        shuffle
      );
      const urls = mediaItems.map((item) => item.uri);

      setImages(mediaItems);
      setImageUrls(urls);
    } catch (err) {
      console.error(`Error refreshing images from ${folderPath}:`, err);
      setError(`Failed to refresh images from ${folderPath}`);
    }
  };

  useEffect(() => {
    loadImages();
  }, [folderPath, shuffle]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(() => {
        loadImages(false); // Don't show loading on auto-refresh
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, folderPath, shuffle]);

  return {
    images,
    imageUrls,
    loading,
    error,
    refreshImages,
    reload: () => loadImages(),
  };
}

export function useMultipleFolderImages(
  folderPaths: string[],
  options: UseStorageImagesOptions = {}
) {
  const { shuffle = false } = options;

  const [images, setImages] = useState<MediaItem[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);

      const mediaItems = await storageService.loadImagesFromFolders(
        folderPaths,
        shuffle
      );
      const urls = mediaItems.map((item) => item.uri);

      setImages(mediaItems);
      setImageUrls(urls);
    } catch (err) {
      console.error("Error loading images from multiple folders:", err);
      setError("Failed to load images from folders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (folderPaths.length > 0) {
      loadImages();
    }
  }, [folderPaths.join(","), shuffle]);

  return {
    images,
    imageUrls,
    loading,
    error,
    reload: loadImages,
  };
}
