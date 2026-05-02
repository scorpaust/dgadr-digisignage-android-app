// Removido FileSystem para evitar erros nativos
import { Contact } from "../types/chat";

export class ExcelService {
  private static instance: ExcelService;
  private contacts: Contact[] = [];
  private isLoaded = false;

  public static getInstance(): ExcelService {
    if (!ExcelService.instance) {
      ExcelService.instance = new ExcelService();
    }
    return ExcelService.instance;
  }

  public async loadContacts(): Promise<Contact[]> {
    if (this.isLoaded) {
      return this.contacts;
    }

    try {
      // Por agora usa contactos padrão - em produção carregaria do Excel/CSV
      this.contacts = this.getDefaultContacts();
      this.isLoaded = true;

      return this.contacts;
    } catch (error) {
      this.contacts = this.getDefaultContacts();
      return this.contacts;
    }
  }

  private getDefaultContacts(): Contact[] {
    return [
      {
        name: "Receção / Informações Gerais",
        phone: "21 844 22 00",
        email: "geral@dgadr.pt",
        department: "Atendimento Geral",
      },
    ];
  }

  public getContacts(): Contact[] {
    return this.contacts;
  }

  public findContactsByKeywords(keywords: string[]): Contact[] {
    const normalizedKeywords = keywords.map((k) => k.toLowerCase());

    return this.contacts.filter((contact) => {
      const searchText = `${contact.name} ${contact.department}`.toLowerCase();
      return normalizedKeywords.some((keyword) => searchText.includes(keyword));
    });
  }

  // Método para converter Excel para CSV (para usar externamente)
  public static getCSVTemplate(): string {
    return `Nome,Departamento,Telefone,Email
Receção Geral,Atendimento Geral,21 844 22 00,geral@dgadr.pt
Dr. Rodrigo Câmara,Apoios e Subsídios,21 844 24 44,rcamara@dgadr.pt
Eng.ª Maísa Oliveira,Desenvolvimento Rural,21 844 23 76,moliveira@dgadr.pt`;
  }
}
