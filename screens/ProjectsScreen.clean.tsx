import React from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { useStorageImages } from "../utils/useStorageImages";
import ImageCarousel from "../components/ImageCarousel";

const ProjectsScreen: React.FC = () => {
  const { imageUrls, loading, error } = useStorageImages("projetos", {
    shuffle: false, // Keep original order for projects
    autoRefresh: true, // Auto-refresh every 5 minutes
    refreshInterval: 300000,
  });

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
        <Text style={styles.helpText}>
          Adicione imagens à pasta 'projetos' no Firebase Storage
        </Text>
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
    marginTop: 16,
    fontSize: 16,
    color: "#52606d",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e53e3e",
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#52606d",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#52606d",
    textAlign: "center",
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
    paddingHorizontal: 20,
  },
});

export default ProjectsScreen;
