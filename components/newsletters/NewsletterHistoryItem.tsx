import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { NewsletterIssue } from "../../types/newsletter";

const windowWidth = Dimensions.get("window").width;
const scaleFactor = windowWidth / 320;

const thumbnailSize = 72 * scaleFactor;

type NewsletterHistoryItemProps = {
  issue: NewsletterIssue;
  categoryName: string;
  accentColor: string;
  coverImageUri?: string;
  onPress?: () => void;
};

const NewsletterHistoryItem = ({
  issue,
  categoryName,
  accentColor,
  coverImageUri,
  onPress,
}: NewsletterHistoryItemProps) => {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    if (!coverImageUri) {
      setAspectRatio(null);
    }
  }, [coverImageUri]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        onPress && pressed ? styles.rowPressed : null,
        !onPress ? styles.rowDisabled : null,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.thumbnailWrapper, { borderColor: accentColor }]}>
        {coverImageUri ? (
          <Image
            source={{ uri: coverImageUri }}
            style={[
              styles.thumbnail,
              aspectRatio ? { aspectRatio } : styles.thumbnailFallback,
            ]}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={150}
            priority="high"
            allowDownscaling={false}
            onLoad={({ source }) => {
              if (source?.width && source?.height) {
                setAspectRatio(source.width / source.height);
              }
            }}
          />
        ) : (
          <View
            style={[
              styles.thumbnail,
              styles.thumbnailFallback,
              styles.thumbnailPlaceholder,
            ]}
          />
        )}
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>{issue.title}</Text>
        <Text style={styles.subtitle}>
          {categoryName} ·{" "}
          {new Date(issue.publishedAt).toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12 * scaleFactor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#d9e2ec",
  },
  rowPressed: {
    opacity: 0.65,
  },
  rowDisabled: {
    opacity: 0.6,
  },
  thumbnailWrapper: {
    width: thumbnailSize,
    padding: 4 * scaleFactor,
    borderRadius: 12 * scaleFactor,
    borderWidth: 1,
    backgroundColor: "#fff",
    marginRight: 12 * scaleFactor,
  },
  thumbnail: {
    width: "100%",
    backgroundColor: "#fff",
  },
  thumbnailFallback: {
    height: thumbnailSize - 8 * scaleFactor,
  },
  thumbnailPlaceholder: {
    backgroundColor: "#e4ebf5",
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 15 * scaleFactor,
    fontWeight: "600",
    color: "#102a43",
  },
  subtitle: {
    fontSize: 12 * scaleFactor,
    color: "#7b8794",
    marginTop: 4 * scaleFactor,
  },
});

export default NewsletterHistoryItem;
