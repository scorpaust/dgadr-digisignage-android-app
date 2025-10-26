# Guia Completo de Migração - Sistema de Imagens Modernizado

## ✅ O que foi feito

### 1. Sistema Modernizado

- ❌ **Antes**: Imagens hardcoded com `require()` e numeração sequencial
- ✅ **Agora**: Carregamento dinâmico de qualquer pasta do Firebase Storage

### 2. Componentes Criados

- `utils/storageService.ts` - Serviço centralizado para Firebase Storage
- `utils/useStorageImages.ts` - Hook React para carregar imagens
- `utils/useNetworkStatus.ts` - Hook para verificar conectividade
- `components/LoadingState.tsx` - Estado de carregamento reutilizável
- `components/ErrorState.tsx` - Estado de erro com retry
- `components/EmptyState.tsx` - Estado vazio com ajuda

### 3. Screens Modernizados

- `ProjectsScreen.tsx` - Agora carrega de `projetos/` no Storage
- `LibFeatScreen.tsx` - Melhorado com novos componentes
- `MediaScreen.tsx` - Melhorado com novos componentes

## 📋 Checklist de Migração

### ✅ Passo 1: Criar pastas no Firebase Storage

1. Aceder ao [Firebase Console](https://console.firebase.google.com/)
2. Projeto: `dgadr-digisignage-app` > Storage > Files
3. Criar pastas:
   - `projetos/` ✅ (já criaste)
   - `eventos/` (opcional, para EventsScreen)
   - `photos/` (já existe)
   - `destaques_biblio/` (já existe)

### ✅ Passo 2: Migrar imagens dos projetos

Fazer upload destas imagens para `projetos/`:

- `assets/projcof/Cartaz-A3-POCI-05-5762-FSE-000277.jpg`
- `assets/projcof/Cartaz-A3-POCI-05-5762-FSE-000292.jpg`
- `assets/projcof/Cartaz-PRR-AAC_01C13_i022021.jpg`

### 🔄 Passo 3: Testar ProjectsScreen

1. Abrir a app
2. Navegar para o ecrã de Projetos
3. Verificar se as imagens carregam corretamente
4. Se aparecer "Debug: X imagens carregadas", está a funcionar!

### 🧹 Passo 4: Limpeza (depois de testar)

Quando confirmares que tudo funciona:

1. **Remover debug do ProjectsScreen:**

```bash
# Substituir o ficheiro atual pelo limpo
cp screens/ProjectsScreen.final.tsx screens/ProjectsScreen.tsx
```

2. **Remover assets locais não utilizados:**

```bash
# Estas pastas podem ser removidas depois de migrar
rm -rf assets/projcof/
rm -rf assets/images/  # Se não forem usadas
```

## 🚀 Funcionalidades do Novo Sistema

### ✅ Carregamento Dinâmico

- Adiciona/remove imagens sem recompilar a app
- Qualquer nome de ficheiro funciona (sem numeração)
- Suporta múltiplas pastas

### ✅ Performance Otimizada

- Cache inteligente (evita downloads repetidos)
- Auto-refresh a cada 5 minutos
- Loading states profissionais

### ✅ Error Handling Robusto

- Estados de loading, erro e vazio
- Botão "Tentar novamente" nos erros
- Mensagens de ajuda úteis

### ✅ Manutenção Simplificada

- Código limpo e reutilizável
- Componentes modulares
- Fácil de estender para novos ecrãs

## 🔧 Como usar o novo sistema

### Para novos ecrãs com imagens:

```typescript
import { useStorageImages } from '../utils/useStorageImages';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const MeuScreen = () => {
  const { imageUrls, loading, error, reload } = useStorageImages("minha-pasta");

  if (loading) return <LoadingState message="A carregar..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (imageUrls.length === 0) return <EmptyState message="Sem imagens" />;

  return (
    // Usar imageUrls aqui
  );
};
```

### Para adicionar novas imagens:

1. Fazer upload para a pasta correta no Firebase Storage
2. A app atualiza automaticamente (auto-refresh)
3. Sem necessidade de código ou rebuild

## 📱 Próximos Passos Opcionais

### 1. Modernizar EventsScreen

Se quiseres, posso modernizar o EventsScreen para usar o mesmo sistema:

- Migrar `assets/events/` para `eventos/` no Storage
- Usar o novo sistema de carregamento

### 2. Adicionar mais funcionalidades

- Upload de imagens diretamente na app
- Reordenação de imagens
- Categorias/tags para imagens

### 3. Otimizações avançadas

- Lazy loading para galerias grandes
- Compressão automática de imagens
- Suporte para vídeos

## 🐛 Troubleshooting

### Imagens não aparecem

1. Verificar se a pasta existe no Firebase Storage
2. Confirmar que há imagens na pasta
3. Verificar permissões do Storage
4. Ver consola para erros específicos

### App lenta

1. Otimizar tamanho das imagens (< 2MB cada)
2. Usar formatos eficientes (WebP, JPEG)
3. Cache reduz carregamentos repetidos

### Erros de rede

1. Verificar conectividade
2. Confirmar configuração do Firebase
3. Ver regras de segurança do Storage

---

**Status atual**: ✅ Sistema modernizado e pronto para uso!
**Próximo passo**: Testar o ProjectsScreen depois de fazer upload das imagens.
