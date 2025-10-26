import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

const { width: windowWidth } = Dimensions.get("window");
const scaleFactor = Math.min(windowWidth / 320, 2.5);

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Erro",
  message,
  onRetry,
  retryText = "Tentar novamente",
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>{retryText}</Text>
        </TouchableOpacity>
      )}
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
    fontSize: Math.max(18 * scaleFactor, 20),
    fontWeight: "600",
    color: "#e53e3e",
    textAlign: "center",
    marginBottom: 8 * scaleFactor,
  },
  message: {
    fontSize: Math.max(14 * scaleFactor, 16),
    color: "#52606d",
    textAlign: "center",
    marginBottom: 20 * scaleFactor,
  },
  retryButton: {
    backgroundColor: "#3F51B5",
    paddingHorizontal: 20 * scaleFactor,
    paddingVertical: 10 * scaleFactor,
    borderRadius: 8 * scaleFactor,
  },
  retryText: {
    color: "white",
    fontSize: Math.max(14 * scaleFactor, 16),
    fontWeight: "600",
  },
});

export default ErrorState;
