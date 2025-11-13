# Configuração da IA Avançada - DGADR

## 🚀 Melhorias Implementadas

### ✅ OpenAI GPT-4o-mini

- **IA real** em vez de palavras-chave básicas
- **Conversas contextuais** com memória
- **Respostas naturais** e personalizadas
- **Fallback automático** se a API falhar

### ✅ Carregamento do Excel

- **Contactos dinâmicos** do ficheiro Excel
- **Parsing automático** de colunas
- **Matching inteligente** por departamento
- **Fallback** para contactos padrão

### ✅ Base de Conhecimento Expandida

- **Carregamento dos ficheiros** da pasta fonte_conhecimento_ai
- **Links dinâmicos** do ficheiro links.txt
- **Conhecimento detalhado** sobre todos os serviços da DGADR

## 📋 Configuração Necessária

### 1. Chave da OpenAI

**Obter chave:**

1. Aceda a https://platform.openai.com/api-keys
2. Crie uma conta ou faça login
3. Gere uma nova API key
4. Copie a chave (começa com `sk-`)

**Configurar na aplicação:**

**Opção A - Ficheiro .env (Recomendado):**

```bash
# Crie o ficheiro .env na raiz do projeto
EXPO_PUBLIC_OPENAI_API_KEY=sk-sua-chave-aqui
```

**Opção B - Diretamente no código:**

```typescript
// Em config/ai.ts, substitua:
OPENAI_API_KEY: "sk-sua-chave-aqui";
```

### 2. Estrutura de Ficheiros

Certifique-se que existe:

```
fonte_conhecimento_ai/
├── Central_telefonica_2025_atualizado_05_09_2025.xlsx
└── links.txt
```

### 3. Formato do Excel

O ficheiro Excel deve ter colunas com nomes similares a:

- **Nome/Responsável**: Nome do contacto
- **Departamento/Divisão**: Departamento/serviço
- **Telefone/Tel**: Número de telefone
- **Email/E-mail**: Endereço de email

## 🔧 Como Funciona

### Sistema Híbrido

1. **Tenta OpenAI primeiro** (se configurada)
2. **Fallback para IA básica** se houver erro
3. **Sempre funciona** mesmo sem internet/API

### Processamento Inteligente

1. **Analisa a pergunta** com IA avançada
2. **Consulta base de conhecimento** expandida
3. **Encontra contactos relevantes** do Excel
4. **Sugere links úteis** automaticamente

### Memória Contextual

- **Lembra conversas anteriores** (últimas 10 interações)
- **Respostas mais precisas** baseadas no contexto
- **Conversas naturais** como com humano

## 💰 Custos da OpenAI

### GPT-4o-mini (Modelo Usado)

- **Muito económico**: ~$0.15 por 1M tokens de input
- **Eficiente**: ~$0.60 por 1M tokens de output
- **Exemplo**: 1000 perguntas ≈ $1-2 USD

### Controlo de Custos

- **Limite de tokens**: 800 por resposta
- **Histórico limitado**: Apenas 10 interações
- **Fallback automático**: Reduz uso da API

## 🧪 Teste da Configuração

### Verificar se está a funcionar:

1. **Abra a aplicação**
2. **Vá a "Pedidos de Informação"**
3. **Faça uma pergunta**
4. **Verifique os logs**:
   - ✅ "OpenAI inicializada com sucesso" = API configurada
   - ⚠️ "Chave da OpenAI não configurada" = Usar .env
   - ✅ "Resposta gerada pela OpenAI" = Funcionando
   - ⚠️ "Erro na OpenAI, usando fallback" = Problema na API

### Exemplos de Perguntas para Testar:

- "Como posso candidatar-me a apoios para jovens agricultores?"
- "Preciso de uma licença para cortar uma árvore"
- "Como reportar uma doença animal?"
- "Quais são os vossos horários de funcionamento?"

## 🔍 Resolução de Problemas

### Problema: "Chave da OpenAI não configurada"

**Solução**: Criar ficheiro .env com a chave ou editar config/ai.ts

### Problema: "Erro na OpenAI"

**Possíveis causas**:

- Chave inválida ou expirada
- Sem créditos na conta OpenAI
- Sem conexão à internet
- Limite de rate excedido

**Solução**: Verificar conta OpenAI e créditos

### Problema: "Contactos não carregados do Excel"

**Possíveis causas**:

- Ficheiro Excel não encontrado
- Formato de colunas diferente
- Permissões de ficheiro

**Solução**: Verificar se o ficheiro existe e tem as colunas corretas

## 📈 Monitorização

### Logs Importantes:

```
✅ OpenAI inicializada com sucesso
✅ AIService inicializado com sucesso
✅ Carregados X contactos do Excel
✅ Base de conhecimento carregada com sucesso
✅ Resposta gerada pela OpenAI
⚠️ Erro na OpenAI, usando fallback
❌ Erro ao processar pergunta
```

### Métricas a Acompanhar:

- **Taxa de sucesso da OpenAI** vs fallback
- **Tempo de resposta** das perguntas
- **Qualidade das respostas** (feedback dos utilizadores)
- **Custos da API** (dashboard OpenAI)

## 🚀 Próximos Passos

1. **Configurar chave OpenAI** para IA avançada
2. **Testar com perguntas reais** dos utilizadores
3. **Ajustar prompts** se necessário
4. **Monitorizar custos** e performance
5. **Expandir base de conhecimento** com mais documentos

## 🔒 Segurança

- **Nunca commitar** chaves da API no código
- **Usar variáveis de ambiente** (.env)
- **Rodar logs** em produção para não expor chaves
- **Monitorizar uso** da API para detetar abusos
