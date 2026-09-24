type Props = { titulo: string; texto?: string; children?: React.ReactNode };

export function EstadoVacio({ titulo, texto, children }: Props) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed border-border px-6 py-10">
      <p className="font-medium">{titulo}</p>
      {texto ? <p className="max-w-prose text-sm text-muted-foreground">{texto}</p> : null}
      {children}
    </div>
  );
}
