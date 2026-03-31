export type PCStatus = "livre" | "ocupado" | "offline";

export type PC = {
  id: string;
  x: number;
  y: number;
  status: PCStatus;
  user?: string;
};

export const pcs: PC[] = [
  { id: "PC-01", x: 600, y: 200, status: "livre" },
  { id: "PC-02", x: 880, y: 40, status: "ocupado", user: "Andrey" },
  { id: "PC-03", x: 880, y: 100, status: "livre" },
  { id: "PC-04", x: 880, y: 160, status: "offline" },
];