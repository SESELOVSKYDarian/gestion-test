import Link from "next/link";

// logotipo tipografico: sin icono generico
export function Marca() {
  return (
    <Link href="/" className="group flex items-baseline gap-1.5 rounded-sm font-heading text-[1.05rem] font-semibold tracking-tight">
      <span className="text-foreground">Gestión</span>
      <span className="text-muted-foreground transition-colors group-hover:text-foreground">Web</span>
    </Link>
  );
}
