import { FirebaseError } from "firebase/app";
import React, { SetStateAction } from "react";
import { Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

interface InfoModalProps {
  info?: SetStateAction<FirebaseError | undefined>;
  text?: String;
  onClose: () => void;
}

const windowWidth = Dimensions.get("window").width;

const scaleFactor = windowWidth / 320;

const InfoModal: React.FC<InfoModalProps> = ({ info, onClose }) => {
  return (
    <TouchableOpacity style={styles.modal} onPress={onClose} activeOpacity={1}>
      <Text style={styles.text}>{info?.toString()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    top: "20%",
    left: "5%",
    transform: [{ translateX: -50 }],
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.6)",
    zIndex: 100,
  },
  text: {
    fontSize: 22 * scaleFactor,
    textAlign: "justify",
  },
});

export default InfoModal;
