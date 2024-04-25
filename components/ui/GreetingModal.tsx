import React from "react";
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
}

const windowWidth = Dimensions.get("window").width;
const scaleFactor = windowWidth / 320;

const GreetingModal: React.FC<GreetingModalProps> = ({
  modalVisible,
  setModalVisible,
  title,
  message,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20%",
  },
  modalView: {
    margin: "5%",
    backgroundColor: "white",
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
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 6 * scaleFactor,
  },
  modalText: {
    marginBottom: "5%",
    textAlign: "center",
    fontSize: 6 * scaleFactor,
  },
  modalTitle: {
    marginBottom: "5%",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 8 * scaleFactor,
  },
});

export default GreetingModal;
