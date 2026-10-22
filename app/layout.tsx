import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { StoreProvider } from "@/lib/store";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "TeleRuta · Registro técnico de campo",
  description: "Registro de atenciones de técnicos de telefonía e internet, con trazado de rutas de cable.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <StoreProvider>
          <div className="app">
            <Sidebar />
            <main className="contenido">{children}</main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
