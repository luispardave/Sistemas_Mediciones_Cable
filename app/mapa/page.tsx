"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import RouteMap from "@/components/RouteMap";
import { EstadoBadge } from "@/components/Badges";
import { tecnicoPorId, useStore } from "@/lib/store";
import { metrosTotales } from "@/lib/geo";
import { formatoMetros } from "@/lib/format";
import type { Estado } from "@/lib/types";

// Mismo significado que los badges de estado (siempre acompañado de etiqueta).
const COLOR_ESTADO: Record<Estado, string> = {
  Completado: "#0F8A5F",
  "En progreso": "#1E5BFF",
  Pendiente: "#D98200",
  Cancelado: "#C22F3A",
};

export default function MapaTendidos() {
  const { registros } = useStore();
  const [sel, setSel] = useState<string>();
  const [estado, setEstado] = useState("");

  const visibles = useMemo(() => registros.filter((r) => !estado || r.estado === estado), [registros, estado]);
  const rutas = useMemo(
    () => visibles.map((r) => ({ id: r.id, ruta: r.ruta, color: COLOR_ESTADO[r.estado], etiqueta: `${r.id} · ${r.cliente.nombre} (${r.estado})` })),
    [visibles]
  );
  const total = visibles.reduce((s, r) => s + metrosTotales(r.ruta, r.red.metrosReserva), 0);

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>Mapa de tendidos</h1>
          <p>Rutas de cable registradas desde la caja NAP hasta el domicilio de cada cliente.</p>
        </div>
        <select className="select" style={{ width: "auto" }} value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {Object.keys(COLOR_ESTADO).map((e) => <option key={e}>{e}</option>)}
        </select>
      </div>

      <div className="grid g-main">
        <div className="card">
          <div className="mapa-barra" style={{ borderRadius: "12px 12px 0 0" }}>
            <div className="metrica"><span>Rutas</span><b>{visibles.length}</b></div>
            <div className="metrica"><span>Cable total</span><b>{formatoMetros(total)}</b></div>
          </div>
          <RouteMap rutas={rutas} altura={560} enfocar={sel} onSeleccion={setSel} />
          <div className="leyenda">
            {Object.entries(COLOR_ESTADO).map(([e, c]) => (
              <span key={e}><i style={{ width: 22, height: 4, background: c, borderRadius: 2 }} />{e}</span>
            ))}
            <span><i className="mk mk-nap" style={{ width: 16, height: 16, borderRadius: 4 }} />Caja NAP</span>
            <span><i className="mk mk-cliente" style={{ width: 16, height: 16 }} />Cliente</span>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Órdenes en el mapa</h2>
            <span className="sub">Selecciona para ubicar</span>
          </div>
          <div className="lista-rutas">
            {visibles.map((r) => (
              <div key={r.id} className={`item-ruta ${sel === r.id ? "sel" : ""}`} onClick={() => setSel(r.id)}>
                <span className="color" style={{ background: COLOR_ESTADO[r.estado] }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span className="ot">{r.id}</span>
                    <span className="num" style={{ fontWeight: 600 }}>{formatoMetros(metrosTotales(r.ruta, r.red.metrosReserva))}</span>
                  </div>
                  <div>{r.cliente.nombre}</div>
                  <div className="sec">{r.red.cajaNap} → {r.cliente.distrito} · {tecnicoPorId(r.tecnicoId)?.nombre}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                    <EstadoBadge estado={r.estado} />
                    <Link href={`/registros/${r.id}`} className="btn btn-sm" onClick={(e) => e.stopPropagation()}>Ver detalle</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
