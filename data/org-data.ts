import { TreeNode } from "../types/org";

export const ORG_CHART_DATA: TreeNode = {
  name: "Rogério Ferreira",
  title: "DIRETOR-GERAL",
  children: [
    { name: "Catarina Cunha", title: "SUBDIRETORA-GERAL" },
    { name: "do Regadio", title: "Conselho Nacional" },
    { name: "da Reserva Agrícola", title: "Entidade Nacional" },
    {
      name: "do Exercício da At. Pecuária",
      title: "Comissão de Acompanhamento",
    },
    {
      name: "",
      title: "Direcões de Serviço",
      children: [
        {
          name: "Paulo Freitas",
          title: "DSIGA",
          children: [
            { name: "Catarina Ribeiro", title: "DORH" },
            { name: "Diogo Ferreira", title: "DGF" },
            { name: "Rosália Martins", title: "DPGI" },
          ],
        },
        {
          name: "Sandra Candeias",
          title: "DSPAA",
          children: [
            { name: "Fátima Caetano", title: "DAEA" },
            { name: "Carlos Carvalho", title: "DQRG" },
            { name: "Patrícia Fonseca", title: "DGRN" },
          ],
        },
        {
          name: "Maria Custódia Correia",
          title: "DSTAR",
          children: [
            { name: "Alexandra Santos", title: "DOER" },
            { name: "Ana Rita Correia", title: "DDAAFA" },
          ],
        },
        {
          name: "Cláudia Brandão",
          title: "DSR",
          children: [
            { name: "Gabriela Salvado", title: "DIH" },
            { name: "Armando Pinto", title: "DER" },
            { name: "Isabel Loureiro", title: "DIR" },
          ],
        },
      ],
    },
  ],
};
