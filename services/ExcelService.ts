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

      console.log(`✅ Carregados ${this.contacts.length} contactos (padrão)`);
      return this.contacts;
    } catch (error) {
      console.error("Erro ao carregar contactos:", error);
      this.contacts = this.getDefaultContacts();
      return this.contacts;
    }
  }

  private getDefaultContacts(): Contact[] {
    // Contactos reais da DGADR
    return [
      {
        name: "Receção/Informações Gerais",
        phone: "21 844 22 00",
        email: "geral@dgadr.pt",
        department: "Atendimento Geral",
      },
      {
        name: "Dr. Rodrigo Câmara - Apoios e Subsídios - Estatuto da Agricultura Familiar",
        phone: "21 844 24 44",
        email: "rcamara@dgadr.pt",
        department: "Apoios e Subsídios",
      },
      {
        name: "Eng.ª Manuela Joia - Jovens Agricultores",
        phone: "21 844 24 54",
        email: "mjoia@dgadr.pt",
        department: "Jovens Agricultores",
      },
      {
        name: "Eng.ª Maísa Oliveira - LEADER",
        phone: "21 844 23 76",
        email: "moliveira@dgadr.pt",
        department: "Desenvolvimento Rural",
      },
      {
        name: "Eng.ª Isabel Loureiro - Aproveitamentos Hidroagrícolas",
        phone: "21 844 24 51",
        email: "iloureiro@dgadr.pt",
        department: "Recursos Florestais",
      },
      {
        name: "Eng.º João Salgueiro - Bem-Estar Animal",
        phone: "21 844 23 85",
        email: "jsalgueiro@dgadr.pt",
        department: "Sanidade Animal",
      },
      {
        name: "Eng.º Afonso Mateus - Fitossanitário",
        phone: "21 844 24 26",
        email: "amateus@dgadr.pt",
        department: "Sanidade Vegetal",
      },
      {
        name: "Eng.º Carlos Carvalho - Produção Biológica",
        phone: "21 844 23 81",
        email: "ccarvalho@dgadr.pt",
        department: "Sanidade Vegetal",
      },
      {
        name: "Dr.ª Teresa Tavares - Segurança Alimentar",
        phone: "21 844 24 14",
        email: "ttavares@dgadr.pt",
        department: "Segurança Alimentar",
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
