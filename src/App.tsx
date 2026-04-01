import { useState, useEffect } from "react";
import Lab2D from "./components/Lab2D";
import Lab3D from "./components/Lab3D";
import SidePanel from "./components/SidePanel";
import { initialPCs } from "./data/pcs";
import type { PC } from "./data/pcs";
import type { SelectedItem } from "./components/SidePanel";

export default function App() {
  const [pcs] = useState<PC[]>(initialPCs);
  const [selected, setSelected] = useState<SelectedItem>(null);
  const [view, setView] = useState<"2D" | "3D">("2D");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (selected && isMobile) {
      setShowMobilePanel(true);
    } else if (!isMobile) {
      setShowMobilePanel(false);
    }
  }, [selected, isMobile]);

  const closeMobilePanel = () => {
    setShowMobilePanel(false);
    setSelected(null);
  };

  return (
    <div className="flex h-screen w-full bg-black">
      <div className={`relative min-w-0 flex-1 ${view === "3D" ? "pt-16" : ""}`}>
        <div className="absolute left-4 top-4 z-30 flex gap-2">
          <button
            onClick={() => setView("2D")}
            className={`rounded px-3 py-2 text-xs sm:text-sm font-semibold transition ${
              view === "2D" ? "bg-blue-600 text-white" : "bg-white/90 text-gray-800"
            }`}
          >
            2D View
          </button>

          <button
            onClick={() => setView("3D")}
            className={`rounded px-3 py-2 text-xs sm:text-sm font-semibold transition ${
              view === "3D" ? "bg-blue-600 text-white" : "bg-white/90 text-gray-800"
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

      {/* Desktop SidePanel */}
      {!isMobile && <SidePanel selected={selected} />}

      {/* Mobile SidePanel Overlay */}
      {isMobile && showMobilePanel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50" onClick={closeMobilePanel}></div>
          <div className="w-80 bg-gray-900 shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Detalhes</h3>
              <button
                onClick={closeMobilePanel}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <SidePanel selected={selected} />
          </div>
        </div>
      )}
    </div>
  );
}