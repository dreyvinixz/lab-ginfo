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
  { id: "PC-154735", x: 870, y: 365, status: "livre" },

  // Coluna direita
  { id: "PC-726677", x: 1165, y: 155, status: "livre" },
  { id: "PC-726680", x: 1165, y: 255, status: "Em uso", user: "Maria" },
  { id: "PC-726681", x: 1165, y: 355, status: "offline" },

  // Fileira direita média
  { id: "PC-726682", x: 990,  y: 558, status: "Em uso", user: "João" },
  { id: "PC-726685", x: 1080, y: 558, status: "livre" },
  { id: "PC-152879", x: 1160, y: 558, status: "Em uso", user: "Ana" },

  // Fileira direita inferior
  { id: "PC-103036", x: 1000,  y: 645, status: "offline" },
  { id: "PC-726678", x: 1165, y: 645, status: "Em uso", user: "Carlos" },

  // Fileira direita inferior
  { id: "PC-155353", x: 1000,  y: 745, status: "offline" },
  { id: "PC-726684", x: 1165, y: 745, status: "Em uso", user: "Carlos" },
];