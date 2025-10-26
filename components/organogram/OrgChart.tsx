import React, { useState } from "react";
import { ScrollView, StyleSheet, Dimensions, View } from "react-native";
import { ORG_CHART_DATA } from "../../data/org-data";
import { TreeNode, OrgModalData } from "../../types/org";
import OrgNode from "./OrgNode";
import OrgNodeModal from "./OrgNodeModal";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const scaleFactor = screenWidth / 320;

const OrgChart: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<OrgModalData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleNodePress = (node: TreeNode) => {
    const modalData: OrgModalData = {
      id: node.id,
      name: node.name,
      title: node.title,
      department: node.department,
      floor: node.floor,
      room: node.room,
      phone: node.phone,
      email: node.email,
      position: node.position,
      shortTitle: node.shortTitle,
    };

    setSelectedNode(modalData);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedNode(null);
  };

  const renderDirectorLevel = () => {
    return (
      <View style={styles.directorLevel}>
        <OrgNode
          node={ORG_CHART_DATA}
          onPress={handleNodePress}
          style={styles.directorNode}
        />
      </View>
    );
  };

  const renderSubdirectorAndCouncils = () => {
    const subdirector = ORG_CHART_DATA.children?.find(
      (child) => child.position === "subdirector"
    );
    const councils =
      ORG_CHART_DATA.children?.filter(
        (child) => child.position === "council"
      ) || [];

    return (
      <View style={styles.secondLevel}>
        {/* Subdirector */}
        {subdirector && (
          <View style={styles.subdirectorContainer}>
            <OrgNode node={subdirector} onPress={handleNodePress} />
          </View>
        )}

        {/* Councils */}
        <View style={styles.councilsContainer}>
          {councils.map((council) => (
            <OrgNode
              key={council.id}
              node={council}
              onPress={handleNodePress}
              style={styles.councilNode}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderServiceDirections = () => {
    const serviceDirections =
      ORG_CHART_DATA.children?.filter((child) => child.position === "head") ||
      [];

    return (
      <View style={styles.serviceLevel}>
        <View style={styles.serviceDirectionsContainer}>
          {serviceDirections.map((direction) => (
            <View key={direction.id} style={styles.directionContainer}>
              {/* Service Direction */}
              <OrgNode
                node={direction}
                onPress={handleNodePress}
                style={styles.serviceDirectionNode}
              />

              {/* Divisions */}
              {direction.children && direction.children.length > 0 && (
                <View style={styles.divisionsContainer}>
                  {direction.children.map((division) => (
                    <OrgNode
                      key={division.id}
                      node={division}
                      onPress={handleNodePress}
                      style={styles.divisionNode}
                    />
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* Director Level */}
        {renderDirectorLevel()}

        {/* Connection Line */}
        <View style={styles.connectionLine} />

        {/* Subdirector and Councils Level */}
        {renderSubdirectorAndCouncils()}

        {/* Connection Line */}
        <View style={styles.connectionLine} />

        {/* Service Directions and Divisions */}
        {renderServiceDirections()}
      </ScrollView>

      {/* Modal */}
      <OrgNodeModal
        visible={modalVisible}
        data={selectedNode}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20 * scaleFactor,
    alignItems: "center",
  },
  directorLevel: {
    alignItems: "center",
    marginBottom: 20 * scaleFactor,
  },
  directorNode: {
    marginBottom: 10 * scaleFactor,
  },
  connectionLine: {
    width: 2,
    height: 20 * scaleFactor,
    backgroundColor: "#CBD5E0",
    marginVertical: 10 * scaleFactor,
  },
  secondLevel: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20 * scaleFactor,
  },
  subdirectorContainer: {
    marginBottom: 20 * scaleFactor,
  },
  councilsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: screenWidth - 40 * scaleFactor,
  },
  councilNode: {
    margin: 4 * scaleFactor,
  },
  serviceLevel: {
    width: "100%",
    alignItems: "center",
  },
  serviceDirectionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: screenWidth - 20 * scaleFactor,
  },
  directionContainer: {
    alignItems: "center",
    margin: 8 * scaleFactor,
    marginBottom: 20 * scaleFactor,
  },
  serviceDirectionNode: {
    marginBottom: 15 * scaleFactor,
  },
  divisionsContainer: {
    alignItems: "center",
  },
  divisionNode: {
    marginBottom: 8 * scaleFactor,
  },
});

export default OrgChart;
