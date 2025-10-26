// This file is deprecated - newsletters are now loaded from Firebase
// Use the useNewsletters hook or newsletterService instead

import { NewsletterCollection } from "../types/newsletter";

// Fallback data for development/offline use
export const FALLBACK_NEWSLETTER_COLLECTIONS: NewsletterCollection[] = [
  {
    id: "raiz-digital",
    name: "Newsletter Raiz.Digital",
    color: "#3F51B5",
    issues: [
      {
        id: "raiz-digital-2025-09",
        title: "Setembro com marcos de aceleração",
        description:
          "Lançado o Portal Raiz.Digital, com notícias, calendário e materiais. Novas demonstrações e períodos de teste do CC+ ocorrem no fim de cada mês até dezembro. Uma transformação para aproximar o Ministério da Agricultura e Mar.",
        publishedAt: "2025-09-25",
        url: "",
        coverImagePath: "newsletters/raiz_digital/raiz_digital_2025_09_25.png",
      },
      {
        id: "raiz-digital-2025-10",
        title: "Um Ministério mais digital, acessível e próximo!",
        description:
          "De setembro a outubro, o RAIZ.Digital continua a avançar com novos marcos, reforçando a colaboração entre equipas e o compromisso com uma administração pública mais moderna, integrada e centrada nas pessoas.",
        publishedAt: "2025-10-23",
        url: "",
        coverImagePath: "newsletters/raiz_digital/raiz_digital_2025_10_23.png",
      },
    ],
  },
];

// For backwards compatibility - use useNewsletters hook instead
export const NEWSLETTER_COLLECTIONS = FALLBACK_NEWSLETTER_COLLECTIONS;
