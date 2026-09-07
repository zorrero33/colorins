import { createFileRoute } from "@tanstack/react-router";
import { products, formatPrice } from "@/lib/colorins-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/productos")({
  component: AdminProducts,
});

function AdminProducts() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold font-display">Gestión de Inventario</h1>
        <Button className="rounded-full"><Plus className="mr-2 size-4" /> Nuevo Producto</Button>
      </div>

      <div className="bg-background border rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-bold">{p.name}</TableCell>
                <TableCell className="capitalize">{p.category}</TableCell>
                <TableCell>{formatPrice(p.price)}</TableCell>
                <TableCell>
                  <span className={p.stock < 5 ? "text-destructive font-bold" : ""}>
                    {p.stock} uds.
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={p.stock > 0 ? "outline" : "destructive"}>
                    {p.stock > 0 ? "Activo" : "Sin Stock"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon"><Edit2 size={16} /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive"><Trash2 size={16} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}