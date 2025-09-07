import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
  ScrollView,
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
  const [fontSize, setFontSize] = useState(16 * scaleFactor);

  useEffect(() => {
    if (message.length > 200) {
      setFontSize(12 * scaleFactor);
    } else {
      setFontSize(16 * scaleFactor);
    }
  }, [message]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={[styles.centeredView]}>
        <View style={styles.modalView}>
          <Text style={[styles.modalTitle, { fontSize: fontSize * 1.2 }]}>
            {title}
          </Text>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={[styles.modalText, { fontSize }]}>{message}</Text>
          </ScrollView>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(false)}
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
    width: "90%",
    maxHeight: "80%",
  },
  button: {
    borderRadius: 20,
    padding: "2%",
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "white",
    marginTop: 10,
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 6 * scaleFactor,
  },
  modalText: {
    textAlign: "center",
    color: "#0D47A1",
  },
  modalTitle: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#0D47A1",
  },
  scrollViewContent: {
    paddingVertical: 10,
  },
});

export default GreetingModal;
