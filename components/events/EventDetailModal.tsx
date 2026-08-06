import React, { useMemo } from "react";
import {
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { EventRecord } from "../../types/event";
import { formatEventDate } from "../../utils/formatEventDate";
import { EVENTS_ACCENT, EVENTS_ACCENT_LIGHT } from "./eventsTheme";

type EventDetailModalProps = {
  visible: boolean;
  event: EventRecord;
  imageUri?: string;
  onClose: () => void;
};

const EventDetailModal = ({
  visible,
  event,
  imageUri,
  onClose,
}: EventDetailModalProps) => {
  // Mesma referência (largura/320) usada no resto do ecrã de Eventos, sem
  // limite superior — assim o modal continua a crescer em ecrãs muito
  // grandes (ex.: digital signage) em vez de ficar preso a um tamanho de telemóvel.
  const { width: windowWidth } = useWindowDimensions();
  const scaleFactor = windowWidth / 320;
  const styles = useMemo(() => createStyles(scaleFactor), [scaleFactor]);

  const handleEmailPress = () => {
    if (event.contactEmail) {
      Linking.openURL(`mailto:${event.contactEmail}`);
    }
  };

  const handlePhonePress = () => {
    if (event.contactPhone) {
      Linking.openURL(`tel:${event.contactPhone}`);
    }
  };

  const handleLinkPress = () => {
    if (event.eventUrl) {
      Linking.openURL(event.eventUrl);
    }
  };

  const hasContacts = event.contactName || event.contactEmail || event.contactPhone;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24 * scaleFactor} color="#243b53" />
          </TouchableOpacity>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={200}
                  priority="high"
                />
              ) : (
                <View style={[styles.image, styles.imagePlaceholder]}>
                  <Ionicons name="calendar" size={48 * scaleFactor} color="#f3b8d0" />
                </View>
              )}

              <View style={styles.content}>
                <Text style={styles.title}>{event.title}</Text>

                <View style={styles.metaRow}>
                  <Ionicons name="calendar-outline" size={18 * scaleFactor} color={EVENTS_ACCENT} />
                  <Text style={styles.metaText}>{formatEventDate(event.startDate)}</Text>
                </View>

                {event.location ? (
                  <View style={styles.metaRow}>
                    <Ionicons name="location-outline" size={18 * scaleFactor} color={EVENTS_ACCENT} />
                    <Text style={styles.metaText}>{event.location}</Text>
                  </View>
                ) : null}

                {event.summary ? (
                  <Text style={styles.summary}>{event.summary}</Text>
                ) : null}

                {hasContacts ? (
                  <View style={styles.contactsSection}>
                    <Text style={styles.sectionLabel}>Contactos</Text>

                    {event.contactName ? (
                      <View style={styles.contactRow}>
                        <Ionicons name="person-outline" size={16 * scaleFactor} color="#486581" />
                        <Text style={styles.contactText}>{event.contactName}</Text>
                      </View>
                    ) : null}

                    {event.contactEmail ? (
                      <TouchableOpacity style={styles.contactRow} onPress={handleEmailPress}>
                        <Ionicons name="mail-outline" size={16 * scaleFactor} color="#486581" />
                        <Text style={[styles.contactText, styles.contactLink]}>
                          {event.contactEmail}
                        </Text>
                      </TouchableOpacity>
                    ) : null}

                    {event.contactPhone ? (
                      <TouchableOpacity style={styles.contactRow} onPress={handlePhonePress}>
                        <Ionicons name="call-outline" size={16 * scaleFactor} color="#486581" />
                        <Text style={[styles.contactText, styles.contactLink]}>
                          {event.contactPhone}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ) : null}

                {event.eventUrl ? (
                  <TouchableOpacity style={styles.linkButton} onPress={handleLinkPress}>
                    <Text style={styles.linkButtonText}>Saber mais</Text>
                    <Ionicons name="open-outline" size={16 * scaleFactor} color="#fff" />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const createStyles = (scaleFactor: number) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(16, 42, 67, 0.8)",
    },
    container: {
      flex: 1,
      width: "100%",
    },
    scroll: {
      flex: 1,
      width: "100%",
    },
    closeButton: {
      position: "absolute",
      top: 24 * scaleFactor,
      right: 20 * scaleFactor,
      zIndex: 2,
      width: 40 * scaleFactor,
      height: 40 * scaleFactor,
      borderRadius: 20 * scaleFactor,
      backgroundColor: "rgba(255,255,255,0.94)",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#102a43",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
    },
    body: {
      paddingTop: 68 * scaleFactor,
      paddingBottom: 40 * scaleFactor,
      paddingHorizontal: 20 * scaleFactor,
      alignItems: "center",
    },
    card: {
      width: "100%",
      maxWidth: 480 * scaleFactor,
      borderRadius: 20 * scaleFactor,
      overflow: "hidden",
      backgroundColor: "#fff",
      shadowColor: "#0b1f33",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.24,
      shadowRadius: 20,
      elevation: 12,
    },
    image: {
      width: "100%",
      aspectRatio: 16 / 9,
      backgroundColor: EVENTS_ACCENT_LIGHT,
    },
    imagePlaceholder: {
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      padding: 20 * scaleFactor,
    },
    title: {
      fontSize: 20 * scaleFactor,
      fontWeight: "700",
      color: "#102a43",
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10 * scaleFactor,
    },
    metaText: {
      fontSize: 14 * scaleFactor,
      color: "#334e68",
      marginLeft: 8 * scaleFactor,
    },
    summary: {
      fontSize: 14 * scaleFactor,
      color: "#52606d",
      lineHeight: 21 * scaleFactor,
      marginTop: 14 * scaleFactor,
      textAlign: "justify",
    },
    contactsSection: {
      marginTop: 20 * scaleFactor,
      paddingTop: 16 * scaleFactor,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: "#d9e2ec",
    },
    sectionLabel: {
      fontSize: 12 * scaleFactor,
      fontWeight: "700",
      color: "#7b8794",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 10 * scaleFactor,
    },
    contactRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8 * scaleFactor,
    },
    contactText: {
      fontSize: 14 * scaleFactor,
      color: "#334e68",
      marginLeft: 10 * scaleFactor,
    },
    contactLink: {
      color: "#3182CE",
      fontWeight: "500",
    },
    linkButton: {
      marginTop: 20 * scaleFactor,
      backgroundColor: EVENTS_ACCENT,
      borderRadius: 12 * scaleFactor,
      paddingVertical: 12 * scaleFactor,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8 * scaleFactor,
    },
    linkButtonText: {
      color: "#fff",
      fontSize: 15 * scaleFactor,
      fontWeight: "700",
      marginRight: 6 * scaleFactor,
    },
  });

export default EventDetailModal;
