import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
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
      {/*
        <Stack.Screen
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
        />
        */}
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
      sceneContainerStyle={{ flex: 1, paddingTop: insets.top }}
      screenOptions={{
        headerShown: false,
        tabBarIconStyle: {
          width: "100%",
        },
        tabBarStyle: {
          flexDirection: "row",
          height: 60 * scaleFactor,
          backgroundColor: "#7eda3b",
          paddingVertical: 10 * scaleFactor,
        },
        tabBarLabelStyle: {
          fontSize: 10 * scaleFactor,
          color: "#fff",
        },
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

  const [headlines, setHeadlines] = useState<string[]>([]);

  const loadHeadlines = async () => {
    const cached = await AsyncStorage.getItem("latestHeadlines");
    if (cached) setHeadlines(JSON.parse(cached));
    else {
      const fresh = await fetchAgricultureNews();
      setHeadlines(fresh);
      await AsyncStorage.setItem("latestHeadlines", JSON.stringify(fresh));
      await saveLastFetchTime();
    }
  };

  useEffect(() => {
    const tryCatchUp = async () => {
      const slotISO = latestSlotBefore(new Date()).toISOString();
      const lastSlotISO = await AsyncStorage.getItem(SLOT_KEY);
      if (lastSlotISO !== slotISO) {
        const news = await fetchAgricultureNews();
        await AsyncStorage.setItem("latestHeadlines", JSON.stringify(news));
        await AsyncStorage.setItem(SLOT_KEY, slotISO);
        setHeadlines(news);
      } else {
        const cached = await AsyncStorage.getItem("latestHeadlines");
        if (cached) setHeadlines(JSON.parse(cached));
      }
    };
    tryCatchUp();
    registerBackgroundFetch();
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
      {/*<View>
        {modalVisible && selectedEvent && (
          <Modal
            visible={modalVisible}
            transparent={true}
            onRequestClose={onCloseHandler}
          >
            <EventModal
              event={selectedEvent}
              onClose={onCloseHandler}
              onNext={() => setSelectedEventIndex(selectedEventIndex + 1)}
              onPrevious={() => setSelectedEventIndex(selectedEventIndex - 1)}
              showNext={showNext}
              showPrevious={showPrevious}
            />
          </Modal>
        )}
        </View>*/}
      <NavigationContainer>
        <TabScreen />
      </NavigationContainer>
      <NewsTicker headlines={headlines} speedPxPerSec={20} />
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
