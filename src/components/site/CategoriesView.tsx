import React, { useState } from "react";
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Package,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { Category } from "../../types";
import { Card, Button, Input, Empty } from "./CommonUI";

interface CategoriesViewProps {
  categories: Category[];
  onCreateCategory: (name: string) => Promise<void>;
  onUpdateCategory: (id: string, name: string) => Promise<void>;
  onToggleCategory: (id: string) => Promise<void>;
  onDeleteCategory: (id: string, name: string) => Promise<void>;
  notify: (msg: string) => void;
}

export function CategoriesView({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onToggleCategory,
  onDeleteCategory,
  notify,
}: CategoriesViewProps) {
  const [newCatName, setNewCatName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      notify("Escribe un nombre para la categoría.");
      return;
    }
    setLoading(true);
    try {
      await onCreateCategory(newCatName.trim());
      setNewCatName("");
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim()) {
      notify("El nombre de la categoría no puede estar vacío.");
      return;
    }
    setLoading(true);
    try {
      await onUpdateCategory(id, editingName.trim());
      setEditingId(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Category Card */}
      <Card title="Crear Nueva Categoría" icon={Plus}>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <Input
              id="input-new-category"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Ej. Bullet Journal, Washi Tapes, Rotuladores..."
            />
          </div>
          <Button id="btn-save-category" type="submit" disabled={loading} className="w-full sm:w-auto">
            <Plus size={16} />
            <span>{loading ? "Creando..." : "Crear Categoría"}</span>
          </Button>
        </form>
      </Card>

      {/* Categories List Card */}
      <Card
        title={`Categorías Disponibles (${categories.length})`}
        subtitle="Agrupa y organiza los productos de Colorins en la tienda y catálogo"
        icon={Tag}
      >
        {categories.length === 0 ? (
          <Empty
            icon={Tag}
            title="Sin categorías"
            text="Crea tu primera categoría para organizar los productos de papelería."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {categories.map((cat) => {
              const isEditing = editingId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3.5 px-2 rounded-xl transition hover:bg-slate-50/50"
                >
                  {isEditing ? (
                    <div className="flex flex-1 items-center gap-2 w-full">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(cat.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                      <Button size="sm" onClick={() => handleSaveEdit(cat.id)} disabled={loading}>
                        <Check size={14} />
                      </Button>
                      <Button size="sm" secondary onClick={() => setEditingId(null)}>
                        <X size={14} />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F26B5B]/10 text-[#F26B5B]">
                          <Tag size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-slate-900">{cat.name}</p>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                cat.active
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {cat.active ? "Visible" : "Oculta"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {cat.product_count ?? 0} productos asociados
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => onToggleCategory(cat.id)}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition cursor-pointer ${
                            cat.active
                              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          }`}
                          title={cat.active ? "Ocultar en tienda" : "Mostrar en tienda"}
                        >
                          {cat.active ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>

                        <button
                          onClick={() => handleStartEdit(cat)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                          title="Editar nombre"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => onDeleteCategory(cat.id, cat.name)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                          title="Eliminar categoría"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
