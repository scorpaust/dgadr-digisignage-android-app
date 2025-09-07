// utils/fetchAgricultureNews.ts
import { MEDIASTACK_API_KEY } from "@env";
import Constants from "expo-constants";

function getExtra() {
  // DEV (expo run/start): expoConfig.extra
  // PROD (EAS build): manifestExtra (SDK 49+) ou manifest?.extra (SDK <49)
  return (
    Constants.expoConfig?.extra ??
    (Constants as any).manifestExtra ??
    (Constants as any).manifest?.extra ??
    {}
  );
}

const API_KEY: string | undefined = getExtra().mediaStackApiKey;

export const fetchAgricultureNews = async (): Promise<string[]> => {
  try {
    const res = await fetch(
      `https://api.mediastack.com/v1/news?access_key=${API_KEY}&languages=pt&countries=pt&keywords=agricultura&limit=10`
    );
    const json = await res.json();
    return json.data?.map((item: any) => item.title) || [];
  } catch (err) {
    console.error("Erro no fetch:", err);
    return [];
  }
};
