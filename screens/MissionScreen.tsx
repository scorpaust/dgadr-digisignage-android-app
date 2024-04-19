import React from "react";
import { View } from "react-native";
import MissionComponent from "../components/MissionComponent";

const MissionScreen: React.FC = () => {
    return (
        <View style={{ flex: 1, marginVertical: '10%' }}>
            <MissionComponent />
        </View>);
}

export default MissionScreen;