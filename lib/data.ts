import type { Registro, Tecnico, TipoServicio, Tecnologia, TipoCable } from "./types";

export const TECNICOS: Tecnico[] = [
  { id: "TEC-014", nombre: "Carlos Mendoza Ríos", cuadrilla: "Cuadrilla Sur 03", telefono: "987 412 330" },
  { id: "TEC-027", nombre: "Andrea Salazar Quispe", cuadrilla: "Cuadrilla Centro 01", telefono: "986 220 914" },
  { id: "TEC-031", nombre: "Jorge Huamán Torres", cuadrilla: "Cuadrilla Este 02", telefono: "945 118 607" },
  { id: "TEC-042", nombre: "Lucía Paredes Vega", cuadrilla: "Cuadrilla Centro 01", telefono: "912 785 446" },
  { id: "TEC-055", nombre: "Miguel Ángel Cárdenas", cuadrilla: "Cuadrilla Sur 03", telefono: "963 507 281" },
];

export const TIPOS_SERVICIO: TipoServicio[] = [
  "Instalación nueva",
  "Reparación de avería",
  "Traslado de servicio",
  "Mantenimiento preventivo",
  "Upgrade de plan",
];

export const TECNOLOGIAS: Tecnologia[] = ["FTTH (Fibra óptica)", "HFC (Coaxial)", "Cobre (VDSL)"];

export const TIPOS_CABLE: TipoCable[] = [
  "Drop FO 1 hilo G.657A2",
  "Drop FO 2 hilos G.657A2",
  "Coaxial RG-6",
  "Par telefónico 2x0.5 mm",
  "UTP Cat 6",
];

export const PLANES = [
  "Fibra Hogar 200 Mbps",
  "Fibra Hogar 400 Mbps",
  "Fibra Hogar 1 Gbps",
  "Dúo Fibra 300 Mbps + Telefonía fija",
  "Trío Fibra 600 Mbps + TV + Telefonía",
  "Empresas Simétrico 500 Mbps",
];

export const EQUIPOS = [
  "ONT Huawei EG8145X6 (Wi-Fi 6)",
  "ONT ZTE F670L",
  "Cable módem Arris TG3442",
  "Router VDSL TP-Link VR600",
  "Mesh TP-Link Deco X20",
];

export const DISTRITOS = [
  "Miraflores", "San Isidro", "Santiago de Surco", "San Borja", "Barranco",
  "Jesús María", "La Molina", "Lince", "Magdalena del Mar", "Pueblo Libre",
];

export const MATERIALES_CATALOGO = [
  "Conector SC/APC mecánico",
  "Roseta óptica",
  "Grapa de retención",
  "Templador para drop",
  "Precinto de nylon",
  "Cinta de acero bandit",
  "Canaleta adhesiva 20x10 (m)",
  "Patch cord SC/APC 1.5 m",
  "Conector F RG-6",
  "Splitter coaxial 2 vías",
];

const base = (
  id: string,
  fecha: string,
  tecnicoId: string,
  estado: Registro["estado"],
  tipoServicio: TipoServicio,
  cliente: Registro["cliente"],
  servicio: Registro["servicio"],
  red: Registro["red"],
  ruta: Registro["ruta"],
  medicion: Registro["medicion"],
  extra: Partial<Registro> = {}
): Registro => ({
  id,
  fecha,
  horaInicio: "09:00",
  horaFin: "11:15",
  estado,
  tipoServicio,
  prioridad: "Media",
  tecnicoId,
  cliente,
  servicio,
  red,
  ruta,
  medicion,
  materiales: [
    { nombre: "Conector SC/APC mecánico", cantidad: 2 },
    { nombre: "Roseta óptica", cantidad: 1 },
    { nombre: "Grapa de retención", cantidad: 6 },
    { nombre: "Templador para drop", cantidad: 2 },
  ],
  observaciones: "",
  conformidadCliente: estado === "Completado",
  calificacion: 5,
  ...extra,
});

export const REGISTROS_SEMILLA: Registro[] = [
  base(
    "OT-2026-004812", "2026-10-13", "TEC-014", "En progreso", "Instalación nueva",
    { nombre: "Rosa Elena Gutiérrez", documento: "DNI 45872136", telefono: "998 451 207", direccion: "Av. José Larco 812, Dpto. 502", distrito: "Miraflores", codigoAbonado: "AB-7731042" },
    { tecnologia: "FTTH (Fibra óptica)", plan: "Fibra Hogar 400 Mbps", equipo: "ONT Huawei EG8145X6 (Wi-Fi 6)", serieEquipo: "48575443A1B2C3D4" },
    { cajaNap: "NAP-MIR-0217", puerto: 5, tipoCable: "Drop FO 1 hilo G.657A2", metrosReserva: 15, tipoTendido: "Aéreo", postesUtilizados: 3 },
    [[-12.12445, -77.02995], [-12.12392, -77.02978], [-12.12331, -77.02961], [-12.12318, -77.02912]],
    { potenciaRx: -19.4, atenuacion: 14.2, velocidadBajada: 0, velocidadSubida: 0, latencia: 0 },
    { horaInicio: "08:40", horaFin: "", prioridad: "Alta", calificacion: 0, observaciones: "Tendido aéreo en curso. Pendiente fusión en roseta y prueba de velocidad." }
  ),
  base(
    "OT-2026-004809", "2026-10-12", "TEC-027", "Completado", "Instalación nueva",
    { nombre: "Inversiones Kallpa S.A.C.", documento: "RUC 20604411238", telefono: "01 441 2290", direccion: "Calle Las Begonias 475, Of. 301", distrito: "San Isidro", codigoAbonado: "AB-7730988" },
    { tecnologia: "FTTH (Fibra óptica)", plan: "Empresas Simétrico 500 Mbps", equipo: "ONT ZTE F670L", serieEquipo: "ZTEGC8A11F02" },
    { cajaNap: "NAP-SIS-0091", puerto: 2, tipoCable: "Drop FO 2 hilos G.657A2", metrosReserva: 20, tipoTendido: "Subterráneo", postesUtilizados: 0 },
    [[-12.09622, -77.03371], [-12.09668, -77.03389], [-12.09702, -77.03432], [-12.09741, -77.03447]],
    { potenciaRx: -17.8, atenuacion: 12.6, velocidadBajada: 512, velocidadSubida: 498, latencia: 4 },
    { horaInicio: "09:10", horaFin: "12:05", prioridad: "Alta", observaciones: "Ingreso por ducto del edificio. Se etiquetó el drop en cuarto de telecomunicaciones (piso 1)." }
  ),
  base(
    "OT-2026-004801", "2026-10-12", "TEC-031", "Completado", "Reparación de avería",
    { nombre: "Héctor Ramírez Polo", documento: "DNI 09981427", telefono: "955 300 128", direccion: "Jr. Monte Rosa 255", distrito: "Santiago de Surco", codigoAbonado: "AB-6620417" },
    { tecnologia: "FTTH (Fibra óptica)", plan: "Fibra Hogar 200 Mbps", equipo: "ONT Huawei EG8145X6 (Wi-Fi 6)", serieEquipo: "4857544399F1E0AA" },
    { cajaNap: "NAP-SUR-0412", puerto: 7, tipoCable: "Drop FO 1 hilo G.657A2", metrosReserva: 10, tipoTendido: "Aéreo", postesUtilizados: 2 },
    [[-12.14512, -76.99121], [-12.14468, -76.99088], [-12.14439, -76.99031]],
    { potenciaRx: -21.1, atenuacion: 15.8, velocidadBajada: 214, velocidadSubida: 205, latencia: 6 },
    { horaInicio: "14:20", horaFin: "15:40", prioridad: "Alta", observaciones: "Drop cortado por poda de árbol. Se reemplazó tramo completo desde NAP." }
  ),
  base(
    "OT-2026-004795", "2026-10-11", "TEC-042", "Completado", "Traslado de servicio",
    { nombre: "María Fernanda Ccori", documento: "DNI 72104589", telefono: "940 662 015", direccion: "Av. San Luis 2190, Torre B 1104", distrito: "San Borja", codigoAbonado: "AB-5503318" },
    { tecnologia: "FTTH (Fibra óptica)", plan: "Trío Fibra 600 Mbps + TV + Telefonía", equipo: "ONT ZTE F670L", serieEquipo: "ZTEGC8B92D17" },
    { cajaNap: "NAP-SBO-0133", puerto: 1, tipoCable: "Drop FO 1 hilo G.657A2", metrosReserva: 25, tipoTendido: "Mixto", postesUtilizados: 1 },
    [[-12.10421, -77.00152], [-12.10466, -77.00121], [-12.10511, -77.00098], [-12.10538, -77.00041]],
    { potenciaRx: -18.6, atenuacion: 13.4, velocidadBajada: 618, velocidadSubida: 590, latencia: 5 },
    { horaInicio: "10:00", horaFin: "12:30", calificacion: 4 }
  ),
  base(
    "OT-2026-004788", "2026-10-11", "TEC-055", "Completado", "Instalación nueva",
    { nombre: "Diego Alonso Vílchez", documento: "DNI 46213987", telefono: "977 183 554", direccion: "Jr. Domeyer 133", distrito: "Barranco", codigoAbonado: "AB-7730802" },
    { tecnologia: "HFC (Coaxial)", plan: "Dúo Fibra 300 Mbps + Telefonía fija", equipo: "Cable módem Arris TG3442", serieEquipo: "ARRS3442K77810" },
    { cajaNap: "TAP-BAR-0058", puerto: 3, tipoCable: "Coaxial RG-6", metrosReserva: 8, tipoTendido: "Aéreo", postesUtilizados: 2 },
    [[-12.14901, -77.02152], [-12.14938, -77.02121], [-12.14972, -77.02095]],
    { potenciaRx: 2.5, atenuacion: 6.1, velocidadBajada: 296, velocidadSubida: 31, latencia: 12 },
    {
      horaInicio: "15:00", horaFin: "16:50",
      materiales: [
        { nombre: "Conector F RG-6", cantidad: 4 },
        { nombre: "Splitter coaxial 2 vías", cantidad: 1 },
        { nombre: "Grapa de retención", cantidad: 5 },
      ],
      observaciones: "Potencia en módem medida en dBmV (rango HFC).",
    }
  ),
  base(
    "OT-2026-004779", "2026-10-10", "TEC-014", "Pendiente", "Mantenimiento preventivo",
    { nombre: "Colegio Santa Beatriz", documento: "RUC 20512983314", telefono: "01 463 0021", direccion: "Av. Salaverry 1840", distrito: "Jesús María", codigoAbonado: "AB-3301174" },
    { tecnologia: "FTTH (Fibra óptica)", plan: "Empresas Simétrico 500 Mbps", equipo: "ONT Huawei EG8145X6 (Wi-Fi 6)", serieEquipo: "48575443C9D0E1F2" },
    { cajaNap: "NAP-JMA-0076", puerto: 4, tipoCable: "Drop FO 2 hilos G.657A2", metrosReserva: 0, tipoTendido: "Subterráneo", postesUtilizados: 0 },
    [[-12.07592, -77.04788], [-12.07631, -77.04802]],
    { potenciaRx: -24.2, atenuacion: 18.9, velocidadBajada: 0, velocidadSubida: 0, latencia: 0 },
    { horaInicio: "08:00", horaFin: "", prioridad: "Baja", materiales: [], conformidadCliente: false, calificacion: 0, observaciones: "Programado: limpieza de conectores y verificación de potencia (cliente reporta lentitud)." }
  ),
  base(
    "OT-2026-004770", "2026-10-10", "TEC-031", "Completado", "Upgrade de plan",
    { nombre: "Patricia Lozano Medina", documento: "DNI 41187520", telefono: "924 008 731", direccion: "Calle Los Fresnos 318", distrito: "La Molina", codigoAbonado: "AB-4410925" },
    { tecnologia: "FTTH (Fibra óptica)", plan: "Fibra Hogar 1 Gbps", equipo: "Mesh TP-Link Deco X20", serieEquipo: "TPDX20-2231907" },
    { cajaNap: "NAP-LMO-0204", puerto: 6, tipoCable: "UTP Cat 6", metrosReserva: 5, tipoTendido: "Aéreo", postesUtilizados: 0 },
    [[-12.07912, -76.94221], [-12.07938, -76.94189]],
    { potenciaRx: -16.9, atenuacion: 11.7, velocidadBajada: 941, velocidadSubida: 912, latencia: 3 },
    { horaInicio: "11:30", horaFin: "12:20", prioridad: "Baja", materiales: [{ nombre: "Canaleta adhesiva 20x10 (m)", cantidad: 6 }], observaciones: "Se añadió nodo mesh en segundo piso con cableado UTP." }
  ),
  base(
    "OT-2026-004764", "2026-10-09", "TEC-042", "Cancelado", "Instalación nueva",
    { nombre: "Óscar Ñique Bernal", documento: "DNI 70032816", telefono: "981 774 260", direccion: "Av. Arequipa 2450, Dpto. 801", distrito: "Lince", codigoAbonado: "AB-7730611" },
    { tecnologia: "FTTH (Fibra óptica)", plan: "Fibra Hogar 400 Mbps", equipo: "ONT ZTE F670L", serieEquipo: "—" },
    { cajaNap: "NAP-LIN-0118", puerto: 8, tipoCable: "Drop FO 1 hilo G.657A2", metrosReserva: 0, tipoTendido: "Aéreo", postesUtilizados: 0 },
    [[-12.08498, -77.03472], [-12.08542, -77.03451]],
    { potenciaRx: 0, atenuacion: 0, velocidadBajada: 0, velocidadSubida: 0, latencia: 0 },
    { horaInicio: "16:00", horaFin: "16:25", materiales: [], conformidadCliente: false, calificacion: 0, observaciones: "Administración del edificio no autorizó el ingreso por fachada. Se reprograma con carta de autorización." }
  ),
];
