import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { SiLibrariesdotio } from "@icons-pack/react-simple-icons";
import React from "react";

export type MenuItem = {
  id: string | undefined;
  title: string;
  icon:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof SimpleLineIcons.glyphMap
  color: string;
  onPress: string;
};
