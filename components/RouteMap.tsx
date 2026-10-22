"use client";

import { useEffect, useRef } from "react";
import type * as Leaflet from "leaflet";
import type { LatLng } from "@/lib/types";
import { CENTRO_LIMA } from "@/lib/geo";

export interface RutaMapa {
  id: string;
  ruta: LatLng[];
  etiqueta?: string;
  color?: string;
}

interface Props {
  /** Rutas de solo lectura (vista general / detalle). */
  rutas?: RutaMapa[];
  /** Ruta editable: clic en el mapa añade un punto, arrastrar mueve, clic derecho elimina. */
  editable?: { ruta: LatLng[]; onChange: (ruta: LatLng[]) => void };
  altura?: number | string;
  onSeleccion?: (id: string) => void;
  /** Id de la ruta a resaltar y encuadrar. */
  enfocar?: string;
}

const TILE = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const ATRIB =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

function icono(L: typeof Leaflet, tipo: "nap" | "cliente" | "punto", n?: number) {
  const html =
    tipo === "nap"
      ? `<div class="mk mk-nap" title="Caja NAP / terminal">NAP</div>`
      : tipo === "cliente"
        ? `<div class="mk mk-cliente" title="Domicilio del cliente"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="#fff" d="M12 3 3 10.5V21h6v-6h6v6h6V10.5z"/></svg></div>`
        : `<div class="mk mk-punto">${n ?? ""}</div>`;
  const size = tipo === "punto" ? 18 : 30;
  return L.divIcon({ html, className: "mk-wrap", iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}

export default function RouteMap({ rutas = [], editable, altura = 420, onSeleccion, enfocar }: Props) {
  const contRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const LRef = useRef<typeof Leaflet | null>(null);
  const capaRef = useRef<Leaflet.LayerGroup | null>(null);
  const editRef = useRef(editable);
  editRef.current = editable;
  const ajustadoRef = useRef(false);

  // Inicializa el mapa una sola vez (Leaflet solo existe en el navegador).
  useEffect(() => {
    let cancel = false;
    import("leaflet").then((mod) => {
      const L = (mod as unknown as { default?: typeof Leaflet }).default ?? (mod as unknown as typeof Leaflet);
      if (cancel || !contRef.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(contRef.current, { zoomControl: true, attributionControl: true }).setView(CENTRO_LIMA, 13);
      L.tileLayer(TILE, { attribution: ATRIB, maxZoom: 20, subdomains: "abcd" }).addTo(map);
      L.control.scale({ metric: true, imperial: false }).addTo(map);
      capaRef.current = L.layerGroup().addTo(map);
      map.on("click", (e: Leaflet.LeafletMouseEvent) => {
        const ed = editRef.current;
        if (!ed) return;
        ed.onChange([...ed.ruta, [+e.latlng.lat.toFixed(6), +e.latlng.lng.toFixed(6)]]);
      });
      mapRef.current = map;
      dibujar();
    });
    return () => {
      cancel = true;
      mapRef.current?.remove();
      mapRef.current = null;
      ajustadoRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redibuja cuando cambian los datos.
  useEffect(() => {
    dibujar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rutas, editable?.ruta, enfocar]);

  // Centra el mapa en la ruta seleccionada.
  useEffect(() => {
    const L = LRef.current;
    const r = rutas.find((x) => x.id === enfocar);
    if (L && mapRef.current && r && r.ruta.length) {
      mapRef.current.flyToBounds(L.latLngBounds(r.ruta), { padding: [60, 60], maxZoom: 18, duration: 0.8 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enfocar]);

  function dibujar() {
    const L = LRef.current;
    const map = mapRef.current;
    const capa = capaRef.current;
    if (!L || !map || !capa) return;
    capa.clearLayers();
    const limites: LatLng[] = [];

    for (const r of rutas) {
      if (r.ruta.length === 0) continue;
      limites.push(...r.ruta);
      const color = r.color ?? "#1E5BFF";
      const sel = r.id === enfocar;
      if (sel) L.polyline(r.ruta, { color, weight: 12, opacity: 0.2 }).addTo(capa);
      const linea = L.polyline(r.ruta, { color, weight: sel ? 5 : 4, opacity: enfocar && !sel ? 0.55 : 0.95, lineCap: "round" }).addTo(capa);
      if (r.etiqueta) linea.bindTooltip(r.etiqueta, { sticky: true });
      if (onSeleccion) linea.on("click", () => onSeleccion(r.id));
      L.marker(r.ruta[0], { icon: icono(L, "nap") }).addTo(capa);
      if (r.ruta.length > 1) {
        const m = L.marker(r.ruta[r.ruta.length - 1], { icon: icono(L, "cliente") }).addTo(capa);
        if (r.etiqueta) m.bindTooltip(r.etiqueta);
        if (onSeleccion) m.on("click", () => onSeleccion(r.id));
      }
    }

    const ed = editRef.current;
    if (ed) {
      const ruta = ed.ruta;
      limites.push(...ruta);
      if (ruta.length > 1) {
        L.polyline(ruta, { color: "#00B8A9", weight: 9, opacity: 0.18 }).addTo(capa);
        L.polyline(ruta, { color: "#1E5BFF", weight: 4, dashArray: "8 6", lineCap: "round" }).addTo(capa);
      }
      ruta.forEach((p, i) => {
        const tipo = i === 0 ? "nap" : i === ruta.length - 1 && ruta.length > 1 ? "cliente" : "punto";
        const m = L.marker(p, { icon: icono(L, tipo, i), draggable: true }).addTo(capa);
        m.bindTooltip(
          i === 0 ? "Caja NAP (origen)" : tipo === "cliente" ? "Domicilio del cliente" : `Poste / punto ${i}`
        );
        m.on("dragend", () => {
          const ll = m.getLatLng();
          const nueva = [...editRef.current!.ruta];
          nueva[i] = [+ll.lat.toFixed(6), +ll.lng.toFixed(6)];
          editRef.current!.onChange(nueva);
        });
        m.on("contextmenu", () => {
          editRef.current!.onChange(editRef.current!.ruta.filter((_, j) => j !== i));
        });
      });
    }

    // Encuadre inicial único: después el usuario controla el zoom libremente.
    if (!ajustadoRef.current) {
      if (limites.length > 1) map.fitBounds(L.latLngBounds(limites), { padding: [40, 40], maxZoom: 18 });
      else if (limites.length === 1) map.setView(limites[0], 17);
      ajustadoRef.current = true;
    }
  }

  return <div ref={contRef} className="mapa" style={{ height: altura }} />;
}
