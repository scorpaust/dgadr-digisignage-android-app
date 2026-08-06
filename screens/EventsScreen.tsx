import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { FirebaseError } from "firebase/app";
import { firebase } from "../config";
import { useEvents } from "../utils/useEvents";
import { EventRecord } from "../types/event";
import EventHighlightCard from "../components/events/EventHighlightCard";
import EventListItem from "../components/events/EventListItem";
import EventDetailModal from "../components/events/EventDetailModal";
import InfoModal from "../components/InfoModal";
import { EVENTS_ACCENT } from "../components/events/eventsTheme";

const windowWidth = Dimensions.get("window").width;
const scaleFactor = windowWidth / 320;

const EventsScreen: React.FC = () => {
  const { events, loading, error: eventsError } = useEvents();
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [storageError, setStorageError] = useState<FirebaseError | undefined>(
    undefined
  );
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);

  const eventsWithImagePath = useMemo(
    () =>
      events
        .filter((event) => Boolean(event.imagePath))
        .map((event) => ({ id: event.id, path: event.imagePath as string })),
    [events]
  );

  const fetchImages = useCallback(async () => {
    if (!eventsWithImagePath.length) {
      setImageUrls({});
      return;
    }

    setStorageError(undefined);
    try {
      const storage = getStorage(
        firebase,
        "gs://dgadr-digisignage-app.appspot.com"
      );

      const entries = await Promise.all(
        eventsWithImagePath.map(async ({ id, path }) => {
          try {
            const downloadUrl = await getDownloadURL(ref(storage, path));
            return [id, downloadUrl] as const;
          } catch (imageError) {
            if (imageError instanceof FirebaseError) {
              setStorageError(imageError);
            }
            return null;
          }
        })
      );

      const validEntries = entries.filter(
        (entry): entry is readonly [string, string] => Boolean(entry)
      );

      setImageUrls(Object.fromEntries(validEntries));
    } catch (error) {
      if (error instanceof FirebaseError) {
        setStorageError(error);
      }
    }
  }, [eventsWithImagePath]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const { nextEvent, upcoming, past } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const withDates = events
      .map((event) => ({ event, date: new Date(event.startDate) }))
      .filter(({ date }) => !Number.isNaN(date.getTime()));

    const upcomingList = withDates
      .filter(({ date }) => date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(({ event }) => event);

    const pastList = withDates
      .filter(({ date }) => date < today)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map(({ event }) => event);

    return {
      nextEvent: upcomingList[0] ?? null,
      upcoming: upcomingList.slice(1),
      past: pastList,
    };
  }, [events]);

  const handleCloseStorageError = useCallback(
    () => setStorageError(undefined),
    []
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={EVENTS_ACCENT} />
        <Text style={styles.loadingText}>A carregar eventos...</Text>
      </View>
    );
  }

  if (eventsError) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Erro ao carregar eventos</Text>
        <Text style={styles.errorSubtext}>{eventsError}</Text>
      </View>
    );
  }

  if (!events.length) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="calendar-outline" size={56 * scaleFactor} color="#c9d3dd" />
        <Text style={styles.emptyText}>Não existem eventos de momento.</Text>
        <Text style={styles.emptySubtext}>
          Volte a consultar mais tarde para novidades sobre eventos.
        </Text>
      </View>
    );
  }

  return (
    <>
      {storageError ? (
        <InfoModal info={storageError} onClose={handleCloseStorageError} />
      ) : null}

      {selectedEvent ? (
        <EventDetailModal
          visible
          event={selectedEvent}
          imageUri={
            selectedEvent.imagePath ? imageUrls[selectedEvent.id] : undefined
          }
          onClose={() => setSelectedEvent(null)}
        />
      ) : null}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {nextEvent ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próximo Evento</Text>
            <Text style={styles.sectionSubtitle}>
              Fique a par do próximo evento em destaque.
            </Text>
            <View style={styles.highlightWrapper}>
              <EventHighlightCard
                event={nextEvent}
                imageUri={imageUrls[nextEvent.id]}
                onPress={() => setSelectedEvent(nextEvent)}
              />
            </View>
          </View>
        ) : null}

        {upcoming.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Outros Eventos Agendados</Text>
            <View style={styles.listWrapper}>
              {upcoming.map((event) => (
                <EventListItem
                  key={event.id}
                  event={event}
                  imageUri={imageUrls[event.id]}
                  onPress={() => setSelectedEvent(event)}
                />
              ))}
            </View>
          </View>
        ) : null}

        {past.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Eventos Anteriores</Text>
            <View style={styles.listWrapper}>
              {past.map((event) => (
                <EventListItem
                  key={event.id}
                  event={event}
                  imageUri={imageUrls[event.id]}
                  onPress={() => setSelectedEvent(event)}
                  past
                />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  contentContainer: {
    paddingHorizontal: 20 * scaleFactor,
    paddingVertical: 24 * scaleFactor,
  },
  section: {
    marginBottom: 32 * scaleFactor,
  },
  sectionTitle: {
    fontSize: 22 * scaleFactor,
    fontWeight: "700",
    color: "#102a43",
  },
  sectionSubtitle: {
    marginTop: 6 * scaleFactor,
    fontSize: 14 * scaleFactor,
    color: "#52606d",
  },
  highlightWrapper: {
    marginTop: 20 * scaleFactor,
  },
  listWrapper: {
    marginTop: 12 * scaleFactor,
    backgroundColor: "#fff",
    borderRadius: 16 * scaleFactor,
    paddingHorizontal: 14 * scaleFactor,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32 * scaleFactor,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#52606d",
  },
  errorText: {
    fontSize: 18 * scaleFactor,
    fontWeight: "600",
    color: "#e53e3e",
    textAlign: "center",
  },
  errorSubtext: {
    marginTop: 8 * scaleFactor,
    fontSize: 14 * scaleFactor,
    color: "#52606d",
    textAlign: "center",
  },
  emptyText: {
    marginTop: 16 * scaleFactor,
    fontSize: 17 * scaleFactor,
    fontWeight: "600",
    color: "#334e68",
    textAlign: "center",
  },
  emptySubtext: {
    marginTop: 8 * scaleFactor,
    fontSize: 14 * scaleFactor,
    color: "#7b8794",
    textAlign: "center",
  },
});

export default EventsScreen;
