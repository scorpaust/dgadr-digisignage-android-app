import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";

const baseWindowWidth = Dimensions.get("window").width;
const scaleFactor = Math.min(Math.max(baseWindowWidth / 360, 1), 3);

interface Props {
  visible: boolean;
  coverUri: string;
  title: string;
  categoryName: string;
  publishedAt: string;
  onClose: () => void;
}

const NewsletterCoverModal: React.FC<Props> = ({
  visible,
  coverUri,
  title,
  categoryName,
  publishedAt,
  onClose,
}) => {
  const [coverAspectRatio, setCoverAspectRatio] = useState<number | null>(null);
  const { width: liveWidth, height: liveHeight } = useWindowDimensions();

  const modalContentWidth = useMemo(
    () => Math.min(liveWidth * 0.92, 1080),
    [liveWidth]
  );
  const horizontalInset = useMemo(
    () => Math.max((liveWidth - modalContentWidth) / 2, 24 * scaleFactor),
    [liveWidth, modalContentWidth]
  );
  const coverFallbackHeight = useMemo(
    () => Math.max(modalContentWidth * 1.35, liveHeight * 0.6),
    [modalContentWidth, liveHeight]
  );

  const scrollContentStyle = useMemo(
    () => ({ paddingHorizontal: horizontalInset }),
    [horizontalInset]
  );
  const metaWidthStyle = useMemo(
    () => ({ maxWidth: modalContentWidth }),
    [modalContentWidth]
  );
  const frameWidthStyle = useMemo(
    () => ({ width: modalContentWidth }),
    [modalContentWidth]
  );
  const fallbackCoverStyle = useMemo(
    () => ({ minHeight: coverFallbackHeight }),
    [coverFallbackHeight]
  );

  useEffect(() => {
    if (!visible || !coverUri) {
      setCoverAspectRatio(null);
    }
  }, [visible, coverUri]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeLabel}>×</Text>
          </TouchableOpacity>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.body, scrollContentStyle]}
            showsVerticalScrollIndicator={false}
            maximumZoomScale={3}
            minimumZoomScale={1}
          >
            <View style={[styles.meta, metaWidthStyle]}>
              <Text style={styles.category}>{categoryName}</Text>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.date}>{publishedAt}</Text>
            </View>
            <View style={[styles.coverFrame, frameWidthStyle]}>
              <Image
                source={{ uri: coverUri }}
                style={[
                  styles.cover,
                  coverAspectRatio
                    ? { aspectRatio: coverAspectRatio }
                    : styles.coverFallback,
                  !coverAspectRatio ? fallbackCoverStyle : null,
                ]}
                contentFit="contain"
                transition={200}
                cachePolicy="memory-disk"
                priority="high"
                allowDownscaling={false}
                onLoad={({ source }) => {
                  if (source?.width && source?.height) {
                    setCoverAspectRatio(source.width / source.height);
                  }
                }}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(16, 42, 67, 0.82)",
  },
  container: {
    flex: 1,
    width: "100%",
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 24 * scaleFactor,
    right: 28 * scaleFactor,
    zIndex: 2,
    width: 44 * scaleFactor,
    height: 44 * scaleFactor,
    borderRadius: 22 * scaleFactor,
    backgroundColor: "rgba(255,255,255,0.94)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#102a43",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  closeLabel: {
    fontSize: 30 * scaleFactor,
    color: "#243b53",
    marginTop: -2 * scaleFactor,
  },
  body: {
    paddingTop: 72 * scaleFactor,
    paddingBottom: 56 * scaleFactor,
    alignItems: "center",
  },
  meta: {
    width: "100%",
    marginBottom: 28 * scaleFactor,
  },
  category: {
    fontSize: 13 * scaleFactor,
    fontWeight: "600",
    color: "#486581",
    textTransform: "uppercase",
    marginBottom: 6 * scaleFactor,
  },
  title: {
    fontSize: 22 * scaleFactor,
    fontWeight: "700",
    color: "#102a43",
    marginBottom: 6 * scaleFactor,
  },
  date: {
    fontSize: 13 * scaleFactor,
    color: "#829ab1",
  },
  coverFrame: {
    width: "100%",
    borderRadius: 24 * scaleFactor,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#0b1f33",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 20,
    elevation: 12,
  },
  cover: {
    width: "100%",
  },
  coverFallback: {
    backgroundColor: "#f0f4f8",
  },
});

export default NewsletterCoverModal;
