import React from "react";
import { useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
} from "react-native";

interface GreetingModalProps {
  modalVisible?: boolean;
  setModalVisible: (visible: boolean) => void;
  title: string;
  message: string;
  distribute: boolean;
}

const windowWidth = Dimensions.get("window").width;
const scaleFactor = windowWidth / 320;

const GreetingModal: React.FC<GreetingModalProps> = ({
  modalVisible,
  setModalVisible,
  title,
  message,
  distribute,
}) => {
  let position:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | undefined;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={[styles.centeredView, { justifyContent: position }]}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: "20%",
  },
  modalView: {
    margin: "5%",
    backgroundColor: "#E0F2F1",
    borderRadius: 20,
    padding: "5%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: "2%",
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "white",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 6 * scaleFactor,
  },
  modalText: {
    marginBottom: "5%",
    textAlign: "center",
    color: "#0D47A1",
    fontSize: 16 * scaleFactor,
  },
  modalTitle: {
    marginBottom: "5%",
    textAlign: "center",
    fontWeight: "bold",
    color: "#0D47A1",
    fontSize: 18 * scaleFactor,
  },
});

export default GreetingModal;
