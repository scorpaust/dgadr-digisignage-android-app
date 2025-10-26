# Configuração das Newsletters no Firebase

## 1. Aceder ao Firebase Console

1. Vai ao [Firebase Console](https://console.firebase.google.com/)
2. Seleciona o teu projeto: `dgadr-digisignage-app`
3. No menu lateral, clica em **Realtime Database**

## 2. Estrutura dos Dados

Os dados devem ser organizados da seguinte forma na Realtime Database:

```
newsletters/
├── raiz-digital/
│   ├── id: "raiz-digital"
│   ├── name: "Newsletter Raiz.Digital"
│   ├── color: "#3F51B5"
│   └── issues/
│       ├── raiz-digital-2025-09/
│       │   ├── id: "raiz-digital-2025-09"
│       │   ├── title: "Setembro com marcos de aceleração"
│       │   ├── description: "Lançado o Portal Raiz.Digital..."
│       │   ├── publishedAt: "2025-09-25"
│       │   ├── url: ""
│       │   └── coverImagePath: "newsletters/raiz_digital/raiz_digital_2025_09_25.png"
│       └── raiz-digital-2025-10/
│           ├── id: "raiz-digital-2025-10"
│           ├── title: "Um Ministério mais digital..."
│           ├── description: "De setembro a outubro..."
│           ├── publishedAt: "2025-10-23"
│           ├── url: ""
│           └── coverImagePath: "newsletters/raiz_digital/raiz_digital_2025_10_23.png"
└── [outras-newsletters]/
    └── ...
```

## 3. Migração Automática dos Dados Existentes

Para migrar os dados existentes automaticamente:

1. **Opção A - Via código (recomendado):**

   ```typescript
   import { migrateNewslettersToFirebase } from "./utils/migrateNewslettersToFirebase";

   // Chama esta função uma vez para migrar os dados
   migrateNewslettersToFirebase();
   ```

2. **Opção B - Manual no Firebase Console:**
   - Vai à Realtime Database
   - Clica no ícone "+" ao lado da raiz
   - Adiciona a chave: `newsletters`
   - Copia e cola a estrutura JSON abaixo

## 4. JSON para Importação Manual

Se preferires importar manualmente, usa este JSON:

```json
{
  "newsletters": {
    "raiz-digital": {
      "id": "raiz-digital",
      "name": "Newsletter Raiz.Digital",
      "color": "#3F51B5",
      "issues": {
        "raiz-digital-2025-09": {
          "id": "raiz-digital-2025-09",
          "title": "Setembro com marcos de aceleração",
          "description": "Lançado o Portal Raiz.Digital, com notícias, calendário e materiais. Novas demonstrações e períodos de teste do CC+ ocorrem no fim de cada mês até dezembro. Uma transformação para aproximar o Ministério da Agricultura e Mar.",
          "publishedAt": "2025-09-25",
          "url": "",
          "coverImagePath": "newsletters/raiz_digital/raiz_digital_2025_09_25.png"
        },
        "raiz-digital-2025-10": {
          "id": "raiz-digital-2025-10",
          "title": "Um Ministério mais digital, acessível e próximo!",
          "description": "De setembro a outubro, o RAIZ.Digital continua a avançar com novos marcos, reforçando a colaboração entre equipas e o compromisso com uma administração pública mais moderna, integrada e centrada nas pessoas.",
          "publishedAt": "2025-10-23",
          "url": "",
          "coverImagePath": "newsletters/raiz_digital/raiz_digital_2025_10_23.png"
        }
      }
    }
  }
}
```

## 5. Adicionar Novas Newsletters

### Via Código (Recomendado)

```typescript
import {
  addNewsletterCollection,
  addNewsletterIssue,
} from "./utils/migrateNewslettersToFirebase";

// Adicionar nova coleção
await addNewsletterCollection({
  id: "nova-newsletter",
  name: "Nova Newsletter",
  color: "#FF5722",
});

// Adicionar nova edição
await addNewsletterIssue("raiz-digital", {
  id: "raiz-digital-2025-11",
  title: "Novembro em destaque",
  description: "Descrição da edição de novembro...",
  publishedAt: "2025-11-25",
  url: "https://link-para-newsletter.com",
  coverImagePath: "newsletters/raiz_digital/raiz_digital_2025_11_25.png",
});
```

### Via Firebase Console

1. Navega até `newsletters/`
2. Para nova coleção:

   - Clica no "+" ao lado de `newsletters`
   - Adiciona o ID da coleção como chave
   - Adiciona os campos: `id`, `name`, `color`, `issues: {}`

3. Para nova edição:
   - Navega até `newsletters/[collection-id]/issues/`
   - Clica no "+" ao lado de `issues`
   - Adiciona o ID da edição como chave
   - Adiciona todos os campos da edição

## 6. Regras de Segurança

Adiciona estas regras na aba "Rules" da Realtime Database:

```json
{
  "rules": {
    "newsletters": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

## 7. Verificar se Funciona

Depois de configurar os dados:

1. Abre a app
2. Navega para o ecrã das newsletters
3. Deves ver os dados carregados do Firebase
4. Se houver problemas, verifica a consola do browser/app para erros

## 8. Vantagens do Novo Sistema

- ✅ **Atualizações em tempo real**: Mudanças no Firebase aparecem imediatamente na app
- ✅ **Sem necessidade de rebuild**: Adiciona newsletters sem recompilar a app
- ✅ **Gestão centralizada**: Todos os dados num só local
- ✅ **Backup automático**: Firebase faz backup dos dados
- ✅ **Escalabilidade**: Suporta muitas newsletters e edições
- ✅ **Offline support**: A app funciona mesmo sem internet (com dados em cache)

## 9. Troubleshooting

### Erro: "Permission denied"

- Verifica as regras de segurança na Realtime Database
- Confirma que `.read: true` está definido para `newsletters`

### Dados não aparecem

- Verifica se a estrutura JSON está correta
- Confirma que o `databaseURL` no `config.ts` está correto
- Verifica a consola para erros de rede

### Imagens não carregam

- Confirma que as imagens estão no Firebase Storage
- Verifica se os caminhos em `coverImagePath` estão corretos
- Confirma as permissões do Storage
