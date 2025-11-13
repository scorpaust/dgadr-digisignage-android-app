// Script para testar o sistema de competências da DGADR
// Execute com: node scripts/test-competencias.js

console.log("🧪 Teste de Competências - DGADR\n");

// Perguntas dentro da competência da DGADR
const perguntasDGADR = [
  "Como obter o estatuto da agricultura familiar?",
  "Qual é a idade máxima para jovens agricultores?",
  "Como candidatar-me a apoios PRODERAM?",
  "Preciso informações sobre produção biológica",
  "Como pedir reembolso do gasóleo agrícola?",
  "Informações sobre emparcelamento de terras",
  "Apoios para modernização de explorações agrícolas",
];

// Perguntas fora da competência da DGADR
const perguntasExternas = [
  {
    pergunta: "Como fazer um furo para água?",
    entidade: "ARH (Administração da Região Hidrográfica)",
    motivo: "Domínio público hídrico",
  },
  {
    pergunta: "Onde submeter a declaração de área PAC?",
    entidade: "IFAP",
    motivo: "Parcelário e pagamentos",
  },
  {
    pergunta: "Como obter licença de caça?",
    entidade: "ICNF",
    motivo: "Conservação da natureza",
  },
  {
    pergunta: "Informações sobre quintas pedagógicas",
    entidade: "DGAV",
    motivo: "Veterinária e bem-estar animal",
  },
  {
    pergunta: "Como plantar vinha?",
    entidade: "IVV",
    motivo: "Vitivinicultura",
  },
  {
    pergunta: "Previsão meteorológica para agricultura",
    entidade: "IPMA",
    motivo: "Meteorologia",
  },
  {
    pergunta: "Candidatura a fundos Portugal 2030",
    entidade: "Portugal 2030",
    motivo: "Fundos europeus gerais",
  },
  {
    pergunta: "Como calcular pegada de carbono?",
    entidade: "GPP",
    motivo: "Alterações climáticas",
  },
];

console.log("✅ Perguntas DENTRO da competência da DGADR:");
perguntasDGADR.forEach((pergunta, index) => {
  console.log(`${index + 1}. "${pergunta}"`);
  console.log("   → Resposta: Informação específica + contacto DGADR");
});

console.log("\n❌ Perguntas FORA da competência da DGADR:");
perguntasExternas.forEach((item, index) => {
  console.log(`${index + 1}. "${item.pergunta}"`);
  console.log(`   → Entidade: ${item.entidade}`);
  console.log(`   → Motivo: ${item.motivo}`);
  console.log(
    `   → Resposta: "Essa questão não está dentro das competências da DGADR..."`
  );
});

console.log("\n🎯 Resposta Esperada para Perguntas Externas:");
console.log(
  '"Peço desculpa, mas essa questão não está dentro das competências da DGADR.'
);
console.log(
  "A DGADR apenas esclarece sobre assuntos relacionados com agricultura,"
);
console.log(
  "desenvolvimento rural, florestas, estruturação fundiária e apoios agrícolas"
);
console.log(
  'na região do Alentejo. Para a sua questão, deve contactar a entidade competente."'
);

console.log("\n📞 Contactos Externos Disponíveis:");
const contactosExternos = [
  "APA - Domínio Público Hídrico: 214 728 200",
  "IFAP - Parcelário e Pagamentos: 212 427 708",
  "ICNF - Conservação Natureza: 213 507 900",
  "DGAV - Veterinária: 213 239 500",
  "IVV - Vitivinicultura: 213 506 700",
  "IPMA - Meteorologia: 218 447 000",
  "INIAV - Investigação: 214 403 500",
  "GPP - Alterações Climáticas: 213 234 600",
  "Portugal 2030 - Fundos: 800 103 510",
];

contactosExternos.forEach((contacto) => {
  console.log(`• ${contacto}`);
});

console.log("\n🔍 Palavras-chave que Ativam Redirecionamento:");
const palavrasChave = [
  "Recursos hídricos: poço, furo, captação, domínio público hídrico",
  "Parcelário: parcelário, pagamento, candidatura PAC, IFAP",
  "Conservação: parque nacional, caça, pesca, espécie protegida",
  "Veterinária: quinta pedagógica, matadouro, transporte animais",
  "Vitivinicultura: vinho, vinha, denominação origem",
  "Meteorologia: previsão tempo, clima, dados meteorológicos",
  "Investigação: investigação, estudo, ensaio, variedade",
  "Fundos: Portugal 2030, FEDER, FSE",
  "Clima: alterações climáticas, carbono, emissões",
];

palavrasChave.forEach((categoria) => {
  console.log(`• ${categoria}`);
});

console.log("\n🚀 Para testar:");
console.log("1. Execute: npm start");
console.log('2. Abra "Pedidos de Informação"');
console.log("3. Teste perguntas da lista acima");
console.log("4. Verifique se:");
console.log("   ✅ Perguntas DGADR → Informação específica + contacto interno");
console.log(
  "   ❌ Perguntas externas → Mensagem competência + contacto externo"
);

console.log("\n📊 Benefícios do Sistema:");
console.log("✅ Evita confusão sobre competências");
console.log("✅ Direciona utilizadores para entidade correta");
console.log("✅ Melhora eficiência do atendimento");
console.log("✅ Reduz transferências desnecessárias");
console.log("✅ Fornece contactos específicos externos");
