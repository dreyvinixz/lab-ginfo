import { PC } from "../data/pcs";

export default function SidePanel({ pc }: { pc: PC | null }) {
  return (
    <div className="w-80 bg-gray-900 text-white p-4 border-l border-gray-700">

      {!pc && <p className="text-gray-400">Selecione um PC</p>}

      {pc && (
        <>
          <h2 className="text-xl font-bold mb-4">{pc.id}</h2>

          <div className="space-y-2">
            <p>Status: <span className="font-semibold">{pc.status}</span></p>
            <p>Usuário: {pc.user || "Nenhum"}</p>
            <p>IP: 192.168.0.{Math.floor(Math.random()*100)}</p>
            <p>Tempo de uso: {Math.floor(Math.random()*120)} min</p>
          </div>
        </>
      )}
    </div>
  );
}