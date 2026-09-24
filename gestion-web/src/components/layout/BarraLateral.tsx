import { Marca } from "./Marca";
import { Navegacion } from "./Navegacion";
import { PieLateral } from "./PieLateral";

// escritorio: barra fija a la izquierda
export function BarraLateral({ nombre, email }: { nombre: string; email: string }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col justify-between border-r border-sidebar-border bg-sidebar px-3 py-5 lg:flex">
      <div className="flex flex-col gap-7">
        <div className="px-3">
          <Marca />
        </div>
        <Navegacion />
      </div>
      <PieLateral nombre={nombre} email={email} />
    </aside>
  );
}
