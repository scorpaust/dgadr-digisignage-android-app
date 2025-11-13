export interface Contact {
  name: string;
  phone?: string;
  email?: string;
  department: string;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  contacts?: Contact[];
}

export interface ChatTab {
  id: string;
  title: string;
  messages: Message[];
}

export interface AIResponse {
  answer: string;
  contacts: Contact[];
}
