import { useEffect, useState } from "react";
import Lab2D from "./components/Lab2D";
import SidePanel from "./components/SidePanel";
import { initialPCs, PC } from "./data/pcs";

export default function App() {
  const [pcs, setPcs] = useState<PC[]>(initialPCs);
  const [selected, setSelected] = useState<PC | null>(null);

  // 🔥 simulação em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setPcs(prev =>
        prev.map(pc => {
          const rand = Math.random();

          if (rand < 0.33) return { ...pc, status: "livre", user: "" };
          if (rand < 0.66) return { ...pc, status: "ocupado", user: "User" + Math.floor(Math.random()*10) };

          return { ...pc, status: "offline", user: "" };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <Lab2D pcs={pcs} setSelected={setSelected} />
      </div>

      <SidePanel pc={selected} />
    </div>
  );
}