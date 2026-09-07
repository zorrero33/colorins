import React, { useState, useEffect } from "react";
import { X, Save, Image as ImageIcon, Sparkles, AlertCircle } from "lucide-react";
import { Product, Category } from "../../types";
import { Button, Input, Textarea } from "./CommonUI";

interface ProductModalProps {
  product: Partial<Product> | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
  loading: boolean;
}

export function ProductModal({
  product,
  categories,
  isOpen,
  onClose,
  onSave,
  loading,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    category: "",
    sku: "",
    price: 0,
    old_price: null,
    stock: 10,
    description: "",
    image_url: "",
    active: 1,
    featured: 0,
    tax: 21,
    weight: "",
  });

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        active: product.active ? 1 : 0,
        featured: product.featured ? 1 : 0,
      });
    } else {
      setFormData({
        name: "",
        category: categories[0]?.name || "Cuadernos y Libretas",
        sku: `COL-${Math.floor(100 + Math.random() * 900)}`,
        price: 9.95,
        old_price: null,
        stock: 15,
        description: "",
        image_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
        active: 1,
        featured: 0,
        tax: 21,
        weight: "200 g",
      });
    }
    setFormError("");
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setFormError("El nombre del producto es obligatorio.");
      return;
    }
    if (Number(formData.price || 0) < 0) {
      setFormError("El precio no puede ser negativo.");
      return;
    }
    setFormError("");
    await onSave(formData);
  };

  const update = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative my-8 w-full max-w-3xl rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-[#F26B5B]">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {product?.id ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <p className="text-xs text-slate-400">
                Los cambios se guardan directamente en SQLite
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {formError && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700">
            <AlertCircle size={16} />
            <span>{formError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Nombre del Producto"
                value={formData.name || ""}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Ej. Cuaderno Bullet Journal A5"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 ml-0.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Categoría
              </label>
              <select
                value={formData.category || ""}
                onChange={(e) => update("category", e.target.value)}
                className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/70 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#F26B5B] focus:bg-white"
              >
                <option value="">Sin categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Código SKU"
              value={formData.sku || ""}
              onChange={(e) => update("sku", e.target.value)}
              placeholder="COL-BJO-001"
            />

            <Input
              label="Precio Actual (€)"
              type="number"
              step="0.01"
              min="0"
              value={formData.price ?? 0}
              onChange={(e) => update("price", parseFloat(e.target.value) || 0)}
              required
            />

            <Input
              label="Precio Anterior / Oferta (€)"
              type="number"
              step="0.01"
              min="0"
              value={formData.old_price ?? ""}
              onChange={(e) =>
                update("old_price", e.target.value === "" ? null : parseFloat(e.target.value))
              }
              placeholder="Opcional para mostrar rebaja"
            />

            <Input
              label="Stock / Existencias"
              type="number"
              min="0"
              value={formData.stock ?? 0}
              onChange={(e) => update("stock", parseInt(e.target.value, 10) || 0)}
              required
            />

            <Input
              label="IVA Aplicable (%)"
              type="number"
              min="0"
              value={formData.tax ?? 21}
              onChange={(e) => update("tax", parseFloat(e.target.value) || 21)}
            />

            <Input
              label="Peso estimado"
              value={formData.weight || ""}
              onChange={(e) => update("weight", e.target.value)}
              placeholder="Ej. 350 g"
            />

            <Input
              label="URL de la Imagen"
              value={formData.image_url || ""}
              onChange={(e) => update("image_url", e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          {/* Image preview box */}
          {formData.image_url && (
            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <img
                src={formData.image_url}
                alt="Vista previa"
                className="h-16 w-16 rounded-xl object-cover border border-slate-200"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <div className="text-xs text-slate-500">
                <p className="font-bold text-slate-700">Previsualización de imagen</p>
                <p className="truncate max-w-md">{formData.image_url}</p>
              </div>
            </div>
          )}

          <Textarea
            label="Descripción del Producto"
            rows={3}
            value={formData.description || ""}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Detalles sobre materiales, gramaje de hojas, colores, recomendaciones de uso..."
          />

          {/* Checkboxes */}
          <div className="grid gap-3 sm:grid-cols-2 pt-2">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 cursor-pointer hover:bg-slate-100/70 transition">
              <input
                type="checkbox"
                checked={Boolean(formData.active)}
                onChange={(e) => update("active", e.target.checked ? 1 : 0)}
                className="h-4 w-4 rounded text-[#F26B5B] focus:ring-[#F26B5B]"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Producto Activo</p>
                <p className="text-[11px] text-slate-400">Visible en la tienda para comprar</p>
              </div>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 cursor-pointer hover:bg-slate-100/70 transition">
              <input
                type="checkbox"
                checked={Boolean(formData.featured)}
                onChange={(e) => update("featured", e.target.checked ? 1 : 0)}
                className="h-4 w-4 rounded text-[#F26B5B] focus:ring-[#F26B5B]"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Producto Destacado</p>
                <p className="text-[11px] text-slate-400">Aparecerá en la portada de Colorins</p>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <Button type="button" secondary onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save size={16} />
              <span>{loading ? "Guardando en DB..." : "Guardar Producto"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
