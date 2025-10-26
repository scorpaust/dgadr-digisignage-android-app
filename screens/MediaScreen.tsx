import React from "react";
import {
  View,
  Alert,
  ActivityIndicator,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import MediaGallery from "../components/MediaGallery";
import { useStorageImages } from "../utils/useStorageImages";
import InfoModal from "../components/InfoModal";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";

const { width: windowWidth } = Dimensions.get("window");
const scaleFactor = Math.min(windowWidth / 320, 2.5);

const MediaScreen = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const { images, loading, error } = useStorageImages("photos", {
    shuffle: true, // Shuffle gallery photos
    autoRefresh: true,
    refreshInterval: 300000, // 5 minutes
  });

  type RootStackParamList = {
    MenuScreen: { id: number } | undefined;
  };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleCloseModal = () => {
    // Error handling is now managed by the hook
  };

  useEffect(() => {
    const checkNetworkConnectivity = async () => {
      try {
        const state = await NetInfo.fetch();
        setIsConnected(state.isConnected);
      } catch (error) {
        console.error("Erro na conexão à Internet:", error);
        setIsConnected(false);
      }
    };

    checkNetworkConnectivity();
  }, []);

  useEffect(() => {
    if (!isConnected) {
      Alert.alert(
        "Sem conexão à Internet",
        "Por favor, verifique a ligação à rede e tente de novo.",
        [{ text: "OK", onPress: () => navigation.navigate("MenuScreen") }]
      );
    }
  }, [isConnected, navigation]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3F51B5" />
        <Text style={styles.loadingText}>A carregar galeria de fotos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <>
        <InfoModal
          info={{ message: error } as any}
          onClose={handleCloseModal}
        />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Erro ao carregar galeria</Text>
        </View>
      </>
    );
  }

  if (images.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Nenhuma foto encontrada</Text>
      </View>
    );
  }

  return (
    <View style={{ marginVertical: "10%" }}>
      <MediaGallery mediaItems={images} />
    </View>
  );
};

export default MediaScreen;
const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20 * scaleFactor,
  },
  loadingText: {
    marginTop: 16 * scaleFactor,
    fontSize: Math.max(16 * scaleFactor, 18),
    color: "#52606d",
    textAlign: "center",
  },
  errorText: {
    fontSize: Math.max(18 * scaleFactor, 20),
    fontWeight: "600",
    color: "#e53e3e",
    textAlign: "center",
  },
  emptyText: {
    fontSize: Math.max(16 * scaleFactor, 18),
    color: "#52606d",
    textAlign: "center",
  },
});
