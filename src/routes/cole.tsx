import { createFileRoute, Link } from "@tanstack/react-router";
import { schoolLists, formatPrice } from "@/lib/colorins-data";
import { Button } from "@/components/ui/button";
import { GraduationCap, CheckCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/cole")({
  component: SchoolListsPage,
});

function SchoolListsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl font-extrabold flex items-center gap-3">
          <GraduationCap className="text-turquoise size-10" /> Listas Escolares
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Encuentra el material específico solicitado por los centros educativos de Onda.
        </p>
      </div>

      <div className="mt-12 space-y-10">
        {schoolLists.map((list) => (
          <div key={list.id} className="surface-card p-8">
            <h2 className="text-2xl font-bold border-b pb-4 mb-6">{list.school}</h2>
            <div className="grid gap-6">
              {list.rows.map((row, i) => (
                <div key={i} className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/30 rounded-2xl border border-border">
                  <div>
                    <Badge variant="secondary" className="mb-2">{row.course} - Grupo {row.group}</Badge>
                    <h3 className="font-bold text-lg">{row.item}</h3>
                    <p className="text-sm text-muted-foreground">Cantidad solicitada: {row.qty}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Info size={14} className="text-sun" /> {row.availability}
                    </span>
                    <Button variant="outline" className="rounded-full">Añadir a mi lista</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-turquoise/10 rounded-[2.5rem] border border-turquoise/20 flex flex-col md:flex-row items-center gap-6">
        <div className="size-16 bg-turquoise text-white rounded-full flex items-center justify-center shrink-0">
          <CheckCircle size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold">¿No encuentras tu lista?</h3>
          <p className="text-muted-foreground">Tráenos la lista física a la tienda en Carrer Metge José Llidó, 8 y nosotros te preparamos todo el paquete.</p>
        </div>
        <Button asChild className="md:ml-auto rounded-full px-8"><Link to="/contacto">Consultar</Link></Button>
      </div>
    </div>
  );
}