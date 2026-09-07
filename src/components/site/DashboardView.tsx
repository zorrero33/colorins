import React from "react";
import {
  CreditCard,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  RefreshCw,
  Plus,
  Download,
  Database,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Product, Order, Customer, Section } from "../../types";
import { Stat, Card, Button, Empty, money, formatDate, downloadFile } from "./CommonUI";

interface DashboardViewProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  onNavigate: (section: Section) => void;
  onRefresh: () => void;
  onUpdateOrderStatus: (orderId: string, status: string) => Promise<void>;
  onOpenProductModal: () => void;
  onOpenOrderModal: () => void;
  notify: (msg: string) => void;
}

export function DashboardView({
  products,
  orders,
  customers,
  onNavigate,
  onRefresh,
  onUpdateOrderStatus,
  onOpenProductModal,
  onOpenOrderModal,
  notify,
}: DashboardViewProps) {
  const nonCancelledOrders = orders.filter((o) => o.status !== "Cancelado");
  const totalSales = nonCancelledOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  const activeProducts = products.filter((p) => p.active);
  const lowStockProducts = products.filter((p) => Number(p.stock) <= 5);
  const outOfStockProducts = products.filter((p) => Number(p.stock) <= 0);
  const pendingOrders = orders.filter((o) => o.status === "Pendiente");

  const exportQuickBackup = () => {
    downloadFile(
      `colorins-resumen-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          totals: {
            ventas: totalSales,
            pedidos: orders.length,
            productos: products.length,
            clientes: customers.length,
          },
          products,
          orders,
          customers,
        },
        null,
        2
      )
    );
    notify("Copia de seguridad rápida descargada correctamente.");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert for low stock */}
      {lowStockProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">
                Atención: {lowStockProducts.length} productos con existencias bajas
              </p>
              <p className="text-xs text-amber-700">
                {outOfStockProducts.length > 0
                  ? `${outOfStockProducts.length} productos ya están agotados completamente.`
                  : "Se recomienda reponer stock para evitar roturas de pedidos."}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            secondary
            onClick={() => onNavigate("inventory")}
            className="border border-amber-300 bg-white hover:bg-amber-100/60"
          >
            Gestionar Inventario
          </Button>
        </div>
      )}

      {/* Main KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          id="stat-ventas"
          title="Ventas Totales"
          value={money(totalSales)}
          icon={CreditCard}
          color="bg-[#F26B5B]"
          subtitle={`${nonCancelledOrders.length} pedidos confirmados`}
        />
        <Stat
          id="stat-pedidos"
          title="Pedidos"
          value={orders.length}
          icon={ShoppingBag}
          color="bg-indigo-500"
          subtitle={`${pendingOrders.length} pendientes de envío`}
        />
        <Stat
          id="stat-productos"
          title="Catálogo Activo"
          value={activeProducts.length}
          icon={Package}
          color="bg-teal-500"
          subtitle={`${products.length} productos en total`}
        />
        <Stat
          id="stat-clientes"
          title="Clientes Registrados"
          value={customers.length}
          icon={Users}
          color="bg-amber-500"
          subtitle="Con historial en SQLite"
        />
      </div>

      {/* Quick actions bar */}
      <Card title="Acciones Rápidas del Administrador" icon={TrendingUp}>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <Button id="btn-quick-new-product" onClick={onOpenProductModal}>
            <Plus size={16} />
            <span>Nuevo Producto</span>
          </Button>
          <Button id="btn-quick-new-order" secondary onClick={onOpenOrderModal}>
            <ShoppingBag size={16} />
            <span>Registrar Pedido</span>
          </Button>
          <Button id="btn-quick-db-tools" secondary onClick={() => onNavigate("database")}>
            <Database size={16} />
            <span>Herramientas DB</span>
          </Button>
          <Button id="btn-quick-backup" secondary onClick={exportQuickBackup}>
            <Download size={16} />
            <span>Descargar Backup</span>
          </Button>
        </div>
      </Card>

      {/* Grid: Recent Orders and Low Stock Table */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card
          title="Últimos Pedidos Recibidos"
          icon={ShoppingBag}
          action={
            <Button size="sm" secondary onClick={() => onNavigate("orders")}>
              <span>Ver todos</span>
              <ArrowUpRight size={14} />
            </Button>
          }
        >
          {orders.length === 0 ? (
            <Empty
              title="Aún no hay pedidos"
              text="Los pedidos de los clientes aparecerán aquí automáticamente."
              action={
                <Button size="sm" onClick={onOpenOrderModal}>
                  Crear Pedido de Prueba
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="font-bold text-sm text-slate-800 truncate">
                        {order.customer_name}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {formatDate(order.created_at)} • {order.payment_method || "Tarjeta"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-sm font-black text-[#F26B5B]">
                      {money(order.total)}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold border outline-none cursor-pointer ${
                        order.status === "Entregado"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : order.status === "Enviado"
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : order.status === "En preparación"
                          ? "border-purple-200 bg-purple-50 text-purple-700"
                          : order.status === "Cancelado"
                          ? "border-rose-200 bg-rose-50 text-rose-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En preparación">En preparación</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregado">Entregado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Low Stock Watchlist */}
        <Card
          title="Control de Stock Crítico"
          icon={AlertTriangle}
          action={
            <Button size="sm" secondary onClick={() => onNavigate("inventory")}>
              <span>Inventario completo</span>
              <ArrowUpRight size={14} />
            </Button>
          }
        >
          {lowStockProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <CheckCircle2 size={36} className="text-emerald-500 mb-2" />
              <p className="text-sm font-bold text-slate-700">Todo el inventario está en orden</p>
              <p className="text-xs text-slate-400 mt-1">
                Ningún producto tiene 5 o menos existencias actualmente.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStockProducts.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-rose-100 bg-rose-50/40 p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-500">
                        <Package size={18} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-800">{p.name}</p>
                      <p className="text-[11px] text-slate-400">SKU: {p.sku || "-"}</p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${
                      Number(p.stock) <= 0
                        ? "bg-rose-500 text-white"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {Number(p.stock) <= 0 ? "Agotado" : `${p.stock} uds`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
