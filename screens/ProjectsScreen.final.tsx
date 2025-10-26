import React from "react";
import { View, StyleSheet } from "react-native";
import { useStorageImages } from "../utils/useStorageImages";
import ImageCarousel from "../components/ImageCarousel";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

const ProjectsScreen: React.FC = () => {
  const { imageUrls, loading, error, reload } = useStorageImages("projetos", {
    shuffle: false,
    autoRefresh: true,
    refreshInterval: 300000, // 5 minutes
  });

  if (loading) {
    return <LoadingState message="A carregar projetos..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar projetos"
        message={error}
        onRetry={reload}
      />
    );
  }

  if (imageUrls.length === 0) {
    return (
      <EmptyState
        title="Nenhum projeto encontrado"
        message="Não foram encontrados projetos para exibir"
        helpText="Adicione imagens à pasta 'projetos' no Firebase Storage"
      />
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
});

export default ProjectsScreen;
