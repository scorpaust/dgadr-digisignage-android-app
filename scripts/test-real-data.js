// Script para testar os dados reais da DGADR
// Execute com: node scripts/test-real-data.js

console.log("🧪 Teste de Dados Reais - DGADR\n");

// Simula perguntas típicas dos utilizadores
const testQueries = [
  {
    query: "Qual é a idade máxima para jovens agricultores?",
    expectedKeywords: ["jovens"],
    expectedContact: "jovens.agricultores@dgadr.gov.pt",
  },
  {
    query: "Como obter o estatuto da agricultura familiar?",
    expectedKeywords: ["familiar"],
    expectedContact: "saaf@dgadr.gov.pt",
  },
  {
    query: "Preciso licença para cortar eucaliptos?",
    expectedKeywords: ["florestal"],
    expectedContact: "licencas.florestais@dgadr.gov.pt",
  },
  {
    query: "Como reportar doença nos bovinos?",
    expectedKeywords: ["animal"],
    expectedContact: "sanidade.animal@dgadr.gov.pt",
  },
  {
    query: "Certificado fitossanitário para exportação?",
    expectedKeywords: ["vegetal"],
    expectedContact: "fitossanitario@dgadr.gov.pt",
  },
];

console.log("📋 Perguntas de Teste:\n");

testQueries.forEach((test, index) => {
  console.log(`${index + 1}. "${test.query}"`);
  console.log(`   Keywords esperadas: ${test.expectedKeywords.join(", ")}`);
  console.log(`   Contacto esperado: ${test.expectedContact}`);
  console.log("");
});

console.log("✅ Funcionalidades Implementadas:");
console.log("• RealDataService - Dados específicos da DGADR");
console.log("• 25+ contactos especializados por área");
console.log("• Procedimentos detalhados com prazos reais");
console.log("• Legislação atualizada por tópico");
console.log("• Integração com OpenAI para respostas precisas");
console.log("• Fallback robusto se APIs falharem");

console.log("\n🎯 Exemplo de Resposta Esperada:");
console.log('Pergunta: "Qual é a idade máxima para jovens agricultores?"');
console.log(
  'Resposta: "A idade máxima para jovens agricultores é 40 anos. O apoio à primeira instalação pode chegar a 70.000€ com taxa de 60%. É necessário elaborar um plano empresarial e implementar o projeto em 18 meses. Contacto: jovens.agricultores@dgadr.gov.pt | 291 145 322"'
);

console.log("\n📞 Contactos Especializados Disponíveis:");
const specializedContacts = [
  "Jovens Agricultores: jovens.agricultores@dgadr.gov.pt",
  "PRODERAM: proderam@dgadr.gov.pt",
  "Agricultura Biológica: biologica@dgadr.gov.pt",
  "Licenciamento Florestal: licencas.florestais@dgadr.gov.pt",
  "Certificação Fitossanitária: fitossanitario@dgadr.gov.pt",
  "Sanidade Animal: sanidade.animal@dgadr.gov.pt",
  "Segurança Alimentar: seguranca.alimentar@dgadr.gov.pt",
  "Sistema SAAF: saaf@dgadr.gov.pt",
  "Produtos Tradicionais: tradicional@dgadr.gov.pt",
  "Turismo Rural: turismo.rural@dgadr.gov.pt",
];

specializedContacts.forEach((contact) => {
  console.log(`• ${contact}`);
});

console.log("\n🚀 Para testar:");
console.log("1. Execute: npm start");
console.log('2. Abra "Pedidos de Informação"');
console.log("3. Faça uma das perguntas de teste acima");
console.log(
  "4. Verifique se a resposta inclui dados específicos e contacto correto"
);

console.log("\n📊 Métricas de Sucesso:");
console.log("✅ Resposta específica (não genérica)");
console.log("✅ Contacto especializado correto");
console.log("✅ Procedimento detalhado (se aplicável)");
console.log("✅ Prazos e valores concretos");
console.log("✅ Legislação relevante (se aplicável)");
