// utils/fetchAgricultureNews.ts
import { MEDIASTACK_API_KEY } from "@env";

export const fetchAgricultureNews = async (): Promise<string[]> => {
  try {
    const res = await fetch(
      `https://api.mediastack.com/v1/news?access_key=${MEDIASTACK_API_KEY}&languages=pt&countries=pt&keywords=agricultura&limit=10`
    );
    const json = await res.json();
    return json.data?.map((item: any) => item.title) || [];
  } catch (err) {
    console.error("Erro no fetch:", err);
    return [];
  }
};
