# Migração de Imagens para Firebase Storage

## Problema Resolvido

Antes, as imagens eram geridas de forma "arcaica":

- ✅ **Projetos**: Imagens hardcoded com `require()` - agora carrega de `projetos/` no Storage
- ✅ **Galeria**: Já usava Firebase Storage (`photos/`) - melhorado com cache e auto-refresh
- ✅ **Biblioteca**: Já usava Firebase Storage (`destaques_biblio/`) - melhorado com cache e auto-refresh
- ❌ **Assets locais**: Imagens numeradas (1.jpg a 30.jpg) em `assets/images/` - podem ser removidas

## Estrutura no Firebase Storage

Organiza as imagens nestas pastas no Firebase Storage:

```
Firebase Storage/
├── projetos/                    # Imagens de projetos (ProjectsScreen)
│   ├── projeto1.jpg
│   ├── projeto2.png
│   └── ...
├── photos/                      # Galeria de fotos (MediaScreen)
│   ├── foto1.jpg
│   ├── foto2.png
│   └── ...
├── destaques_biblio/           # Destaques da biblioteca (LibFeatScreen)
│   ├── destaque1.jpg
│   ├── destaque2.png
│   └── ...
└── newsletters/                # Capas das newsletters
    └── raiz_digital/
        ├── raiz_digital_2025_09_25.png
        └── raiz_digital_2025_10_23.png
```

## Como Migrar Imagens

### 1. Projetos (ProjectsScreen)

**Antes:**

```typescript
const imageLinks = [
  require("../assets/projcof/Cartaz-A3-POCI-05-5762-FSE-000277.jpg"),
  require("../assets/projcof/Cartaz-A3-POCI-05-5762-FSE-000292.jpg"),
  // ...
];
```

**Agora:**

1. Faz upload das imagens de `assets/projcof/` para a pasta `projetos/` no Firebase Storage
2. O código carrega automaticamente todas as imagens da pasta
3. Não precisas de numeração sequencial ou nomes específicos

### 2. Upload das Imagens

**Opção A - Firebase Console:**

1. Vai ao [Firebase Console](https://console.firebase.google.com/)
2. Seleciona o projeto `dgadr-digisignage-app`
3. Vai a **Storage** > **Files**
4. Cria as pastas: `projetos/`, `photos/`, `destaques_biblio/`
5. Faz upload das imagens para as respetivas pastas

**Opção B - Programaticamente:**

```typescript
import { storageService } from "./utils/storageService";

// Exemplo de como usar o novo sistema
const { imageUrls, loading, error } = useStorageImages("projetos");
```

## Vantagens do Novo Sistema

### ✅ Sem Numeração Sequencial

- Não precisas de nomear imagens como 1.jpg, 2.jpg, etc.
- Qualquer nome de ficheiro funciona
- Adiciona/remove imagens sem quebrar a sequência

### ✅ Gestão Dinâmica

- Adiciona novas imagens sem recompilar a app
- Remove imagens obsoletas instantaneamente
- Reordena imagens apenas mudando os nomes

### ✅ Performance Melhorada

- Cache inteligente (evita downloads repetidos)
- Auto-refresh a cada 5 minutos
- Loading states e error handling

### ✅ Manutenção Simplificada

- Uma pasta por tipo de conteúdo
- Sem código hardcoded
- Gestão centralizada no Firebase

## Configuração das Pastas

### Projetos (`projetos/`)

```typescript
// Carrega todas as imagens da pasta projetos, sem shuffle
const { imageUrls } = useStorageImages("projetos", { shuffle: false });
```

### Galeria (`photos/`)

```typescript
// Carrega todas as fotos, com shuffle e auto-refresh
const { images } = useStorageImages("photos", {
  shuffle: true,
  autoRefresh: true,
});
```

### Biblioteca (`destaques_biblio/`)

```typescript
// Carrega destaques da biblioteca, com shuffle
const { images } = useStorageImages("destaques_biblio", { shuffle: true });
```

## Limpeza dos Assets Locais

Depois de migrar, podes remover:

1. **Pasta `assets/projcof/`** - imagens agora no Storage
2. **Pasta `assets/images/`** - imagens numeradas não são usadas
3. **Pasta `assets/events/`** - se migrares eventos também

## Troubleshooting

### Imagens não aparecem

1. Verifica se as imagens estão na pasta correta no Storage
2. Confirma as permissões do Storage (deve permitir leitura)
3. Verifica a consola para erros de rede

### Performance lenta

1. Otimiza o tamanho das imagens (recomendado: < 2MB cada)
2. Usa formatos eficientes (WebP, JPEG otimizado)
3. O cache reduz downloads repetidos

### Erro de permissões

Adiciona estas regras no Firebase Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Próximos Passos

1. **Migra as imagens** dos assets locais para o Firebase Storage
2. **Testa cada ecrã** para confirmar que as imagens carregam
3. **Remove os assets locais** depois de confirmar que tudo funciona
4. **Considera migrar eventos** se também usam imagens hardcoded

O sistema agora é muito mais flexível e fácil de manter!
