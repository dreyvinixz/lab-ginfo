import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  MeshReflectorMaterial,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";
import type { PC } from "../data/pcs";
import type { SelectedItem } from "./SidePanel";

/* ─── Helpers ─────────────────────────────────────────────── */
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

/*
  Mapeamento SVG → 3D
  ViewBox: 1280×820  |  Sala SVG: x=[55,1230], y=[78,740]
  Sala 3D:  x=[-9,+9], z=[-5.5,+5.5]
*/
const SX = (x: number) => (x - 55) / (1175 / 18) - 9;
const SZ = (y: number) => (y - 78) / (662 / 11) - 5.5;
const SW = (w: number) => w / (1175 / 18);
const SD = (h: number) => h / (662 / 11);

/* ─── Piso ────────────────────────────────────────────────── */
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[34, 22]} />
      <MeshReflectorMaterial
        blur={[250, 80]}
        resolution={1024}
        mixBlur={0.8}
        mixStrength={10}
        depthScale={0.7}
        minDepthThreshold={0.9}
        color="#1f2937"
        metalness={0.45}
        roughness={0.55}
        mirror={0.12}
      />
    </mesh>
  );
}

/* ─── Fundo aberto ────────────────────────────────────────── */
function Backdrop() {
  return (
    <>
      <mesh position={[0, 2.2, -7.2]} receiveShadow>
        <boxGeometry args={[24, 4.6, 0.12]} />
        <meshStandardMaterial color="#1f2937" roughness={0.95} />
      </mesh>

      <mesh position={[-10.8, 1.6, -2.2]} rotation={[0, 0.18, 0]} receiveShadow>
        <boxGeometry args={[0.12, 3.2, 8]} />
        <meshStandardMaterial color="#273449" roughness={0.95} />
      </mesh>

      <mesh position={[10.8, 1.6, -2.2]} rotation={[0, -0.18, 0]} receiveShadow>
        <boxGeometry args={[0.12, 3.2, 8]} />
        <meshStandardMaterial color="#273449" roughness={0.95} />
      </mesh>
    </>
  );
}

/* ─── Mesa ────────────────────────────────────────────────── */
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
    [-w / 2 + 0.1, -d / 2 + 0.1],
    [w / 2 - 0.1, -d / 2 + 0.1],
    [-w / 2 + 0.1, d / 2 - 0.1],
    [w / 2 - 0.1, d / 2 - 0.1],
  ];

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, tabletopH, d]} />
        <meshStandardMaterial color="#92400e" roughness={0.55} metalness={0.08} />
      </mesh>

      <mesh position={[0, tabletopH / 2 + 0.005, 0]}>
        <boxGeometry args={[w, 0.01, d]} />
        <meshStandardMaterial color="#b45309" roughness={0.35} />
      </mesh>

      {corners.map(([lx, lz], i) => (
        <mesh key={i} position={[lx, -tabletopH / 2 - legH / 2, lz]} castShadow>
          <cylinderGeometry args={[legR, legR, legH, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Mesa de reunião ─────────────────────────────────────── */
function MeetingDesk({ onSelect }: { onSelect: (item: SelectedItem) => void }) {
  const [hovered, setHovered] = useState(false);

  const cx = SX(65 + 295 / 2);
  const cz = SZ(215 + 148 / 2);
  const w = SW(295);
  const d = SD(148);

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
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, 0.06, d]} />
        <meshStandardMaterial
          color={hovered ? "#d97706" : "#92400e"}
          roughness={0.5}
          metalness={0.08}
          emissive={hovered ? "#7c2d12" : "#000000"}
          emissiveIntensity={hovered ? 0.35 : 0}
        />
      </mesh>

      <mesh position={[0, 0.035, 0]}>
        <boxGeometry args={[w, 0.01, d]} />
        <meshStandardMaterial color={hovered ? "#f59e0b" : "#b45309"} roughness={0.3} />
      </mesh>

      {(
        [
          [-w / 2 + 0.1, -d / 2 + 0.1],
          [w / 2 - 0.1, -d / 2 + 0.1],
          [-w / 2 + 0.1, d / 2 - 0.1],
          [w / 2 - 0.1, d / 2 - 0.1],
        ] as [number, number][]
      ).map(([lx, lz], i) => (
        <mesh key={i} position={[lx, -0.39, lz]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.72, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
      ))}

      {hovered && (
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.18}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          📅 Clique para detalhes
        </Text>
      )}
    </group>
  );
}

/* ─── TV ──────────────────────────────────────────────────── */
function TV() {
  const tx = SX(147.5);
  const tz = SZ(279);

  return (
    <group position={[tx, 1.8, tz]}>
      <mesh castShadow>
        <boxGeometry args={[0.1, 1.1, 1.7]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.85} />
      </mesh>

      <mesh position={[0.06, 0, 0]}>
        <boxGeometry args={[0.015, 0.98, 1.58]} />
        <meshStandardMaterial
          color="#1d4ed8"
          emissive="#1d4ed8"
          emissiveIntensity={1.8}
          roughness={0}
        />
      </mesh>

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

      <pointLight position={[1.5, 0, 0]} color="#3b82f6" intensity={2.2} distance={5} decay={2} />
    </group>
  );
}

/* ─── Luzes ───────────────────────────────────────────────── */
function CeilingLights() {
  const positions: [number, number, number][] = [
    [-6, 3.8, -3.5],
    [0, 3.8, -3.5],
    [6, 3.8, -3.5],
    [-6, 3.8, 2.5],
    [0, 3.8, 2.5],
    [6, 3.8, 2.5],
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <boxGeometry args={[1.4, 0.05, 0.28]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1.5} />
          </mesh>
          <pointLight intensity={5.5} distance={8} decay={2} color="#fff5e0" castShadow />
        </group>
      ))}
    </>
  );
}

/* ─── Monitor ─────────────────────────────────────────────── */
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
  const color = getColor(pc.status);
  const emissive = getEmissive(pc.status);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      if (pc.status === "ocupado") {
        glowRef.current.intensity = 1.2 + Math.sin(clock.getElapsedTime() * 2.5) * 0.35;
      } else {
        glowRef.current.intensity = pc.status === "offline" ? 0 : 0.9;
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
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.22, 0.04, 0.18]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.75} />
      </mesh>

      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.04, 0.36, 0.04]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.3} metalness={0.75} />
      </mesh>

      <mesh position={[0, 1.26, 0]} castShadow>
        <boxGeometry args={[0.55, 0.38, 0.05]} />
        <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.85} />
      </mesh>

      <mesh position={[0, 1.26, 0.028]}>
        <boxGeometry args={[0.48, 0.31, 0.005]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={hovered ? 3.2 : 1.6}
          roughness={0.05}
        />
      </mesh>

      <pointLight
        ref={glowRef}
        position={[0, 1.26, 0.6]}
        color={color}
        intensity={1}
        distance={2}
        decay={2}
      />

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
        fontSize={0.1}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {pc.status}
      </Text>

      {hovered && (
        <Text
          position={[0, 1.9, 0]}
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

/* ─── Navegação por duplo clique ──────────────────────────── */
function CameraNavigator({
  moveTarget,
  controlsRef,
}: {
  moveTarget: THREE.Vector3 | null;
  controlsRef: React.RefObject<any>;
}) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0.9, 0));
  const desiredLookAt = useRef(new THREE.Vector3(0, 0.9, 0));
  const desiredCameraPos = useRef(camera.position.clone());

  useEffect(() => {
    if (!moveTarget) return;

    desiredLookAt.current.set(moveTarget.x, 0.9, moveTarget.z);

    const offset = new THREE.Vector3(0, 5.2, 7.4);
    desiredCameraPos.current = new THREE.Vector3(
      moveTarget.x + offset.x,
      offset.y,
      moveTarget.z + offset.z
    );
  }, [moveTarget]);

  useFrame(() => {
    camera.position.lerp(desiredCameraPos.current, 0.08);
    currentLookAt.current.lerp(desiredLookAt.current, 0.08);

    if (controlsRef.current) {
      controlsRef.current.target.copy(currentLookAt.current);
      controlsRef.current.update();
    } else {
      camera.lookAt(currentLookAt.current);
    }
  });

  return null;
}

/* ─── Área de duplo clique no chão ────────────────────────── */
function WalkSurface({
  onMove,
}: {
  onMove: (point: THREE.Vector3) => void;
}) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.002, 0]}
      onDoubleClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onMove(e.point.clone());
      }}
      visible={false}
    >
      <planeGeometry args={[34, 22]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

/* ─── Cena principal ──────────────────────────────────────── */
export default function Lab3D({
  pcs,
  setSelected,
}: {
  pcs: PC[];
  setSelected: (item: SelectedItem) => void;
}) {
  const controlsRef = useRef<any>(null);
  const [moveTarget, setMoveTarget] = useState<THREE.Vector3 | null>(null);

  const desks: Array<{ pos: [number, number, number]; size: [number, number, number] }> = useMemo(
    () => [
      { pos: [SX(855 + 72 / 2), 0.38, SZ(95 + 335 / 2)], size: [SW(72), 0.06, SD(335)] },
      { pos: [SX(1150 + 72 / 2), 0.38, SZ(115 + 325 / 2)], size: [SW(72), 0.06, SD(325)] },
      { pos: [SX(520 + 320 / 2), 0.38, SZ(535 + 68 / 2)], size: [SW(320), 0.06, SD(68)] },
      { pos: [SX(875 + 340 / 2), 0.38, SZ(535 + 68 / 2)], size: [SW(340), 0.06, SD(68)] },
      { pos: [SX(875 + 340 / 2), 0.38, SZ(635 + 62 / 2)], size: [SW(340), 0.06, SD(62)] },
    ],
    []
  );

  return (
    <div className="relative h-full w-full bg-gray-950">
      <Canvas
        shadows
        camera={{ position: [0, 5.2, 9.2], fov: 48 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        className="!h-full !w-full"
      >
        <color attach="background" args={["#0b1220"]} />
        <Environment preset="city" />

        <ambientLight intensity={0.35} />

        <directionalLight
          position={[8, 12, 6]}
          intensity={1.15}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-14}
          shadow-camera-right={14}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
        />

        <Floor />
        <WalkSurface onMove={setMoveTarget} />
        <Backdrop />
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
          ref={controlsRef}
          target={[0, 0.9, 0]}
          minPolarAngle={0.45}
          maxPolarAngle={Math.PI / 2.18}
          minDistance={4.5}
          maxDistance={18}
          enableDamping
          dampingFactor={0.08}
        />

        <CameraNavigator moveTarget={moveTarget} controlsRef={controlsRef} />
      </Canvas>

      <div className="absolute bottom-4 left-4 flex gap-3 rounded-lg bg-black/65 px-3 py-2 text-xs text-white backdrop-blur-sm">
        {[
          { color: "#22c55e", label: "Livre" },
          { color: "#ef4444", label: "Ocupado" },
          { color: "#64748b", label: "Offline" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>

      <div className="absolute right-4 top-4 rounded bg-black/55 px-2 py-1 text-xs text-gray-300 backdrop-blur-sm">
        🖱 Arraste · Scroll para zoom · Duplo clique no chão para mover
      </div>
    </div>
  );
}