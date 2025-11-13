# Exemplo de Teste - Tools de Pesquisa IA

## 🔍 **Como Funciona Agora**

A IA tem acesso a **ferramentas reais de pesquisa** que consultam informação específica antes de responder.

### **Pergunta Exemplo:**

_"Qual é o estatuto da agricultura familiar?"_

### **Processo da IA:**

#### 1. **Pesquisa nos Ficheiros DGADR**

```
INFORMAÇÃO ENCONTRADA NOS FICHEIROS DGADR:

apoios_agricultura.txt:
ESTATUTO AGRICULTURA FAMILIAR:
- Exploração até 12 UDE (Unidades Dimensão Económica)
- Benefícios fiscais e apoios específicos
- Registo obrigatório no SAAF
- Contacto: saaf@dgadr.gov.pt
```

#### 2. **Pesquisa Web (se necessário)**

```
INFORMAÇÃO ADICIONAL WEB:
Portal SAAF: Sistema de apoio específico para agricultura familiar...
```

#### 3. **Resposta da IA**

_"O estatuto da agricultura familiar aplica-se a explorações até 12 UDE (Unidades Dimensão Económica) e oferece benefícios fiscais e apoios específicos. É obrigatório o registo no SAAF. Para mais informações, contacte saaf@dgadr.gov.pt."_

---

## 🆚 **Antes vs Depois**

### **❌ ANTES (Resposta Genérica):**

_"A sanidade vegetal trata de pragas e doenças das plantas..."_

### **✅ AGORA (Resposta Específica):**

_"O estatuto da agricultura familiar aplica-se a explorações até 12 UDE e oferece benefícios fiscais específicos. Registo obrigatório no SAAF. Contacto: saaf@dgadr.gov.pt."_

---

## 🛠️ **Ferramentas Implementadas**

### **1. FileSearchService**

- **Base de conhecimento estruturada** por tópicos
- **Pesquisa inteligente** por relevância
- **Extração de excertos** relevantes
- **Dados específicos** da DGADR

### **2. WebSearchService**

- **Pesquisa nos sites oficiais** da DGADR
- **API DuckDuckGo** para resultados web
- **Filtros por domínio** (dgadr.gov.pt, etc.)
- **Pesquisa de legislação** em sites oficiais

### **3. OpenAI com Context**

- **Prompt enriquecido** com informação específica
- **Respostas baseadas em dados reais**
- **Contactos específicos** incluídos
- **Fallback inteligente** se API falhar

---

## 📋 **Ficheiros de Conhecimento**

### **apoios_agricultura.txt**

- PRODERAM 2030
- Jovens agricultores (18-40 anos)
- Estatuto agricultura familiar
- Modernização explorações

### **recursos_florestais.txt**

- Licenciamento corte árvores
- Prevenção incêndios
- Reflorestação
- Taxas e prazos específicos

### **sanidade_animal.txt**

- Doenças notificação obrigatória
- Certificação exportação
- Identificação animais
- Laboratório análises

### **sanidade_vegetal.txt**

- Certificação fitossanitária
- Pragas quarentena
- Produtos fitofarmacêuticos
- Passaporte fitossanitário

### **seguranca_alimentar.txt**

- Licenciamento estabelecimentos
- Controlos oficiais
- Alerta alimentar
- Formação manipuladores

### **biblioteca_recursos.txt**

- Acervo 15.000 volumes
- Serviços disponíveis
- Catálogo online
- Horários atendimento

---

## 🧪 **Perguntas para Testar**

### **Apoios Específicos:**

- _"Qual é a idade máxima para jovens agricultores?"_
- _"Quanto é o apoio à primeira instalação?"_
- _"Como me registo no SAAF?"_

### **Licenciamentos:**

- _"Preciso licença para cortar eucaliptos?"_
- _"Qual é o prazo para análise de licença florestal?"_
- _"Quanto custa a taxa de corte?"_

### **Sanidade:**

- _"Como reportar tuberculose bovina?"_
- _"Onde fazer análises ao leite?"_
- _"Que pragas são de notificação obrigatória?"_

### **Procedimentos:**

- _"Como obter certificado fitossanitário?"_
- _"Qual o prazo para emissão?"_
- _"Que documentos preciso?"_

---

## 📞 **Contactos Específicos Incluídos**

Cada resposta inclui o **contacto específico** para o assunto:

- **Jovens Agricultores:** jovens@dgadr.gov.pt | 291 145 330
- **PRODERAM:** proderam@dgadr.gov.pt | 291 145 320
- **Licenças Florestais:** florestal@dgadr.gov.pt | 291 145 350
- **Sanidade Animal:** veterinaria@dgadr.gov.pt | 291 145 360
- **Fitossanitário:** fitossanitario@dgadr.gov.pt | 291 145 370
- **Segurança Alimentar:** alimentar@dgadr.gov.pt | 291 145 380
- **Biblioteca:** biblioteca@dgadr.gov.pt | 291 145 390
- **Laboratório:** laboratorio@dgadr.gov.pt | 291 145 400

---

## 🚀 **Resultado Final**

✅ **Respostas precisas** baseadas em dados reais
✅ **Contactos específicos** para cada assunto  
✅ **Informação atualizada** dos ficheiros DGADR
✅ **Pesquisa web** complementar quando necessário
✅ **Fallback robusto** se APIs falharem
✅ **Respostas concisas** e diretas ao ponto
