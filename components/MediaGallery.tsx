import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
} from "react-native";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import Carousel from "react-native-snap-carousel";
import { MediaItem } from "../types/media-item";

const resMode = ResizeMode.CONTAIN;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const scaleFactor = windowWidth / 320;

const RenderItem: React.FC<{ item: MediaItem }> = ({ item }) => {
  const videoRef = useRef<Video>(null);
  const scale = useRef(new Animated.Value(1)).current;

  const onImagePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.3,
      useNativeDriver: true,
    }).start();
  };

  const onImagePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const [isMediaLoaded, setMediaLoaded] = useState(false);

  const onLoadMedia = () => setMediaLoaded(true);
  const onErrorMedia = () => setMediaLoaded(false);

  useEffect(() => {
    if (item.type === "video" && videoRef.current) {
      videoRef.current.pauseAsync();
    }
  }, [item]);

  return (
    <View style={styles.mediaContainer}>
      {!isMediaLoaded && (
        <View style={styles.placeholderContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
      {item.type === "photo" ? (
        <TouchableWithoutFeedback
          onPressIn={onImagePressIn}
          onPressOut={onImagePressOut}
        >
          <Animated.Image
            source={{ uri: item.uri }}
            style={[
              styles.media,
              { transform: [{ scale }] },
              isMediaLoaded ? {} : styles.hidden,
            ]}
            resizeMode="contain"
            onLoad={onLoadMedia}
            onError={onErrorMedia}
          />
        </TouchableWithoutFeedback>
      ) : (
        <Video
          ref={videoRef}
          source={item.uri as any}
          resizeMode={resMode}
          style={[styles.media, isMediaLoaded ? {} : styles.hidden]}
          shouldPlay={false}
          isLooping
          onLoad={onLoadMedia}
          onError={onErrorMedia}
        />
      )}
    </View>
  );
};

const MediaGallery: React.FC<{ mediaItems: MediaItem[] }> = ({
  mediaItems,
}) => {
  return (
    <Carousel
      data={mediaItems}
      renderItem={({ item, index }: any) => (
        <RenderItem item={item as MediaItem} />
      )}
      sliderWidth={windowWidth}
      itemWidth={windowWidth * 0.9}
      vertical={false}
      autoplay={true}
      autoplayInterval={10000}
      loop={true}
    />
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: windowHeight * 0.7,
  },
  media: {
    width: "90%",
    height: "90%",
    marginHorizontal: 5 * scaleFactor,
  },
  hidden: {
    display: "none",
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
});

export default MediaGallery;
