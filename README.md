# TeleRuta · Registro técnico de campo

Aplicación web (Next.js 15 + React 19 + Leaflet) para registrar las atenciones de técnicos de telefonía e internet y trazar la ruta del cable instalado.

## Ejecutar

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

## Secciones

- **Panel general** (`/`): indicadores, mapa de tendidos y registros recientes.
- **Registros** (`/registros`): búsqueda, filtros y exportación a CSV.
- **Nuevo registro** (`/registros/nuevo`): formulario con mapa editable (clic para añadir puntos, arrastrar para mover, clic derecho para eliminar). La longitud del cable se calcula automáticamente.
- **Detalle** (`/registros/[id]`): ruta, tramos, mediciones ópticas, materiales y cierre.
- **Mapa de tendidos** (`/mapa`): todas las rutas coloreadas por estado.

Los datos son de demostración y se guardan en el `localStorage` del navegador.
