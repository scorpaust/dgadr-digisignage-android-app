import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { TreeNode } from "../../types/org";

interface OrgNodeProps {
  node: TreeNode;
  onPress?: (node: TreeNode) => void;
  style?: any;
}

const { width: screenWidth } = Dimensions.get("window");
const scaleFactor = screenWidth / 320;

const OrgNode: React.FC<OrgNodeProps> = ({ node, onPress, style }) => {
  const handlePress = () => {
    if (node.isClickable && onPress) {
      onPress(node);
    }
  };

  const getNodeStyle = () => {
    const baseStyle = [styles.node];

    if (node.color) {
      baseStyle.push({ backgroundColor: node.color });
    }

    if (node.position === "director" || node.position === "subdirector") {
      baseStyle.push(styles.directorNode);
    } else if (node.position === "head") {
      baseStyle.push(styles.headNode);
    } else if (node.position === "division") {
      baseStyle.push(styles.divisionNode);
    } else if (node.position === "council") {
      baseStyle.push(styles.councilNode);
    }

    if (node.isClickable) {
      baseStyle.push(styles.clickableNode);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.nodeText];

    if (node.position === "director" || node.position === "subdirector") {
      baseStyle.push(styles.directorText);
    } else if (node.position === "council") {
      baseStyle.push(styles.councilText);
    }

    return baseStyle;
  };

  const NodeComponent = node.isClickable ? TouchableOpacity : View;

  return (
    <NodeComponent
      style={[getNodeStyle(), style]}
      onPress={node.isClickable ? handlePress : undefined}
      activeOpacity={node.isClickable ? 0.7 : 1}
    >
      {/* Short Title (Sigla) */}
      {node.shortTitle && (
        <Text style={[styles.shortTitle, getTextStyle()]}>
          {node.shortTitle}
        </Text>
      )}

      {/* Department/Title */}
      <Text style={[styles.title, getTextStyle()]} numberOfLines={2}>
        {node.shortTitle ? node.title : node.title}
      </Text>

      {/* Person Name */}
      {node.name && (
        <Text style={[styles.name, getTextStyle()]} numberOfLines={1}>
          {node.name}
        </Text>
      )}

      {/* Clickable indicator */}
      {node.isClickable && (
        <View style={styles.clickIndicator}>
          <Text style={styles.clickIndicatorText}>ⓘ</Text>
        </View>
      )}
    </NodeComponent>
  );
};

const styles = StyleSheet.create({
  node: {
    minWidth: 120 * scaleFactor,
    minHeight: 80 * scaleFactor,
    padding: 12 * scaleFactor,
    borderRadius: 8 * scaleFactor,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    margin: 4 * scaleFactor,
    position: "relative",
  },
  directorNode: {
    minWidth: 140 * scaleFactor,
    minHeight: 90 * scaleFactor,
    borderWidth: 2,
    borderColor: "#2D5A87",
  },
  headNode: {
    minWidth: 130 * scaleFactor,
    minHeight: 85 * scaleFactor,
    borderColor: "#68D391",
  },
  divisionNode: {
    minWidth: 120 * scaleFactor,
    minHeight: 80 * scaleFactor,
    borderColor: "#C6F6D5",
  },
  councilNode: {
    minWidth: 140 * scaleFactor,
    minHeight: 70 * scaleFactor,
    borderColor: "#90CDF4",
  },
  clickableNode: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shortTitle: {
    fontSize: 14 * scaleFactor,
    fontWeight: "bold",
    marginBottom: 4 * scaleFactor,
    textAlign: "center",
  },
  title: {
    fontSize: 10 * scaleFactor,
    textAlign: "center",
    lineHeight: 12 * scaleFactor,
    marginBottom: 4 * scaleFactor,
  },
  name: {
    fontSize: 9 * scaleFactor,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 2 * scaleFactor,
  },
  nodeText: {
    color: "#2D3748",
  },
  directorText: {
    color: "#FFFFFF",
  },
  councilText: {
    color: "#FFFFFF",
  },
  clickIndicator: {
    position: "absolute",
    top: 4 * scaleFactor,
    right: 4 * scaleFactor,
    width: 16 * scaleFactor,
    height: 16 * scaleFactor,
    borderRadius: 8 * scaleFactor,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  clickIndicatorText: {
    fontSize: 10 * scaleFactor,
    color: "#4A5568",
  },
});

export default OrgNode;
