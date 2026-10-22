"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RouteMap from "@/components/RouteMap";
import { useStore } from "@/lib/store";
import { DISTRITOS, EQUIPOS, MATERIALES_CATALOGO, PLANES, TECNICOS, TECNOLOGIAS, TIPOS_CABLE, TIPOS_SERVICIO } from "@/lib/data";
import { longitudRuta } from "@/lib/geo";
import { formatoMetros } from "@/lib/format";
import type { Estado, LatLng, Registro } from "@/lib/types";

const hoy = () => new Date().toISOString().slice(0, 10);

function Campo({ label, ayuda, children, className = "" }: { label: string; ayuda?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`campo ${className}`}>
      <label>{label}</label>
      {children}
      {ayuda && <span className="ayuda">{ayuda}</span>}
    </div>
  );
}

function Seccion({ n, titulo, children, extra }: { n: number; titulo: string; children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className="card mb">
      <div className="card-head">
        <div className="seccion-titulo"><span className="paso">{n}</span><h2>{titulo}</h2></div>
        {extra}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

export default function NuevoRegistro() {
  const { agregar, siguienteId } = useStore();
  const router = useRouter();
  const [ruta, setRuta] = useState<LatLng[]>([]);
  const [materiales, setMateriales] = useState<{ nombre: string; cantidad: number }[]>([
    { nombre: "Conector SC/APC mecánico", cantidad: 2 },
    { nombre: "Roseta óptica", cantidad: 1 },
  ]);
  const [error, setError] = useState("");
  const [reserva, setReserva] = useState(15);

  const longitud = longitudRuta(ruta);

  function ubicarme() {
    navigator.geolocation?.getCurrentPosition(
      (p) => setRuta((r) => [...r, [+p.coords.latitude.toFixed(6), +p.coords.longitude.toFixed(6)]]),
      () => setError("No se pudo obtener la ubicación del dispositivo.")
    );
  }

  function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim();
    const n = (k: string) => Number(f.get(k) ?? 0) || 0;

    if (ruta.length < 2) {
      setError("Traza en el mapa la ruta del cable: al menos la caja NAP y el domicilio del cliente.");
      document.getElementById("seccion-mapa")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const registro: Registro = {
      id: siguienteId(),
      fecha: s("fecha"),
      horaInicio: s("horaInicio"),
      horaFin: s("horaFin"),
      estado: s("estado") as Estado,
      tipoServicio: s("tipoServicio") as Registro["tipoServicio"],
      prioridad: s("prioridad") as Registro["prioridad"],
      tecnicoId: s("tecnicoId"),
      cliente: {
        nombre: s("clienteNombre"),
        documento: s("clienteDocumento"),
        telefono: s("clienteTelefono"),
        direccion: s("clienteDireccion"),
        distrito: s("clienteDistrito"),
        codigoAbonado: s("codigoAbonado"),
      },
      servicio: {
        tecnologia: s("tecnologia") as Registro["servicio"]["tecnologia"],
        plan: s("plan"),
        equipo: s("equipo"),
        serieEquipo: s("serieEquipo"),
      },
      red: {
        cajaNap: s("cajaNap").toUpperCase(),
        puerto: n("puerto"),
        tipoCable: s("tipoCable") as Registro["red"]["tipoCable"],
        metrosReserva: reserva,
        tipoTendido: s("tipoTendido") as Registro["red"]["tipoTendido"],
        postesUtilizados: n("postes"),
      },
      ruta,
      medicion: {
        potenciaRx: n("potenciaRx"),
        atenuacion: n("atenuacion"),
        velocidadBajada: n("bajada"),
        velocidadSubida: n("subida"),
        latencia: n("latencia"),
      },
      materiales: materiales.filter((m) => m.cantidad > 0),
      observaciones: s("observaciones"),
      conformidadCliente: f.get("conformidad") === "on",
      calificacion: n("calificacion"),
    };
    agregar(registro);
    router.push(`/registros/${registro.id}`);
  }

  return (
    <form onSubmit={guardar}>
      <div className="encabezado">
        <div>
          <div className="migas"><Link href="/registros">Registros</Link> / Nuevo</div>
          <h1>Nuevo registro de atención</h1>
          <p>Completa los datos de la orden de trabajo y traza la ruta del cable instalado.</p>
        </div>
        <div className="acciones">
          <Link href="/registros" className="btn">Cancelar</Link>
          <button type="submit" className="btn btn-primario">Guardar registro</button>
        </div>
      </div>

      <Seccion n={1} titulo="Orden de trabajo">
        <div className="form-grid">
          <Campo label="Técnico responsable">
            <select name="tecnicoId" className="select" required>
              {TECNICOS.map((t) => <option key={t.id} value={t.id}>{t.nombre} · {t.cuadrilla}</option>)}
            </select>
          </Campo>
          <Campo label="Tipo de servicio">
            <select name="tipoServicio" className="select">{TIPOS_SERVICIO.map((t) => <option key={t}>{t}</option>)}</select>
          </Campo>
          <Campo label="Estado">
            <select name="estado" className="select" defaultValue="Completado">
              {["Completado", "En progreso", "Pendiente", "Cancelado"].map((e) => <option key={e}>{e}</option>)}
            </select>
          </Campo>
          <Campo label="Fecha"><input type="date" name="fecha" className="input" defaultValue={hoy()} required /></Campo>
          <Campo label="Hora de inicio"><input type="time" name="horaInicio" className="input" defaultValue="09:00" required /></Campo>
          <Campo label="Hora de fin"><input type="time" name="horaFin" className="input" defaultValue="11:00" /></Campo>
          <Campo label="Prioridad">
            <select name="prioridad" className="select" defaultValue="Media">{["Alta", "Media", "Baja"].map((p) => <option key={p}>{p}</option>)}</select>
          </Campo>
        </div>
      </Seccion>

      <Seccion n={2} titulo="Datos del cliente">
        <div className="form-grid">
          <Campo label="Nombre o razón social"><input name="clienteNombre" className="input" required placeholder="Ej. Juan Pérez García" /></Campo>
          <Campo label="Documento"><input name="clienteDocumento" className="input" required placeholder="DNI 12345678 / RUC 20…" /></Campo>
          <Campo label="Teléfono de contacto"><input name="clienteTelefono" className="input" placeholder="9XX XXX XXX" /></Campo>
          <Campo label="Dirección de instalación" className="span-2"><input name="clienteDireccion" className="input" required placeholder="Av. / Jr. / Calle, número, dpto." /></Campo>
          <Campo label="Distrito">
            <select name="clienteDistrito" className="select">{DISTRITOS.map((d) => <option key={d}>{d}</option>)}</select>
          </Campo>
          <Campo label="Código de abonado"><input name="codigoAbonado" className="input" placeholder="AB-0000000" /></Campo>
        </div>
      </Seccion>

      <Seccion n={3} titulo="Servicio y equipos">
        <div className="form-grid">
          <Campo label="Tecnología">
            <select name="tecnologia" className="select">{TECNOLOGIAS.map((t) => <option key={t}>{t}</option>)}</select>
          </Campo>
          <Campo label="Plan contratado">
            <select name="plan" className="select">{PLANES.map((p) => <option key={p}>{p}</option>)}</select>
          </Campo>
          <Campo label="Equipo instalado">
            <select name="equipo" className="select">{EQUIPOS.map((p) => <option key={p}>{p}</option>)}</select>
          </Campo>
          <Campo label="N.º de serie del equipo"><input name="serieEquipo" className="input" placeholder="SN / MAC" /></Campo>
        </div>
      </Seccion>

      <div className="card mb" id="seccion-mapa">
        <div className="card-head">
          <div className="seccion-titulo"><span className="paso">4</span><h2>Ruta de instalación del cable</h2></div>
        </div>
        <div className="card-body" style={{ paddingBottom: 0 }}>
          <div className="aviso">
            Haz <b>clic en el mapa</b> para marcar los puntos del tendido: el primero es la <b>caja NAP</b>, los intermedios son
            postes o puntos de anclaje y el último es el <b>domicilio del cliente</b>. Arrastra un punto para moverlo y haz
            <b> clic derecho</b> para eliminarlo.
          </div>
        </div>
        <div className="card-body form-grid">
          <Campo label="Caja NAP / terminal de origen"><input name="cajaNap" className="input" required placeholder="NAP-MIR-0000" /></Campo>
          <Campo label="Puerto"><input type="number" name="puerto" min={1} max={16} defaultValue={1} className="input" /></Campo>
          <Campo label="Tipo de cable">
            <select name="tipoCable" className="select">{TIPOS_CABLE.map((t) => <option key={t}>{t}</option>)}</select>
          </Campo>
          <Campo label="Tipo de tendido">
            <select name="tipoTendido" className="select">{["Aéreo", "Subterráneo", "Mixto"].map((t) => <option key={t}>{t}</option>)}</select>
          </Campo>
          <Campo label="Postes utilizados"><input type="number" name="postes" min={0} defaultValue={0} className="input" /></Campo>
          <Campo label="Reserva / coca de cable (m)" ayuda="Se suma a la longitud trazada">
            <input type="number" min={0} value={reserva} onChange={(e) => setReserva(Number(e.target.value) || 0)} className="input" />
          </Campo>
        </div>
        <div className="mapa-barra">
          <div className="metrica"><span>Puntos</span><b>{ruta.length}</b></div>
          <div className="metrica"><span>Longitud trazada</span><b>{formatoMetros(longitud)}</b></div>
          <div className="metrica"><span>Cable total</span><b>{formatoMetros(longitud + reserva)}</b></div>
          <div className="espacio" />
          <button type="button" className="btn btn-sm" onClick={ubicarme}>Mi ubicación</button>
          <button type="button" className="btn btn-sm" disabled={!ruta.length} onClick={() => setRuta((r) => r.slice(0, -1))}>Deshacer</button>
          <button type="button" className="btn btn-sm btn-peligro" disabled={!ruta.length} onClick={() => setRuta([])}>Limpiar ruta</button>
        </div>
        <RouteMap editable={{ ruta, onChange: (r) => { setRuta(r); setError(""); } }} altura={460} />
        {error && <div className="card-body error">{error}</div>}
      </div>

      <Seccion n={5} titulo="Mediciones y pruebas">
        <div className="form-grid">
          <Campo label="Potencia Rx (dBm)" ayuda="GPON óptimo: −8 a −25 dBm"><input type="number" step="0.1" name="potenciaRx" className="input" defaultValue={-19.5} /></Campo>
          <Campo label="Atenuación del tramo (dB)"><input type="number" step="0.1" name="atenuacion" className="input" defaultValue={14} /></Campo>
          <Campo label="Latencia (ms)"><input type="number" name="latencia" className="input" defaultValue={5} /></Campo>
          <Campo label="Velocidad de bajada (Mbps)"><input type="number" name="bajada" className="input" defaultValue={0} /></Campo>
          <Campo label="Velocidad de subida (Mbps)"><input type="number" name="subida" className="input" defaultValue={0} /></Campo>
        </div>
      </Seccion>

      <Seccion
        n={6}
        titulo="Materiales utilizados"
        extra={<button type="button" className="btn btn-sm" onClick={() => setMateriales((m) => [...m, { nombre: MATERIALES_CATALOGO[2], cantidad: 1 }])}>Agregar material</button>}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {materiales.map((m, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 110px auto", gap: 10 }}>
              <select className="select" value={m.nombre} onChange={(e) => setMateriales((arr) => arr.map((x, j) => (j === i ? { ...x, nombre: e.target.value } : x)))}>
                {MATERIALES_CATALOGO.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input type="number" min={0} className="input" value={m.cantidad} onChange={(e) => setMateriales((arr) => arr.map((x, j) => (j === i ? { ...x, cantidad: Number(e.target.value) || 0 } : x)))} />
              <button type="button" className="btn btn-sm btn-peligro" onClick={() => setMateriales((arr) => arr.filter((_, j) => j !== i))}>Quitar</button>
            </div>
          ))}
          {materiales.length === 0 && <span className="sec">Sin materiales registrados.</span>}
        </div>
      </Seccion>

      <Seccion n={7} titulo="Cierre de la atención">
        <div className="form-grid">
          <Campo label="Observaciones del técnico" className="span-3">
            <textarea name="observaciones" className="input" rows={3} placeholder="Incidencias, trabajos adicionales, recomendaciones…" />
          </Campo>
          <Campo label="Calificación del cliente">
            <select name="calificacion" className="select" defaultValue="5">
              {[5, 4, 3, 2, 1, 0].map((c) => <option key={c} value={c}>{c ? "★".repeat(c) : "Sin calificar"}</option>)}
            </select>
          </Campo>
          <Campo label="Conformidad">
            <label className="check"><input type="checkbox" name="conformidad" defaultChecked /> El cliente firmó la conformidad del servicio</label>
          </Campo>
        </div>
      </Seccion>

      <div className="acciones">
        <Link href="/registros" className="btn">Cancelar</Link>
        <button type="submit" className="btn btn-primario">Guardar registro</button>
      </div>
    </form>
  );
}
