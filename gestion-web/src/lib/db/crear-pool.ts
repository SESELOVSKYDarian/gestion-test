import mysql from "mysql2/promise";

type DatosConexion = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
};

// pool comun para todas las conexiones MariaDB
export function crearPool(datos: DatosConexion) {
  return mysql.createPool({
    ...datos,
    connectionLimit: 8,
    charset: "utf8mb4",
    // fechas como texto: evito corrimientos de zona horaria
    dateStrings: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
    connectTimeout: 8000,
  });
}
