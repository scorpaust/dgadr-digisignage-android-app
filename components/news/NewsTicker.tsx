// NewsTicker.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Animated, Text, StyleSheet, Dimensions } from "react-native";
import { Easing } from "react-native";

// px/seg (ajusta a gosto: 80–140 costuma ser bom)
const SPEED_PX_PER_SEC = 2;

const { width: winW } = Dimensions.get("window");
const scale = winW / 320;

type Props = { headlines: string[]; speedPxPerSec?: number };

export const NewsTicker = ({ headlines, speedPxPerSec = 40 }: Props) => {
  const SEP = "   •   ";

  const text = useMemo(() => {
    if (!headlines?.length) return "";
    return headlines.join(SEP) + SEP; // garante bolinha no “encaixe” do loop
  }, [headlines]);
  const [textW, setTextW] = useState<number>(0);
  const tx = useRef(new Animated.Value(0)).current;

  // mede a largura real do texto somando as larguras das linhas renderizadas
  const handleMeasure = (e: any) => {
    const lines = e?.nativeEvent?.lines ?? [];
    if (!lines.length) return;
    const total = lines.reduce(
      (acc: number, l: any) => acc + (l?.width || 0),
      0
    );
    // margem de segurança para não cortar no fim
    const measured = Math.max(total + 80, winW);
    setTextW(measured);
  };

  useEffect(() => {
    if (!textW) return;

    const distance = textW + winW; // percorre o texto + entra/saída fora do ecrã
    const duration = Math.round((distance / speedPxPerSec) * 1000);

    const MIN_MS = 20000; // >= 20s
    const MAX_MS = 120000; // <= 120s
    const clamped = Math.max(MIN_MS, Math.min(duration, MAX_MS));

    const run = () => {
      tx.setValue(0);
      Animated.timing(tx, {
        toValue: -distance,
        duration: clamped,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => run());
    };

    run();
    return () => tx.stopAnimation();
  }, [textW, text, speedPxPerSec]);

  return (
    <View style={styles.wrapper}>
      {/* Medidor fora da faixa visível: deixa partir em várias linhas, e somamos as larguras */}
      <Text
        style={styles.measure}
        onTextLayout={handleMeasure}
        allowFontScaling={false}
      >
        {text}
      </Text>

      <View style={styles.mask}>
        <Animated.View
          style={[styles.track, { transform: [{ translateX: tx }] }]}
        >
          {/* cópia 1 */}
          <Text
            style={[styles.txt, { width: textW }]}
            numberOfLines={1}
            ellipsizeMode="clip"
            allowFontScaling={false}
          >
            {text}
          </Text>
          {/* cópia 2 (para loop contínuo) */}
          <Text
            style={[styles.txt, { width: textW }]}
            numberOfLines={1}
            ellipsizeMode="clip"
            allowFontScaling={false}
          >
            {text}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 40 * scale,
    backgroundColor: "#004d00",
    justifyContent: "center",
    paddingHorizontal: 12,
    zIndex: 999,
  },
  mask: {
    overflow: "hidden",
    width: "100%",
  },
  track: {
    flexDirection: "row",
    alignItems: "center",
  },
  txt: {
    fontSize: 16 * scale,
    color: "white",
    flexShrink: 0, // nunca encolhe
    paddingRight: 50, // espaço entre cópias
    includeFontPadding: false,
    textAlignVertical: "center",
    lineHeight: 18 * scale,
  },
  // medidor: fora do ecrã e invisível, sem constraints úteis para o cálculo final
  measure: {
    position: "absolute",
    left: -10000,
    top: -10000,
    opacity: 0,
    fontSize: 16 * scale,
  },
});
