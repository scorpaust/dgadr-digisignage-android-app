// utils/asyncStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "lastFetchTime";

export const saveLastFetchTime = async () => {
  await AsyncStorage.setItem(KEY, new Date().toISOString());
};

export const getLastFetchTime = async (): Promise<Date | null> => {
  const value = await AsyncStorage.getItem(KEY);
  return value ? new Date(value) : null;
};
