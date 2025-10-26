import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { scale, FontSizes, Spacing } from "../utils/scaling";

interface LoadingStateProps {
  message?: string;
  color?: string;
  size?: "small" | "large";
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "A carregar...",
  color = "#3F51B5",
  size = "large",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.large,
  },
  text: {
    marginTop: Spacing.large,
    fontSize: FontSizes.large,
    color: "#52606d",
    textAlign: "center",
  },
});

export default LoadingState;
