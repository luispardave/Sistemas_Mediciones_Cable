"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const ICONOS = {
  panel: "M3 13h8V3H3zm0 8h8v-6H3zm10 0h8V11h-8zm0-18v6h8V3z",
  lista: "M4 6h16M4 12h16M4 18h10",
  nuevo: "M12 5v14M5 12h14",
  mapa: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14",
};

const NAV = [
  { href: "/", label: "Panel general", icono: ICONOS.panel },
  { href: "/registros", label: "Registros de atención", icono: ICONOS.lista },
  { href: "/registros/nuevo", label: "Nuevo registro", icono: ICONOS.nuevo },
  { href: "/mapa", label: "Mapa de tendidos", icono: ICONOS.mapa },
];

export function Sidebar() {
  const path = usePathname();
  const activo = (href: string) =>
    href === "/" ? path === "/" : href === "/registros" ? path === "/registros" || /^\/registros\/OT/.test(path) : path.startsWith(href);

  return (
    <aside className="sidebar">
      <Link href="/" className="sidebar-logo">
        <Logo />
      </Link>
      <nav>
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={`nav-item ${activo(n.href) ? "activo" : ""}`}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={n.icono} />
            </svg>
            <span>{n.label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-pie">
        <div className="avatar">SV</div>
        <div>
          <div className="pie-nombre">Supervisión de campo</div>
          <div className="pie-sub">Zona Lima Metropolitana</div>
        </div>
      </div>
    </aside>
  );
}
