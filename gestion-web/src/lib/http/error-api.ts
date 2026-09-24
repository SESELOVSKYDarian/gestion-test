// error con status http y mensaje pensado para mostrar al usuario
export class ErrorApi extends Error {
  estado: number;
  codigo: string;
  detalles?: unknown;

  constructor(estado: number, codigo: string, mensaje: string, detalles?: unknown) {
    super(mensaje);
    this.estado = estado;
    this.codigo = codigo;
    this.detalles = detalles;
  }
}
