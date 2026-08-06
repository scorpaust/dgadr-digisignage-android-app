import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [isUpperCase, setIsUpperCase] = useState(false);

  // Escala pela largura, como no resto da app, MAS nunca deixando o teclado
  // (barra + acentos + 5 linhas de teclas) ultrapassar uma fração segura da
  // altura real do ecrã. Em ecrãs muito largos e pouco altos (ex.: digital
  // signage), a escala só pela largura fazia o teclado ficar mais alto do
  // que o ecrã, cortando as últimas linhas.
  const sfWidth = windowWidth / 320;
  const NATURAL_HEIGHT_AT_SF1 = 340; // altura estimada do teclado completo a sf=1
  const MAX_HEIGHT_RATIO = 0.42; // nunca ocupar mais de ~42% da altura do ecrã
  const sfHeight = (windowHeight * MAX_HEIGHT_RATIO) / NATURAL_HEIGHT_AT_SF1;
  const sf = Math.min(sfWidth, sfHeight);
  const styles = useMemo(
    () => createStyles(sf, windowHeight * (MAX_HEIGHT_RATIO + 0.05)),
    [sf, windowHeight],
  );

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

// Estilos gerados a partir da largura real do teclado, para que cada linha
// preencha exatamente essa largura (via flex) e nunca fique cortada ou
// desalinhada, seja qual for o tamanho do ecrã.
const createStyles = (sf: number, maxContainerHeight: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: "#f0f0f0",
      borderTopWidth: 1,
      borderTopColor: "#ccc",
      maxHeight: maxContainerHeight,
      overflow: "hidden",
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
      marginBottom: 4 * sf,
    },
    key: {
      flex: 1,
      minWidth: 0,
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5 * sf,
      paddingVertical: 10 * sf,
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
      flex: 1.4,
      minWidth: 0,
      backgroundColor: "#e0e0e0",
      borderWidth: 1,
      borderColor: "#bbb",
      borderRadius: 5 * sf,
      paddingVertical: 10 * sf,
      marginHorizontal: 2 * sf,
      alignItems: "center",
      justifyContent: "center",
      elevation: 1,
    },
    shiftKeyActive: {
      backgroundColor: "#555",
      borderColor: "#555",
    },
    backspaceKey: {
      flex: 1.4,
      minWidth: 0,
      backgroundColor: "#e05555",
      borderRadius: 5 * sf,
      paddingVertical: 10 * sf,
      marginHorizontal: 2 * sf,
      alignItems: "center",
      justifyContent: "center",
      elevation: 1,
    },
    punctKey: {
      flex: 1,
      minWidth: 0,
      marginHorizontal: 2 * sf,
    },
    spaceKey: {
      flex: 3,
      minWidth: 0,
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5 * sf,
      paddingVertical: 10 * sf,
      marginHorizontal: 2 * sf,
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
