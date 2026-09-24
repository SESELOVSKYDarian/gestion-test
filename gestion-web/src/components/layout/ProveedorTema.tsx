"use client";

import { ThemeProvider } from "next-themes";

// oscuro por defecto; la eleccion queda guardada en localStorage (clave gw-tema)
export function ProveedorTema({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="gw-tema" disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
