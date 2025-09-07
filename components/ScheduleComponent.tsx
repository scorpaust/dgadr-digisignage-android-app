import React from "react";
import { Text, StyleSheet, Dimensions, View } from "react-native";
import BaseCard from "./layout-base/BaseCard"; // Update the import path as per your project structure

const windowWidth = Dimensions.get("window").width;

const scaleFactor = windowWidth / 320;

const ScheduleComponent: React.FC = () => {
  return (
    <>
      <BaseCard>
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Horário</Text>
          <Text style={styles.content}>10h00 às 12h30</Text>
          <Text style={styles.content}>14h30 às 16h30</Text>
        </View>
      </BaseCard>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18 * scaleFactor,
    fontWeight: "bold",
    marginBottom: "5%",
  },
  contentWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    fontSize: 14 * scaleFactor,
    lineHeight: 20 * scaleFactor, // For better readability
  },
});

export default ScheduleComponent;
