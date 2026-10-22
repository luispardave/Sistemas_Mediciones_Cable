import type { LatLng } from "./types";

const R = 6371000; // radio terrestre en metros

export function distanciaMetros(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function longitudRuta(ruta: LatLng[]): number {
  let total = 0;
  for (let i = 1; i < ruta.length; i++) total += distanciaMetros(ruta[i - 1], ruta[i]);
  return total;
}

export function metrosTotales(ruta: LatLng[], reserva: number): number {
  return Math.round(longitudRuta(ruta) + reserva);
}

export const CENTRO_LIMA: LatLng = [-12.1046, -77.0228];
