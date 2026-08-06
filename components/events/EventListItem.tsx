import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { EventRecord } from "../../types/event";
import { formatEventDateShort } from "../../utils/formatEventDate";
import { EVENTS_ACCENT, EVENTS_MUTED } from "./eventsTheme";

const windowWidth = Dimensions.get("window").width;
const scaleFactor = windowWidth / 320;
const thumbnailSize = 64 * scaleFactor;

type EventListItemProps = {
  event: EventRecord;
  imageUri?: string;
  onPress: () => void;
  past?: boolean;
};

const EventListItem = ({
  event,
  imageUri,
  onPress,
  past,
}: EventListItemProps) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed ? styles.rowPressed : null]}
      onPress={onPress}
    >
      <View style={styles.thumbnailWrapper}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.thumbnail}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={150}
          />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
            <Ionicons name="calendar-outline" size={22 * scaleFactor} color="#c9d3dd" />
          </View>
        )}
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, past ? styles.titleMuted : null]} numberOfLines={2}>
          {event.title}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={13 * scaleFactor} color={EVENTS_MUTED} />
          <Text style={styles.metaText}>{formatEventDateShort(event.startDate)}</Text>
          {event.location ? (
            <>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText} numberOfLines={1}>
                {event.location}
              </Text>
            </>
          ) : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18 * scaleFactor} color="#c9d3dd" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12 * scaleFactor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e4ebf5",
  },
  rowPressed: {
    opacity: 0.65,
  },
  thumbnailWrapper: {
    width: thumbnailSize,
    height: thumbnailSize,
    borderRadius: 12 * scaleFactor,
    overflow: "hidden",
    marginRight: 12 * scaleFactor,
    backgroundColor: "#f0f4f8",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  thumbnailPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    flex: 1,
    marginRight: 8 * scaleFactor,
  },
  title: {
    fontSize: 15 * scaleFactor,
    fontWeight: "600",
    color: "#102a43",
  },
  titleMuted: {
    color: "#52606d",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5 * scaleFactor,
  },
  metaText: {
    fontSize: 12 * scaleFactor,
    color: EVENTS_MUTED,
    marginLeft: 5 * scaleFactor,
    flexShrink: 1,
  },
  metaDot: {
    fontSize: 12 * scaleFactor,
    color: EVENTS_MUTED,
    marginHorizontal: 5 * scaleFactor,
  },
});

export default EventListItem;
