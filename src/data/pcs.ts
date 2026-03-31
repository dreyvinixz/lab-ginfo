export type PCStatus = "livre" | "ocupado" | "offline";

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
  { id: "PC-15", x: 870, y: 365, status: "livre" },

  // Coluna direita
  { id: "PC-03", x: 1165, y: 125, status: "livre" },
  { id: "PC-04", x: 1165, y: 225, status: "ocupado", user: "Maria" },
  { id: "PC-05", x: 1165, y: 305, status: "offline" },
  { id: "PC-06", x: 1165, y: 395, status: "livre" },

  // Fileira direita média
  { id: "PC-07", x: 905,  y: 548, status: "livre" },
  { id: "PC-08", x: 985,  y: 548, status: "ocupado", user: "João" },
  { id: "PC-09", x: 1065, y: 548, status: "livre" },
  { id: "PC-10", x: 1145, y: 548, status: "ocupado", user: "Ana" },

  // Fileira direita inferior
  { id: "PC-11", x: 905,  y: 635, status: "livre" },
  { id: "PC-12", x: 985,  y: 635, status: "offline" },
  { id: "PC-13", x: 1065, y: 635, status: "ocupado", user: "Carlos" },
  { id: "PC-14", x: 1145, y: 635, status: "livre" },
];