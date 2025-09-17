// utils/fetchAgricultureNews.ts
import Constants from "expo-constants";
import { MEDIASTACK_API_KEY as ENV_KEY } from "@env";

type MSItem = { title?: string };
type MSResp =
  | { data?: MSItem[] }
  | { error?: { code?: number; type?: string; info?: string } };

function getKey(): string | undefined {
  const extra =
    (Constants.expoConfig?.extra ??
      (Constants as any).manifestExtra ??
      (Constants as any).manifest?.extra) ||
    {};
  return extra.mediaStackApiKey || ENV_KEY || undefined;
}

const Q = `languages=pt&countries=pt&keywords=agricultura&limit=20&sort=published_desc`;

/** Tenta HTTPS primeiro. Se vier erro típico do plano free (access_restricted)
 *  ou falhar a rede, tenta HTTP como fallback. */
export async function fetchAgricultureNews(): Promise<string[]> {
  const key = getKey();
  if (!key) {
    console.warn("[news] MEDIASTACK_API_KEY ausente (extra/.env).");
    return [];
  }

  const httpsUrl = `https://api.mediastack.com/v1/news?access_key=${key}&${Q}`;
  const httpUrl = `http://api.mediastack.com/v1/news?access_key=${key}&${Q}`;

  const tryOnce = async (url: string, label: string) => {
    try {
      const r = await fetch(url);
      const j = (await r.json()) as MSResp;
      if ((j as any)?.error) {
        console.warn(`[news] ${label} error:`, (j as any).error);
        return [] as string[];
      }
      const titles = Array.isArray((j as any)?.data)
        ? (((j as any).data as MSItem[])
            .map((i) => i?.title)
            .filter(Boolean) as string[])
        : [];
      return titles;
    } catch (e) {
      console.warn(`[news] ${label} fetch falhou:`, e);
      return [] as string[];
    }
  };

  // 1) HTTPS
  let titles = await tryOnce(httpsUrl, "HTTPS");
  // 2) Fallback HTTP se vazio
  if (!titles.length) {
    titles = await tryOnce(httpUrl, "HTTP");
  }
  if (!titles.length) {
    console.warn("[news] sem títulos após HTTPS/HTTP. A usar cache/default.");
  }
  return titles;
}
