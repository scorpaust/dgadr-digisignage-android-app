import React from "react";
import { View, StyleSheet } from "react-native";
import ImageCarousel from "../components/ImageCarousel";

const ProjectsScreen: React.FC = () => {
  const imageLinks = [
    require("../assets/projcof/Cartaz-A3-POCI-05-5762-FSE-000277.jpg"),
    require("../assets/projcof/Cartaz-A3-POCI-05-5762-FSE-000292.jpg"),
    require("../assets/projcof/Cartaz-PRR-AAC_01C13_i022021.jpg"),
    // ... more image URLs
  ];

  return (
    <View style={styles.container}>
      <ImageCarousel
        imageLinks={imageLinks}
        autoplay={true}
        autoplayInterval={10000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // You can change the background color
  },
});

export default ProjectsScreen;
