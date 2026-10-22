import type { Estado } from "@/lib/types";

const CLASE: Record<Estado, string> = {
  Completado: "ok",
  "En progreso": "info",
  Pendiente: "warn",
  Cancelado: "bad",
};

export function EstadoBadge({ estado }: { estado: Estado }) {
  return (
    <span className={`badge badge-${CLASE[estado]}`}>
      <span className="dot" />
      {estado}
    </span>
  );
}

export function TonoBadge({ tono, children }: { tono: "ok" | "warn" | "bad" | "info"; children: React.ReactNode }) {
  return (
    <span className={`badge badge-${tono}`}>
      <span className="dot" />
      {children}
    </span>
  );
}
