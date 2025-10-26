export interface TreeNode {
  id: string;
  name: string;
  title: string;
  shortTitle?: string; // Sigla (ex: DSIGA, DSPAA)
  department?: string; // Departamento completo
  floor?: string; // Piso
  room?: string; // Número da sala
  phone?: string; // Telefone
  email?: string; // Email
  position?: "director" | "subdirector" | "head" | "division" | "council"; // Tipo de posição
  color?: string; // Cor do node
  isClickable?: boolean; // Se o node é clicável
  children?: TreeNode[];
}

export interface OrgModalData {
  id: string;
  name: string;
  title: string;
  department?: string;
  floor?: string;
  room?: string;
  phone?: string;
  email?: string;
  position?: string;
  shortTitle?: string;
}

export interface OrgNodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}
