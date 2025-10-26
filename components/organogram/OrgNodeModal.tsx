import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Linking,
} from "react-native";
import { OrgModalData } from "../../types/org";

interface OrgNodeModalProps {
  visible: boolean;
  data: OrgModalData | null;
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get("window");
const scaleFactor = screenWidth / 320;

const OrgNodeModal: React.FC<OrgNodeModalProps> = ({
  visible,
  data,
  onClose,
}) => {
  if (!data) return null;

  const handlePhonePress = () => {
    if (data.phone) {
      Linking.openURL(`tel:${data.phone}`);
    }
  };

  const handleEmailPress = () => {
    if (data.email) {
      Linking.openURL(`mailto:${data.email}`);
    }
  };

  const getPositionColor = (position?: string) => {
    switch (position) {
      case "director":
        return "#2D5A87";
      case "subdirector":
        return "#2D5A87";
      case "head":
        return "#A8D8A8";
      case "division":
        return "#E8F4E8";
      default:
        return "#5B9BD5";
    }
  };

  const getPositionTitle = (position?: string) => {
    switch (position) {
      case "director":
        return "Direção";
      case "subdirector":
        return "Direção";
      case "head":
        return "Direção de Serviços";
      case "division":
        return "Divisão";
      case "council":
        return "Conselho/Entidade";
      default:
        return "Departamento";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View
              style={[
                styles.header,
                { backgroundColor: getPositionColor(data.position) },
              ]}
            >
              <View style={styles.headerContent}>
                <Text style={styles.shortTitle}>
                  {data.shortTitle || data.title}
                </Text>
                <Text style={styles.positionType}>
                  {getPositionTitle(data.position)}
                </Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
              {/* Department Name */}
              <View style={styles.section}>
                <Text style={styles.departmentTitle}>{data.title}</Text>
              </View>

              {/* Responsible Person */}
              {data.name && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Responsável</Text>
                  <Text style={styles.personName}>{data.name}</Text>
                </View>
              )}

              {/* Location */}
              {(data.floor || data.room) && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Localização</Text>
                  <View style={styles.locationContainer}>
                    {data.floor && (
                      <View style={styles.locationItem}>
                        <Text style={styles.locationLabel}>Piso:</Text>
                        <Text style={styles.locationValue}>{data.floor}</Text>
                      </View>
                    )}
                    {data.room && (
                      <View style={styles.locationItem}>
                        <Text style={styles.locationLabel}>Sala:</Text>
                        <Text style={styles.locationValue}>{data.room}</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Contacts */}
              {(data.phone || data.email) && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Contactos</Text>

                  {data.phone && (
                    <TouchableOpacity
                      style={styles.contactItem}
                      onPress={handlePhonePress}
                    >
                      <Text style={styles.contactLabel}>📞 Telefone:</Text>
                      <Text style={styles.contactValue}>{data.phone}</Text>
                    </TouchableOpacity>
                  )}

                  {data.email && (
                    <TouchableOpacity
                      style={styles.contactItem}
                      onPress={handleEmailPress}
                    >
                      <Text style={styles.contactLabel}>✉️ Email:</Text>
                      <Text style={styles.contactValue}>{data.email}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20 * scaleFactor,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 16 * scaleFactor,
    maxWidth: 400 * scaleFactor,
    width: "100%",
    maxHeight: "80%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20 * scaleFactor,
    borderTopLeftRadius: 16 * scaleFactor,
    borderTopRightRadius: 16 * scaleFactor,
  },
  headerContent: {
    flex: 1,
  },
  shortTitle: {
    fontSize: 20 * scaleFactor,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4 * scaleFactor,
  },
  positionType: {
    fontSize: 12 * scaleFactor,
    color: "rgba(255, 255, 255, 0.8)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  closeButton: {
    width: 32 * scaleFactor,
    height: 32 * scaleFactor,
    borderRadius: 16 * scaleFactor,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16 * scaleFactor,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16 * scaleFactor,
    fontWeight: "bold",
  },
  content: {
    padding: 20 * scaleFactor,
  },
  section: {
    marginBottom: 20 * scaleFactor,
  },
  departmentTitle: {
    fontSize: 16 * scaleFactor,
    fontWeight: "600",
    color: "#2D3748",
    lineHeight: 22 * scaleFactor,
  },
  sectionTitle: {
    fontSize: 14 * scaleFactor,
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: 8 * scaleFactor,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  personName: {
    fontSize: 18 * scaleFactor,
    fontWeight: "500",
    color: "#2D3748",
  },
  locationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20 * scaleFactor,
    marginBottom: 4 * scaleFactor,
  },
  locationLabel: {
    fontSize: 14 * scaleFactor,
    color: "#718096",
    marginRight: 8 * scaleFactor,
  },
  locationValue: {
    fontSize: 14 * scaleFactor,
    fontWeight: "500",
    color: "#2D3748",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8 * scaleFactor,
    paddingHorizontal: 12 * scaleFactor,
    backgroundColor: "#F7FAFC",
    borderRadius: 8 * scaleFactor,
    marginBottom: 8 * scaleFactor,
  },
  contactLabel: {
    fontSize: 14 * scaleFactor,
    color: "#4A5568",
    marginRight: 12 * scaleFactor,
    minWidth: 80 * scaleFactor,
  },
  contactValue: {
    fontSize: 14 * scaleFactor,
    fontWeight: "500",
    color: "#3182CE",
    flex: 1,
  },
});

export default OrgNodeModal;
