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

  const [headlines, setHeadlines] = useState<string[]>(DEFAULT_HEADLINES);

  useEffect(() => {
    let mounted = true;

    const KEYS = {
      data: "latestHeadlines",
      ts: "latestHeadlinesTS",
      slot: SLOT_KEY,
      ver: "latestHeadlinesVER",
      src: "latestHeadlinesSRC", // "api" | "default"
    } as const;

    const CACHE_VERSION = "2"; // <- incrementa para invalidar versões antigas
    const TTL_MS = 30 * 60 * 1000; // 30 min (ajusta se quiseres)

    const readCache = async () => {
      try {
        const [ver, dataStr, tsStr, src] = await Promise.all([
          AsyncStorage.getItem(KEYS.ver),
          AsyncStorage.getItem(KEYS.data),
          AsyncStorage.getItem(KEYS.ts),
          AsyncStorage.getItem(KEYS.src),
        ]);
        const arr = dataStr ? (JSON.parse(dataStr) as string[]) : [];
        const ts = tsStr ? Number(tsStr) : NaN;
        return {
          arr: Array.isArray(arr) ? arr : [],
          ts: Number.isFinite(ts) ? ts : NaN,
          src: src ?? null,
          okVersion: ver === CACHE_VERSION,
        };
      } catch {
        return {
          arr: [],
          ts: NaN,
          src: null as string | null,
          okVersion: false,
        };
      }
    };

    const saveApiCache = async (arr: string[]) => {
      // só grava se for mesmo resultado da API e não default
      if (!arr.length || arr.join("|") === DEFAULT_HEADLINES.join("|")) return;
      await Promise.all([
        AsyncStorage.setItem(KEYS.data, JSON.stringify(arr)),
        AsyncStorage.setItem(KEYS.ts, String(Date.now())),
        AsyncStorage.setItem(KEYS.ver, CACHE_VERSION),
        AsyncStorage.setItem(KEYS.src, "api"),
      ]);
    };

    const clearCache = async () => {
      await AsyncStorage.multiRemove([
        KEYS.data,
        KEYS.ts,
        KEYS.slot,
        KEYS.ver,
        KEYS.src,
      ]);
    };

    const ensureFreshHeadlines = async () => {
      const now = new Date();
      const slotISO = latestSlotBefore(now).toISOString();
      const lastSlotISO = await AsyncStorage.getItem(KEYS.slot);

      // 0) ler cache
      const { arr: cached, ts, src, okVersion } = await readCache();

      // 1) MIGRAÇÃO: se alguma vez defaults foram guardados, limpa já
      const looksLikeDefault =
        cached.length > 0 && cached.join("|") === DEFAULT_HEADLINES.join("|");
      if (looksLikeDefault || !okVersion || src !== "api") {
        // trata tudo como 'sem cache API' e limpa
        await clearCache();
      }

      // 2) reavaliar depois de possível limpeza
      const after = await readCache();
      const hasApiCache = after.src === "api" && after.arr.length > 0;
      const ageMs = Number.isFinite(after.ts)
        ? Date.now() - (after.ts as number)
        : Infinity;

      // mostrar algo já: se tens cache API, usa-o, senão defaults
      if (hasApiCache) {
        if (mounted) setHeadlines(after.arr);
      } else {
        if (mounted) setHeadlines(DEFAULT_HEADLINES);
      }

      // 3) decidir fetch
      const slotChanged = lastSlotISO !== slotISO;
      const stale = ageMs > TTL_MS;

      // fetcha se: não tens cache API OU mudou o slot OU ficou stale
      if (!hasApiCache || slotChanged || stale || true) {
        const news = await fetchAgricultureNews();
        console.log("fetchou");

        if (news.length) {
          await saveApiCache(news); // grava só se veio da API
          await AsyncStorage.setItem(KEYS.slot, slotISO); // atualiza slot só com sucesso
          if (mounted) setHeadlines(news);
          return;
        }
        // Se falhou, NÃO atualiza TS nem SLOT: assim continua “stale” e volta a tentar no próximo foco/arranque
      }
    };

    ensureFreshHeadlines();

    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") ensureFreshHeadlines();
    });

    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

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
