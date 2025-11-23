import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

const scaleFactor = windowWidth / 320;

const DateTimeComponent = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    try {
      const interval = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000); // Update every minute

      return () => clearInterval(interval); // Clear interval on unmount
    } catch (error) {
      // Erro silencioso
    }
  }, [currentDateTime]);

  const formatDateAndTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Intl.DateTimeFormat("pt-PT", options).format(date);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{formatDateAndTime(currentDateTime)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    marginRight: "0.15%",
  },
  text: {
    fontSize: 5 * scaleFactor,
  },
});

export default DateTimeComponent;
