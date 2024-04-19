import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { EventItemType } from "../../types/event-item"; // Certifique-se de importar o tipo corretamente

const windowWidth = Dimensions.get("window").width;

const scaleFactor = windowWidth / 320;

const EventItem: React.FC<EventItemType> = ({
  title,
  subtitle,
  summary,
  date,
  time,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.summary}>{summary}</Text>
      <Text style={styles.datetime}>{`Data: ${date} - Horário: ${time}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5428d",
    padding: 20 * scaleFactor,
    marginVertical: 8 * scaleFactor,
    marginHorizontal: 8 * scaleFactor,
    borderRadius: 10 * scaleFactor,
  },
  title: {
    fontSize: 18 * scaleFactor,
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 14 * scaleFactor,
    color: "#fff",
  },
  summary: {
    fontSize: 12 * scaleFactor,
    textAlign: "justify",
    color: "#fff",
  },
  datetime: {
    fontSize: 12 * scaleFactor,
    color: "#ffffff",
    marginTop: 8 * scaleFactor,
  },
});

export default EventItem;
