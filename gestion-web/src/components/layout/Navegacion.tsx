"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ENLACES } from "./enlaces";

function estaActivo(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navegacion({ alNavegar }: { alNavegar?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Principal" className="flex flex-col gap-0.5">
      {ENLACES.map(({ href, texto, icono: Icono }) => {
        const activo = estaActivo(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={alNavegar}
            aria-current={activo ? "page" : undefined}
            className={cn(
              "flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150",
              activo
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <Icono className={cn("size-4", activo ? "opacity-100" : "opacity-60")} />
            {texto}
          </Link>
        );
      })}
    </nav>
  );
}
