import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { NewsletterIssue } from "../../types/newsletter";

const windowWidth = Dimensions.get("window").width;
const scaleFactor = windowWidth / 320;
const defaultAspectRatio = 210 / 297;

type NewsletterHighlightCardProps = {
  issue: NewsletterIssue;
  categoryName: string;
  accentColor: string;
  coverImageUri?: string;
  onPress?: () => void;
};

const NewsletterHighlightCard = ({
  issue,
  categoryName,
  accentColor,
  coverImageUri,
  onPress,
}: NewsletterHighlightCardProps) => {
  const [coverAspectRatio, setCoverAspectRatio] = useState<number | null>(null);

  const resolvedAspectRatio = useMemo(
    () => coverAspectRatio ?? defaultAspectRatio,
    [coverAspectRatio]
  );

  const fallbackHeight = useMemo(() => windowWidth * 1.35, []);

  useEffect(() => {
    if (!coverImageUri) {
      setCoverAspectRatio(null);
    }
  }, [coverImageUri]);

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        onPress && pressed ? styles.cardPressed : null,
      ]}
    >
      <View
        style={[
          styles.coverSurface,
          !coverAspectRatio ? { minHeight: fallbackHeight } : null,
        ]}
      >
        {coverImageUri ? (
          <Image
            source={{ uri: coverImageUri }}
            style={[styles.coverImage, { aspectRatio: resolvedAspectRatio }]}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={200}
            priority="high"
            allowDownscaling={false}
            onLoad={({ source }) => {
              if (source?.width && source?.height) {
                setCoverAspectRatio(source.width / source.height);
              }
            }}
          />
        ) : (
          <View style={styles.coverPlaceholder} />
        )}
      </View>
      <View style={[styles.content, { borderTopColor: accentColor }]}>
        <Text style={[styles.category, { color: accentColor }]}>
          {categoryName}
        </Text>
        <Text style={styles.title}>{issue.title}</Text>
        {issue.description ? (
          <Text style={styles.description}>{issue.description}</Text>
        ) : null}
        <Text style={styles.meta}>
          {new Date(issue.publishedAt).toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20 * scaleFactor,
  },
  cardPressed: {
    opacity: 0.85,
  },
  coverSurface: {
    width: "100%",
    backgroundColor: "#edf2f7",
    paddingHorizontal: 12 * scaleFactor,
    paddingVertical: 16 * scaleFactor,
    justifyContent: "center",
    alignItems: "center",
  },
  coverImage: {
    width: "100%",
    height: undefined,
  },
  coverPlaceholder: {
    width: "70%",
    aspectRatio: defaultAspectRatio,
    borderRadius: 12 * scaleFactor,
    backgroundColor: "#d9e2ec",
  },
  content: {
    padding: 16 * scaleFactor,
    borderTopWidth: 3,
  },
  category: {
    fontSize: 12 * scaleFactor,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18 * scaleFactor,
    fontWeight: "700",
    color: "#1f2933",
    marginTop: 6 * scaleFactor,
  },
  description: {
    fontSize: 14 * scaleFactor,
    color: "#52606d",
    marginTop: 4 * scaleFactor,
  },
  meta: {
    fontSize: 12 * scaleFactor,
    color: "#7b8794",
    marginTop: 4 * scaleFactor,
  },
});

export default NewsletterHighlightCard;
