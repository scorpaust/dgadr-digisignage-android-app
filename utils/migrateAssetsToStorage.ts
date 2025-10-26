import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { firebase } from "../config";

/**
 * Utility functions to help migrate local assets to Firebase Storage
 * These are helper functions - actual file upload needs to be done manually or via web interface
 */

export class AssetMigrationHelper {
  private storage = getStorage(
    firebase,
    "gs://dgadr-digisignage-app.appspot.com"
  );

  /**
   * Get the list of assets that need to be migrated
   */
  getAssetsToMigrate() {
    return {
      projetos: [
        "assets/projcof/Cartaz-A3-POCI-05-5762-FSE-000277.jpg",
        "assets/projcof/Cartaz-A3-POCI-05-5762-FSE-000292.jpg",
        "assets/projcof/Cartaz-PRR-AAC_01C13_i022021.jpg",
      ],
      eventos: [
        "assets/events/2024_03_11_expo_juntas_colonias_agricolas.png",
        "assets/events/20240524101400-flyer_coimbra_2024_main_60x90_004.jpg",
        "assets/events/grapes-276070_1280-1140x570.jpg",
      ],
      imagens_numeradas: Array.from(
        { length: 30 },
        (_, i) => `assets/images/${i + 1}.jpg`
      ),
    };
  }

  /**
   * Generate Firebase Storage paths for assets
   */
  generateStoragePaths() {
    const assets = this.getAssetsToMigrate();

    return {
      projetos: assets.projetos.map((path) => {
        const filename = path.split("/").pop()!;
        return `projetos/${filename}`;
      }),
      eventos: assets.eventos.map((path) => {
        const filename = path.split("/").pop()!;
        return `eventos/${filename}`;
      }),
      galeria: assets.imagens_numeradas.map((path, index) => {
        const extension = path.split(".").pop();
        return `photos/foto_${String(index + 1).padStart(2, "0")}.${extension}`;
      }),
    };
  }

  /**
   * Upload a file to Firebase Storage (for programmatic upload)
   * Note: This requires the file to be available as a Blob/File object
   */
  async uploadFile(file: Blob | File, storagePath: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, storagePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log(`File uploaded successfully to ${storagePath}`);
      return downloadURL;
    } catch (error) {
      console.error(`Error uploading file to ${storagePath}:`, error);
      throw error;
    }
  }

  /**
   * Generate migration instructions
   */
  getMigrationInstructions() {
    const assets = this.getAssetsToMigrate();
    const storagePaths = this.generateStoragePaths();

    return {
      instructions: `
# Instruções de Migração de Assets

## 1. Projetos (ProjectsScreen)
Migrar de assets/projcof/ para Firebase Storage pasta 'projetos/':

${assets.projetos
  .map((asset, i) => `- ${asset} → ${storagePaths.projetos[i]}`)
  .join("\n")}

## 2. Eventos (EventsScreen) - Opcional
Migrar de assets/events/ para Firebase Storage pasta 'eventos/':

${assets.eventos
  .map((asset, i) => `- ${asset} → ${storagePaths.eventos[i]}`)
  .join("\n")}

## 3. Imagens Numeradas - Podem ser removidas
Estas imagens em assets/images/ (1.jpg a 30.jpg) não parecem estar sendo usadas.
Se forem necessárias, migrar para Firebase Storage pasta 'photos/':

${assets.imagens_numeradas
  .slice(0, 5)
  .map((asset, i) => `- ${asset} → ${storagePaths.galeria[i]}`)
  .join("\n")}
... (e assim por diante)

## Como fazer a migração:

1. Aceder ao Firebase Console
2. Ir para Storage > Files
3. Criar as pastas: projetos/, eventos/, photos/
4. Fazer upload dos ficheiros para as respetivas pastas
5. Testar a app para confirmar que as imagens carregam
6. Remover os assets locais depois de confirmar que tudo funciona
      `,
      assets,
      storagePaths,
    };
  }

  /**
   * Print migration instructions to console
   */
  printMigrationInstructions() {
    const { instructions } = this.getMigrationInstructions();
    console.log(instructions);
  }
}

export const assetMigrationHelper = new AssetMigrationHelper();
