import type { PC } from "../data/pcs";

type MeetingData = {
  title: string;
  time: string;
  scheduledBy: string;
  date: string;
  participants: number;
};

export type SelectedItem =
  | { type: "pc"; data: PC }
  | { type: "meeting"; data: MeetingData }
  | null;

function getStatusLabel(status: PC["status"]) {
  switch (status) {
    case "livre":
      return "Livre";
    case "ocupado":
      return "Ocupado";
    case "offline":
      return "Offline";
    default:
      return status;
  }
}

function getStatusColor(status: PC["status"]) {
  switch (status) {
    case "livre":
      return "text-green-400";
    case "ocupado":
      return "text-red-400";
    case "offline":
      return "text-gray-400";
    default:
      return "text-white";
  }
}

export default function SidePanel({ selected }: { selected: SelectedItem }) {
  if (!selected) {
    return (
      <div className="h-full w-full overflow-auto bg-gray-900 p-6 text-white">
        <p className="text-gray-400">Selecione um PC ou a mesa de reunião.</p>
      </div>
    );
  }

  if (selected.type === "meeting") {
    const meeting = selected.data;

    return (
      <div className="h-full w-full overflow-auto bg-gray-900 p-6 text-white">
        <h2 className="mb-6 text-xl font-bold text-amber-400">📅 REUNIÃO AGENDADA</h2>

        <div className="space-y-4 text-sm">
          <p>
            <strong>Título:</strong> {meeting.title}
          </p>
          <p>
            <strong>Horário:</strong> {meeting.time}
          </p>
          <p>
            <strong>Agendado por:</strong> {meeting.scheduledBy}
          </p>
          <p>
            <strong>Data:</strong> {meeting.date}
          </p>
          <p>
            <strong>Participantes:</strong> {meeting.participants}
          </p>
        </div>
      </div>
    );
  }

  const pc = selected.data;

  return (
    <div className="h-full w-full overflow-auto bg-gray-900 p-6 text-white">
      <h2 className="mb-6 text-xl font-bold">{pc.id}</h2>

      <div className="space-y-4 text-sm">
        <p>
          <strong>Status:</strong>{" "}
          <span className={`font-semibold ${getStatusColor(pc.status)}`}>
            {getStatusLabel(pc.status)}
          </span>
        </p>

        <p>
          <strong>Usuário:</strong> {pc.user || "Nenhum"}
        </p>

        <p>
          <strong>IP:</strong> 192.168.0.24
        </p>

        <p>
          <strong>Tempo de uso:</strong> 37 min
        </p>
      </div>
    </div>
  );
}