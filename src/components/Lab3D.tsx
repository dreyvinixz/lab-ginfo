import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PointerLockControls,
  Text,
} from "@react-three/drei";
import * as THREE from "three";
import type { PC } from "../data/pcs";
import type { SelectedItem } from "./SidePanel";

/* ───────────────── Helpers ───────────────── */
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
  SVG → 3D
  ViewBox: 1280×820 | Sala SVG: x=[55,1230], y=[78,740]
  Sala 3D: x=[-9,+9], z=[-5.5,+5.5]
*/
const SX = (x: number) => (x - 55) / (1175 / 18) - 9;
const SZ = (y: number) => (y - 78) / (662 / 11) - 5.5;
const SW = (w: number) => w / (1175 / 18);
const SD = (h: number) => h / (662 / 11);

/* ───────────────── Piso ───────────────── */
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[34, 22]} />
      <meshStandardMaterial
        color="#2a2a3e"
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

/* ───────────────── Fundo ───────────────── */
function Backdrop() {
  return (
    <>
      <mesh position={[0, 2.2, -7.2]}>
        <boxGeometry args={[24, 4.6, 0.12]} />
        <meshStandardMaterial color="#1f2937" roughness={0.95} />
      </mesh>

      <mesh position={[-10.8, 1.6, -2.2]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[0.12, 3.2, 8]} />
        <meshStandardMaterial color="#273449" roughness={0.95} />
      </mesh>

      <mesh position={[10.8, 1.6, -2.2]} rotation={[0, -0.18, 0]}>
        <boxGeometry args={[0.12, 3.2, 8]} />
        <meshStandardMaterial color="#273449" roughness={0.95} />
      </mesh>
    </>
  );
}

/* ───────────────── Mesa ───────────────── */
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

/* ───────────────── Mesa de reunião ───────────────── */
function MeetingDesk({ onSelect }: { onSelect: (item: SelectedItem) => void }) {
  const [hovered, setHovered] = useState(false);

  const cx = SX(65 + 295 / 2);
  const cz = SZ(215 + 148 / 2);
  const w = SW(295);
  const d = SD(148);

  return (
    <group
      position={[cx, 0.38, cz]}
      onClick={() =>
        onSelect({
          type: "meeting",
          data: {
            title: "Reunião Diária - Planejamento Q2",
            scheduledBy: "Andrey",
            time: "14:00 - 15:30",
            date: "Hoje",
            participants: 6,
          },
        })
      }
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
          fontSize={0.25}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000"
        >
          📅 Reunião
        </Text>
      )}
    </group>
  );
}

/* ───────────────── TV ───────────────── */
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
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 2, 0]}
        outlineWidth={0.015}
        outlineColor="#000"
      >
        Lab Ginfo
      </Text>

      <Text
        position={[0.08, -0.15, 0]}
        fontSize={0.12}
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

/* ───────────────── Luzes ───────────────── */
function CeilingLights() {
  const positions: [number, number, number][] = [
    [-4, 3.8, -2],
    [4, 3.8, -2],
    [-4, 3.8, 3],
    [4, 3.8, 3],
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <boxGeometry args={[1.2, 0.05, 0.25]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1.0} />
          </mesh>
          <pointLight intensity={4.5} distance={6} decay={2} color="#fff8e7" />
        </group>
      ))}
    </>
  );
}

/* ───────────────── Monitor ───────────────── */
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
    if (!glowRef.current) return;

    const t = clock.getElapsedTime();
    if (pc.status === "ocupado") {
      glowRef.current.intensity = 1.2 + Math.sin(t * 1.5) * 0.2;
    } else {
      glowRef.current.intensity = pc.status === "offline" ? 0 : 0.8;
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

      {hovered && (
        <Text
          position={[0, 1.85, 0]}
          fontSize={0.15}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          {pc.id}
        </Text>
      )}
    </group>
  );
}

/* ───────────────── Movimento FPS ───────────────── */
function FirstPersonMovement({
  controlsRef,
  colliders,
}: {
  controlsRef: React.RefObject<any>;
  colliders: Array<{ pos: [number, number, number]; size: [number, number, number] }>;
}) {
  const { camera } = useThree();
  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
  });

  const checkCollision = (newPos: THREE.Vector3) => {
    for (const { pos, size } of colliders) {
      const [cx, cy, cz] = pos;
      const [sx, sy, sz] = size;

      if (
        newPos.x > cx - sx / 2 - 0.45 &&
        newPos.x < cx + sx / 2 + 0.45 &&
        newPos.z > cz - sz / 2 - 0.45 &&
        newPos.z < cz + sz / 2 + 0.45 &&
        newPos.y < cy + sy / 2 + 1 &&
        newPos.y > cy - sy / 2
      ) {
        return true;
      }
    }

    if (Math.abs(newPos.x) > 11.5 || Math.abs(newPos.z) > 8.5) return true;
    return false;
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "w") keys.current.w = true;
      if (key === "a") keys.current.a = true;
      if (key === "s") keys.current.s = true;
      if (key === "d") keys.current.d = true;
      if (key === "shift") keys.current.shift = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "w") keys.current.w = false;
      if (key === "a") keys.current.a = false;
      if (key === "s") keys.current.s = false;
      if (key === "d") keys.current.d = false;
      if (key === "shift") keys.current.shift = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls || !controls.isLocked) return;

    const speed = keys.current.shift ? 5.2 : 3.2;
    const step = speed * delta;

    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(direction, camera.up).normalize();

    const newPos = camera.position.clone();

    if (keys.current.w) newPos.addScaledVector(direction, step);
    if (keys.current.s) newPos.addScaledVector(direction, -step);
    if (keys.current.a) newPos.addScaledVector(right, -step);
    if (keys.current.d) newPos.addScaledVector(right, step);

    newPos.y = 1.65;

    if (!checkCollision(newPos)) {
      camera.position.copy(newPos);
    }
  });

  return null;
}

/* ───────────────── Braços em primeira pessoa ───────────────── */
function FirstPersonHands() {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    camera.add(groupRef.current);

    return () => {
      if (groupRef.current) {
        camera.remove(groupRef.current);
      }
    };
  }, [camera]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const t = clock.getElapsedTime();
    groupRef.current.position.y = -0.28 + Math.sin(t * 3) * 0.01;
  });

  return (
    <group ref={groupRef} position={[0, -0.28, -0.45]}>
      <mesh position={[-0.18, -0.08, 0]}>
        <boxGeometry args={[0.08, 1.0, 0.08]} />
        <meshStandardMaterial color="#9a3412" roughness={0.8} />
      </mesh>

      <mesh position={[0.18, -0.08, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#9a3412" roughness={0.8} />
      </mesh>

      <mesh position={[-0.18, -0.28, 0.03]}>
        <boxGeometry args={[0.15, 0.1, 0.14]} />
        <meshStandardMaterial color="#f1c27d" roughness={0.9} />
      </mesh>

      <mesh position={[0.18, -0.28, 0.03]}>
        <boxGeometry args={[0.15, 0.1, 0.14]} />
        <meshStandardMaterial color="#f1c27d" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ───────────────── Auto lock do mouse ───────────────── */
function FPSLockOnEnter({
  entered,
  controlsRef,
}: {
  entered: boolean;
  controlsRef: React.RefObject<any>;
}) {
  useEffect(() => {
    if (!entered) return;

    const id = window.setTimeout(() => {
      controlsRef.current?.lock?.();
    }, 50);

    return () => window.clearTimeout(id);
  }, [entered, controlsRef]);

  return null;
}

/* ───────────────── Cena principal ───────────────── */
function SceneContent({
  pcs,
  setSelected,
  entered,
  controlsRef,
}: {
  pcs: PC[];
  setSelected: (item: SelectedItem) => void;
  entered: boolean;
  controlsRef: React.RefObject<any>;
}) {
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
    <>
      <color attach="background" args={["#1a1a2e"]} />

      <ambientLight intensity={0.8} />

      <directionalLight
        position={[8, 12, 6]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <Floor />
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

      {entered ? (
        <>
          <PointerLockControls ref={controlsRef} />
          <FPSLockOnEnter entered={entered} controlsRef={controlsRef} />
          <FirstPersonMovement controlsRef={controlsRef} colliders={desks} />
          <FirstPersonHands />
        </>
      ) : (
        <OrbitControls
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={4}
          maxDistance={20}
          target={[0, 1, 0]}
        />
      )}
    </>
  );
}

export default function Lab3D({
  pcs,
  setSelected,
}: {
  pcs: PC[];
  setSelected: (item: SelectedItem) => void;
}) {
  const controlsRef = useRef<any>(null);
  const [entered, setEntered] = useState(false);

  return (
    <div className="relative h-full w-full bg-black">
      <Canvas
        shadows
        camera={{ position: [0, 1.65, 5], fov: 70 }}
        gl={{
          antialias: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        className="!h-full !w-full"
      >
        <SceneContent
          pcs={pcs}
          setSelected={setSelected}
          entered={entered}
          controlsRef={controlsRef}
        />
      </Canvas>

      {!entered && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/45 text-white backdrop-blur-sm">
          <img
            src="/ginfo-logo.png"
            alt="Ginfo"
            className="mb-5 h-24 w-24 object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />

          <h2 className="mb-2 text-3xl font-bold">Laboratório pronto</h2>
          <p className="mb-6 max-w-md text-center text-sm text-gray-200">
            Clique para entrar em primeira pessoa. Use <strong>W A S D</strong> para andar,
            <strong> Shift</strong> para acelerar e <strong>ESC</strong> para liberar o mouse.
          </p>

          <button
            onClick={() => setEntered(true)}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Entrar no laboratório
          </button>
        </div>
      )}

      {entered && (
        <>
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-4 w-4 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 bg-white/90" />
            <div className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 bg-white/90" />
          </div>

          <div className="absolute bottom-4 left-4 rounded-lg bg-black/65 px-3 py-2 text-xs text-white backdrop-blur-sm">
            W A S D para mover · Shift para correr · ESC para liberar o mouse
          </div>
        </>
      )}
    </div>
  );
}