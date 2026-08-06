import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { EventRecord } from "../../types/event";
import { formatEventDate } from "../../utils/formatEventDate";
import { truncateText } from "../../utils/truncateText";
import { EVENTS_ACCENT } from "./eventsTheme";

const SUMMARY_MAX_LENGTH = 130;

const windowWidth = Dimensions.get("window").width;
const scaleFactor = windowWidth / 320;

type EventHighlightCardProps = {
  event: EventRecord;
  imageUri?: string;
  onPress: () => void;
};

const EventHighlightCard = ({
  event,
  imageUri,
  onPress,
}: EventHighlightCardProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
    >
      <View style={styles.coverSurface}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.coverImage}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
            priority="high"
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Ionicons
              name="calendar"
              size={40 * scaleFactor}
              color="#f3b8d0"
            />
          </View>
        )}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Próximo Evento</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={16 * scaleFactor} color={EVENTS_ACCENT} />
          <Text style={styles.metaText}>{formatEventDate(event.startDate)}</Text>
        </View>

        {event.location ? (
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={16 * scaleFactor} color={EVENTS_ACCENT} />
            <Text style={styles.metaText}>{event.location}</Text>
          </View>
        ) : null}

        {event.summary ? (
          <Text style={styles.summary}>
            {truncateText(event.summary, SUMMARY_MAX_LENGTH)}
          </Text>
        ) : null}

        <View style={styles.ctaRow}>
          <Text style={styles.cta}>Ver detalhes</Text>
          <Ionicons name="chevron-forward" size={16 * scaleFactor} color={EVENTS_ACCENT} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 18 * scaleFactor,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  cardPressed: {
    opacity: 0.9,
  },
  coverSurface: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#fbe4ee",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 12 * scaleFactor,
    left: 12 * scaleFactor,
    backgroundColor: EVENTS_ACCENT,
    paddingHorizontal: 10 * scaleFactor,
    paddingVertical: 5 * scaleFactor,
    borderRadius: 20 * scaleFactor,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11 * scaleFactor,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  content: {
    padding: 16 * scaleFactor,
  },
  title: {
    fontSize: 19 * scaleFactor,
    fontWeight: "700",
    color: "#1f2933",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8 * scaleFactor,
    gap: 6 * scaleFactor,
  },
  metaText: {
    fontSize: 13 * scaleFactor,
    color: "#52606d",
    marginLeft: 6 * scaleFactor,
  },
  summary: {
    fontSize: 13 * scaleFactor,
    color: "#52606d",
    marginTop: 10 * scaleFactor,
    lineHeight: 19 * scaleFactor,
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12 * scaleFactor,
    gap: 4 * scaleFactor,
  },
  cta: {
    fontSize: 13 * scaleFactor,
    fontWeight: "700",
    color: EVENTS_ACCENT,
    marginRight: 2 * scaleFactor,
  },
});

export default EventHighlightCard;
