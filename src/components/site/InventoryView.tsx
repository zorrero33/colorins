import React, { useState, useMemo } from "react";
import {
  AlertTriangle,
  Search,
  RefreshCw,
  CheckCircle2,
  Package,
  Plus,
  Minus,
  Save,
  ArrowUpDown,
} from "lucide-react";
import { Product, Category } from "../../types";
import { Card, Stat, Button, Empty } from "./CommonUI";

interface InventoryViewProps {
  products: Product[];
  categories: Category[];
  onUpdateStock: (productId: string, newStock: number) => Promise<void>;
  onRefresh: () => void;
  notify: (msg: string) => void;
}

export function InventoryView({
  products,
  categories,
  onUpdateStock,
  onRefresh,
  notify,
}: InventoryViewProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [filterMode, setFilterMode] = useState<"all" | "low" | "out">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const lowStockCount = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 5).length;
  const outOfStockCount = products.filter((p) => Number(p.stock) <= 0).length;
  const totalStockUnits = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q));

      const matchesCat = categoryFilter === "all" || p.category === categoryFilter;

      let matchesMode = true;
      if (filterMode === "low") matchesMode = Number(p.stock) > 0 && Number(p.stock) <= 5;
      else if (filterMode === "out") matchesMode = Number(p.stock) <= 0;

      return matchesSearch && matchesCat && matchesMode;
    });
  }, [products, search, categoryFilter, filterMode]);

  const handleStockChange = async (product: Product, delta: number) => {
    const current = Number(product.stock || 0);
    const updated = Math.max(0, current + delta);
    setUpdatingId(product.id);
    try {
      await onUpdateStock(product.id, updated);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleManualInput = async (product: Product, valueStr: string) => {
    const val = parseInt(valueStr, 10);
    if (isNaN(val) || val < 0) return;
    setUpdatingId(product.id);
    try {
      await onUpdateStock(product.id, val);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top inventory KPI stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          title="Unidades en Almacén"
          value={totalStockUnits.toLocaleString()}
          icon={Package}
          color="bg-indigo-500"
          subtitle={`${products.length} referencias activas`}
        />
        <Stat
          title="Stock Bajo (≤ 5 uds)"
          value={lowStockCount}
          icon={AlertTriangle}
          color="bg-amber-500"
          subtitle="Requiere reposición próxima"
        />
        <Stat
          title="Sin Stock (0 uds)"
          value={outOfStockCount}
          icon={Minus}
          color="bg-rose-500"
          subtitle="Ventas detenidas para estos items"
        />
      </div>

      {/* Filter and control bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o SKU..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 outline-none transition focus:border-[#F26B5B] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-bold">
            <button
              onClick={() => setFilterMode("all")}
              className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
                filterMode === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Todos ({products.length})
            </button>
            <button
              onClick={() => setFilterMode("low")}
              className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
                filterMode === "low" ? "bg-amber-500 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Bajo ({lowStockCount})
            </button>
            <button
              onClick={() => setFilterMode("out")}
              className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
                filterMode === "out" ? "bg-rose-500 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Agotado ({outOfStockCount})
            </button>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#F26B5B]"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <Button size="sm" secondary onClick={onRefresh}>
            <RefreshCw size={14} />
            <span>Refrescar</span>
          </Button>
        </div>
      </div>

      {/* Inventory table */}
      <Card
        title="Ajuste Rápido de Stock en Tiempo Real"
        subtitle="Los cambios actualizan instantáneamente la base de datos SQLite y la tienda en vivo"
      >
        {filteredProducts.length === 0 ? (
          <Empty
            icon={Package}
            title="No hay productos coincidentes"
            text="Intenta cambiar los filtros de inventario o el término de búsqueda."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredProducts.map((p) => {
              const isOut = Number(p.stock) <= 0;
              const isLow = Number(p.stock) > 0 && Number(p.stock) <= 5;
              const isUpdating = updatingId === p.id;

              return (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3.5 transition hover:bg-slate-50/50 px-2 rounded-xl"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-12 w-12 shrink-0 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                        <Package size={20} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-slate-900 truncate">{p.name}</p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                            isOut
                              ? "bg-rose-100 text-rose-700"
                              : isLow
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isOut ? "Agotado" : isLow ? "Stock Bajo" : "En Stock"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        SKU: <span className="font-mono text-slate-600">{p.sku || "-"}</span> •{" "}
                        <span className="text-slate-600">{p.category || "General"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Direct Stock Stepper */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleStockChange(p, -1)}
                      disabled={isUpdating || Number(p.stock) <= 0}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white font-black text-slate-700 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-40 transition cursor-pointer shadow-xs"
                      title="Disminuir en 1 unidad"
                    >
                      <Minus size={14} />
                    </button>

                    <input
                      type="number"
                      min="0"
                      value={p.stock}
                      onChange={(e) => handleManualInput(p, e.target.value)}
                      disabled={isUpdating}
                      className={`h-9 w-20 rounded-xl border-2 text-center text-sm font-black outline-none transition focus:bg-white ${
                        isOut
                          ? "border-rose-200 bg-rose-50 text-rose-700"
                          : isLow
                          ? "border-amber-200 bg-amber-50 text-amber-800"
                          : "border-slate-200 bg-slate-50 text-slate-800"
                      }`}
                    />

                    <button
                      onClick={() => handleStockChange(p, 1)}
                      disabled={isUpdating}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white font-black text-slate-700 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-40 transition cursor-pointer shadow-xs"
                      title="Aumentar en 1 unidad"
                    >
                      <Plus size={14} />
                    </button>

                    <button
                      onClick={() => handleStockChange(p, 10)}
                      disabled={isUpdating}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                      title="Añadir lote de 10 unidades"
                    >
                      +10
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
