import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";

export type MenuItem = {
    id: string | undefined;
    title: string;
    icon: keyof typeof Ionicons.glyphMap | keyof typeof SimpleLineIcons.glyphMap;
    color: string;
    onPress: string;
}