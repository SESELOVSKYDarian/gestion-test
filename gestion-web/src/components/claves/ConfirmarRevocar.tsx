"use client";

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = { nombre: string | null; alCerrar: () => void; alConfirmar: () => void };

export function ConfirmarRevocar({ nombre, alCerrar, alConfirmar }: Props) {
  return (
    <AlertDialog open={nombre !== null} onOpenChange={(valor) => !valor && alCerrar()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Revocar la clave &quot;{nombre}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            El sistema que la usa deja de tener acceso en el momento. No se puede reactivar: habría que crear una nueva.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={alConfirmar}>Revocar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
