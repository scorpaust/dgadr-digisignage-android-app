import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AppState,
  Dimensions,
  Image,
  Modal,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import BackButton from "./components/ui/BackButton";
import ComplaintScreen from "./screens/ComplaintScreen";
import MenuScreen from "./screens/MenuScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MediaScreen from "./screens/MediaScreen";
import DateTimeComponent from "./components/DateTimeComponent";
import UsefulLinksScreen from "./screens/UsefulLinksScreen";
import OrganogramScreen from "./screens/OrganogramScreen";
import EventsScreen from "./screens/EventsScreen";
import NotificationScheduler from "./components/notifications/NotificationScheduler";
import { useEffect, useState } from "react";
import {
  EventModal,
  eventsData,
  getUpcomingEvents,
} from "./components/events/EventModal";
import ProjectsScreen from "./screens/ProjectsScreen";
import { fetchAgricultureNews } from "./utils/fetchAgricultureNews";
import { registerBackgroundFetch } from "./utils/backgroundFetch";
import { NewsTicker } from "./components/news/NewsTicker";
import { getLastFetchTime, saveLastFetchTime } from "./utils/asyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { latestSlotBefore, SLOT_KEY } from "./utils/slots";
import { DEFAULT_HEADLINES } from "./utils/defaultHeadlines";
import LibFeatScreen from "./screens/LibFeatScreen";

const windowWidth = Dimensions.get("window").width;
const scaleFactor = windowWidth / 320;

const windowHeight = Dimensions.get("window").height;
const hScaleFactor = windowHeight / 320;

function padding(
  a: string,
  b: string,
  c: string,
  d: string
): StyleProp<ViewStyle> {
  return {
    paddingTop: a,
    paddingRight: b !== undefined ? b : a,
    paddingBottom: c !== undefined ? c : a,
    paddingLeft: d !== undefined ? d : b !== undefined ? b : a,
  } as StyleProp<ViewStyle>;
}

const TICKER_HEIGHT = 32 * scaleFactor; // px

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

// Define Stack Screens
function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MenuScreen"
        component={MenuScreen}
        options={{
          headerTitle: () => (
            <View style={{ padding: "5%" }}>
              <Image
                style={{ width: 110 * scaleFactor, height: 30 * scaleFactor }}
                source={require("./assets/dgadr-logo.png")}
              />
            </View>
          ),
          headerBackVisible: false,
          headerRight: () => <DateTimeComponent />,
        }}
      />
      <Stack.Screen
        name="ScheduleScreen"
        component={ScheduleScreen}
        options={{
          title: "Horário",
          headerLeft: () => <BackButton />,
          headerTitleStyle: {
            fontSize: 24 * scaleFactor,
          },
          headerBackVisible: false,
        }}
      />
      {/*<Stack.Screen name="MissionScreen" component={MissionScreen} options={{
          title: 'DGADR',
          headerLeft: () => <BackButton />,
          headerTitleStyle: {
            fontSize: 24 * scaleFactor
          },
          headerBackVisible: false,
        }} />*/}
      <Stack.Screen
        name="MediaScreen"
        component={MediaScreen}
        options={{
          title: "Galeria",
          headerLeft: () => <BackButton />,
          headerTitleStyle: {
            fontSize: 24 * scaleFactor,
          },
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="LibFeatScreen"
        component={LibFeatScreen}
        options={{
          title: "Destaques da Biblioteca",
          headerLeft: () => <BackButton />,
          headerTitleStyle: {
            fontSize: 24 * scaleFactor,
          },
          headerBackVisible: false,
        }}
      />

      {/*<Stack.Screen
        name="OrganogramScreen"
        component={OrganogramScreen}
        options={{
          title: "Organograma",
          headerLeft: () => <BackButton />,
          headerTitleStyle: {
            fontSize: 24 * scaleFactor,
          },
          headerBackVisible: false,
        }}
      />*/}

      <Stack.Screen
        name="ComplaintScreen"
        component={ComplaintScreen}
        options={{
          title: "Livro de Reclamações",
          headerLeft: () => <BackButton />,
          headerTitleStyle: {
            fontSize: 24 * scaleFactor,
          },
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="ProjectsScreen"
        component={ProjectsScreen}
        options={{
          title: "Projetos Cofinanciados",
          headerLeft: () => <BackButton />,
          headerTitleStyle: {
            fontSize: 24 * scaleFactor,
          },
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="UsefulLinksScreen"
        component={UsefulLinksScreen}
        options={{
          title: "As Nossas Ligações",
          headerLeft: () => <BackButton />,
          headerTitleStyle: {
            fontSize: 24 * scaleFactor,
          },
          headerBackVisible: false,
        }}
      />
      {/*{
        <Stack.Screen
          name="EventsScreen"
          component={EventsScreen}
          options={{
            title: "Eventos",
            headerLeft: () => <BackButton />,
            headerTitleStyle: {
              fontSize: 24 * scaleFactor,
            },
            headerBackVisible: false,
          }}
        />
      }*/}
    </Stack.Navigator>
  );
}

function TabScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Menu"
      sceneContainerStyle={{
        flex: 1,
        paddingTop: insets.top,
        // dá espaço para conteúdo não ficar escondido pela tab bar + ticker
        paddingBottom: 60 * scaleFactor + TICKER_HEIGHT + insets.bottom,
      }}
      screenOptions={{
        headerShown: false,
        tabBarIconStyle: { width: "100%" },
        tabBarStyle: {
          flexDirection: "row",
          height: 60 * scaleFactor,
          backgroundColor: "#7eda3b",
          paddingVertical: 10 * scaleFactor,
          // move a tab bar para cima, deixando o ticker no fundo
          position: "absolute",
          bottom: TICKER_HEIGHT + insets.bottom,
        },
        tabBarLabelStyle: { fontSize: 10 * scaleFactor, color: "#fff" },
        tabBarLabelPosition: "below-icon",
      }}
    >
      {/*<Tab.Screen name="Missao" component={MissionScreen} options={{
          tabBarIcon: () => <Ionicons name="business-outline" style={styles.icon} size={20 * scaleFactor} color="black" />,
          tabBarLabel: "DGADR",          
        }} />*/}
      {/*<Tab.Screen
        name="Organograma"
        component={OrganogramScreen}
        options={{
          tabBarIcon: () => (
            <SimpleLineIcons
              name="organization"
              style={styles.icon}
              size={20 * scaleFactor}
              color="black"
            />
          ),
          tabBarLabel: "",
        }}
      />*/}
      <Tab.Screen
        name="MediaScreen"
        component={MediaScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons
              name="images"
              style={styles.icon}
              size={20 * scaleFactor}
              color="black"
            />
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="LibFeatScreen"
        component={LibFeatScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons
              name="barcode"
              style={styles.icon}
              size={20 * scaleFactor}
              color="black"
            />
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="ScheduleScreen"
        component={ScheduleScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons
              name="time-outline"
              style={styles.icon}
              size={20 * scaleFactor}
              color="black"
            />
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="ComplaintScreen"
        component={ComplaintScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons
              name="book-outline"
              style={styles.icon}
              size={20 * scaleFactor}
              color="black"
            />
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="ProjectsScreen"
        component={ProjectsScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons
              name="documents"
              style={styles.icon}
              size={20 * scaleFactor}
              color="black"
            />
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Menu"
        component={StackScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons
              name="menu-sharp"
              style={styles.icon}
              size={20 * scaleFactor}
              color="black"
            />
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="UsefulLinksScreen"
        component={UsefulLinksScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons
              name="link"
              style={styles.icon}
              size={20 * scaleFactor}
              color="black"
            />
          ),
          tabBarLabel: "",
        }}
      />
      {/*{
        <Tab.Screen
          name="EventsScreen"
          component={EventsScreen}
          options={{
            tabBarIcon: () => (
              <Ionicons
                name="calendar-outline"
                style={styles.icon}
                size={20 * scaleFactor}
                color="black"
              />
            ),
            tabBarLabel: "",
          }}
        />
      }*/}
    </Tab.Navigator>
  );
}

export default function App() {
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // dentro do teu App.tsx
  // ...
  const [headlines, setHeadlines] = useState<string[]>(DEFAULT_HEADLINES);

  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const KEYS = {
      data: "latestHeadlines",
      ts: "latestHeadlinesTS",
      ver: "latestHeadlinesVER",
      src: "latestHeadlinesSRC", // "api"
      lastSlot: "latestHeadlinesSLOT", // ISO do último slot processado
    } as const;

    const CACHE_VERSION = "6"; // sobe se quiseres invalidar caches antigos

    const SLOT_HOURS = [10, 13]; // 10:00 e 13:00 (hora local do device)

    // util: ler/escrever cache só quando vem da API
    const readCache = async () => {
      try {
        const [ver, dataStr, src] = await Promise.all([
          AsyncStorage.getItem(KEYS.ver),
          AsyncStorage.getItem(KEYS.data),
          AsyncStorage.getItem(KEYS.src),
        ]);
        const arr = dataStr ? (JSON.parse(dataStr) as string[]) : [];
        const ok = ver === CACHE_VERSION && src === "api" && arr.length > 0;
        return ok ? arr : [];
      } catch {
        return [];
      }
    };
    const saveApiCache = async (arr: string[]) => {
      if (!arr.length) return; // nunca gravar vazio/defaults
      await Promise.all([
        AsyncStorage.setItem(KEYS.data, JSON.stringify(arr)),
        AsyncStorage.setItem(KEYS.ts, String(Date.now())),
        AsyncStorage.setItem(KEYS.ver, CACHE_VERSION),
        AsyncStorage.setItem(KEYS.src, "api"),
      ]);
    };

    // slots: última ocorrência (<= agora) e próxima (> agora)
    const atHour = (base: Date, hour: number) => {
      const d = new Date(base);
      d.setHours(hour, 0, 0, 0);
      return d;
    };
    const latestSlotBefore = (now: Date) => {
      const today10 = atHour(now, SLOT_HOURS[0]);
      const today13 = atHour(now, SLOT_HOURS[1]);
      if (now >= today13) return today13;
      if (now >= today10) return today10;
      // ontem 13:00
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      return atHour(y, SLOT_HOURS[1]);
    };
    const nextSlotAfter = (now: Date) => {
      const today10 = atHour(now, SLOT_HOURS[0]);
      const today13 = atHour(now, SLOT_HOURS[1]);
      if (now < today10) return today10;
      if (now < today13) return today13;
      // amanhã 10:00
      const t = new Date(now);
      t.setDate(t.getDate() + 1);
      return atHour(t, SLOT_HOURS[0]);
    };

    // compara arrays de títulos (ordem importa)
    const sameHeadlines = (a: string[], b: string[]) =>
      a.length === b.length && a.every((v, i) => v === b[i]);

    const scheduleNext = () => {
      const now = new Date();
      const next = nextSlotAfter(now);
      const ms = Math.max(500, next.getTime() - now.getTime());
      if (timer) clearTimeout(timer);
      timer = setTimeout(runIfNewSlot, ms);
      // console.log("[news] next slot @", next.toLocaleString(), "in", Math.round(ms/1000), "s");
    };

    const runIfNewSlot = async () => {
      if (!mounted) return;
      const now = new Date();
      const slot = latestSlotBefore(now).toISOString();
      const lastSlot = await AsyncStorage.getItem(KEYS.lastSlot);

      // já processado este slot? então só agenda o próximo
      if (lastSlot === slot) {
        scheduleNext();
        return;
      }

      // tenta fetch
      const fresh = await fetchAgricultureNews();

      if (fresh.length) {
        const cached = await readCache();
        if (!sameHeadlines(fresh, cached)) {
          await saveApiCache(fresh);
          if (mounted) setHeadlines(fresh);
        }
        // marca slot processado (houve resposta da API, com ou sem mudança)
        await AsyncStorage.setItem(KEYS.lastSlot, slot);
      } else {
        // sem dados (falha/erro) → não marca slot; volta a tentar quando app focar
        // (opcional) podes re-tentar passado uns minutos:
        // setTimeout(runIfNewSlot, 5 * 60 * 1000);
      }

      scheduleNext();
    };

    (async () => {
      // mostra já algo: cache válido se existir, senão defaults
      const cached = await readCache();
      if (cached.length) setHeadlines(cached);
      else setHeadlines(DEFAULT_HEADLINES);

      // dispara lógica do slot imediatamente (caso já estejamos depois das 10/13 e ainda não processado)
      runIfNewSlot();
    })();

    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") runIfNewSlot();
    });

    return () => {
      mounted = false;
      sub.remove();
      if (timer) clearTimeout(timer);
    };
  }, []);
  // ...

  const upcomingEvents = getUpcomingEvents(eventsData);

  useEffect(() => {
    if (upcomingEvents.length > 0) {
      setModalVisible(true);
    }
  }, []);

  const onCloseHandler = () => {
    setModalVisible(false);
  };

  const showNext =
    selectedEventIndex !== null &&
    selectedEventIndex < upcomingEvents.length - 1;
  const showPrevious = selectedEventIndex !== null && selectedEventIndex > 0;

  const selectedEvent =
    selectedEventIndex !== null ? upcomingEvents[selectedEventIndex] : null;

  return (
    <SafeAreaProvider>
      <NotificationScheduler />
      <View style={{ flex: 1 }}>
        <NavigationContainer>
          <TabScreen />
        </NavigationContainer>

        {/* Ticker fixo no fundo */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
          }}
        >
          <NewsTicker headlines={headlines} speedPxPerSec={20} />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: "#fff",
  },
  titleImg: {
    ...(padding("5%", "5%", "5%", "5%") as ViewStyle),
  },
  tabNav: {
    height: 65 * scaleFactor,
    elevation: 8,
    shadowColor: "black",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
  },
});
