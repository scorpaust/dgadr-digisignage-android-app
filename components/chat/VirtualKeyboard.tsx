import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onHide: () => void;
  visible: boolean;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onSpace,
  onHide,
  visible,
}) => {
  if (!visible) return null;

  // Layout do teclado português
  const keyboardRows = [
    // Números e símbolos
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    // Primeira linha de letras
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    // Segunda linha de letras
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ç"],
    // Terceira linha de letras
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  // Caracteres especiais portugueses
  const specialChars = [
    "á",
    "à",
    "â",
    "ã",
    "é",
    "ê",
    "í",
    "ó",
    "ô",
    "õ",
    "ú",
    "ü",
  ];

  // Pontuação comum
  const punctuation = [".", ",", "?", "!", ";", ":", "-", "(", ")", '"', "'"];

  const renderKey = (key: string, isSpecial = false) => (
    <TouchableOpacity
      key={key}
      style={[styles.key, isSpecial && styles.specialKey]}
      onPress={() => onKeyPress(key)}
    >
      <Text style={[styles.keyText, isSpecial && styles.specialKeyText]}>
        {key}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Barra superior com botão fechar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Teclado Português</Text>
        <TouchableOpacity onPress={onHide} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Teclado principal */}
        <View style={styles.keyboard}>
          {keyboardRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((key) => renderKey(key))}
            </View>
          ))}

          {/* Linha com espaço e backspace */}
          <View style={styles.row}>
            <TouchableOpacity style={styles.backspaceKey} onPress={onBackspace}>
              <Ionicons name="backspace" size={20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.spaceKey} onPress={onSpace}>
              <Text style={styles.keyText}>espaço</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Caracteres especiais portugueses */}
        <View style={styles.specialSection}>
          <Text style={styles.sectionTitle}>Acentos Portugueses</Text>
          <View style={styles.specialRow}>
            {specialChars.map((char) => renderKey(char, true))}
          </View>
        </View>

        {/* Pontuação */}
        <View style={styles.specialSection}>
          <Text style={styles.sectionTitle}>Pontuação</Text>
          <View style={styles.specialRow}>
            {punctuation.map((char) => renderKey(char, true))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    maxHeight: 300,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  keyboard: {
    padding: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 6,
  },
  key: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 2,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  specialSection: {
    padding: 12,
    backgroundColor: "#fff",
    marginTop: 8,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  specialRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  specialKey: {
    backgroundColor: "#7eda3b",
    borderColor: "#7eda3b",
    marginHorizontal: 3,
    marginVertical: 2,
  },
  specialKeyText: {
    color: "#fff",
    fontWeight: "600",
  },
  backspaceKey: {
    backgroundColor: "#ff6b6b",
    borderWidth: 1,
    borderColor: "#ff6b6b",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  spaceKey: {
    backgroundColor: "#4ecdc4",
    borderWidth: 1,
    borderColor: "#4ecdc4",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

export default VirtualKeyboard;
