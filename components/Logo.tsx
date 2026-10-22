/**
 * Logo TeleRuta: un tendido de cable (nodos conectados) que parte de la caja
 * terminal y termina en el pin de ubicación del cliente.
 */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="tr-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1E5BFF" />
          <stop offset="1" stopColor="#00B8A9" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#tr-grad)" />
      <path
        d="M11 35 L19 27 L26 31 L34 25"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="35" r="3.2" fill="#fff" />
      <circle cx="19" cy="27" r="1.9" fill="#fff" />
      <circle cx="26" cy="31" r="1.9" fill="#fff" />
      <path d="M34 7.5a7 7 0 0 1 7 7c0 5.2-7 11-7 11s-7-5.8-7-11a7 7 0 0 1 7-7z" fill="#fff" />
      <circle cx="34" cy="14.5" r="2.6" fill="#1E5BFF" />
    </svg>
  );
}

export function Logo() {
  return (
    <div className="logo">
      <LogoMark />
      <div>
        <div className="logo-name">
          Tele<span>Ruta</span>
        </div>
        <div className="logo-sub">Registro técnico de campo</div>
      </div>
    </div>
  );
}
