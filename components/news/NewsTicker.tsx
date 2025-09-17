import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Animated,
  Text,
  StyleSheet,
  Dimensions,
  Easing,
} from "react-native";

const { width: winW } = Dimensions.get("window");
const scale = winW / 320;
const SEP = "   •   ";

type Props = { headlines: string[]; speedPxPerSec?: number };

export const NewsTicker = ({ headlines, speedPxPerSec = 30 }: Props) => {
  // 1) conteúdo base
  const raw = useMemo(
    () => (headlines?.length ? headlines.join(SEP) : ""),
    [headlines]
  );

  // 2) fita repetida para garantir largura mínima (evita “loop” curto e cortes)
  const tape = useMemo(() => {
    if (!raw) return "";
    const minPx = winW * 1.25; // pelo menos 125% da largura do ecrã
    const charPx = 7.5 * (scale * 0.95); // heurística ~ 7.5px por char @16px
    const minChars = Math.ceil(minPx / charPx);

    let s = raw;
    while (s.length < minChars) s = s + SEP + raw;
    return s + SEP; // separador final
  }, [raw]);

  const [textW, setTextW] = useState(0);
  const tx = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  // mede largura pelo somatório das lines (Android/Hermes-friendly)
  const onTextLayoutLines = (e: any) => {
    const lines = e?.nativeEvent?.lines ?? [];
    if (!lines.length) return;
    const sum = lines.reduce((acc: number, l: any) => acc + (l?.width || 0), 0);
    setTextW((w) => Math.max(w, Math.ceil(sum) + 40)); // margem de segurança
  };

  // fallback por onLayout (iOS costuma ser suficiente)
  const onLayoutWidth = (e: any) => {
    const w = e?.nativeEvent?.layout?.width ?? 0;
    if (w > 0) setTextW((curr) => Math.max(curr, Math.ceil(w) + 40));
  };

  // fallback por estimativa se nada mediu
  useEffect(() => {
    if (!tape) return;
    const estimate = Math.ceil(tape.length * 7.5 * (scale * 0.95));
    const t = setTimeout(() => {
      setTextW((w) => (w > 0 ? w : Math.max(estimate, winW + 200)));
    }, 300);
    return () => clearTimeout(t);
  }, [tape]);

  // ANIMAÇÃO: desloca de 0 até -textW (não -textW - winW) para loop perfeito
  useEffect(() => {
    if (!tape || textW <= 0) return;

    const distance = textW; // 👈 chave do loop sem cortes
    const duration = Math.max(
      10000,
      Math.min(240000, Math.round((distance / speedPxPerSec) * 1000))
    );

    const raf = requestAnimationFrame(() => {
      tx.setValue(0);
      const run = () => {
        animRef.current = Animated.timing(tx, {
          toValue: -distance,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        });
        animRef.current.start(({ finished }) => {
          if (finished) {
            tx.setValue(0);
            run();
          }
        });
      };
      run();
    });

    return () => {
      cancelAnimationFrame(raf);
      animRef.current?.stop?.();
    };
  }, [tape, textW, speedPxPerSec, tx]);

  return (
    <View style={styles.wrapper} pointerEvents="none">
      {/* medidor invisível (precisa estar na árvore para medir em release) */}
      <Text
        style={styles.measure}
        onTextLayout={onTextLayoutLines}
        onLayout={onLayoutWidth}
        allowFontScaling={false}
      >
        {tape}
      </Text>

      <View style={styles.mask}>
        <Animated.View
          style={[styles.track, { transform: [{ translateX: tx }] }]}
        >
          {/* duas cópias lado a lado; ao transladar -textW a segunda encaixa na primeira */}
          <Text
            style={[styles.txt, { width: Math.max(textW, 1) }]}
            numberOfLines={1}
            ellipsizeMode="clip"
            allowFontScaling={false}
          >
            {tape}
          </Text>
          <Text
            style={[styles.txt, { width: Math.max(textW, 1) }]}
            numberOfLines={1}
            ellipsizeMode="clip"
            allowFontScaling={false}
          >
            {tape}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
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
    flexShrink: 0,
    paddingRight: 40, // espaço entre repetição
    includeFontPadding: false,
    textAlignVertical: "center",
    lineHeight: 18 * scale,
  },
  measure: {
    position: "absolute",
    opacity: 0,
    fontSize: 16 * scale,
    includeFontPadding: false,
  },
});
