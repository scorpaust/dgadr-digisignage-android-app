export type MediaItem = {
  id: string;
  uri: string;
  type: "photo" | "video" | string;
  name?: string;
  fullPath?: string;
};
