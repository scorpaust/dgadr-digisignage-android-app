import { Platform, StyleSheet, Text, View } from "react-native";
import OrgChart from "../components/organogram/OrgChart";

const OrganogramScreen = () => {
  return (
    <View style={styles.container}>
      <OrgChart />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});

export default OrganogramScreen;
