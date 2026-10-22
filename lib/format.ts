export function formatoFecha(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatoMetros(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`;
}

export function duracion(inicio: string, fin: string): string {
  const [h1, m1] = inicio.split(":").map(Number);
  const [h2, m2] = fin.split(":").map(Number);
  const min = h2 * 60 + m2 - (h1 * 60 + m1);
  if (!Number.isFinite(min) || min <= 0) return "—";
  return `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")} min`;
}

/** Clasifica la potencia óptica recibida (dBm) según rangos típicos GPON. */
export function calidadPotencia(dbm: number): { label: string; tono: "ok" | "warn" | "bad" } {
  if (dbm >= -25 && dbm <= -8) return { label: "Óptima", tono: "ok" };
  if (dbm > -28 && dbm < -25) return { label: "Límite", tono: "warn" };
  return { label: "Fuera de rango", tono: "bad" };
}
