import React from "react";
import { Dimensions } from "react-native";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  View,
  Text,
} from "react-native";

interface Props {
  imgUrl: any; // Pode ser ajustado para ser mais específico, se necessário
  onClose: () => void;
}

const windowWidth = Dimensions.get("window").width;

const scaleFactor = windowWidth / 320;

const FullScreenImage: React.FC<Props> = ({ imgUrl, onClose }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.image} source={imgUrl} />
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semitransparente
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 40 * scaleFactor,
    right: 20 * scaleFactor,
    backgroundColor: "white",
    padding: 10 * scaleFactor,
    borderRadius: 20 * scaleFactor,
    // Garanta que o botão esteja visualmente destacado sobre a imagem
    zIndex: 1, // Certifique-se de que o botão esteja acima da imagem
  },
  closeButtonText: {
    fontSize: 16 * scaleFactor,
    color: "#000", // Ajuste conforme necessário
  },
});

export default FullScreenImage;
