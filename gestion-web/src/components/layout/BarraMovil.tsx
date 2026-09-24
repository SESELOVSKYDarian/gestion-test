"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { IndicadorModo } from "@/components/modo/IndicadorModo";
import { Marca } from "./Marca";
import { Navegacion } from "./Navegacion";
import { PieLateral } from "./PieLateral";

// celular y tablet: barra arriba + menu lateral deslizable
export function BarraMovil({ nombre, email }: { nombre: string; email: string }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur lg:hidden">
      <Marca />
      <div className="flex items-center gap-2">
        <IndicadorModo className="hidden sm:inline-flex" />
        <Sheet open={abierto} onOpenChange={setAbierto}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Abrir menú">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-72 flex-col justify-between bg-sidebar p-4">
            <div className="flex flex-col gap-6">
              <SheetHeader className="p-0 pl-3">
                <SheetTitle className="sr-only">Menú</SheetTitle>
                <SheetDescription className="sr-only">Navegación del panel</SheetDescription>
                <Marca />
              </SheetHeader>
              <Navegacion alNavegar={() => setAbierto(false)} />
            </div>
            <PieLateral nombre={nombre} email={email} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
