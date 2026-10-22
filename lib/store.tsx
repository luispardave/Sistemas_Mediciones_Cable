"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Estado, Registro } from "./types";
import { REGISTROS_SEMILLA, TECNICOS } from "./data";

const CLAVE = "teleruta.registros.v1";

interface StoreValue {
  registros: Registro[];
  listo: boolean;
  agregar: (r: Registro) => void;
  cambiarEstado: (id: string, estado: Estado) => void;
  eliminar: (id: string) => void;
  restablecer: () => void;
  siguienteId: () => string;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [registros, setRegistros] = useState<Registro[]>(REGISTROS_SEMILLA);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CLAVE);
      if (raw) setRegistros(JSON.parse(raw));
    } catch {
      /* almacenamiento no disponible: se usan datos semilla */
    }
    setListo(true);
  }, []);

  useEffect(() => {
    if (!listo) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(registros));
    } catch {
      /* ignorar */
    }
  }, [registros, listo]);

  const agregar = useCallback((r: Registro) => setRegistros((prev) => [r, ...prev]), []);
  const cambiarEstado = useCallback(
    (id: string, estado: Estado) =>
      setRegistros((prev) => prev.map((r) => (r.id === id ? { ...r, estado } : r))),
    []
  );
  const eliminar = useCallback((id: string) => setRegistros((prev) => prev.filter((r) => r.id !== id)), []);
  const restablecer = useCallback(() => setRegistros(REGISTROS_SEMILLA), []);
  const siguienteId = useCallback(() => {
    const max = registros.reduce((m, r) => Math.max(m, Number(r.id.split("-").pop()) || 0), 4800);
    return `OT-${new Date().getFullYear()}-${String(max + 1).padStart(6, "0")}`;
  }, [registros]);

  const value = useMemo(
    () => ({ registros, listo, agregar, cambiarEstado, eliminar, restablecer, siguienteId }),
    [registros, listo, agregar, cambiarEstado, eliminar, restablecer, siguienteId]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider");
  return ctx;
}

export function tecnicoPorId(id: string) {
  return TECNICOS.find((t) => t.id === id);
}
