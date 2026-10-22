import Image from "next/image";

/**
 * Logo TeleRuta: usa el mismo ícono de la app (app/icon.svg), que Next.js
 * sirve en la ruta /icon.svg.
 */
export function LogoMark({ size = 36 }: { size?: number }) {
  return <Image src="/icon.svg" width={size} height={size} alt="" aria-hidden="true" />;
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
