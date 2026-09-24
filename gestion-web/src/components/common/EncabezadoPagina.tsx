type Props = {
  titulo: string;
  descripcion?: string;
  children?: React.ReactNode;
};

// titulo de cada pantalla + acciones a la derecha (abajo en celular)
export function EncabezadoPagina({ titulo, descripcion, children }: Props) {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h1 className="text-fluid-xl font-medium">{titulo}</h1>
        {descripcion ? <p className="mt-1.5 text-fluid-base text-muted-foreground">{descripcion}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </header>
  );
}
