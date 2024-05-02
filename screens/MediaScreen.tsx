import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { View, Alert } from "react-native"; // Import Alert for displaying error messages
import NetInfo from "@react-native-community/netinfo"; // Import NetInfo for checking network connectivity
import MediaGallery from "../components/MediaGallery";
import { MediaItem } from "../types/media-item";
import { firebase } from "../config";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import InfoModal from "../components/InfoModal";
import { FirebaseError } from "firebase/app";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const MediaScreen = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [error, setError] =
    useState<SetStateAction<FirebaseError | undefined>>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [isConnected, setIsConnected] =
    useState<SetStateAction<boolean | null>>(true); // State to track network connectivity

  type RootStackParamList = {
    MenuScreen: { id: number } | undefined;
  };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleCloseModal = () => {
    setError(undefined);
    setModalVisible(false);
  };

  const checkNetworkConnectivity = useCallback(async () => {
    try {
      const state = await NetInfo.fetch(); // Check network connectivity
      setIsConnected(state.isConnected);
    } catch (error) {
      console.error("Erro na conexão à Internet:", error);
    }
  }, []);

  const getMediaData = useCallback(async () => {
    try {
      const storage = getStorage(
        firebase,
        "gs://dgadr-digisignage-app.appspot.com"
      );
      const listRef = ref(storage, "photos");

      const res = await listAll(listRef);
      const urlPromises = res.items.map(async (itemRef, index) => {
        const url = await getDownloadURL(ref(storage, itemRef.fullPath));
        return {
          id: index.toString(),
          uri: url,
          type: "photo",
        };
      });

      const medias = await Promise.all(urlPromises);

      setMediaItems(shuffleMediaArray(medias));
    } catch (error) {
      setError(error as FirebaseError);
      setModalVisible(true);
    }
  }, []);

  useEffect(() => {
    checkNetworkConnectivity(); // Check network connectivity when component mounts
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      if (mediaItems.length === 0) {
        getMediaData();
      }
    } else {
      // Display error message if not connected to the internet
      Alert.alert(
        "Sem conexão à Internet",
        "Por favor, verifique a ligação à rede e tente de novo.",
        undefined,
        {
          onDismiss: () => navigation.navigate("MenuScreen"),
        }
      );
    }
  }, [isConnected, mediaItems]);

  function shuffleMediaArray(array: MediaItem[]) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  return (
    <>
      {error && <InfoModal info={error} onClose={handleCloseModal} />}
      <View style={{ marginVertical: "10%" }}>
        {mediaItems.length > 0 && <MediaGallery mediaItems={mediaItems} />}
      </View>
    </>
  );
};

export default MediaScreen;
