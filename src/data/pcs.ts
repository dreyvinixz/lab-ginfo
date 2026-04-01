export type PCStatus = "livre" | "Em uso" | "offline";

export type Meeting = {
  scheduled: boolean;
  title?: string;
  scheduledBy?: string;
  time?: string;
};

export type PC = {
  id: string;
  x: number;
  y: number;
  status: PCStatus;
  user?: string;
};

export const initialPCs: PC[] = [
  // Mesa vertical central
  { id: "PC-152879", x: 870, y: 365, status: "livre" },

  // Coluna direita
  { id: "PC-726677", x: 1165, y: 155, status: "livre" },
  { id: "PC-726680", x: 1165, y: 255, status: "Em uso", user: "Maria" },
  { id: "PC-726681", x: 1165, y: 355, status: "offline" },

  // Fileira direita média
  { id: "PC-07", x: 905,  y: 548, status: "livre" },
  { id: "PC-08", x: 985,  y: 548, status: "Em uso", user: "João" },
  { id: "PC-09", x: 1065, y: 548, status: "livre" },
  { id: "PC-152879", x: 1145, y: 548, status: "Em uso", user: "Ana" },

  // Fileira direita inferior
  { id: "PC-11", x: 905,  y: 635, status: "livre" },
  { id: "PC-12", x: 985,  y: 635, status: "offline" },
  { id: "PC-13", x: 1065, y: 635, status: "Em uso", user: "Carlos" },
  { id: "PC-14", x: 1145, y: 635, status: "livre" },
];