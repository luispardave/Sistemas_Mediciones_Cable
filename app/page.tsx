"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import RouteMap from "@/components/RouteMap";
import { EstadoBadge } from "@/components/Badges";
import { tecnicoPorId, useStore } from "@/lib/store";
import { TIPOS_SERVICIO } from "@/lib/data";
import { metrosTotales } from "@/lib/geo";
import { formatoFecha, formatoMetros } from "@/lib/format";

function Icono({ d }: { d: string }) {
  return (
    <span className="kpi-icono">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
      </svg>
    </span>
  );
}

export default function Panel() {
  const { registros } = useStore();
  const router = useRouter();

  const stats = useMemo(() => {
    const completados = registros.filter((r) => r.estado === "Completado");
    const metros = completados.reduce((s, r) => s + metrosTotales(r.ruta, r.red.metrosReserva), 0);
    const fibra = completados.filter((r) => r.servicio.tecnologia.startsWith("FTTH") && r.medicion.potenciaRx < 0);
    const potencia = fibra.length ? fibra.reduce((s, r) => s + r.medicion.potenciaRx, 0) / fibra.length : 0;
    const calif = completados.filter((r) => r.calificacion > 0);
    const satisf = calif.length ? calif.reduce((s, r) => s + r.calificacion, 0) / calif.length : 0;
    const porTipo = TIPOS_SERVICIO.map((t) => ({ tipo: t, n: registros.filter((r) => r.tipoServicio === t).length }));
    return { completados: completados.length, metros, potencia, satisf, porTipo };
  }, [registros]);

  const maxTipo = Math.max(1, ...stats.porTipo.map((p) => p.n));
  const recientes = registros.slice(0, 6);
  const rutas = useMemo(() => registros.map((r) => ({ id: r.id, ruta: r.ruta, etiqueta: `${r.id} · ${r.cliente.nombre}` })), [registros]);

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>Panel general</h1>
          <p>Resumen de atenciones técnicas y tendidos de cable en Lima Metropolitana.</p>
        </div>
        <Link href="/registros/nuevo" className="btn btn-primario">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          Nuevo registro
        </Link>
      </div>

      <div className="grid g-4 mb">
        <div className="card kpi">
          <div className="kpi-label"><Icono d="M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />Atenciones completadas</div>
          <div className="kpi-valor">{stats.completados}<small>/ {registros.length}</small></div>
          <div className="kpi-nota">Órdenes de trabajo registradas</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label"><Icono d="M3 17c3-6 6 2 9-4s6 2 9-4" />Cable instalado</div>
          <div className="kpi-valor">{formatoMetros(stats.metros)}</div>
          <div className="kpi-nota">Ruta trazada + reserva, en OT completadas</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label"><Icono d="M13 2 3 14h9l-1 8 10-12h-9z" />Potencia óptica promedio</div>
          <div className="kpi-valor">{stats.potencia.toFixed(1)}<small>dBm</small></div>
          <div className="kpi-nota">Rango GPON óptimo: −8 a −25 dBm</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label"><Icono d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" />Satisfacción del cliente</div>
          <div className="kpi-valor">{stats.satisf.toFixed(1)}<small>/ 5</small></div>
          <div className="kpi-nota">Promedio de calificaciones</div>
        </div>
      </div>

      <div className="grid g-main mb">
        <div className="card">
          <div className="card-head">
            <div>
              <h2>Mapa de tendidos</h2>
              <div className="sub">Clic en una ruta para ver el registro</div>
            </div>
            <Link href="/mapa" className="btn btn-sm">Ver mapa completo</Link>
          </div>
          <RouteMap rutas={rutas} altura={380} onSeleccion={(id) => router.push(`/registros/${id}`)} />
        </div>
        <div className="card">
          <div className="card-head">
            <h2>Atenciones por tipo de servicio</h2>
          </div>
          <div className="card-body">
            <div className="barras">
              {stats.porTipo.map((p) => (
                <div key={p.tipo} className="barra-fila" title={`${p.tipo}: ${p.n} atenciones`}>
                  <span>{p.tipo}</span>
                  <div className="barra-pista">
                    <div className="barra-relleno" style={{ width: `${(p.n / maxTipo) * 100}%` }} />
                  </div>
                  <span className="num">{p.n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h2>Registros recientes</h2>
          <Link href="/registros" className="btn btn-sm">Ver todos</Link>
        </div>
        <div className="tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>Orden</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Técnico</th>
                <th>Fecha</th>
                <th className="num">Cable</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recientes.map((r) => (
                <tr key={r.id} className="clic" onClick={() => router.push(`/registros/${r.id}`)}>
                  <td className="ot">{r.id}</td>
                  <td>
                    <div>{r.cliente.nombre}</div>
                    <div className="sec">{r.cliente.distrito}</div>
                  </td>
                  <td>{r.tipoServicio}</td>
                  <td>{tecnicoPorId(r.tecnicoId)?.nombre ?? r.tecnicoId}</td>
                  <td>{formatoFecha(r.fecha)}</td>
                  <td className="num">{formatoMetros(metrosTotales(r.ruta, r.red.metrosReserva))}</td>
                  <td><EstadoBadge estado={r.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
