import React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Alert,
  Dimensions,
} from "react-native";
import { useStorageImages } from "../utils/useStorageImages";
import ImageCarousel from "../components/ImageCarousel";

const { width: windowWidth } = Dimensions.get("window");
const scaleFactor = Math.min(windowWidth / 320, 2.5);

const ProjectsScreen: React.FC = () => {
  const { imageUrls, loading, error, images } = useStorageImages("projetos", {
    shuffle: false, // Keep original order for projects
    autoRefresh: false,
    refreshInterval: 300000,
  });

  React.useEffect(() => {
    // Effect para monitorizar mudanças
  }, [loading, error, imageUrls, images]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3F51B5" />
        <Text style={styles.loadingText}>A carregar projetos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Erro ao carregar projetos</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

  if (imageUrls.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>Nenhum projeto encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageCarousel
        imageLinks={imageUrls}
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
    backgroundColor: "#fff",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16 * scaleFactor,
    fontSize: Math.max(16 * scaleFactor, 18),
    color: "#52606d",
  },
  errorText: {
    fontSize: Math.max(18 * scaleFactor, 20),
    fontWeight: "600",
    color: "#e53e3e",
    textAlign: "center",
    marginBottom: 8 * scaleFactor,
  },
  errorSubtext: {
    fontSize: Math.max(14 * scaleFactor, 16),
    color: "#52606d",
    textAlign: "center",
  },
  emptyText: {
    fontSize: Math.max(16 * scaleFactor, 18),
    color: "#52606d",
    textAlign: "center",
  },
  debugText: {
    fontSize: Math.max(12 * scaleFactor, 14),
    color: "#999",
    textAlign: "center",
    marginTop: 8 * scaleFactor,
    paddingHorizontal: 20 * scaleFactor,
  },
});

export default ProjectsScreen;
