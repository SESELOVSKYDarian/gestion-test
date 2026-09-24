import { formatearNumero } from "@/lib/formato";

type Cifra = { etiqueta: string; valor: number | null };

// tira de numeros del dia, sin tarjetas: separados por lineas finas
export function Cifras({ cifras }: { cifras: Cifra[] }) {
  return (
    <dl className="aparecer grid grid-cols-2 border-b border-border sm:grid-cols-3 xl:grid-cols-6">
      {cifras.map((cifra) => (
        <div key={cifra.etiqueta} className="border-border px-1 py-4 sm:px-4 xl:border-l xl:first:border-l-0">
          <dt className="text-xs text-muted-foreground">{cifra.etiqueta}</dt>
          <dd className="tabular mt-1 font-heading text-2xl font-medium">
            {cifra.valor === null ? "—" : formatearNumero(cifra.valor)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
