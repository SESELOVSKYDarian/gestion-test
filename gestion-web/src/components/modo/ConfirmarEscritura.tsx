"use client";

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = { abierto: boolean; alCerrar: () => void; alConfirmar: () => void };

// habilitar escritura toca la base de un sistema en produccion: pido confirmacion
export function ConfirmarEscritura({ abierto, alCerrar, alConfirmar }: Props) {
  return (
    <AlertDialog open={abierto} onOpenChange={(valor) => !valor && alCerrar()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Habilitar la escritura?</AlertDialogTitle>
          <AlertDialogDescription>
            Las claves con permiso de escritura van a poder crear, modificar y borrar registros en las tablas que
            tengan la escritura activada. Los cambios impactan directo en el sistema de gestión.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="escritura" onClick={alConfirmar}>
            Habilitar escritura
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
