import React, { useState, useMemo } from "react";
import {
  ClipboardList,
  Search,
  Plus,
  Download,
  Trash2,
  Package,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Order, Product } from "../../types";
import { Card, Button, Empty, money, formatDate, csvEscape, downloadFile } from "./CommonUI";

interface OrdersViewProps {
  orders: Order[];
  onOpenCreateModal: () => void;
  onUpdateOrderStatus: (orderId: string, status: string) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  notify: (msg: string) => void;
}

export function OrdersView({
  orders,
  onOpenCreateModal,
  onUpdateOrderStatus,
  onDeleteOrder,
  notify,
}: OrdersViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const statuses = ["Pendiente", "En preparación", "Enviado", "Entregado", "Cancelado"];

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        o.customer_name.toLowerCase().includes(q) ||
        (o.customer_email && o.customer_email.toLowerCase().includes(q)) ||
        o.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const exportCSV = () => {
    if (orders.length === 0) {
      notify("No hay pedidos registrados para exportar.");
      return;
    }

    const headers = [
      "ID Pedido",
      "Cliente",
      "Email",
      "Teléfono",
      "Dirección",
      "Total",
      "Estado",
      "Método de Pago",
      "Fecha",
      "Notas",
    ];

    const rows = orders.map((o) =>
      [
        o.id,
        o.customer_name,
        o.customer_email || "",
        o.customer_phone || "",
        o.shipping_address || "",
        o.total,
        o.status,
        o.payment_method || "",
        o.created_at,
        o.notes || "",
      ]
        .map(csvEscape)
        .join(",")
    );

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    downloadFile(`colorins-pedidos-${new Date().toISOString().slice(0, 10)}.csv`, csvContent, "text/csv;charset=utf-8;");
    notify("Listado de pedidos exportado en CSV.");
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            id="input-search-orders"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, ID o email..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 outline-none transition focus:border-[#F26B5B] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#F26B5B]"
          >
            <option value="all">Todos los estados ({orders.length})</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <Button size="sm" secondary onClick={exportCSV}>
            <Download size={14} />
            <span>Exportar CSV</span>
          </Button>

          <Button id="btn-add-order" size="sm" onClick={onOpenCreateModal}>
            <Plus size={14} />
            <span>Nuevo Pedido</span>
          </Button>
        </div>
      </div>

      {/* Orders List Card */}
      <Card
        title={`Historial de Pedidos (${filteredOrders.length})`}
        subtitle="Monitoreo de pagos y preparación de envíos para Colorins"
        icon={ClipboardList}
      >
        {filteredOrders.length === 0 ? (
          <Empty
            icon={ClipboardList}
            title="Sin pedidos encontrados"
            text="No hay pedidos que coincidan con los filtros actuales."
            action={
              <Button size="sm" onClick={onOpenCreateModal}>
                <Plus size={14} />
                <span>Registrar Primer Pedido</span>
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              let items: any[] = [];
              if (order.items_json) {
                try {
                  items = JSON.parse(order.items_json);
                } catch {}
              }

              return (
                <div key={order.id} className="py-4 px-2 hover:bg-slate-50/40 rounded-xl transition">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          #{order.id.slice(0, 8)}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900">{order.customer_name}</h3>
                        <span className="text-xs text-slate-400">
                          {formatDate(order.created_at)}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        {order.customer_email && <span>{order.customer_email}</span>}
                        {order.customer_phone && <span>• {order.customer_phone}</span>}
                        <span>• Pago: <strong>{order.payment_method || "Tarjeta"}</strong></span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
                      <span className="text-base font-black text-[#F26B5B]">
                        {money(order.total)}
                      </span>

                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-black border outline-none cursor-pointer ${
                          order.status === "Entregado"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : order.status === "Enviado"
                            ? "border-blue-200 bg-blue-50 text-blue-800"
                            : order.status === "En preparación"
                            ? "border-purple-200 bg-purple-50 text-purple-800"
                            : order.status === "Cancelado"
                            ? "border-rose-200 bg-rose-50 text-rose-800"
                            : "border-amber-200 bg-amber-50 text-amber-800"
                        }`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                        title="Ver detalles de productos"
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => onDeleteOrder(order.id)}
                        className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                        title="Eliminar registro de pedido"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Order Details View */}
                  {isExpanded && (
                    <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 space-y-3">
                      {order.shipping_address && (
                        <div className="text-xs">
                          <p className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                            Dirección de entrega:
                          </p>
                          <p className="font-semibold text-slate-800 mt-0.5">
                            {order.shipping_address}
                          </p>
                        </div>
                      )}

                      {order.notes && (
                        <div className="text-xs">
                          <p className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                            Notas del pedido:
                          </p>
                          <p className="font-medium text-slate-700 italic mt-0.5">{order.notes}</p>
                        </div>
                      )}

                      <div>
                        <p className="font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-1.5">
                          Artículos incluidos:
                        </p>
                        {items.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">
                            No se especificaron líneas de producto individuales en este registro.
                          </p>
                        ) : (
                          <div className="space-y-1.5">
                            {items.map((item: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between rounded-xl bg-white p-2.5 text-xs font-semibold border border-slate-200/70"
                              >
                                <span className="text-slate-800">
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="font-bold text-slate-900">
                                  {money(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
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
