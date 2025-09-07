import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAgricultureNews } from "./fetchAgricultureNews";
import { latestSlotBefore, SLOT_KEY } from "./slots";

export const BACKGROUND_TASK = "fetch-agriculture-headlines";

if (!TaskManager.isTaskDefined(BACKGROUND_TASK)) {
  TaskManager.defineTask(BACKGROUND_TASK, async () => {
    try {
      const slot = latestSlotBefore(new Date());
      const slotISO = slot.toISOString();
      const lastSlotISO = await AsyncStorage.getItem(SLOT_KEY);

      if (lastSlotISO === slotISO) {
        return BackgroundFetch.BackgroundFetchResult.NoData; // já buscou este slot
      }

      const headlines = await fetchAgricultureNews();
      await AsyncStorage.setItem("latestHeadlines", JSON.stringify(headlines));
      await AsyncStorage.setItem(SLOT_KEY, slotISO);
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (e) {
      console.error("BG task error:", e);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });
}

export async function registerBackgroundFetch() {
  const ok = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK);
  if (!ok) {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
      minimumInterval: 15 * 60,
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }
}
