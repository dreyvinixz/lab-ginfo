import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { PC } from "../data/pcs";
import type { SelectedItem } from "./SidePanel";

/* ─── Helpers ─────────────────────────────────────────────── */
function getColor(status: string) {
  if (status === "livre")   return "#22c55e";
  if (status === "ocupado") return "#ef4444";
  return "#64748b";
}
function getEmissive(status: string) {
  if (status === "livre")   return "#064d1e";
  if (status === "ocupado") return "#7f1d1d";
  return "#1e293b";
}

/*
  Mapeamento SVG → 3D
  ViewBox: 1280×820  |  Sala SVG: x=[55,1230], y=[78,740]
  Sala 3D:  x=[-9,+9], z=[-5.5,+5.5]
*/
const SX = (x: number) => (x - 55) / (1175 / 18) - 9;
const SZ = (y: number) => (y - 78) / (662 / 11) - 5.5;
const SW = (w: number) => w / (1175 / 18);
const SD = (h: number) => h / (662 / 11);

/* ─── Chão reflexivo ──────────────────────────────────────── */
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 13]} />
      <MeshReflectorMaterial
        blur={[400, 100]} resolution={512}
        mixBlur={1} mixStrength={12}
        depthScale={1} minDepthThreshold={0.85}
        color="#16213e" metalness={0.6} roughness={0.45} mirror={0}
      />
    </mesh>
  );
}

/* ─── Paredes ─────────────────────────────────────────────── */
function Walls() {
  const wallMat = <meshStandardMaterial color="#2d3748" roughness={0.85} />;
  const ceilMat = <meshStandardMaterial color="#1a202c" roughness={1} />;
  return (
    <>
      {/* Fundo */}
      <mesh position={[0, 2, -6.5]} castShadow receiveShadow>
        <boxGeometry args={[19, 4, 0.15]} />{wallMat}
      </mesh>
      {/* Frente */}
      <mesh position={[0, 2, 6.5]} castShadow receiveShadow>
        <boxGeometry args={[19, 4, 0.15]} />{wallMat}
      </mesh>
      {/* Esquerda */}
      <mesh position={[-9.5, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 4, 13]} />{wallMat}
      </mesh>
      {/* Direita */}
      <mesh position={[9.5, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 4, 13]} />{wallMat}
      </mesh>
      {/* Teto */}
      <mesh position={[0, 4.05, 0]} receiveShadow>
        <boxGeometry args={[19, 0.1, 13]} />{ceilMat}
      </mesh>
    </>
  );
}

/* ─── Mesa com pernas ─────────────────────────────────────── */
function Desk({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  const [w, , d] = size;
  const tabletopH = 0.06;
  const legH = 0.72;
  const legR = 0.035;

  const corners: [number, number][] = [
    [-w / 2 + 0.1,  -d / 2 + 0.1],
    [ w / 2 - 0.1,  -d / 2 + 0.1],
    [-w / 2 + 0.1,   d / 2 - 0.1],
    [ w / 2 - 0.1,   d / 2 - 0.1],
  ];

  return (
    <group position={position}>
      {/* Tampo */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, tabletopH, d]} />
        <meshStandardMaterial color="#92400e" roughness={0.55} metalness={0.1} />
      </mesh>
      {/* Superfície mais clara */}
      <mesh position={[0, tabletopH / 2 + 0.005, 0]}>
        <boxGeometry args={[w, 0.01, d]} />
        <meshStandardMaterial color="#b45309" roughness={0.35} />
      </mesh>
      {/* Pernas */}
      {corners.map(([lx, lz], i) => (
        <mesh key={i} position={[lx, -tabletopH / 2 - legH / 2, lz]} castShadow>
          <cylinderGeometry args={[legR, legR, legH, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Mesa de reunião (especial, clicável) ────────────────── */
function MeetingDesk({ onSelect }: { onSelect: (item: SelectedItem) => void }) {
  const [hovered, setHovered] = useState(false);

  // Mesa: x=65 y=215 w=295 h=148
  const cx = SX(65 + 295 / 2);
  const cz = SZ(215 + 148 / 2);
  const w  = SW(295);
  const d  = SD(148);

  const handleClick = () => {
    onSelect({
      type: "meeting",
      data: {
        title: "Reunião Diária - Planejamento Q2",
        scheduledBy: "Andrey",
        time: "14:00 - 15:30",
        date: "Hoje",
        participants: 6,
      },
    });
  };

  return (
    <group
      position={[cx, 0.38, cz]}
      onClick={handleClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Tampo da mesa */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, 0.06, d]} />
        <meshStandardMaterial
          color={hovered ? "#d97706" : "#92400e"}
          roughness={0.5}
          metalness={0.1}
          emissive={hovered ? "#7c2d12" : "#000000"}
          emissiveIntensity={hovered ? 0.4 : 0}
        />
      </mesh>
      {/* Superfície */}
      <mesh position={[0, 0.035, 0]}>
        <boxGeometry args={[w, 0.01, d]} />
        <meshStandardMaterial color={hovered ? "#f59e0b" : "#b45309"} roughness={0.3} />
      </mesh>
      {/* Pernas */}
      {([[-w/2+0.1,-d/2+0.1],[w/2-0.1,-d/2+0.1],[-w/2+0.1,d/2-0.1],[w/2-0.1,d/2-0.1]] as [number,number][]).map(([lx,lz],i)=>(
        <mesh key={i} position={[lx, -0.39, lz]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.72, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
      ))}
      {hovered && (
        <Text position={[0, 0.6, 0]} fontSize={0.18} color="#fbbf24" anchorX="center" anchorY="middle"
          outlineWidth={0.02} outlineColor="#000">
          📅 Clique para detalhes
        </Text>
      )}
    </group>
  );
}

/* ─── TV na parede esquerda (junto à mesa de reunião) ─────── */
function TV() {
  // Centro da TV no SVG: x=95+105/2=147.5, y=245+68/2=279
  const tx = SX(147.5);
  const tz = SZ(279);

  return (
    <group position={[tx, 1.8, tz]}>
      {/* Moldura */}
      <mesh castShadow>
        <boxGeometry args={[0.1, 1.1, 1.7]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Tela */}
      <mesh position={[0.06, 0, 0]}>
        <boxGeometry args={[0.015, 0.98, 1.58]} />
        <meshStandardMaterial
          color="#1d4ed8"
          emissive="#1d4ed8"
          emissiveIntensity={1.8}
          roughness={0}
        />
      </mesh>
      {/* Texto na tela */}
      <Text
        position={[0.08, 0.1, 0]}
        fontSize={0.14}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 2, 0]}
        outlineWidth={0.01}
        outlineColor="#000"
      >
        Lab Ginfo
      </Text>
      <Text
        position={[0.08, -0.15, 0]}
        fontSize={0.09}
        color="#93c5fd"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 2, 0]}
      >
        TV / REUNIÃO
      </Text>
      {/* Luz ambiente da TV */}
      <pointLight position={[1.5, 0, 0]} color="#3b82f6" intensity={3} distance={5} decay={2} />
    </group>
  );
}

/* ─── Luminárias de teto ──────────────────────────────────── */
function CeilingLights() {
  const positions: [number, number, number][] = [
    [-6, 3.9, -3.5], [ 0, 3.9, -3.5], [6, 3.9, -3.5],
    [-6, 3.9,  2.5], [ 0, 3.9,  2.5], [6, 3.9,  2.5],
  ];
  return (
    <>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <boxGeometry args={[1.4, 0.06, 0.28]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
          </mesh>
          <pointLight
            intensity={9}
            distance={9}
            decay={2}
            color="#fff5e0"
            castShadow
            shadow-mapSize={[512, 512]}
          />
        </group>
      ))}
    </>
  );
}

/* ─── Monitor com tela LED ────────────────────────────────── */
function Monitor({
  pc,
  onSelect,
}: {
  pc: PC;
  onSelect: (item: SelectedItem) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const glowRef = useRef<THREE.PointLight>(null);

  const px = SX(pc.x);
  const pz = SZ(pc.y);
  const color    = getColor(pc.status);
  const emissive = getEmissive(pc.status);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      if (pc.status === "ocupado") {
        glowRef.current.intensity = 1.4 + Math.sin(clock.getElapsedTime() * 2.5) * 0.5;
      } else {
        glowRef.current.intensity = pc.status === "offline" ? 0 : 1.2;
      }
    }
  });

  return (
    <group
      position={[px, 0, pz]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={() => onSelect({ type: "pc", data: pc })}
    >
      {/* Base */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.22, 0.04, 0.18]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.75} />
      </mesh>
      {/* Coluna */}
      <mesh position={[0, 0.90, 0]} castShadow>
        <boxGeometry args={[0.04, 0.36, 0.04]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.3} metalness={0.75} />
      </mesh>
      {/* Moldura do monitor */}
      <mesh position={[0, 1.26, 0]} castShadow>
        <boxGeometry args={[0.55, 0.38, 0.05]} />
        <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.85} />
      </mesh>
      {/* Tela LED */}
      <mesh position={[0, 1.26, 0.028]}>
        <boxGeometry args={[0.48, 0.31, 0.005]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={hovered ? 3.5 : 1.8}
          roughness={0.05}
        />
      </mesh>
      {/* Glow do monitor */}
      <pointLight
        ref={glowRef}
        position={[0, 1.26, 0.6]}
        color={color}
        intensity={1.4}
        distance={2.2}
        decay={2}
      />

      {/* Labels flutuantes */}
      <Text
        position={[0, 1.72, 0]}
        fontSize={0.14}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#000"
      >
        {pc.id}
      </Text>
      <Text
        position={[0, 1.57, 0]}
        fontSize={0.10}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {pc.status}
      </Text>

      {hovered && (
        <Text
          position={[0, 1.90, 0]}
          fontSize={0.11}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000"
        >
          {pc.user ? `👤 ${pc.user}` : "🖥 livre"}
        </Text>
      )}
    </group>
  );
}

/* ─── Componente principal ────────────────────────────────── */
export default function Lab3D({
  pcs,
  setSelected,
}: {
  pcs: PC[];
  setSelected: (item: SelectedItem) => void;
}) {
  // Mesas calculadas com a função de mapeamento
  const desks: Array<{ pos: [number, number, number]; size: [number, number, number] }> = [
    // Mesa vertical central
    { pos: [SX(855 + 72/2),   0.38, SZ(95 + 335/2)],   size: [SW(72),  0.06, SD(335)]  },
    // Mesa coluna direita
    { pos: [SX(1150 + 72/2),  0.38, SZ(115 + 325/2)],  size: [SW(72),  0.06, SD(325)]  },
    // Mesa fileira média esquerda
    { pos: [SX(520 + 320/2),  0.38, SZ(535 + 68/2)],   size: [SW(320), 0.06, SD(68)]   },
    // Mesa fileira média direita
    { pos: [SX(875 + 340/2),  0.38, SZ(535 + 68/2)],   size: [SW(340), 0.06, SD(68)]   },
    // Mesa fileira inferior
    { pos: [SX(875 + 340/2),  0.38, SZ(635 + 62/2)],   size: [SW(340), 0.06, SD(62)]   },
  ];

  return (
    <div className="relative w-full h-full bg-gray-950">
      <Canvas
        shadows
        camera={{ position: [0, 10, 13], fov: 50 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      >
        <fog attach="fog" args={["#0a0a1a", 20, 38]} />

        {/* Iluminação global */}
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[6, 10, 4]}
          intensity={1.0}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        <Floor />
        <Walls />
        <CeilingLights />
        <TV />
        <MeetingDesk onSelect={setSelected} />

        {desks.map((d, i) => (
          <Desk key={i} position={d.pos} size={d.size} />
        ))}

        {pcs.map((pc) => (
          <Monitor key={pc.id} pc={pc} onSelect={setSelected} />
        ))}

        <OrbitControls
          minPolarAngle={0.25}
          maxPolarAngle={Math.PI / 2.05}
          minDistance={4}
          maxDistance={22}
          target={[0, 0.8, 0]}
        />
      </Canvas>

      {/* Legenda */}
      <div className="absolute bottom-4 left-4 flex gap-3 text-xs text-white bg-black/65 rounded-lg px-3 py-2 backdrop-blur-sm">
        {[
          { color: "#22c55e", label: "Livre"   },
          { color: "#ef4444", label: "Ocupado" },
          { color: "#64748b", label: "Offline" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>

      <div className="absolute top-4 right-4 text-xs text-gray-400 bg-black/55 px-2 py-1 rounded backdrop-blur-sm">
        🖱 Arraste · Scroll para zoom · Clique para detalhes
      </div>
    </div>
  );
}