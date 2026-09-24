// titulos de columna: solo en escritorio (en celular cada fila se explica sola)
export function CabeceraListaTablas() {
  return (
    <div
      aria-hidden
      className="hidden grid-cols-[minmax(0,1.6fr)_7rem_minmax(0,1.2fr)_6.5rem_8.5rem_2.5rem] gap-x-4 border-b border-border pb-2 text-xs text-muted-foreground md:grid"
    >
      <span>Tabla</span>
      <span className="text-right">Filas aprox.</span>
      <span>Clave primaria</span>
      <span>Expuesta</span>
      <span>Escritura</span>
      <span />
    </div>
  );
}
