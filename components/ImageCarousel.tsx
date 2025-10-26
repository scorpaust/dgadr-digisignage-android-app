import React from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import Carousel from "react-native-snap-carousel";

const { width: screenWidth } = Dimensions.get("window");

const windowWidth = Dimensions.get("window").width;

const scaleFactor = windowWidth / 320;

interface ImageCarouselProps {
  imageLinks: string[]; // Now expects URLs from Firebase Storage
  autoplay?: boolean;
  autoplayInterval?: number | undefined;
}

interface CarouselItem {
  item: any;
  index: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  imageLinks,
  autoplay,
  autoplayInterval,
}) => {
  const renderItem = ({ item }: { item: string }, index: number) => {
    return (
      <View style={styles.item} key={index}>
        <Image
          source={{ uri: item }} // Now uses URI for Firebase Storage URLs
          style={styles.image}
        />
      </View>
    );
  };

  return (
    <Carousel
      data={imageLinks}
      renderItem={({ item, index }) => renderItem({ item }, index)}
      sliderWidth={screenWidth}
      itemWidth={screenWidth}
      vertical={false}
      loop={false}
      autoplay={autoplay}
      autoplayInterval={autoplayInterval}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "5%",
  },
  image: {
    width: "100%",
    height: 350 * scaleFactor,
    resizeMode: "contain",
  },
});

export default ImageCarousel;
