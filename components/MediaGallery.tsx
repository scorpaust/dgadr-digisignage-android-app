import React, { useCallback, useEffect, useRef, useState, memo } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import Carousel from "react-native-snap-carousel";
import { MediaItem } from "../types/media-item";

const resMode = ResizeMode.CONTAIN;

type MediaGalleryProps = {
  mediaItems: MediaItem[];
};

const windowWidth = Dimensions.get("window").width;

const scaleFactor = windowWidth / 320;

var isVideo = false;

const RenderItem: React.FC<{ item: MediaItem }> = ({ item }) => {
  const videoRef = useRef<Video>(null);

  const scale = useRef(new Animated.Value(1)).current; // Initial scale is 1

  const onImagePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.3, // Zoom in to 130% of the size
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  };

  const onImagePressOut = () => {
    Animated.spring(scale, {
      toValue: 1, // Return to original size
      useNativeDriver: true,
    }).start();
  };

  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const handlePlayVideo = useCallback((id: string) => {
    setPlayingVideoId(id);
  }, []);

  const [isMediaLoaded, setMediaLoaded] = useState(false);

  const onLoadMedia = () => setMediaLoaded(true);

  const onErrorMedia = () => setMediaLoaded(false);

  const onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    if (!playbackStatus.isLoaded) {
      // Video is still loading
    } else {
      // Video is loaded
      if (!playbackStatus.isPlaying) {
        videoRef.current?.playAsync();
      }
    }
  };

  useEffect(() => {
    if (item.type === "video") {
      isVideo = true;
    } else {
      isVideo = false;
    }

    if (
      item.type === "video" &&
      playingVideoId !== item.id &&
      videoRef.current
    ) {
      videoRef.current.pauseAsync();
    }
  }, [playingVideoId, item]);

  return (
    <View style={styles.mediaContainer}>
      {!isMediaLoaded && (
        <View style={styles.placeholderContainer}>
          <ActivityIndicator size="large" color="#000000" />
          {/* Or use a custom placeholder component */}
        </View>
      )}
      {item.type === "photo" ? (
        <TouchableWithoutFeedback
          onPressIn={onImagePressIn}
          onPressOut={onImagePressOut}
        >
          <Animated.Image
            source={item.uri}
            style={[
              styles.media,
              { transform: [{ scale }] },
              isMediaLoaded ? {} : styles.hidden,
            ]}
            onLoad={onLoadMedia}
            onError={onErrorMedia}
          />
        </TouchableWithoutFeedback>
      ) : (
        <Video
          ref={videoRef}
          isMuted={true}
          source={item.uri as any}
          rate={1.0}
          volume={0}
          resizeMode={resMode}
          shouldPlay={playingVideoId === item.id}
          isLooping
          style={[styles.media, isMediaLoaded ? {} : styles.hidden]}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          onLoad={onLoadMedia}
          onError={onErrorMedia}
        />
      )}
    </View>
  );
};

const MediaGallery: React.FC<MediaGalleryProps> = ({ mediaItems }) => {
  // const [paused, setIsPaused] = useState(false);
  // const [autoplay, setAutoPlay] = useState(true);

  const windowWidth = Dimensions.get("window").width;
  const scaleFactor = windowWidth / 320;

  /*useEffect(() => {
    setAutoPlay(!paused);
  }, [paused]);*/

  return (
    <>
      {/*{autoplay && (*/}
      <Carousel
        data={mediaItems}
        renderItem={({ item }) => <RenderItem item={item} />}
        //sliderWidth={Dimensions.get('window').width}
        sliderHeight={Dimensions.get("window").height}
        itemHeight={300 * scaleFactor}
        autoplay={true} // Enable automatic play
        loop={!isVideo} // Loop through the items indefinitely
        autoplayInterval={10000}
        vertical
      />
      {/*})}*/}
      {/*{!autoplay && (
        <Carousel
          data={mediaItems}
          renderItem={({ item }) => <RenderItem item={item} />}
          //sliderWidth={Dimensions.get('window').width}
          sliderHeight={Dimensions.get("window").height}
          itemHeight={300 * scaleFactor}
          autoplay={false} // Enable automatic play
          loop={!isVideo} // Loop through the items indefinitely
          vertical
        />
      )}*/}
      {/*<BaseButton paused={paused} onPress={() => { setIsPaused(!paused); setAutoPlay(paused)}} />*/}
    </>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    height: "95%",
    marginHorizontal: 5 * (Dimensions.get("window").width / 320),
  },
  media: {
    width: "90%",
    height: "90%",
    marginHorizontal: 5 * (Dimensions.get("window").width / 320),
  },
  hidden: {
    display: "none",
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0", // Placeholder background color
  },
});

export default MediaGallery;
