export type Columna = {
  nombre: string;
  tipo: string;
  tipoCompleto: string;
  aceptaNulo: boolean;
  tieneDefecto: boolean;
  autoIncremental: boolean;
  largoMaximo: number | null;
  esClave: boolean;
};

export type TablaLegacy = {
  nombre: string;
  esVista: boolean;
  filasAprox: number;
  columnas: Columna[];
  clavePrimaria: string[];
};

export type EsquemaLegacy = Map<string, TablaLegacy>;
