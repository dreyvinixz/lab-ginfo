import { useEffect, useState } from "react";
import Lab2D from "./components/Lab2D";
import Lab3D from "./components/Lab3D";
import SidePanel from "./components/SidePanel";
import { initialPCs, PC } from "./data/pcs";

export default function App() {
  const [pcs, setPcs] = useState<PC[]>(initialPCs);
  const [selected, setSelected] = useState<PC | null>(null);
  const [view, setView] = useState<"2D" | "3D">("2D");

  // Simulação em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setPcs(prev =>
        prev.map(pc => {
          const rand = Math.random();
          if (rand < 0.33) return { ...pc, status: "livre", user: "" };
          if (rand < 0.66) return { ...pc, status: "ocupado", user: "User" + Math.floor(Math.random() * 10) };
          return { ...pc, status: "offline", user: "" };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Header com toggle */}
      <header className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-700 shrink-0">
        <h1 className="text-white font-bold text-lg tracking-wide">🖥 Lab Ginfo</h1>
        <div className="flex gap-1 bg-gray-800 p-1 rounded-lg">
          {(["2D", "3D"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                view === v
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </header>

      {/* Conteúdo */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          {view === "2D" ? (
            <Lab2D pcs={pcs} setSelected={setSelected} />
          ) : (
            <Lab3D pcs={pcs} setSelected={setSelected} />
          )}
        </div>
        <SidePanel pc={selected} />
      </div>
    </div>
  );
}
