import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold font-display">Dashboard de COLORINS</h1>
      <p className="mt-2 text-muted-foreground">Bienvenido al panel de gestión real.</p>
      
      <div className="grid gap-6 mt-10 md:grid-cols-3">
        <div className="p-6 bg-background border rounded-2xl shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Pedidos Totales</p>
          <p className="text-3xl font-bold mt-1">0</p>
          <p className="text-xs text-muted-foreground mt-2 italic">Dato real (sin pedidos todavía)</p>
        </div>
        <div className="p-6 bg-background border rounded-2xl shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Mensajes Nuevos</p>
          <p className="text-3xl font-bold mt-1">0</p>
          <p className="text-xs text-muted-foreground mt-2 italic">Dato real (sin mensajes todavía)</p>
        </div>
        <div className="p-6 bg-background border rounded-2xl shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Productos en Catálogo</p>
          <p className="text-3xl font-bold mt-1">16</p>
          <p className="text-xs text-muted-foreground mt-2 italic">Dato real de demo-data.ts</p>
        </div>
      </div>
    </div>
  );
}