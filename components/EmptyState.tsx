import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

interface EmptyStateProps {
  title?: string;
  message: string;
  helpText?: string;
}

const { width: windowWidth } = Dimensions.get("window");
const scaleFactor = Math.min(windowWidth / 320, 2.5);

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Nenhum conteúdo encontrado",
  message,
  helpText,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {helpText && <Text style={styles.helpText}>{helpText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20 * scaleFactor,
  },
  title: {
    fontSize: Math.max(16 * scaleFactor, 18),
    color: "#52606d",
    textAlign: "center",
    marginBottom: 8 * scaleFactor,
  },
  message: {
    fontSize: Math.max(14 * scaleFactor, 16),
    color: "#718096",
    textAlign: "center",
    marginBottom: 8 * scaleFactor,
  },
  helpText: {
    fontSize: Math.max(12 * scaleFactor, 14),
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default EmptyState;
