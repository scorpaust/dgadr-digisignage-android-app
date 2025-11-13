import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Alert,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AIService } from "../../services/AIService";
import { Message } from "../../types/chat";
import VirtualKeyboard from "./VirtualKeyboard";

const windowWidth = Dimensions.get("window").width;
const scaleFactor = windowWidth / 320;

interface ChatComponentProps {
  chatId: string;
  messages: Message[];
  onAddMessage: (chatId: string, message: Message) => void;
  onUpdateTitle: (chatId: string, title: string) => void;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  chatId,
  messages,
  onAddMessage,
  onUpdateTitle,
}) => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const textInputRef = useRef<TextInput>(null);
  const aiService = new AIService();

  useEffect(() => {
    // Scroll para a última mensagem quando há novas mensagens
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    // Configuração para suporte a acentos portugueses
    if (Platform.OS === "android") {
      // Força o uso do teclado padrão do sistema
      I18nManager.allowRTL(false);
    }
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    // Adiciona mensagem do usuário
    onAddMessage(chatId, userMessage);

    // Atualiza título do chat se for a primeira mensagem do usuário
    if (messages.length === 1) {
      const title =
        inputText.trim().length > 30
          ? inputText.trim().substring(0, 30) + "..."
          : inputText.trim();
      onUpdateTitle(chatId, title);
    }

    setInputText("");
    setIsLoading(true);

    try {
      // Processa a pergunta com IA
      const response = await aiService.processQuery(inputText.trim());

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        isUser: false,
        timestamp: new Date(),
        contacts: response.contacts,
      };

      onAddMessage(chatId, aiMessage);
    } catch (error) {
      console.error("Erro ao processar pergunta:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Peço desculpa, mas ocorreu um erro ao processar a sua pergunta. Por favor, tente novamente ou contacte-nos diretamente através dos nossos canais oficiais.",
        isUser: false,
        timestamp: new Date(),
      };

      onAddMessage(chatId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhonePress = (phone: string) => {
    Alert.alert("Contactar", `Deseja ligar para ${phone}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Ligar",
        onPress: () => Linking.openURL(`tel:${phone}`),
      },
    ]);
  };

  const handleEmailPress = (email: string) => {
    Alert.alert("Contactar", `Deseja enviar email para ${email}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Enviar Email",
        onPress: () => Linking.openURL(`mailto:${email}`),
      },
    ]);
  };

  // Funções do teclado virtual
  const handleVirtualKeyPress = (key: string) => {
    setInputText((prev) => {
      const newText = prev + key;
      return newText.normalize("NFC");
    });
  };

  const handleVirtualBackspace = () => {
    setInputText((prev) => prev.slice(0, -1));
  };

  const handleVirtualSpace = () => {
    setInputText((prev) => prev + " ");
  };

  const toggleVirtualKeyboard = () => {
    setShowVirtualKeyboard(!showVirtualKeyboard);
    if (!showVirtualKeyboard) {
      // Esconde o teclado do sistema quando mostra o virtual
      textInputRef.current?.blur();
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isUser ? styles.userText : styles.aiText,
          ]}
        >
          {item.text}
        </Text>

        {/* Contactos (apenas para mensagens da IA) */}
        {!item.isUser && item.contacts && item.contacts.length > 0 && (
          <View style={styles.contactsContainer}>
            <Text style={styles.contactsTitle}>Contactos relevantes:</Text>
            {item.contacts.map((contact, index) => (
              <View key={index} style={styles.contactItem}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactDepartment}>
                  {contact.department}
                </Text>
                {contact.phone && (
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => handlePhonePress(contact.phone!)}
                  >
                    <Ionicons
                      name="call"
                      size={14 * scaleFactor}
                      color="#7eda3b"
                    />
                    <Text style={styles.contactButtonText}>
                      {contact.phone}
                    </Text>
                  </TouchableOpacity>
                )}
                {contact.email && (
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => handleEmailPress(contact.email!)}
                  >
                    <Ionicons
                      name="mail"
                      size={14 * scaleFactor}
                      color="#7eda3b"
                    />
                    <Text style={styles.contactButtonText}>
                      {contact.email}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString("pt-PT", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
      />

      <View style={styles.inputContainer}>
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          value={inputText}
          onChangeText={(text) => {
            // Normaliza o texto para garantir compatibilidade com acentos portugueses
            const normalizedText = text.normalize("NFC");
            setInputText(normalizedText);
          }}
          onFocus={() => setShowVirtualKeyboard(false)}
          placeholder="Digite a sua pergunta..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          editable={!isLoading}
          autoCorrect={true}
          autoCapitalize="sentences"
          keyboardType="default"
          spellCheck={true}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
          blurOnSubmit={false}
          {...(Platform.OS === "android" && {
            underlineColorAndroid: "transparent",
            textAlignVertical: "top",
          })}
          {...(Platform.OS === "ios" && {
            clearButtonMode: "while-editing",
          })}
        />

        {/* Botão para teclado virtual */}
        <TouchableOpacity
          style={styles.keyboardButton}
          onPress={toggleVirtualKeyboard}
        >
          <Ionicons
            name={showVirtualKeyboard ? "keypad" : "keypad-outline"}
            size={20 * scaleFactor}
            color="#7eda3b"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          {isLoading ? (
            <Ionicons name="hourglass" size={20 * scaleFactor} color="#fff" />
          ) : (
            <Ionicons name="send" size={20 * scaleFactor} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Teclado Virtual */}
      <VirtualKeyboard
        visible={showVirtualKeyboard}
        onKeyPress={handleVirtualKeyPress}
        onBackspace={handleVirtualBackspace}
        onSpace={handleVirtualSpace}
        onHide={() => setShowVirtualKeyboard(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16 * scaleFactor,
  },
  messageContainer: {
    marginVertical: 4 * scaleFactor,
  },
  userMessage: {
    alignItems: "flex-end",
  },
  aiMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12 * scaleFactor,
    borderRadius: 16 * scaleFactor,
  },
  userBubble: {
    backgroundColor: "#7eda3b",
  },
  aiBubble: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  messageText: {
    fontSize: 16 * scaleFactor,
    lineHeight: 22 * scaleFactor,
  },
  userText: {
    color: "#fff",
  },
  aiText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 12 * scaleFactor,
    color: "#666",
    marginTop: 4 * scaleFactor,
    textAlign: "right",
  },
  contactsContainer: {
    marginTop: 12 * scaleFactor,
    paddingTop: 12 * scaleFactor,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  contactsTitle: {
    fontSize: 14 * scaleFactor,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8 * scaleFactor,
  },
  contactItem: {
    marginBottom: 8 * scaleFactor,
  },
  contactName: {
    fontSize: 14 * scaleFactor,
    fontWeight: "600",
    color: "#333",
  },
  contactDepartment: {
    fontSize: 12 * scaleFactor,
    color: "#666",
    marginBottom: 4 * scaleFactor,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2 * scaleFactor,
  },
  contactButtonText: {
    fontSize: 12 * scaleFactor,
    color: "#7eda3b",
    marginLeft: 4 * scaleFactor,
    textDecorationLine: "underline",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16 * scaleFactor,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20 * scaleFactor,
    paddingHorizontal: 16 * scaleFactor,
    paddingVertical: 12 * scaleFactor,
    fontSize: 16 * scaleFactor,
    maxHeight: 100 * scaleFactor,
    marginRight: 8 * scaleFactor,
  },
  sendButton: {
    backgroundColor: "#7eda3b",
    borderRadius: 20 * scaleFactor,
    padding: 12 * scaleFactor,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  keyboardButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20 * scaleFactor,
    padding: 12 * scaleFactor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8 * scaleFactor,
  },
});

export default ChatComponent;
