export type LatLng = [number, number];

export type TipoServicio =
  | "Instalación nueva"
  | "Reparación de avería"
  | "Traslado de servicio"
  | "Mantenimiento preventivo"
  | "Upgrade de plan";

export type Tecnologia = "FTTH (Fibra óptica)" | "HFC (Coaxial)" | "Cobre (VDSL)";

export type TipoCable =
  | "Drop FO 1 hilo G.657A2"
  | "Drop FO 2 hilos G.657A2"
  | "Coaxial RG-6"
  | "Par telefónico 2x0.5 mm"
  | "UTP Cat 6";

export type Estado = "Completado" | "En progreso" | "Pendiente" | "Cancelado";

export interface Tecnico {
  id: string;
  nombre: string;
  cuadrilla: string;
  telefono: string;
}

export interface Medicion {
  potenciaRx: number; // dBm en la ONT/módem
  atenuacion: number; // dB pérdida total del tramo
  velocidadBajada: number; // Mbps
  velocidadSubida: number; // Mbps
  latencia: number; // ms
}

export interface Registro {
  id: string; // OT-2026-000123
  fecha: string; // YYYY-MM-DD
  horaInicio: string;
  horaFin: string;
  estado: Estado;
  tipoServicio: TipoServicio;
  prioridad: "Alta" | "Media" | "Baja";
  tecnicoId: string;

  cliente: {
    nombre: string;
    documento: string;
    telefono: string;
    direccion: string;
    distrito: string;
    codigoAbonado: string;
  };

  servicio: {
    tecnologia: Tecnologia;
    plan: string;
    equipo: string;
    serieEquipo: string;
  };

  red: {
    cajaNap: string; // terminal de origen
    puerto: number;
    tipoCable: TipoCable;
    metrosReserva: number;
    tipoTendido: "Aéreo" | "Subterráneo" | "Mixto";
    postesUtilizados: number;
  };

  ruta: LatLng[]; // primer punto: caja NAP, último: domicilio del cliente
  medicion: Medicion;

  materiales: { nombre: string; cantidad: number }[];
  observaciones: string;
  conformidadCliente: boolean;
  calificacion: number; // 1-5
}
