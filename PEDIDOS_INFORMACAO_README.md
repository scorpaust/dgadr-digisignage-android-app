# Pedidos de Informação - Chat IA

## Descrição

Nova funcionalidade que permite aos visitantes fazer pedidos de informação através de um sistema de chat com inteligência artificial. O sistema oferece respostas personalizadas e contactos relevantes da DGADR.

## Funcionalidades Implementadas

### 1. Sistema de Chat Multi-Abas

- **Múltiplos chats simultâneos**: Os utilizadores podem ter várias conversas abertas
- **Gestão de abas**: Criar, fechar e navegar entre diferentes chats
- **Títulos automáticos**: O título de cada aba é gerado automaticamente baseado na primeira pergunta

### 2. Interface de Chat

- **Design responsivo**: Adaptado ao layout existente da aplicação
- **Mensagens diferenciadas**: Visual distinto para mensagens do utilizador e da IA
- **Timestamps**: Cada mensagem mostra a hora de envio
- **Indicador de carregamento**: Feedback visual durante o processamento

### 3. Inteligência Artificial

- **Processamento de linguagem natural**: Analisa as perguntas dos utilizadores
- **Base de conhecimento**: Consulta informações sobre agricultura, desenvolvimento rural, etc.
- **Respostas contextualizadas**: Fornece informações específicas baseadas nas palavras-chave

### 4. Sistema de Contactos

- **Contactos relevantes**: Sugere os departamentos/pessoas certas para cada tipo de pergunta
- **Integração com telefone**: Links diretos para fazer chamadas
- **Integração com email**: Links diretos para enviar emails
- **Informações completas**: Nome, departamento, telefone e email quando disponível

### 5. Recursos Adicionais

- **Links úteis**: Sugere websites relevantes da DGADR
- **Tom profissional**: Linguagem formal, simpática e prestável
- **Legislação e fontes**: Referências a recursos oficiais quando apropriado

## Estrutura de Ficheiros

```
screens/
├── InformationRequestScreen.tsx    # Tela principal com sistema de abas

components/
└── chat/
    └── ChatComponent.tsx           # Componente individual de chat

services/
└── AIService.ts                    # Lógica de processamento da IA

types/
└── chat.ts                         # Definições de tipos TypeScript
```

## Base de Conhecimento

### Tópicos Cobertos

- **Apoios e Subsídios**: PRODERAM, modernização, jovens agricultores
- **Desenvolvimento Rural**: Diversificação, turismo rural, património
- **Recursos Florestais**: Prevenção de incêndios, licenciamentos, gestão
- **Sanidade Animal**: Controlo de doenças, certificação veterinária
- **Sanidade Vegetal**: Pragas, doenças, certificação fitossanitária
- **Segurança Alimentar**: Controlos oficiais, sistema de alerta
- **Biblioteca**: Recursos documentais, publicações técnicas

### Contactos Disponíveis

- Gabinete do Diretor-Geral
- Divisão de Apoios à Agricultura
- Divisão de Desenvolvimento Rural
- Divisão de Recursos Florestais
- Divisão de Sanidade Animal
- Biblioteca e Documentação
- Laboratório Regional de Veterinária

## Como Usar

1. **Aceder ao Menu**: Selecionar "Pedidos de Informação" no menu principal
2. **Fazer Pergunta**: Escrever a pergunta na caixa de texto
3. **Receber Resposta**: A IA processa e fornece resposta com contactos relevantes
4. **Contactar**: Usar os links de telefone/email para contacto direto
5. **Múltiplos Chats**: Criar novas abas para diferentes tópicos

## Exemplos de Perguntas

- "Como posso candidatar-me a apoios para jovens agricultores?"
- "Preciso de informações sobre licenciamento florestal"
- "Como reportar uma doença animal?"
- "Onde posso encontrar legislação sobre segurança alimentar?"
- "Quais são os horários de atendimento?"

## ✅ Melhorias Implementadas (Versão 2.0)

### 🧠 IA Avançada com OpenAI

- **GPT-4o-mini**: IA real em vez de palavras-chave básicas
- **Conversas contextuais**: Memória das interações anteriores
- **Respostas naturais**: Linguagem fluida e personalizada
- **Fallback automático**: Sistema híbrido que sempre funciona

### 📊 Integração com Excel

- **Contactos dinâmicos**: Carregamento automático do ficheiro Excel
- **Parsing inteligente**: Deteta automaticamente as colunas relevantes
- **Matching avançado**: Encontra contactos por palavras-chave
- **Fallback robusto**: Contactos padrão se Excel não disponível

### 📚 Base de Conhecimento Expandida

- **Carregamento automático**: Ficheiros da pasta fonte_conhecimento_ai
- **Links dinâmicos**: Carregamento do ficheiro links.txt
- **Conhecimento detalhado**: Informação completa sobre todos os serviços
- **Respostas estruturadas**: Formatação clara com emojis e secções

### 🔧 Arquitetura Modular

- **OpenAIService**: Gestão da API da OpenAI
- **ExcelService**: Processamento do ficheiro de contactos
- **KnowledgeBaseService**: Gestão da base de conhecimento
- **AIService**: Orquestração de todos os serviços

## Melhorias Futuras (Versão 3.0)

1. **Histórico persistente**: Guardar conversas entre sessões
2. **Notificações**: Alertas para respostas importantes
3. **Feedback**: Sistema de avaliação das respostas da IA
4. **Multilíngua**: Suporte para inglês e outras línguas
5. **Analytics**: Métricas de utilização e satisfação
6. **Integração Firebase**: Sincronização cloud da base de conhecimento

## Configuração Técnica

### Dependências Adicionais

- `openai`: API da OpenAI para IA avançada
- `xlsx`: Processamento de ficheiros Excel
- `react-native-fs`: Sistema de ficheiros (alternativa)
- `expo-file-system`: Para acesso aos ficheiros de conhecimento
- `expo-linking`: Para integração com telefone e email (já existente)

### Integração com Firebase

A funcionalidade está preparada para integração futura com Firebase para:

- Armazenamento de conversas
- Analytics de utilização
- Atualizações da base de conhecimento

## Manutenção

### Atualizar Contactos

Editar o array `contacts` em `services/AIService.ts` ou implementar carregamento do Excel.

### Adicionar Conhecimento

Expandir o array `knowledgeBase` em `services/AIService.ts` com novas informações.

### Melhorar Respostas

Ajustar a lógica em `generateResponse()` para cobrir novos tópicos ou melhorar respostas existentes.
