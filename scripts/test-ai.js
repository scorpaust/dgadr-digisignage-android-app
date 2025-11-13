// Script de teste para verificar se a IA está configurada corretamente
// Execute com: node scripts/test-ai.js

const fs = require("fs");
const path = require("path");

console.log("🧪 Teste de Configuração da IA - DGADR\n");

// 1. Verificar dependências
console.log("📦 Verificando dependências...");
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const requiredDeps = ["expo-file-system", "expo-linking"];

requiredDeps.forEach((dep) => {
  if (packageJson.dependencies[dep]) {
    console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`❌ ${dep}: NÃO INSTALADO`);
  }
});

// 2. Verificar ficheiros de configuração
console.log("\n⚙️ Verificando configuração...");

const configFiles = [
  "config/ai.ts",
  "services/AIService.ts",
  "services/OpenAIService.ts",
  "services/ExcelService.ts",
  "services/KnowledgeBaseService.ts",
];

configFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file}: NÃO ENCONTRADO`);
  }
});

// 3. Verificar ficheiro .env
console.log("\n🔑 Verificando configuração da API...");
if (fs.existsSync(".env")) {
  const envContent = fs.readFileSync(".env", "utf8");
  if (envContent.includes("EXPO_PUBLIC_OPENAI_API_KEY")) {
    console.log("✅ Ficheiro .env encontrado com chave OpenAI");
  } else {
    console.log("⚠️ Ficheiro .env encontrado mas sem chave OpenAI");
  }
} else {
  console.log("⚠️ Ficheiro .env não encontrado");
  console.log("💡 Crie o ficheiro .env baseado no .env.example");
}

// 4. Verificar base de conhecimento
console.log("\n📚 Verificando base de conhecimento...");
const knowledgeFiles = [
  "fonte_conhecimento_ai/Central_telefonica_2025_atualizado_05_09_2025.xlsx",
  "fonte_conhecimento_ai/links.txt",
];

knowledgeFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`⚠️ ${file}: NÃO ENCONTRADO (usará dados padrão)`);
  }
});

// 5. Verificar integração no menu
console.log("\n🎯 Verificando integração...");
const menuItems = fs.readFileSync("data/menu-items.ts", "utf8");
if (menuItems.includes("Pedidos de Informação")) {
  console.log("✅ Item adicionado ao menu");
} else {
  console.log("❌ Item não encontrado no menu");
}

const appTsx = fs.readFileSync("App.tsx", "utf8");
if (appTsx.includes("InformationRequestScreen")) {
  console.log("✅ Tela adicionada à navegação");
} else {
  console.log("❌ Tela não encontrada na navegação");
}

console.log("\n🎉 Teste concluído!");
console.log("\n📋 Próximos passos:");
console.log("1. Configure a chave da OpenAI no ficheiro .env");
console.log("2. Execute: npm start");
console.log('3. Teste a funcionalidade "Pedidos de Informação"');
console.log("4. Verifique os logs para confirmar que está a funcionar");
console.log("\n📖 Consulte CONFIGURACAO_IA.md para instruções detalhadas");
