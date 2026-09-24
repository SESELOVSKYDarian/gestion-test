"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FormularioClave, type ClaveCreada } from "./FormularioClave";
import { SecretoGenerado } from "./SecretoGenerado";

export function PanelNuevaClave({ alCrear }: { alCrear: () => void }) {
  const [abierto, setAbierto] = useState(false);
  const [creada, setCreada] = useState<ClaveCreada | null>(null);

  function cambiarAbierto(valor: boolean) {
    setAbierto(valor);
    // al cerrar olvido el secreto: no queda en memoria del navegador
    if (!valor) setCreada(null);
  }

  return (
    <Sheet open={abierto} onOpenChange={cambiarAbierto}>
      <SheetTrigger asChild>
        <Button size="lg">
          <Plus /> Nueva clave
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{creada ? `Clave "${creada.nombre}" creada` : "Nueva clave de API"}</SheetTitle>
          <SheetDescription>
            {creada ? "Pasale estos dos datos al sistema que va a consumir la API." : "Cada sistema que consuma la API tiene que tener su propia clave."}
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto px-4 pb-6">
          {creada ? (
            <SecretoGenerado clavePublica={creada.clavePublica} secreto={creada.secreto} />
          ) : (
            <FormularioClave
              alCrear={(clave) => {
                setCreada(clave);
                alCrear();
              }}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
