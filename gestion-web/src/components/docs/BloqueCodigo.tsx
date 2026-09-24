import { BotonCopiar } from "@/components/common/BotonCopiar";

export function BloqueCodigo({ codigo, etiqueta }: { codigo: string; etiqueta: string }) {
  return (
    <div className="relative rounded-lg border border-border bg-muted/40">
      <div className="flex items-center justify-between border-b border-border py-1 pr-1 pl-3">
        <span className="text-xs text-muted-foreground">{etiqueta}</span>
        <BotonCopiar texto={codigo} etiqueta={etiqueta} />
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed">
        <code>{codigo}</code>
      </pre>
    </div>
  );
}
