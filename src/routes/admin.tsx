import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <aside className="w-64 bg-background border-r flex flex-col">
        <div className="p-6 border-b">
          <span className="font-display text-xl font-black tracking-tighter">
            COLORINS <span className="text-coral">ADMIN</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted font-medium"
          >
            <LayoutDashboard className="size-5" />
            Dashboard
          </Link>

          <Link
            to="/admin/productos"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted font-medium"
          >
            <Package className="size-5" />
            Productos
          </Link>

          <div className="flex items-center gap-3 p-3 rounded-xl text-muted-foreground">
            <ShoppingCart className="size-5" />
            Pedidos
          </div>
        </nav>

        <div className="p-4 border-t">
          <Link
            to="/"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 text-destructive font-medium"
          >
            <LogOut className="size-5" />
            Salir al sitio
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
