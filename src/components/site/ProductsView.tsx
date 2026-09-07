import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  Plus,
  Download,
  Filter,
  Pencil,
  Trash2,
  Package,
  CheckCircle,
  XCircle,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import { Product, Category } from "../../types";
import { Card, Button, Empty, money, csvEscape, downloadFile } from "./CommonUI";

interface ProductsViewProps {
  products: Product[];
  categories: Category[];
  onOpenCreateModal: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string, productName: string) => Promise<void>;
  onToggleProduct: (productId: string) => Promise<void>;
  notify: (msg: string) => void;
}

export function ProductsView({
  products,
  categories,
  onOpenCreateModal,
  onEditProduct,
  onDeleteProduct,
  onToggleProduct,
  notify,
}: ProductsViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "inStock" | "lowStock" | "outOfStock">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));

      const matchesCat = selectedCategory === "all" || p.category === selectedCategory;

      let matchesStock = true;
      if (stockFilter === "inStock") matchesStock = Number(p.stock) > 5;
      else if (stockFilter === "lowStock") matchesStock = Number(p.stock) > 0 && Number(p.stock) <= 5;
      else if (stockFilter === "outOfStock") matchesStock = Number(p.stock) <= 0;

      let matchesStatus = true;
      if (statusFilter === "active") matchesStatus = Boolean(p.active);
      else if (statusFilter === "inactive") matchesStatus = !Boolean(p.active);

      return matchesSearch && matchesCat && matchesStock && matchesStatus;
    });
  }, [products, search, selectedCategory, stockFilter, statusFilter]);

  const exportCSV = () => {
    if (products.length === 0) {
      notify("No hay productos para exportar.");
      return;
    }

    const headers = [
      "ID",
      "Nombre",
      "Categoría",
      "SKU",
      "Precio",
      "Precio Anterior",
      "Stock",
      "IVA",
      "Activo",
      "Destacado",
      "Peso",
      "Descripción",
    ];

    const rows = products.map((p) =>
      [
        p.id,
        p.name,
        p.category || "",
        p.sku || "",
        p.price,
        p.old_price ?? "",
        p.stock,
        p.tax,
        p.active ? "Sí" : "No",
        p.featured ? "Sí" : "No",
        p.weight || "",
        p.description || "",
      ]
        .map(csvEscape)
        .join(",")
    );

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    downloadFile(`colorins-productos-${new Date().toISOString().slice(0, 10)}.csv`, csvContent, "text/csv;charset=utf-8;");
    notify("Archivo CSV de productos exportado con éxito.");
  };

  return (
    <div className="space-y-6">
      {/* Search and filter toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              id="input-search-products"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, SKU o descripción..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#F26B5B] focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#F26B5B]"
            >
              <option value="all">Todas las categorías ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#F26B5B]"
            >
              <option value="all">Todo el stock</option>
              <option value="inStock">Disponible (&gt;5)</option>
              <option value="lowStock">Stock bajo (1-5)</option>
              <option value="outOfStock">Agotado (0)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#F26B5B]"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Solo Activos</option>
              <option value="inactive">Solo Inactivos</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span className="font-semibold">
            Mostrando <strong className="text-slate-800">{filteredProducts.length}</strong> de{" "}
            <strong className="text-slate-800">{products.length}</strong> productos
          </span>

          <div className="flex items-center gap-2">
            <Button size="sm" secondary onClick={exportCSV}>
              <Download size={14} />
              <span>Exportar CSV</span>
            </Button>
            <Button id="btn-add-product" size="sm" onClick={onOpenCreateModal}>
              <Plus size={14} />
              <span>Nuevo Producto</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        {filteredProducts.length === 0 ? (
          <Empty
            icon={Package}
            title="No se encontraron productos"
            text="Prueba a ajustar los términos de búsqueda o filtros, o crea un nuevo producto."
            action={
              <Button size="sm" onClick={onOpenCreateModal}>
                <Plus size={14} />
                <span>Crear Producto</span>
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3 pl-2">Producto</th>
                  <th className="pb-3">Categoría</th>
                  <th className="pb-3">Precio</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3 pr-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredProducts.map((p) => {
                  const isLow = Number(p.stock) > 0 && Number(p.stock) <= 5;
                  const isOut = Number(p.stock) <= 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-3">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="h-11 w-11 shrink-0 rounded-xl object-cover border border-slate-200"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                              <ImageIcon size={18} />
                            </div>
                          )}
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-900 truncate text-sm">{p.name}</p>
                              {Boolean(p.featured) && (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-black text-amber-800">
                                  <Star size={9} fill="currentColor" />
                                  Destacado
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">
                              SKU: <span className="font-mono text-slate-600">{p.sku || "-"}</span>{" "}
                              {p.weight && `• ${p.weight}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                          {p.category || "Sin categoría"}
                        </span>
                      </td>

                      <td className="py-3">
                        <div className="font-bold text-slate-900 text-sm">
                          {money(p.price)}
                        </div>
                        {p.old_price && Number(p.old_price) > Number(p.price) && (
                          <div className="text-[11px] text-slate-400 line-through">
                            {money(p.old_price)}
                          </div>
                        )}
                      </td>

                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-black ${
                            isOut
                              ? "bg-rose-100 text-rose-700"
                              : isLow
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isOut ? "Agotado" : `${p.stock} uds`}
                        </span>
                      </td>

                      <td className="py-3">
                        <button
                          onClick={() => onToggleProduct(p.id)}
                          title="Hacer clic para activar o desactivar"
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold cursor-pointer transition ${
                            p.active
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {p.active ? (
                            <>
                              <CheckCircle size={12} />
                              <span>Activo</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={12} />
                              <span>Inactivo</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 pr-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditProduct(p)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                            title="Editar producto"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(p.id, p.name)}
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                            title="Eliminar producto"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
