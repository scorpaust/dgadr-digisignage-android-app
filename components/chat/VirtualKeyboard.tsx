import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const sf = windowWidth / 320; // mesma escala do resto da app
const keyW = Math.floor((windowWidth - 20 * sf) / 10) - 4 * sf;

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
  const [isUpperCase, setIsUpperCase] = useState(false);

  if (!visible) return null;

  const toCase = (k: string) => (isUpperCase ? k.toUpperCase() : k);

  const accentLower = ["á", "à", "â", "ã", "é", "ê", "í", "ó", "ô", "õ", "ú", "ü"];
  const accentUpper = ["Á", "À", "Â", "Ã", "É", "Ê", "Í", "Ó", "Ô", "Õ", "Ú", "Ü"];
  const accents = isUpperCase ? accentUpper : accentLower;

  const row1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const row2 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
  const row3 = ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ç"];
  const row4 = ["z", "x", "c", "v", "b", "n", "m"];
  const punctuation = [".", ",", "?", "!", ";", ":", "-", "(", ")", '"'];

  const renderKey = (key: string, extraStyle?: object, extraTextStyle?: object) => (
    <TouchableOpacity
      key={key}
      style={[styles.key, extraStyle]}
      onPress={() => onKeyPress(key)}
    >
      <Text style={[styles.keyText, extraTextStyle]}>{key}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Barra superior */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Teclado PT</Text>
        <TouchableOpacity onPress={onHide} style={styles.closeButton}>
          <Ionicons name="close" size={22 * sf} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Acentos — sempre visíveis, scroll horizontal */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.accentScroll}
        contentContainerStyle={styles.accentContent}
      >
        {accents.map((char) => renderKey(char, styles.accentKey, styles.accentKeyText))}
      </ScrollView>

      <View style={styles.keyboard}>
        {/* Números */}
        <View style={styles.row}>
          {row1.map((k) => renderKey(k))}
        </View>

        {/* QWERTY */}
        <View style={styles.row}>
          {row2.map((k) => renderKey(toCase(k)))}
        </View>

        {/* ASDF */}
        <View style={styles.row}>
          {row3.map((k) => renderKey(toCase(k)))}
        </View>

        {/* Shift + ZXCVBNM + Backspace */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.shiftKey, isUpperCase && styles.shiftKeyActive]}
            onPress={() => setIsUpperCase(!isUpperCase)}
          >
            <Ionicons name="arrow-up" size={18 * sf} color={isUpperCase ? "#fff" : "#555"} />
          </TouchableOpacity>
          {row4.map((k) => renderKey(toCase(k)))}
          <TouchableOpacity style={styles.backspaceKey} onPress={onBackspace}>
            <Ionicons name="backspace-outline" size={18 * sf} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Pontuação + Espaço */}
        <View style={styles.row}>
          {punctuation.map((char) => renderKey(char, styles.punctKey))}
          <TouchableOpacity style={styles.spaceKey} onPress={onSpace}>
            <Text style={styles.spaceText}>espaço</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    borderTopWidth: 1 * sf,
    borderTopColor: "#ccc",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12 * sf,
    paddingVertical: 6 * sf,
    backgroundColor: "#e8e8e8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 13 * sf,
    fontWeight: "600",
    color: "#555",
  },
  closeButton: {
    padding: 4 * sf,
  },
  accentScroll: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  accentContent: {
    flexDirection: "row",
    paddingHorizontal: 8 * sf,
    paddingVertical: 6 * sf,
    alignItems: "center",
  },
  accentKey: {
    backgroundColor: "#7eda3b",
    borderRadius: 6 * sf,
    paddingVertical: 8 * sf,
    paddingHorizontal: 12 * sf,
    marginHorizontal: 3 * sf,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 38 * sf,
  },
  accentKeyText: {
    fontSize: 16 * sf,
    color: "#fff",
    fontWeight: "600",
  },
  keyboard: {
    paddingHorizontal: 8 * sf,
    paddingVertical: 6 * sf,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 4 * sf,
  },
  key: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5 * sf,
    paddingVertical: 10 * sf,
    width: keyW,
    marginHorizontal: 2 * sf,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
  },
  keyText: {
    fontSize: 15 * sf,
    color: "#333",
    fontWeight: "500",
  },
  shiftKey: {
    backgroundColor: "#e0e0e0",
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 5 * sf,
    paddingVertical: 10 * sf,
    paddingHorizontal: 12 * sf,
    marginHorizontal: 2 * sf,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 42 * sf,
    elevation: 1,
  },
  shiftKeyActive: {
    backgroundColor: "#555",
    borderColor: "#555",
  },
  backspaceKey: {
    backgroundColor: "#e05555",
    borderRadius: 5 * sf,
    paddingVertical: 10 * sf,
    paddingHorizontal: 12 * sf,
    marginHorizontal: 2 * sf,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 42 * sf,
    elevation: 1,
  },
  punctKey: {
    width: keyW - 2 * sf,
    marginHorizontal: 2 * sf,
  },
  spaceKey: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5 * sf,
    paddingVertical: 10 * sf,
    paddingHorizontal: 12 * sf,
    marginHorizontal: 2 * sf,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
  },
  spaceText: {
    fontSize: 14 * sf,
    color: "#555",
    fontWeight: "500",
  },
});

export default VirtualKeyboard;
