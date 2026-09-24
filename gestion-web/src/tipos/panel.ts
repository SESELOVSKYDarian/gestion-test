// tipos que usa el frontend (espejo de lo que devuelve la API)
export type { Columna } from "@/services/esquema/tipos";
export type { ModoApi, EstadoModo } from "@/services/modo/modo";

export type TablaResumen = {
  nombre: string;
  esVista: boolean;
  filasAprox: number;
  columnas: number;
  clavePrimaria: string[];
  expuesta: boolean;
  permiteEscritura: boolean;
};

export type EventoAuditoria = {
  id: number;
  accion: string;
  tabla: string | null;
  estado: number;
  detalle: string | null;
  ip: string | null;
  fecha: string;
  origen: string;
};

export type ClaveApi = {
  id: number;
  nombre: string;
  clavePublica: string;
  permiso: "lectura" | "escritura";
  creadaEn: string;
  ultimoUsoEn: string | null;
  revocadaEn: string | null;
  creador: string | null;
};

export type Fila = Record<string, string | number | null>;
