import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChatComponent from "../components/chat/ChatComponent";
import { ChatTab } from "../types/chat";

const windowWidth = Dimensions.get("window").width;
const scaleFactor = windowWidth / 320;

const InformationRequestScreen = () => {
  const [chatTabs, setChatTabs] = useState<ChatTab[]>([
    {
      id: "1",
      title: "Novo Chat",
      messages: [
        {
          id: "1",
          text: "Olá! Sou o assistente virtual da DGADR. Como posso ajudar hoje? Pode fazer perguntas sobre agricultura, desenvolvimento rural, apoios, legislação ou qualquer assunto da nossa competência.",
          isUser: false,
          timestamp: new Date(),
        },
      ],
    },
  ]);
  const [activeTabId, setActiveTabId] = useState("1");
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [tabToClose, setTabToClose] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const activeTab = chatTabs.find((tab) => tab.id === activeTabId);

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newTab: ChatTab = {
      id: newId,
      title: "Novo Chat",
      messages: [
        {
          id: "1",
          text: "Olá! Sou o assistente virtual da DGADR. Como posso ajudar hoje?",
          isUser: false,
          timestamp: new Date(),
        },
      ],
    };

    setChatTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);

    // Scroll para a nova aba
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const closeChat = (tabId: string) => {
    if (chatTabs.length === 1) {
      Alert.alert("Aviso", "Deve manter pelo menos um chat aberto.");
      return;
    }

    setTabToClose(tabId);
    setShowCloseModal(true);
  };

  const confirmCloseChat = () => {
    if (tabToClose) {
      setChatTabs((prev) => prev.filter((tab) => tab.id !== tabToClose));
      if (activeTabId === tabToClose) {
        const remainingTabs = chatTabs.filter((tab) => tab.id !== tabToClose);
        setActiveTabId(remainingTabs[0]?.id || "");
      }
    }
    setShowCloseModal(false);
    setTabToClose(null);
  };

  const cancelCloseChat = () => {
    setShowCloseModal(false);
    setTabToClose(null);
  };

  const updateChatTitle = (tabId: string, newTitle: string) => {
    setChatTabs((prev) =>
      prev.map((tab) => (tab.id === tabId ? { ...tab, title: newTitle } : tab))
    );
  };

  const addMessage = (tabId: string, message: any) => {
    setChatTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId
          ? { ...tab, messages: [...tab.messages, message] }
          : tab
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* Barra de Abas */}
      <View style={styles.tabBar}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScrollView}
        >
          {chatTabs.map((tab) => (
            <View key={tab.id} style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTabId === tab.id && styles.activeTab]}
                onPress={() => setActiveTabId(tab.id)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTabId === tab.id && styles.activeTabText,
                  ]}
                  numberOfLines={1}
                >
                  {tab.title}
                </Text>
              </TouchableOpacity>
              {chatTabs.length > 1 && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => closeChat(tab.id)}
                >
                  <Ionicons name="close" size={12 * scaleFactor} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.newChatButton} onPress={createNewChat}>
          <Ionicons name="add" size={20 * scaleFactor} color="#7eda3b" />
        </TouchableOpacity>
      </View>

      {/* Área do Chat */}
      {activeTab && (
        <ChatComponent
          chatId={activeTab.id}
          messages={activeTab.messages}
          onAddMessage={addMessage}
          onUpdateTitle={updateChatTitle}
        />
      )}

      {/* Modal de Confirmação para Fechar Chat */}
      <Modal
        visible={showCloseModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelCloseChat}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Fechar Chat</Text>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalMessage}>
                Tem certeza que deseja fechar este chat? Esta ação não pode ser
                desfeita.
              </Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelCloseChat}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmCloseChat}
              >
                <Text style={styles.confirmButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 8 * scaleFactor,
    paddingHorizontal: 8 * scaleFactor,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabScrollView: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8 * scaleFactor,
    position: "relative",
  },
  tab: {
    paddingHorizontal: 16 * scaleFactor,
    paddingVertical: 8 * scaleFactor,
    backgroundColor: "#f0f0f0",
    borderRadius: 20 * scaleFactor,
    maxWidth: 120 * scaleFactor,
  },
  activeTab: {
    backgroundColor: "#7eda3b",
  },
  tabText: {
    fontSize: 14 * scaleFactor,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
  },
  closeButton: {
    position: "absolute",
    right: -8 * scaleFactor,
    top: -4 * scaleFactor,
    backgroundColor: "#ff4444",
    borderRadius: 12 * scaleFactor,
    width: 20 * scaleFactor,
    height: 20 * scaleFactor,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  newChatButton: {
    padding: 8 * scaleFactor,
    marginLeft: 8 * scaleFactor,
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20 * scaleFactor,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16 * scaleFactor,
    width: Math.min(windowWidth * 0.85, 400 * scaleFactor),
    maxWidth: windowWidth * 0.9,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    paddingHorizontal: 24 * scaleFactor,
    paddingTop: 24 * scaleFactor,
    paddingBottom: 16 * scaleFactor,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20 * scaleFactor,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  modalBody: {
    paddingHorizontal: 24 * scaleFactor,
    paddingVertical: 20 * scaleFactor,
  },
  modalMessage: {
    fontSize: 16 * scaleFactor,
    color: "#666",
    textAlign: "center",
    lineHeight: 24 * scaleFactor,
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 24 * scaleFactor,
    paddingBottom: 24 * scaleFactor,
    paddingTop: 16 * scaleFactor,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12 * scaleFactor,
    paddingHorizontal: 16 * scaleFactor,
    borderRadius: 8 * scaleFactor,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    marginRight: 8 * scaleFactor,
  },
  confirmButton: {
    backgroundColor: "#ff4444",
    marginLeft: 8 * scaleFactor,
  },
  cancelButtonText: {
    fontSize: 16 * scaleFactor,
    fontWeight: "500",
    color: "#666",
  },
  confirmButtonText: {
    fontSize: 16 * scaleFactor,
    fontWeight: "500",
    color: "#fff",
  },
});

export default InformationRequestScreen;
