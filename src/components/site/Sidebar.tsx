import React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  AlertTriangle,
  Tag,
  ClipboardList,
  Users,
  Settings,
  Palette,
  Globe,
  FileText,
  ShieldCheck,
  Database,
  Activity,
  LogOut,
  X,
  ExternalLink,
  Sparkles,
  FolderTree,
} from "lucide-react";
import { Section } from "../../types";

interface SidebarProps {
  currentSection: Section;
  onSelectSection: (section: Section) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  onToggleStorefront: () => void;
  badgeCounts?: {
    lowStock?: number;
    pendingOrders?: number;
  };
}

export function Sidebar({
  currentSection,
  onSelectSection,
  mobileOpen,
  onCloseMobile,
  onLogout,
  onToggleStorefront,
  badgeCounts = {},
}: SidebarProps) {
  const navItems: Array<{
    id: Section;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
    group: "main" | "store" | "config" | "system";
  }> = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "main" },
    { id: "products", label: "Productos", icon: ShoppingBag, group: "store" },
    {
      id: "inventory",
      label: "Inventario",
      icon: AlertTriangle,
      badge: badgeCounts.lowStock,
      badgeColor: "bg-rose-500 text-white",
      group: "store",
    },
    { id: "categories", label: "Categorías", icon: Tag, group: "store" },
    {
      id: "orders",
      label: "Pedidos",
      icon: ClipboardList,
      badge: badgeCounts.pendingOrders,
      badgeColor: "bg-amber-500 text-white",
      group: "store",
    },
    { id: "customers", label: "Clientes", icon: Users, group: "store" },
    { id: "settings", label: "Tienda y Envío", icon: Settings, group: "config" },
    { id: "design", label: "Diseño & Marca", icon: Palette, group: "config" },
    { id: "seo", label: "SEO & Redes", icon: Globe, group: "config" },
    { id: "legal", label: "Textos Legales", icon: FileText, group: "config" },
    { id: "security", label: "Seguridad & .env", icon: ShieldCheck, group: "system" },
    { id: "database", label: "Base de Datos", icon: Database, group: "system" },
    { id: "logs", label: "Auditoría & Logs", icon: Activity, group: "system" },
    { id: "integration", label: "Pack & Rutas Web", icon: FolderTree, group: "system" },
  ];

  const renderGroup = (group: "main" | "store" | "config" | "system", title: string) => {
    const items = navItems.filter((item) => item.group === group);
    return (
      <div className="mb-4">
        <p className="px-3 mb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
          {title}
        </p>
        <div className="space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  onSelectSection(item.id);
                  onCloseMobile();
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-[#F26B5B] text-white shadow-sm shadow-[#F26B5B]/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={18}
                    className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"}
                  />
                  <span>{item.label}</span>
                </div>
                {Boolean(item.badge && item.badge > 0) && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      isActive ? "bg-white text-[#F26B5B]" : item.badgeColor || "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F26B5B] to-[#e44d3c] text-white shadow-md shadow-[#F26B5B]/20">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-slate-900 leading-tight">
                COLORINS
              </h1>
              <p className="text-[11px] font-semibold text-slate-400">
                Papelería Creativa Admin
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Storefront switch banner */}
        <div className="p-3">
          <button
            id="btn-open-storefront"
            onClick={onToggleStorefront}
            className="flex w-full items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Ver Tienda Colorins</span>
            </div>
            <ExternalLink size={14} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-1">
          {renderGroup("main", "General")}
          {renderGroup("store", "Gestión Comercial")}
          {renderGroup("config", "Personalización")}
          {renderGroup("system", "Seguridad & Datos")}
        </nav>

        {/* Footer with database indicator & logout */}
        <div className="border-t border-slate-100 p-3">
          <div className="mb-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
            <span className="font-semibold text-slate-500">Base de datos:</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              SQLite Activo
            </span>
          </div>
          <button
            id="btn-logout"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
