import React from "react";
import { View, StyleSheet } from "react-native";
import OrgChart from "../components/organogram/OrgChart";

const OrganogramScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <OrgChart />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
});

export default OrganogramScreen;
