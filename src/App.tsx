import { useState } from "react";
import Lab2D from "./components/Lab2D";
import Lab3D from "./components/Lab3D";
import SidePanel from "./components/SidePanel";
import { initialPCs } from "./data/pcs";
import type { PC } from "./data/pcs";
import type { SelectedItem } from "./components/SidePanel";

export default function App() {
  const [pcs] = useState<PC[]>(initialPCs);
  const [selected, setSelected] = useState<SelectedItem>(null);
  const [view, setView] = useState<"2D" | "3D">("3D");

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <div className="relative min-w-0 flex-1">
        <div className="absolute left-4 top-4 z-20 flex gap-2">
          <button
            onClick={() => setView("2D")}
            className={`rounded px-4 py-2 ${
              view === "2D" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            2D View
          </button>

          <button
            onClick={() => setView("3D")}
            className={`rounded px-4 py-2 ${
              view === "3D" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            3D View
          </button>
        </div>

        {view === "2D" ? (
          <Lab2D pcs={pcs} setSelected={setSelected} />
        ) : (
          <Lab3D pcs={pcs} setSelected={setSelected} />
        )}
      </div>

      <SidePanel selected={selected} />
    </div>
  );
}