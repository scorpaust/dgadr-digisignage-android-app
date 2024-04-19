import { MenuItem } from "../../types/menu-item";
import { Pressable, View, StyleSheet, Text, Platform, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SimpleLineIcons } from '@expo/vector-icons'; 
import React from "react";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get('window').width;
const scaleFactor = windowWidth / 320;

const MenuComponent = ({ id, title, icon, color, onPress}: MenuItem) => {
  
    const navigation = useNavigation();

    
    return (
        <View style={styles.gridItem}>
          <Pressable
            android_ripple={{ color: "#ccc" }}
            style={({ pressed }) => [
              styles.buttonStyle,
              pressed ? styles.buttonPressed : null,
            ]}
            onPress={() => { navigation.navigate({ name: onPress } as never)}}
          >
            <View style={[styles.innerContainer, { backgroundColor: color }]}>
              {title !== 'Organograma' && <Ionicons name={icon as keyof typeof Ionicons.glyphMap} style={styles.icon} size={24 * scaleFactor} color="white" />}
              {title === 'Organograma' && <SimpleLineIcons name={icon as keyof typeof SimpleLineIcons.glyphMap} style={styles.icon} size={24 * scaleFactor} color="white" />}
              <Text style={styles.title}>{title}</Text>
            </View>
          </Pressable>
        </View>
      );
}

export default MenuComponent;

const styles = StyleSheet.create({
    gridItem: {
      flex: 1,
      margin: 6 * scaleFactor,
      height: 100 * scaleFactor,
      borderRadius: 8,
      elevation: 4,
      backgroundColor: "white",
      shadowColor: "black",
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      overflow: Platform.OS === "android" ? "hidden" : "visible",
      justifyContent: "center",
    },
    buttonStyle: {
      flex: 1,
    },
    buttonPressed: {
      opacity: 0.5,
    },
    innerContainer: {
      flex: 1,
      padding: 16,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    icon: {
      alignItems: "flex-start",
    },
    title: {
      fontWeight: "bold",
      fontSize: 18 * scaleFactor,
      textAlign: "center",
  },
  });
  