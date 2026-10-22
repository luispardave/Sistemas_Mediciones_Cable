"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import RouteMap from "@/components/RouteMap";
import { EstadoBadge, TonoBadge } from "@/components/Badges";
import { tecnicoPorId, useStore } from "@/lib/store";
import { distanciaMetros, longitudRuta } from "@/lib/geo";
import { calidadPotencia, duracion, formatoFecha, formatoMetros } from "@/lib/format";
import type { Estado } from "@/lib/types";

export default function DetalleRegistro() {
  const { id } = useParams<{ id: string }>();
  const { registros, listo, cambiarEstado, eliminar } = useStore();
  const router = useRouter();
  const r = registros.find((x) => x.id === decodeURIComponent(id));
  const rutas = useMemo(() => (r ? [{ id: r.id, ruta: r.ruta }] : []), [r]);

  if (!r) {
    return (
      <div className="card vacio">
        {listo ? (
          <>
            No se encontró el registro <b>{id}</b>.<br /><br />
            <Link href="/registros" className="btn">Volver a registros</Link>
          </>
        ) : (
          "Cargando…"
        )}
      </div>
    );
  }

  const tec = tecnicoPorId(r.tecnicoId);
  const longitud = longitudRuta(r.ruta);
  const esHFC = r.servicio.tecnologia.startsWith("HFC");
  const conMedicion = r.medicion.potenciaRx !== 0;
  const calidad = calidadPotencia(r.medicion.potenciaRx);

  return (
    <>
      <div className="encabezado">
        <div>
          <div className="migas"><Link href="/registros">Registros</Link> / {r.id}</div>
          <h1 style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {r.id} <EstadoBadge estado={r.estado} />
          </h1>
          <p>{r.tipoServicio} · {r.cliente.nombre} · {formatoFecha(r.fecha)}</p>
        </div>
        <div className="acciones">
          <select className="select" style={{ width: "auto" }} value={r.estado} onChange={(e) => cambiarEstado(r.id, e.target.value as Estado)}>
            {["Completado", "En progreso", "Pendiente", "Cancelado"].map((e) => <option key={e}>{e}</option>)}
          </select>
          <button className="btn" onClick={() => window.print()}>Imprimir</button>
          <button
            className="btn btn-peligro"
            onClick={() => {
              if (confirm(`¿Eliminar el registro ${r.id}?`)) {
                eliminar(r.id);
                router.push("/registros");
              }
            }}
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid g-main mb">
        <div className="card">
          <div className="card-head">
            <div>
              <h2>Ruta de instalación del cable</h2>
              <div className="sub">{r.red.cajaNap} (puerto {r.red.puerto}) → {r.cliente.direccion}</div>
            </div>
          </div>
          <div className="mapa-barra">
            <div className="metrica"><span>Longitud trazada</span><b>{formatoMetros(longitud)}</b></div>
            <div className="metrica"><span>Reserva</span><b>{r.red.metrosReserva} m</b></div>
            <div className="metrica"><span>Cable total</span><b>{formatoMetros(longitud + r.red.metrosReserva)}</b></div>
            <div className="metrica"><span>Tendido</span><b>{r.red.tipoTendido}</b></div>
            <div className="metrica"><span>Postes</span><b>{r.red.postesUtilizados}</b></div>
          </div>
          <RouteMap rutas={rutas} altura={400} />
          <div className="leyenda">
            <span><i className="mk mk-nap" style={{ width: 16, height: 16, borderRadius: 4 }} />Caja NAP</span>
            <span><i style={{ width: 22, height: 4, background: "#1E5BFF", borderRadius: 2 }} />Tendido de {r.red.tipoCable}</span>
            <span><i className="mk mk-cliente" style={{ width: 16, height: 16 }} />Domicilio del cliente</span>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h2>Tramos del tendido</h2></div>
          <div className="tabla-wrap">
            <table>
              <thead>
                <tr><th>Tramo</th><th>Coordenadas destino</th><th className="num">Distancia</th></tr>
              </thead>
              <tbody>
                {r.ruta.slice(1).map((p, i) => (
                  <tr key={i}>
                    <td>{i === 0 ? "NAP" : `P${i}`} → {i === r.ruta.length - 2 ? "Cliente" : `P${i + 1}`}</td>
                    <td className="sec" style={{ fontVariantNumeric: "tabular-nums" }}>{p[0].toFixed(5)}, {p[1].toFixed(5)}</td>
                    <td className="num">{formatoMetros(distanciaMetros(r.ruta[i], p))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card mb">
        <div className="card-head">
          <h2>Mediciones y pruebas</h2>
          {conMedicion && !esHFC && <TonoBadge tono={calidad.tono}>Potencia {calidad.label}</TonoBadge>}
        </div>
        <div className="card-body">
          {conMedicion ? (
            <div className="medidas">
              <div className="medida"><div className="k">Potencia Rx</div><div className="v">{r.medicion.potenciaRx} <small>{esHFC ? "dBmV" : "dBm"}</small></div></div>
              <div className="medida"><div className="k">Atenuación</div><div className="v">{r.medicion.atenuacion} <small>dB</small></div></div>
              <div className="medida"><div className="k">Bajada</div><div className="v">{r.medicion.velocidadBajada || "—"} <small>Mbps</small></div></div>
              <div className="medida"><div className="k">Subida</div><div className="v">{r.medicion.velocidadSubida || "—"} <small>Mbps</small></div></div>
              <div className="medida"><div className="k">Latencia</div><div className="v">{r.medicion.latencia || "—"} <small>ms</small></div></div>
            </div>
          ) : (
            <span className="sec">Sin mediciones registradas para esta orden.</span>
          )}
        </div>
      </div>

      <div className="grid g-3 mb">
        <div className="card">
          <div className="card-head"><h2>Cliente</h2></div>
          <div className="card-body">
            <dl className="dl">
              <dt>Nombre</dt><dd>{r.cliente.nombre}</dd>
              <dt>Documento</dt><dd>{r.cliente.documento}</dd>
              <dt>Teléfono</dt><dd>{r.cliente.telefono || "—"}</dd>
              <dt>Dirección</dt><dd>{r.cliente.direccion}</dd>
              <dt>Distrito</dt><dd>{r.cliente.distrito}</dd>
              <dt>Cód. abonado</dt><dd>{r.cliente.codigoAbonado || "—"}</dd>
            </dl>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h2>Servicio y red</h2></div>
          <div className="card-body">
            <dl className="dl">
              <dt>Tecnología</dt><dd>{r.servicio.tecnologia}</dd>
              <dt>Plan</dt><dd>{r.servicio.plan}</dd>
              <dt>Equipo</dt><dd>{r.servicio.equipo}</dd>
              <dt>N.º de serie</dt><dd style={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}>{r.servicio.serieEquipo || "—"}</dd>
              <dt>Caja NAP</dt><dd>{r.red.cajaNap} · puerto {r.red.puerto}</dd>
              <dt>Cable</dt><dd>{r.red.tipoCable}</dd>
            </dl>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h2>Atención</h2></div>
          <div className="card-body">
            <dl className="dl">
              <dt>Técnico</dt><dd>{tec?.nombre ?? r.tecnicoId}<div className="sec">{tec?.id} · {tec?.cuadrilla}</div></dd>
              <dt>Fecha</dt><dd>{formatoFecha(r.fecha)}</dd>
              <dt>Horario</dt><dd>{r.horaInicio} – {r.horaFin || "en curso"}</dd>
              <dt>Duración</dt><dd>{r.horaFin ? duracion(r.horaInicio, r.horaFin) : "—"}</dd>
              <dt>Prioridad</dt><dd>{r.prioridad}</dd>
              <dt>Conformidad</dt><dd>{r.conformidadCliente ? <TonoBadge tono="ok">Firmada</TonoBadge> : <TonoBadge tono="warn">Pendiente</TonoBadge>}</dd>
              <dt>Calificación</dt>
              <dd>
                {r.calificacion ? (
                  <span className="estrellas" aria-label={`${r.calificacion} de 5`}>
                    {"★".repeat(r.calificacion)}<span className="off">{"★".repeat(5 - r.calificacion)}</span>
                  </span>
                ) : "Sin calificar"}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="grid g-2">
        <div className="card">
          <div className="card-head"><h2>Materiales utilizados</h2></div>
          {r.materiales.length ? (
            <table>
              <thead><tr><th>Material</th><th className="num">Cantidad</th></tr></thead>
              <tbody>
                {r.materiales.map((m, i) => (
                  <tr key={i}><td>{m.nombre}</td><td className="num">{m.cantidad}</td></tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="card-body sec">Sin materiales registrados.</div>
          )}
        </div>
        <div className="card">
          <div className="card-head"><h2>Observaciones del técnico</h2></div>
          <div className="card-body" style={{ lineHeight: 1.6, color: r.observaciones ? "var(--text)" : "var(--muted)" }}>
            {r.observaciones || "Sin observaciones."}
          </div>
        </div>
      </div>
    </>
  );
}
