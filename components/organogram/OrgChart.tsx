import React, { useState, useRef } from "react";
import {
  ScrollView,
  Alert,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import Svg, {
  Rect,
  Image,
  Text,
  G,
  ClipPath,
  Defs,
  Path,
  Line,
} from "react-native-svg";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PinchGestureHandler,
} from "react-native-gesture-handler";

interface TreeNode {
  name: string;
  title: string;
  imageUrl: string;
  children?: TreeNode[];
}

const windowWidth = Dimensions.get("window").width;

const scaleFactor = windowWidth / 800;

// Constants
const horizontalSpacing = 200 * scaleFactor;
const verticalSpacing = 150 * scaleFactor;
const nodeWidth = 150 * scaleFactor;
const nodeHeight = 80 * scaleFactor;
const fontSize = 8 * scaleFactor;

// Get device window dimensions
const window = Dimensions.get("window");

// Helper function to calculate tree size
const getTreeSize = (
  node: TreeNode,
  depth = 0
): { maxDepth: number; maxWidth: number } => {
  if (!node.children || node.children.length === 0) {
    return { maxDepth: depth, maxWidth: 1 };
  }

  const childDepths = node.children.map((child) =>
    getTreeSize(child, depth + 1)
  );
  const totalWidth = childDepths.reduce((sum, val) => sum + val.maxWidth, 0);
  const maxDepth = Math.max(...childDepths.map((val) => val.maxDepth));

  return { maxDepth, maxWidth: totalWidth };
};

// Function to render each node
const renderNode = (
  node: TreeNode,
  x: number,
  y: number,
  depth: number = 0
) => {
  const hasChildren = node.children && node.children?.length > 0;

  return (
    <G key={`${node.name}-${depth}`}>
      <Rect
        x={x - nodeWidth / 2}
        y={y - nodeHeight / 2}
        width={nodeWidth}
        height={nodeHeight}
        fill="lightblue"
        onPress={() => Alert.alert(`Pressed on ${node.name}`)}
      />
      {/*<Image
        href={{ uri: node.imageUrl }}
        x={x - nodeWidth / 4}
        y={y - nodeHeight / 3}
        width={80}
        height={20}
      />*/}
      <Text
        x={x}
        y={node.name !== "" ? y - 10 * scaleFactor : y + 2 * scaleFactor}
        textAnchor="middle"
        fontWeight="bold"
        fontSize={fontSize}
        fill="black"
      >
        {node.title}
      </Text>
      <Text
        x={x}
        y={y + 5 * scaleFactor}
        textAnchor="middle"
        fontWeight="bold"
        fontSize={fontSize}
        fill="black"
      >
        {node.name}
      </Text>
      {hasChildren &&
        node.children?.map((child, index) => {
          const childX =
            x -
            (horizontalSpacing / 2) *
              (node.children ? node.children.length : 0 - 1) +
            index * horizontalSpacing;
          const childY = y + verticalSpacing;
          return (
            <React.Fragment key={`${child.name}-${depth + 1}`}>
              <Line
                x1={x}
                y1={y + nodeHeight / 2}
                x2={childX}
                y2={childY - nodeHeight / 2}
                stroke="black"
              />
              {renderNode(child, childX, childY, depth + 1)}
            </React.Fragment>
          );
        })}
    </G>
  );
};

const OrgChart: React.FC = () => {
  const data: TreeNode = {
    name: "Rogério Ferreira",
    title: "DIRETOR-GERAL",
    imageUrl: "https://www.dgadr.gov.pt/images/foto_dir/foto_DG.jpg",
    children: [
      {
        name: "Catarina Cunha",
        title: "SUBDIRETORA-GERAL",
        imageUrl: "",
      },
      {
        name: "do Regadio",
        title: "Conselho Nacional",
        imageUrl: "",
      },
      {
        name: "da Reserva Agrícola",
        title: "Entidade Nacional ",
        imageUrl: "",
      },
      {
        name: "do Exercício da At. Pecuária",
        title: "Comissão de Acompanhamento",
        imageUrl: "",
      },
      {
        name: "",
        title: "Direções de Serviço",
        imageUrl: "",
        children: [
          {
            name: "Paulo Freitas",
            title: "DSIGA",
            imageUrl: "",
          },
          {
            name: "Sandra Candeias",
            title: "DSPAA",
            imageUrl: "",
          },
          {
            name: "Maria S. Luís Centeno",
            title: "DSTAR",
            imageUrl: "",
          },
          {
            name: "Cláudia Brandão",
            title: "DSR",
            imageUrl: "",
          },
        ],
      },
    ],
  };

  const treeSize = getTreeSize(data);
  const svgWidth =
    Math.max(treeSize.maxWidth * horizontalSpacing, 400) + nodeWidth;
  const svgHeight = (treeSize.maxDepth + 1) * verticalSpacing;

  // Gesture handling state
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  return (
    <ScrollView
      horizontal={true}
      scrollEnabled={true}
      showsHorizontalScrollIndicator={true}
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      <ScrollView
        horizontal={false}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        <GestureHandlerRootView
          style={[
            styles.gestureHandlerRoot,
            { width: "100%", height: svgHeight },
          ]}
        >
          <PanGestureHandler
            onGestureEvent={Animated.event(
              [
                {
                  nativeEvent: {
                    translationX: translateX,
                    translationY: translateY,
                  },
                },
              ],
              { useNativeDriver: true }
            )}
          >
            <Animated.View
              style={{ transform: [{ translateX }, { translateY }] }}
            >
              <PinchGestureHandler
                onGestureEvent={Animated.event(
                  [{ nativeEvent: { scale: scale } }],
                  { useNativeDriver: true }
                )}
              >
                <Animated.View
                  style={{
                    transform: [{ scale }],
                    width: svgWidth,
                    height: svgHeight,
                  }}
                >
                  <Svg height={svgHeight} width={svgWidth}>
                    <Defs>
                      <ClipPath id="clip">
                        <Path d="M0 0 H20 V20 H0 Z" />
                      </ClipPath>
                    </Defs>
                    {renderNode(data, svgWidth / 2, 100)}
                  </Svg>
                </Animated.View>
              </PinchGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </ScrollView>
    </ScrollView>
  );
};

export default OrgChart;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "transparent", // Use transparent background to avoid overlay issues
  },
  gestureHandlerRoot: {
    width: window.width, // Use full width of the screen
    height: window.height, // Use full height of the screen, adjust based on your app's navigation/headers/etc.
    alignItems: "center", // Center children horizontally
    justifyContent: "center", // Center children vertically
    backgroundColor: "transparent", // Ensure background is transparent for full manipulation space
  },
  // Styles for the nodes to make them visually appealing
  node: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // Ensure node background doesn't block gesture handling
  },
  // Style for SVG Rects to give them a more appealing look
  rect: {
    backgroundColor: "#78909C", // Cool grey color for the rectangles
    borderWidth: 2, // Border thickness
    borderColor: "#546E7A", // Darker border color for contrast
  },
  // Style for SVG Text to make it visually appealing
  text: {
    backgroundColor: "white", // White text color for contrast against the rect color
    fontWeight: "bold",
    fontSize: 12, // Slightly larger font size for readability
  },
  // Style for SVG Lines to make them visually appealing
  line: {
    borderColor: "#37474F", // Dark line color for contrast and visibility
    borderWidth: 2, // Make lines a bit thicker for visibility
  },
  // Adjustments for image styling within SVG
  image: {
    width: 20, // Adjust image size as needed
    height: 20, // Adjust image size as needed
    x: -10, // Center the image relative to its container
    y: -10, // Center the image relative to its container
  },
});
