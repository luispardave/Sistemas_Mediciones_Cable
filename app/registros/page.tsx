"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { EstadoBadge } from "@/components/Badges";
import { tecnicoPorId, useStore } from "@/lib/store";
import { TECNICOS, TIPOS_SERVICIO } from "@/lib/data";
import { metrosTotales } from "@/lib/geo";
import { formatoFecha, formatoMetros } from "@/lib/format";
import type { Estado } from "@/lib/types";

const ESTADOS: Estado[] = ["Completado", "En progreso", "Pendiente", "Cancelado"];

export default function Registros() {
  const { registros, restablecer } = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState("");
  const [tecnico, setTecnico] = useState("");

  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    return registros.filter(
      (r) =>
        (!estado || r.estado === estado) &&
        (!tipo || r.tipoServicio === tipo) &&
        (!tecnico || r.tecnicoId === tecnico) &&
        (!t ||
          [r.id, r.cliente.nombre, r.cliente.direccion, r.cliente.distrito, r.red.cajaNap, r.cliente.codigoAbonado]
            .join(" ")
            .toLowerCase()
            .includes(t))
    );
  }, [registros, q, estado, tipo, tecnico]);

  function exportarCSV() {
    const cab = ["OT", "Fecha", "Estado", "Tipo", "Técnico", "Cliente", "Distrito", "Dirección", "Tecnología", "Caja NAP", "Puerto", "Cable", "Metros", "Potencia Rx (dBm)", "Bajada (Mbps)", "Subida (Mbps)"];
    const filas = filtrados.map((r) => [
      r.id, r.fecha, r.estado, r.tipoServicio, tecnicoPorId(r.tecnicoId)?.nombre ?? r.tecnicoId, r.cliente.nombre,
      r.cliente.distrito, r.cliente.direccion, r.servicio.tecnologia, r.red.cajaNap, r.red.puerto, r.red.tipoCable,
      metrosTotales(r.ruta, r.red.metrosReserva), r.medicion.potenciaRx, r.medicion.velocidadBajada, r.medicion.velocidadSubida,
    ]);
    const csv = [cab, ...filas].map((f) => f.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `registros-atencion-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>Registros de atención</h1>
          <p>Órdenes de trabajo ejecutadas por los técnicos de campo.</p>
        </div>
        <div className="acciones">
          <button className="btn" onClick={exportarCSV}>Exportar CSV</button>
          <Link href="/registros/nuevo" className="btn btn-primario">Nuevo registro</Link>
        </div>
      </div>

      <div className="card">
        <div className="filtros">
          <input className="input" placeholder="Buscar por OT, cliente, dirección, NAP…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="select" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {ESTADOS.map((e) => <option key={e}>{e}</option>)}
          </select>
          <select className="select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Todos los servicios</option>
            {TIPOS_SERVICIO.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select className="select" value={tecnico} onChange={(e) => setTecnico(e.target.value)}>
            <option value="">Todos los técnicos</option>
            {TECNICOS.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
          <span className="sec" style={{ marginLeft: "auto" }}>{filtrados.length} de {registros.length} registros</span>
        </div>
        <div className="tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>Orden</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Técnico</th>
                <th>Caja NAP</th>
                <th className="num">Cable</th>
                <th className="num">Pot. Rx</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((r) => {
                const tec = tecnicoPorId(r.tecnicoId);
                return (
                  <tr key={r.id} className="clic" onClick={() => router.push(`/registros/${r.id}`)}>
                    <td className="ot">{r.id}</td>
                    <td>
                      <div>{formatoFecha(r.fecha)}</div>
                      <div className="sec">{r.horaInicio}{r.horaFin ? ` – ${r.horaFin}` : ""}</div>
                    </td>
                    <td>
                      <div>{r.cliente.nombre}</div>
                      <div className="sec">{r.cliente.direccion} · {r.cliente.distrito}</div>
                    </td>
                    <td>
                      <div>{r.tipoServicio}</div>
                      <div className="sec">{r.servicio.tecnologia}</div>
                    </td>
                    <td>
                      <div>{tec?.nombre ?? r.tecnicoId}</div>
                      <div className="sec">{tec?.cuadrilla}</div>
                    </td>
                    <td>
                      <div>{r.red.cajaNap}</div>
                      <div className="sec">Puerto {r.red.puerto}</div>
                    </td>
                    <td className="num">{formatoMetros(metrosTotales(r.ruta, r.red.metrosReserva))}</td>
                    <td className="num">{r.medicion.potenciaRx ? `${r.medicion.potenciaRx} ${r.servicio.tecnologia.startsWith("HFC") ? "dBmV" : "dBm"}` : "—"}</td>
                    <td><EstadoBadge estado={r.estado} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtrados.length === 0 && <div className="vacio">No hay registros que coincidan con los filtros.</div>}
        </div>
      </div>

      <div style={{ marginTop: 14, textAlign: "right" }}>
        <button
          className="btn btn-sm"
          onClick={() => confirm("¿Restablecer los datos de demostración? Se perderán los registros creados.") && restablecer()}
        >
          Restablecer datos de demostración
        </button>
      </div>
    </>
  );
}
