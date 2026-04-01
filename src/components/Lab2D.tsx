import { useState, useCallback, memo } from "react";
import type { MouseEvent } from "react";
import type { PC } from "../data/pcs";
import type { SelectedItem } from "./SidePanel";

function getPCColor(status: string): string {
  switch (status) {
    case "livre":
      return "#22c55e";
    case "Em uso":
      return "#ef4444";
    case "offline":
      return "#6b7280";
    default:
      return "#64748b";
  }
}

const PCElement = memo(
  ({
    pc,
    onClick,
    onMouseMove,
    onMouseLeave,
  }: {
    pc: PC;
    onClick: (pc: PC) => void;
    onMouseMove: (e: MouseEvent<SVGRectElement>, pc: PC) => void;
    onMouseLeave: () => void;
  }) => {
    return (
      <g>
        <rect
          x={pc.x - 6}
          y={pc.y - 14}
          width="50"
          height="30"
          rx="3"
          fill="#f5e8b3"
          stroke="#6b5e3d"
          strokeWidth="2.5"
        />

        <rect
          x={pc.x}
          y={pc.y - 11}
          width="39"
          height="26"
          rx="2"
          fill={getPCColor(pc.status)}
          stroke="#1f2937"
          strokeWidth="3"
          onMouseMove={(e) => onMouseMove(e, pc)}
          onMouseLeave={onMouseLeave}
          onClick={() => onClick(pc)}
          style={{ cursor: "pointer" }}
        />

        <rect
          x={pc.x + 10}
          y={pc.y + 14}
          width="19"
          height="5"
          rx="1"
          fill="#475569"
        />
      </g>
    );
  }
);

PCElement.displayName = "PCElement";

export default function Lab2D({
  pcs,
  setSelected,
}: {
  pcs: PC[];
  setSelected: (item: SelectedItem) => void;
}) {
  const [tooltip, setTooltip] = useState<{ pc: PC; x: number; y: number } | null>(null);

  const handleMouseMove = useCallback((event: MouseEvent<SVGRectElement>, pc: PC) => {
    const container = (
      event.currentTarget.ownerSVGElement?.parentElement as HTMLDivElement | null
    )?.getBoundingClientRect();

    if (!container) return;

    setTooltip({
      pc,
      x: event.clientX - container.left + 15,
      y: event.clientY - container.top + 12,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const handlePCClick = useCallback(
    (pc: PC) => {
      setSelected({ type: "pc", data: pc });
    },
    [setSelected]
  );

  const handleMeetingClick = useCallback(() => {
    setTooltip(null);
    setSelected({
      type: "meeting",
      data: {
        title: "Reunião Diária - Planejamento Q2",
        scheduledBy: "Andrey",
        time: "14:00 - 15:30",
        date: "Hoje",
        participants: 6,
      },
    });
  }, [setSelected]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#d8d8cf]">
      <svg viewBox="0 0 1280 820" className="h-full w-full">
        <rect x="0" y="0" width="1280" height="820" fill="#d8d8cf" />

        <text
          x="640"
          y="34"
          textAnchor="middle"
          fontSize="32"
          fontWeight="700"
          fill="#0f172a"
        >
          LAB - 2D
        </text>

        <rect
          x="55"
          y="78"
          width="1175"
          height="722"
          rx="12"
          fill="none"
          stroke="#273142"
          strokeWidth="6"
        />

        {/* Mesa de reunião clicável */}
        <g>
          <rect
            x="65"
            y="215"
            width="295"
            height="148"
            fill="#e8dc97"
            fillOpacity="0.85"
            stroke="#938d6c"
            strokeWidth="3"
            onClick={handleMeetingClick}
            style={{ cursor: "pointer" }}
          />
          <rect
            x="85"
            y="245"
            width="105"
            height="68"
            rx="4"
            fill="#ef4444"
            stroke="#1f2937"
            strokeWidth="3"
            onClick={handleMeetingClick}
            style={{ cursor: "pointer" }}
          />
          <text
            x="147"
            y="235"
            textAnchor="middle"
            fontSize="16"
            fill="#374151"
            fontWeight="600"
            onClick={handleMeetingClick}
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            TV / REUNIÃO
          </text>
        </g>

        <rect
          x="855"
          y="95"
          width="72"
          height="335"
          fill="#e8dc97"
          fillOpacity="0.78"
          stroke="#938d6c"
          strokeWidth="2"
        />
        <rect
          x="1150"
          y="115"
          width="72"
          height="325"
          fill="#e8dc97"
          fillOpacity="0.78"
          stroke="#938d6c"
          strokeWidth="2"
        />
        <rect
          x="710"
          y="615"
          width="250"
          height="62"
          fill="#e8dc97"
          fillOpacity="0.78"
          stroke="#938d6c"
          strokeWidth="2"
        />
        <rect
          x="970"
          y="535"
          width="250"
          height="68"
          fill="#e8dc97"
          fillOpacity="0.78"
          stroke="#938d6c"
          strokeWidth="2"
        />
        <rect
          x="970"
          y="615"
          width="250"
          height="62"
          fill="#e8dc97"
          fillOpacity="0.78"
          stroke="#938d6c"
          strokeWidth="2"
        />

        <rect
          x="970"
          y="720"
          width="250"
          height="62"
          fill="#e8dc97"
          fillOpacity="0.78"
          stroke="#938d6c"
          strokeWidth="2"
        />

        {pcs.map((pc) => (
          <PCElement
            key={pc.id}
            pc={pc}
            onClick={handlePCClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        ))}

        <g transform="translate(65, 730)">
          <rect width="285" height="90" rx="6" fill="#ebe9dc" stroke="#9ca3af" />
          <text x="12" y="18" fontSize="16" fontWeight="600" fill="#111827">
            Legenda
          </text>

          <rect x="15" y="29" width="18" height="18" fill="#e8dc97" stroke="#6b5e3d" />
          <text x="40" y="41" fontSize="14" fill="#111827">
            Mesa
          </text>

          <rect x="155" y="29" width="18" height="18" fill="#22c55e" stroke="#1f2937" />
          <text x="180" y="41" fontSize="14" fill="#111827">
            PC Livre
          </text>

          <rect x="155" y="51" width="18" height="18" fill="#ef4444" stroke="#1f2937" />
          <text x="180" y="63" fontSize="14" fill="#111827">
            PC em Uso
          </text>

          <rect x="15" y="51" width="18" height="18" fill="#6b7280" stroke="#1f2937" />
          <text x="40" y="63" fontSize="14" fill="#111827">
            PC Offline
          </text>
        </g>
      </svg>

      {tooltip && (
        <div
          className="pointer-events-none absolute z-20 rounded-md bg-black/90 px-3 py-2 text-xs sm:text-sm text-white shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-semibold">{tooltip.pc.id}</div>
          <div>Status: {tooltip.pc.status}</div>
          <div>Usuário: {tooltip.pc.user || "Nenhum"}</div>
        </div>
      )}
    </div>
  );
}