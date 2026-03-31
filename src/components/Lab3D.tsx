import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { PC } from "../data/pcs";

function getColor(status: string) {
  if (status === "livre") return "#22c55e";
  if (status === "ocupado") return "#ef4444";
  return "#64748b";
}
function getEmissive(status: string) {
  if (status === "livre") return "#064d1e";
  if (status === "ocupado") return "#7f1d1d";
  return "#1e293b";
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 14]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={15}
        depthScale={1}
        minDepthThreshold={0.85}
        color="#1a1a2e"
        metalness={0.6}
        roughness={0.4}
        mirror={0}
      />
    </mesh>
  );
}

function Walls() {
  const mat = <meshStandardMaterial color="#2d3748" roughness={0.8} />;
  return (
    <>
      <mesh position={[0, 2, -7]} receiveShadow castShadow><boxGeometry args={[20, 4, 0.15]} />{mat}</mesh>
      <mesh position={[0, 2, 7]} receiveShadow castShadow><boxGeometry args={[20, 4, 0.15]} />{mat}</mesh>
      <mesh position={[-10, 2, 0]} receiveShadow castShadow><boxGeometry args={[0.15, 4, 14]} />{mat}</mesh>
      <mesh position={[10, 2, 0]} receiveShadow castShadow><boxGeometry args={[0.15, 4, 14]} />{mat}</mesh>
      <mesh position={[0, 4, 0]} receiveShadow>
        <boxGeometry args={[20, 0.1, 14]} />
        <meshStandardMaterial color="#1a202c" roughness={1} />
      </mesh>
    </>
  );
}

function Desk({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  const [w, h, d] = size;
  const legOffsets: [number, number][] = [
    [-w / 2 + 0.1, -d / 2 + 0.1],
    [w / 2 - 0.1, -d / 2 + 0.1],
    [-w / 2 + 0.1, d / 2 - 0.1],
    [w / 2 - 0.1, d / 2 - 0.1],
  ];
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#92400e" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, h / 2 + 0.01, 0]}>
        <boxGeometry args={[w, 0.02, d]} />
        <meshStandardMaterial color="#b45309" roughness={0.4} />
      </mesh>
      {legOffsets.map(([lx, lz], i) => (
        <mesh key={i} position={[lx, -h / 2 - 0.35, lz]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Monitor({ pc, onSelect }: { pc: PC; onSelect: (pc: PC) => void }) {
  const [hovered, setHovered] = useState(false);
  const glowRef = useRef<THREE.PointLight>(null);

  // Mapeia SVG (viewBox 0 0 1000 520) para espaço 3D (-9..+9, -6.5..+6.5)
  const px = pc.x / 55 - 9;
  const pz = pc.y / 40 - 6.5;

  const color = getColor(pc.status);
  const emissive = getEmissive(pc.status);

  useFrame(({ clock }) => {
    if (glowRef.current && pc.status === "ocupado") {
      glowRef.current.intensity = 1.5 + Math.sin(clock.getElapsedTime() * 2) * 0.5;
    }
  });

  return (
    <group
      position={[px, 0, pz]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={() => onSelect(pc)}
    >
      {/* Base */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.08, 0.04, 0.25]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Coluna */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <boxGeometry args={[0.04, 0.32, 0.04]} />
        <meshStandardMaterial color="#111" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Moldura */}
      <mesh position={[0, 1.22, 0]} castShadow>
        <boxGeometry args={[0.5, 0.35, 0.04]} />
        <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Tela LED */}
      <mesh position={[0, 1.22, 0.025]}>
        <boxGeometry args={[0.44, 0.29, 0.005]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={hovered ? 3 : 1.5}
          roughness={0.1}
        />
      </mesh>
      {/* Luz ambiente do monitor */}
      <pointLight
        ref={glowRef}
        position={[0, 1.22, 0.5]}
        color={color}
        intensity={pc.status === "offline" ? 0 : 1.5}
        distance={2}
        decay={2}
      />
      <Text position={[0, 1.65, 0]} fontSize={0.13} color="white" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="black">
        {pc.id}
      </Text>
      <Text position={[0, 1.5, 0]} fontSize={0.09} color={color} anchorX="center" anchorY="middle">
        {pc.status}
      </Text>
      {hovered && (
        <Text position={[0, 1.82, 0]} fontSize={0.1} color="#facc15" anchorX="center" anchorY="middle" outlineWidth={0.015} outlineColor="#000">
          {pc.user ? `👤 ${pc.user}` : "🖥 livre"}
        </Text>
      )}
    </group>
  );
}

function TV() {
  return (
    <group position={[-9.85, 2.2, 0.5]}>
      <mesh castShadow>
        <boxGeometry args={[0.12, 1.1, 1.6]} />
        <meshStandardMaterial color="#111" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0.07, 0, 0]}>
        <boxGeometry args={[0.01, 0.95, 1.45]} />
        <meshStandardMaterial color="#1e3a5f" emissive="#1e3a5f" emissiveIntensity={2} roughness={0} />
      </mesh>
      <pointLight position={[1, 0, 0]} color="#3b82f6" intensity={2} distance={4} decay={2} />
      <Text position={[0.1, 0, 0]} fontSize={0.12} color="white" anchorX="center" anchorY="middle" rotation={[0, Math.PI / 2, 0]}>
        Lab Ginfo
      </Text>
    </group>
  );
}

function CeilingLights() {
  const positions: [number, number, number][] = [
    [-5, 3.85, -3], [0, 3.85, -3], [5, 3.85, -3],
    [-5, 3.85, 3],  [0, 3.85, 3],  [5, 3.85, 3],
  ];
  return (
    <>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <boxGeometry args={[1.2, 0.06, 0.3]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1.5} />
          </mesh>
          <pointLight intensity={8} distance={8} decay={2} color="#fff8e7" castShadow shadow-mapSize={[512, 512]} />
        </group>
      ))}
    </>
  );
}

// Converte bounding box SVG (viewBox 1000x520) → posição/tamanho 3D
function svgToDesk(sx: number, sy: number, sw: number, sh: number, dy = 0.7) {
  const cx = (sx + sw / 2) / 55 - 9;
  const cz = (sy + sh / 2) / 40 - 6.5;
  return {
    pos: [cx, dy / 2, cz] as [number, number, number],
    size: [sw / 55, dy, sh / 40] as [number, number, number],
  };
}

export default function Lab3D({ pcs, setSelected }: { pcs: PC[]; setSelected: (pc: PC) => void }) {
  const desks = [
    svgToDesk(20, 120, 250, 130),
    svgToDesk(600, 20, 50, 250),
    svgToDesk(400, 340, 500, 60),
    svgToDesk(650, 450, 250, 40),
  ];

  return (
    <div className="relative w-full h-full bg-gray-950">
      <Canvas
        shadows
        camera={{ position: [0, 9, 12], fov: 52 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <fog attach="fog" args={["#0a0a1a", 18, 35]} />
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[8, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
        />

        <Floor />
        <Walls />
        <CeilingLights />
        <TV />

        {desks.map((d, i) => (
          <Desk key={i} position={d.pos} size={d.size} />
        ))}

        {pcs.map((pc) => (
          <Monitor key={pc.id} pc={pc} onSelect={setSelected} />
        ))}

        <OrbitControls
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={4}
          maxDistance={20}
          target={[0, 1, 0]}
        />
      </Canvas>

      {/* Legenda */}
      <div className="absolute bottom-4 left-4 flex gap-3 text-xs text-white bg-black/60 rounded-lg px-3 py-2 backdrop-blur">
        {[
          { color: "#22c55e", label: "Livre" },
          { color: "#ef4444", label: "Ocupado" },
          { color: "#64748b", label: "Offline" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>

      <div className="absolute top-4 right-4 text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">
        🖱 Arraste · Scroll para zoom · Clique no PC para detalhes
      </div>
    </div>
  );
}
