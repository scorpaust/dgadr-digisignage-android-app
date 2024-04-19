import React, { useEffect, useState } from "react";
import { View } from "react-native";
import MediaGallery from "../components/MediaGallery";
import { MediaItem } from "../types/media-item";

const images = [
  require("../assets/images/1.jpg"),
  require("../assets/images/2.jpg"),
  require("../assets/images/3.jpg"),
  require("../assets/images/4.jpg"),
  require("../assets/images/5.jpg"),
  require("../assets/images/6.jpg"),
  require("../assets/images/7.jpg"),
  require("../assets/images/8.jpg"),
  require("../assets/images/9.jpg"),
  require("../assets/images/10.jpg"),
  require("../assets/images/11.jpg"),
  require("../assets/images/12.jpg"),
  require("../assets/images/13.jpg"),
  require("../assets/images/14.jpg"),
  require("../assets/images/15.jpg"),
  require("../assets/images/16.jpg"),
  require("../assets/images/17.jpg"),
  require("../assets/images/18.jpg"),
  require("../assets/images/19.jpg"),
  require("../assets/images/20.jpg"),
  require("../assets/images/21.jpg"),
  require("../assets/images/22.jpg"),
  require("../assets/images/23.jpg"),
  require("../assets/images/24.jpg"),
  require("../assets/images/25.jpg"),
  require("../assets/images/26.jpg"),
  require("../assets/images/27.jpg"),
  require("../assets/images/28.jpg"),
  require("../assets/images/29.jpg"),
  require("../assets/images/30.jpg"),
];

const MediaScreen = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  function shuffleMediaArray(array: MediaItem[]) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  if (mediaItems.length <= 0) {
    const items: MediaItem[] = images.map((img, index) => ({
      id: `img${index + 1}`,
      uri: img,
      type: "photo",
    }));

    const shuffledItems = shuffleMediaArray(items);

    setMediaItems(shuffledItems);
  }

  return (
    <View style={{ marginVertical: "10%" }}>
      {mediaItems.length > 0 && <MediaGallery mediaItems={mediaItems} />}
    </View>
  );
};

export default MediaScreen;
