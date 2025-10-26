# Organograma Interativo - DGADR

## ✨ Funcionalidades Implementadas

### 🎯 Organograma Moderno e Interativo
- **Design baseado na imagem fornecida** - Layout hierárquico claro
- **Nodes clicáveis** - Indicador visual (ⓘ) nos elementos interativos
- **Cores diferenciadas** por nível hierárquico:
  - 🔵 **Azul escuro** - Diretor-Geral e Subdirectora-Geral
  - 🔵 **Azul claro** - Conselhos e Entidades
  - 🟢 **Verde claro** - Direções de Serviços
  - 🟢 **Verde muito claro** - Divisões

### 📱 Modal Informativo
Quando clicas num node, abre um modal com:
- **Nome do responsável**
- **Departamento completo**
- **Localização** (piso e sala)
- **Contactos** (telefone e email clicáveis)
- **Tipo de posição** (Direção, Divisão, etc.)

### 📞 Contactos Clicáveis
- **Telefone** - Abre a app de chamadas
- **Email** - Abre a app de email
- **Interface intuitiva** com ícones

## 🏗️ Estrutura dos Componentes

### `OrgChart.tsx` - Componente Principal
- Layout responsivo e scrollável
- Organização hierárquica clara
- Gestão de estados do modal

### `OrgNode.tsx` - Node Individual
- Design adaptativo por tipo de posição
- Indicador visual para nodes clicáveis
- Cores e tamanhos diferenciados

### `OrgNodeModal.tsx` - Modal de Informações
- Design moderno com header colorido
- Contactos clicáveis
- Informações organizadas por secções

## 📊 Dados Estruturados

### Exemplo de Node Completo:
```typescript
{
  id: "dsiga",
  name: "Paulo Freitas",
  title: "Direção de Serviços de Informação, Gestão e Administração",
  shortTitle: "DSIGA",
  position: "head",
  color: "#A8D8A8",
  floor: "2º",
  room: "201",
  phone: "+351 213 234 620",
  email: "paulo.freitas@dgadr.gov.pt",
  isClickable: true,
  children: [...]
}
```

## 🎨 Design System

### Cores por Hierarquia:
- **Diretor-Geral**: `#2D5A87` (Azul escuro)
- **Subdirectora-Geral**: `#2D5A87` (Azul escuro)
- **Conselhos/Entidades**: `#5B9BD5` (Azul claro)
- **Direções de Serviços**: `#A8D8A8` (Verde claro)
- **Divisões**: `#E8F4E8` (Verde muito claro)

### Tamanhos dos Nodes:
- **Diretor-Geral**: 140x90px (maior)
- **Direções**: 130x85px (médio)
- **Divisões**: 120x80px (padrão)
- **Conselhos**: 140x70px (largo)

## 📱 Experiência do Utilizador

### Navegação:
1. **Scroll vertical** - Navegar pela hierarquia
2. **Toque no node** - Abrir informações detalhadas
3. **Indicador visual** - Saber quais nodes são clicáveis
4. **Modal intuitivo** - Informações organizadas e acessíveis

### Contactos:
1. **Toque no telefone** - Liga automaticamente
2. **Toque no email** - Abre app de email
3. **Interface clara** - Ícones e labels descritivos

## 🔧 Como Adicionar/Editar Informações

### 1. Editar dados existentes:
```typescript
// Em data/org-data.ts
{
  id: "novo-departamento",
  name: "Nome do Responsável",
  title: "Nome Completo do Departamento",
  shortTitle: "SIGLA",
  position: "division", // ou "head", "director", etc.
  floor: "1º",
  room: "105",
  phone: "+351 213 234 XXX",
  email: "email@dgadr.gov.pt",
  isClickable: true,
}
```

### 2. Adicionar nova divisão:
Adiciona ao array `children` da direção correspondente.

### 3. Adicionar nova direção:
Adiciona ao array `children` do diretor-geral.

## 🚀 Funcionalidades Avançadas

### Possíveis Melhorias Futuras:
- **Pesquisa** - Encontrar departamentos por nome
- **Filtros** - Mostrar apenas certas hierarquias
- **Zoom** - Ampliar/reduzir o organograma
- **Modo escuro** - Tema alternativo
- **Exportar** - Guardar como imagem
- **Favoritos** - Marcar contactos importantes

### Integração com Firebase:
- **Dados dinâmicos** - Carregar do Firebase Realtime Database
- **Atualizações em tempo real** - Mudanças automáticas
- **Gestão web** - Interface para editar dados

## 📋 Checklist de Teste

### ✅ Funcionalidades Básicas:
- [ ] Organograma carrega corretamente
- [ ] Todos os nodes são visíveis
- [ ] Cores estão corretas por hierarquia
- [ ] Layout é responsivo

### ✅ Interatividade:
- [ ] Nodes clicáveis têm indicador (ⓘ)
- [ ] Modal abre ao clicar
- [ ] Informações estão corretas
- [ ] Modal fecha corretamente

### ✅ Contactos:
- [ ] Telefones são clicáveis
- [ ] Emails são clicáveis
- [ ] Apps externas abrem corretamente

### ✅ Design:
- [ ] Cores estão consistentes
- [ ] Texto é legível
- [ ] Layout é profissional
- [ ] Animações são suaves

## 🎯 Resultado Final

O organograma agora é:
- ✅ **Moderno e profissional**
- ✅ **Totalmente interativo**
- ✅ **Fácil de navegar**
- ✅ **Rico em informações**
- ✅ **Contactos acessíveis**
- ✅ **Design responsivo**

Cada departamento tem toda a informação necessária (localização, contactos, responsável) acessível com um simples toque!