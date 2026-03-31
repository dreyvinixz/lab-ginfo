import { useState } from "react";
import { PC } from "../data/pcs";

function getColor(status: string) {
  if (status === "livre") return "#22c55e";
  if (status === "ocupado") return "#ef4444";
  return "#64748b";
}

export default function Lab2D({
  pcs,
  setSelected,
}: {
  pcs: PC[];
  setSelected: (pc: PC) => void;
}) {
  const [hovered, setHovered] = useState<PC | null>(null);

  return (
    <div className="relative w-full h-full bg-gray-200">
      <svg viewBox="0 0 1000 520" className="w-full h-full">

        {/* Sala */}
        <rect x="20" y="20" width="960" height="480" stroke="black" fill="none"/>

        {/* TV */}
        <rect x="20" y="150" width="80" height="80" fill="red"/>

        {/* Mesas */}
        <rect x="20" y="120" width="250" height="130" fill="orange" opacity="0.3"/>
        <rect x="600" y="20" width="50" height="250" fill="orange" opacity="0.3"/>
        <rect x="400" y="340" width="500" height="60" fill="orange" opacity="0.3"/>
        <rect x="650" y="450" width="250" height="40" fill="orange" opacity="0.3"/>

        {/* PCs */}
        {pcs.map(pc => (
          <rect
            key={pc.id}
            x={pc.x}
            y={pc.y}
            width={30}
            height={30}
            fill={getColor(pc.status)}
            onMouseEnter={() => setHovered(pc)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setSelected(pc)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </svg>

      {/* 🔥 Tooltip */}
      {hovered && (
        <div
          className="absolute bg-black text-white text-sm px-2 py-1 rounded"
          style={{
            left: hovered.x + 40,
            top: hovered.y,
          }}
        >
          {hovered.id} — {hovered.status}
        </div>
      )}
    </div>
  );
}