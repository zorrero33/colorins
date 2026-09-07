import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Trash2,
  CheckCircle2,
  XCircle,
  Download,
  X,
  Save,
} from "lucide-react";
import { Customer } from "../../types";
import { Card, Stat, Button, Input, Textarea, Empty, money, formatDate, csvEscape, downloadFile } from "./CommonUI";

interface CustomersViewProps {
  customers: Customer[];
  onCreateCustomer: (customer: Partial<Customer>) => Promise<void>;
  onToggleCustomer: (id: string) => Promise<void>;
  onDeleteCustomer: (id: string) => Promise<void>;
  notify: (msg: string) => void;
}

export function CustomersView({
  customers,
  onCreateCustomer,
  onToggleCustomer,
  onDeleteCustomer,
  notify,
}: CustomersViewProps) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase().trim();
      return (
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q))
      );
    });
  }, [customers, search]);

  const totalSpentAll = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0);
  const activeCount = customers.filter((c) => c.active).length;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      notify("El nombre del cliente es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      await onCreateCustomer({
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || null,
        notes: notes.trim() || null,
      });
      setIsModalOpen(false);
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setNotes("");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (customers.length === 0) {
      notify("No hay clientes registrados para exportar.");
      return;
    }

    const headers = ["ID", "Nombre", "Email", "Teléfono", "Dirección", "Total Gastado", "Pedidos", "Activo", "Fecha Alta"];
    const rows = customers.map((c) =>
      [
        c.id,
        c.name,
        c.email || "",
        c.phone || "",
        c.address || "",
        c.total_spent || 0,
        c.orders_count || 0,
        c.active ? "Sí" : "No",
        c.created_at || "",
      ]
        .map(csvEscape)
        .join(",")
    );

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    downloadFile(`colorins-clientes-${new Date().toISOString().slice(0, 10)}.csv`, csvContent, "text/csv;charset=utf-8;");
    notify("Listado de clientes exportado en CSV.");
  };

  return (
    <div className="space-y-6">
      {/* Top customer KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          title="Total Clientes"
          value={customers.length}
          icon={Users}
          color="bg-indigo-500"
          subtitle={`${activeCount} cuentas activas`}
        />
        <Stat
          title="Facturación Acumulada"
          value={money(totalSpentAll)}
          icon={ShoppingBag}
          color="bg-emerald-500"
          subtitle="Gasto total histórico de clientes"
        />
        <Stat
          title="Ticket Medio por Cliente"
          value={customers.length ? money(totalSpentAll / customers.length) : "0,00 €"}
          icon={CheckCircle2}
          color="bg-amber-500"
          subtitle="Promedio por comprador registrado"
        />
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            id="input-search-customers"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cliente por nombre, email o teléfono..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 outline-none transition focus:border-[#F26B5B] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" secondary onClick={exportCSV}>
            <Download size={14} />
            <span>Exportar CSV</span>
          </Button>

          <Button id="btn-add-customer" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} />
            <span>Nuevo Cliente</span>
          </Button>
        </div>
      </div>

      {/* Customers List Card */}
      <Card
        title={`Directorio de Clientes (${filteredCustomers.length})`}
        subtitle="Gestión de contactos, historial y cuentas activas de Colorins"
        icon={Users}
      >
        {filteredCustomers.length === 0 ? (
          <Empty
            icon={Users}
            title="Sin clientes registrados"
            text="Agrega clientes o se registrarán automáticamente con los nuevos pedidos."
            action={
              <Button size="sm" onClick={() => setIsModalOpen(true)}>
                <Plus size={14} />
                <span>Crear Cliente</span>
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredCustomers.map((c) => (
              <div
                key={c.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 px-2 hover:bg-slate-50/40 rounded-xl transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 font-black text-sm">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-slate-900 truncate">{c.name}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          c.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {c.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {c.email && (
                        <span className="flex items-center gap-1">
                          <Mail size={12} className="text-slate-400" />
                          {c.email}
                        </span>
                      )}
                      {c.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} className="text-slate-400" />
                          {c.phone}
                        </span>
                      )}
                      {c.address && (
                        <span className="flex items-center gap-1 truncate max-w-xs">
                          <MapPin size={12} className="text-slate-400" />
                          {c.address}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <p className="font-black text-sm text-[#F26B5B]">{money(c.total_spent || 0)}</p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {c.orders_count || 0} pedidos
                    </p>
                  </div>

                  <button
                    onClick={() => onToggleCustomer(c.id)}
                    className={`rounded-lg p-2 transition cursor-pointer ${
                      c.active ? "text-emerald-600 hover:bg-emerald-50" : "text-slate-400 hover:bg-slate-100"
                    }`}
                    title={c.active ? "Desactivar cliente" : "Activar cliente"}
                  >
                    {c.active ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  </button>

                  <button
                    onClick={() => onDeleteCustomer(c.id)}
                    className="rounded-lg p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                    title="Eliminar cliente"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* New Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative my-8 w-full max-w-md rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Users size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Nuevo Cliente</h2>
                  <p className="text-xs text-slate-400">Registra un nuevo contacto en el sistema</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <Input
                label="Nombre Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Laura Sánchez"
                required
              />
              <Input
                label="Correo Electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="laura@ejemplo.com"
              />
              <Input
                label="Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+34 654 321 000"
              />
              <Input
                label="Dirección de Envío"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Dirección completa y código postal"
              />
              <Textarea
                label="Notas Adicionales"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observaciones de facturación o preferencias..."
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button type="button" secondary onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save size={15} />
                  <span>{loading ? "Guardando..." : "Guardar Cliente"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
