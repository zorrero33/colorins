import React, { useState, useEffect, useCallback } from "react";
import {
  Menu,
  Sparkles,
  RefreshCw,
  Bell,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Database,
  Search,
  FolderTree,
} from "lucide-react";

import {
  Section,
  Product,
  Category,
  Order,
  Customer,
  SiteSettings,
  DesignSettings,
  SEOSettings,
  LegalSettings,
  SecurityStatus,
  DatabaseStatus,
  LogEntry,
} from "../../types";

import { api, clearAuthToken, setAuthToken } from "../api/api";
import { Sidebar } from "./Sidebar";
import { DashboardView } from "./DashboardView";
import { ProductsView } from "./ProductsView";
import { ProductModal } from "./ProductModal";
import { InventoryView } from "./InventoryView";
import { CategoriesView } from "./CategoriesView";
import { OrdersView } from "./OrdersView";
import { OrderModal } from "./OrderModal";
import { CustomersView } from "./CustomersView";
import { SettingsView } from "./SettingsView";
import { SecurityView } from "./SecurityView";
import { DatabaseView } from "./DatabaseView";
import { LogsView } from "./LogsView";
import { IntegrationGuideView } from "./IntegrationGuideView";
import { LoginView } from "./LoginView";
import { checkSupabaseConnection, SUPABASE_URL } from "../../supabase";


export default function AdminPanel() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | undefined>();
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Navigation State
  const [currentSection, setCurrentSection] = useState<Section>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Data Collections
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_name: "Colorins Papelería Creativa",
    tagline: "Papelería bonita, agendas y bullet journal",
    email: "hola@colorins.com",
    phone: "+34 910 000 000",
    currency: "EUR (€)",
    tax_rate: 21,
    free_shipping_from: 45,
    maintenance: false,
    logo_url: "",
    favicon_url: "",
    address: "Calle Mayor 12, Madrid, España",
    working_hours: "Lunes a Viernes 9:00 - 18:00",
  });

  const [designSettings, setDesignSettings] = useState<DesignSettings>({
    primary_color: "#F26B5B",
    secondary_color: "#F9A03F",
    accent_color: "#EE4266",
    background_color: "#FFFBF5",
    text_color: "#2D3142",
    radius: "1rem",
    font: "Plus Jakarta Sans",
    button_style: "rounded-2xl",
  });

  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    title: "Colorins Papelería Creativa | Agendas y Washi Tapes",
    description: "Tienda online de papelería bonita, lettering y bullet journal.",
    keywords: "papelería, agendas 2026, bullet journal, washi tape, lettering",
    og_image: "",
    twitter_handle: "@colorinspapeleria",
  });

  const [legalSettings, setLegalSettings] = useState<LegalSettings>({
    privacy: "Política de Privacidad de Colorins...",
    terms: "Términos y Condiciones de Uso...",
    cookies: "Política de Cookies...",
    returns: "Política de Devoluciones: 14 días naturales.",
    legal_notice: "Aviso Legal: Colorins S.L. CIF B-12345678",
  });

  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [databaseStatus, setDatabaseStatus] = useState<DatabaseStatus | null>(null);

  // Modals & UI Controls
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productModalLoading, setProductModalLoading] = useState(false);

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderModalLoading, setOrderModalLoading] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(true);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Check initial session
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.checkSession();
        if (res.authenticated) {
          setIsAuthenticated(true);
          setCurrentUser(res.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthChecking(false);
      }
    }
    checkAuth();
    checkSupabaseConnection().then((r) => setSupabaseConnected(r.connected));
  }, []);

  // Fetch all panel data
  const loadAllData = useCallback(async () => {
    try {
      const [
        prods,
        cats,
        ords,
        custs,
        stSettings,
        dsSettings,
        sSettings,
        lgSettings,
        secStatus,
        dbStat,
        activityLogs,
      ] = await Promise.allSettled([
        api.getProducts(),
        api.getCategories(),
        api.getOrders(),
        api.getCustomers(),
        api.getStoreSettings(),
        api.getDesignSettings(),
        api.getSEOSettings(),
        api.getLegalSettings(),
        api.getSecurityAudit(),
        api.getDatabaseStatus(),
        api.getLogs(),
      ]);

      if (prods.status === "fulfilled") setProducts(prods.value);
      if (cats.status === "fulfilled") setCategories(cats.value);
      if (ords.status === "fulfilled") setOrders(ords.value);
      if (custs.status === "fulfilled") setCustomers(custs.value);
      if (stSettings.status === "fulfilled" && stSettings.value) setSiteSettings(stSettings.value);
      if (dsSettings.status === "fulfilled" && dsSettings.value) setDesignSettings(dsSettings.value);
      if (sSettings.status === "fulfilled" && sSettings.value) setSeoSettings(sSettings.value);
      if (lgSettings.status === "fulfilled" && lgSettings.value) setLegalSettings(lgSettings.value);
      if (secStatus.status === "fulfilled") setSecurityStatus(secStatus.value);
      if (dbStat.status === "fulfilled") setDatabaseStatus(dbStat.value);
      if (activityLogs.status === "fulfilled") setLogs(activityLogs.value);
    } catch (err: any) {
      console.error("Error loading panel data:", err);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated, loadAllData]);

  // Auth Handlers
  const handleLogin = async (credentials: { email: string; password: string }) => {
    setLoginLoading(true);
    setLoginError(undefined);
    try {
      const res = await api.login(credentials);
      if (res.success && res.token) {
        setAuthToken(res.token);
        setIsAuthenticated(true);
        setCurrentUser(res.user);
        notify(`¡Bienvenido de nuevo, ${res.user.name || "Administrador"}!`);
      }
    } catch (err: any) {
      setLoginError(err.message || "Error al iniciar sesión.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    setIsAuthenticated(false);
    setCurrentUser(null);
    notify("Has cerrado sesión.");
  };

  // Product Actions
  const handleSaveProduct = async (productData: Partial<Product>) => {
    setProductModalLoading(true);
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
        notify(`Producto "${productData.name}" actualizado.`);
      } else {
        await api.createProduct(productData);
        notify(`Producto "${productData.name}" creado con éxito.`);
      }
      setProductModalOpen(false);
      setEditingProduct(null);
      await loadAllData();
    } catch (err: any) {
      notify("Error al guardar producto: " + err.message);
    } finally {
      setProductModalLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar definitivamente "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      notify(`Producto "${name}" eliminado.`);
      await loadAllData();
    } catch (err: any) {
      notify("Error al eliminar: " + err.message);
    }
  };

  const handleToggleProduct = async (id: string) => {
    try {
      await api.toggleProduct(id);
      await loadAllData();
    } catch (err: any) {
      notify("Error: " + err.message);
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      await api.updateStock(productId, newStock);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
      );
      notify("Stock actualizado.");
    } catch (err: any) {
      notify("Error al actualizar stock: " + err.message);
    }
  };

  // Category Actions
  const handleCreateCategory = async (name: string) => {
    try {
      await api.createCategory(name);
      notify(`Categoría "${name}" creada.`);
      await loadAllData();
    } catch (err: any) {
      notify("Error al crear categoría: " + err.message);
    }
  };

  const handleUpdateCategory = async (id: string, name: string) => {
    try {
      await api.updateCategory(id, name);
      notify("Categoría actualizada.");
      await loadAllData();
    } catch (err: any) {
      notify("Error al actualizar: " + err.message);
    }
  };

  const handleToggleCategory = async (id: string) => {
    try {
      await api.toggleCategory(id);
      await loadAllData();
    } catch (err: any) {
      notify("Error: " + err.message);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar la categoría "${name}"?`)) return;
    try {
      await api.deleteCategory(id);
      notify(`Categoría "${name}" eliminada.`);
      await loadAllData();
    } catch (err: any) {
      notify("Error al eliminar categoría: " + err.message);
    }
  };

  // Order Actions
  const handleSaveOrder = async (orderData: Partial<Order> & { items?: any[] }) => {
    setOrderModalLoading(true);
    try {
      await api.createOrder(orderData);
      notify("Pedido registrado exitosamente.");
      setOrderModalOpen(false);
      await loadAllData();
    } catch (err: any) {
      notify("Error al registrar pedido: " + err.message);
    } finally {
      setOrderModalLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      notify(`Estado del pedido actualizado a "${status}".`);
    } catch (err: any) {
      notify("Error al cambiar estado: " + err.message);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("¿Eliminar este registro de pedido?")) return;
    try {
      await api.deleteOrder(orderId);
      notify("Pedido eliminado.");
      await loadAllData();
    } catch (err: any) {
      notify("Error: " + err.message);
    }
  };

  // Customer Actions
  const handleCreateCustomer = async (cust: Partial<Customer>) => {
    try {
      await api.createCustomer(cust);
      notify(`Cliente "${cust.name}" registrado.`);
      await loadAllData();
    } catch (err: any) {
      notify("Error al registrar cliente: " + err.message);
    }
  };

  const handleToggleCustomer = async (id: string) => {
    try {
      await api.toggleCustomer(id);
      await loadAllData();
    } catch (err: any) {
      notify("Error: " + err.message);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    try {
      await api.deleteCustomer(id);
      notify("Cliente eliminado.");
      await loadAllData();
    } catch (err: any) {
      notify("Error: " + err.message);
    }
  };

  // Settings Actions
  const handleSaveStore = async (settings: SiteSettings) => {
    try {
      await api.saveStoreSettings(settings);
      setSiteSettings(settings);
      notify("Configuración de tienda guardada.");
    } catch (err: any) {
      notify("Error al guardar tienda: " + err.message);
    }
  };

  const handleSaveDesign = async (design: DesignSettings) => {
    try {
      await api.saveDesignSettings(design);
      setDesignSettings(design);
      notify("Estilos de diseño actualizados.");
    } catch (err: any) {
      notify("Error al guardar diseño: " + err.message);
    }
  };

  const handleSaveSEO = async (seo: SEOSettings) => {
    try {
      await api.saveSEOSettings(seo);
      setSeoSettings(seo);
      notify("Parámetros SEO guardados.");
    } catch (err: any) {
      notify("Error al guardar SEO: " + err.message);
    }
  };

  const handleSaveLegal = async (legal: LegalSettings) => {
    try {
      await api.saveLegalSettings(legal);
      setLegalSettings(legal);
      notify("Textos legales actualizados.");
    } catch (err: any) {
      notify("Error al guardar textos: " + err.message);
    }
  };

  // Security Password Change
  const handleChangePassword = async (currentPass: string, newPass: string) => {
    try {
      const res = await api.changePassword({
        email: currentUser?.email,
        currentPassword: currentPass,
        newPassword: newPass,
      });
      notify(res.message || "Contraseña modificada correctamente.");
    } catch (err: any) {
      notify("Error al cambiar contraseña: " + err.message);
    }
  };

  // Database Tools
  const handleRunQuery = async (query: string) => {
    return await api.runQuery(query);
  };

  const handleSeedDatabase = async () => {
    if (!confirm("¿Deseas repoblar la base de datos con los datos iniciales de Colorins?")) return;
    try {
      await api.seedDatabase();
      notify("Datos de demostración restaurados con éxito.");
      await loadAllData();
    } catch (err: any) {
      notify("Error al repoblar: " + err.message);
    }
  };

  const handleVacuumDatabase = async () => {
    try {
      await api.vacuumDatabase();
      notify("Base de datos optimizada y compactada con éxito.");
      await loadAllData();
    } catch (err: any) {
      notify("Error en VACUUM: " + err.message);
    }
  };

  const handleRestoreBackup = async (data: any) => {
    try {
      await api.restoreDatabase(data);
      notify("Copia de seguridad restaurada correctamente.");
      await loadAllData();
    } catch (err: any) {
      notify("Error al restaurar: " + err.message);
    }
  };

  // Activity Logs
  const handleClearLogs = async () => {
    try {
      await api.clearLogs();
      setLogs([]);
      notify("Historial de auditoría vaciado.");
    } catch (err: any) {
      notify("Error al limpiar logs: " + err.message);
    }
  };

  // Badge calculations
  const lowStockCount = products.filter((p) => Number(p.stock) <= 5).length;
  const pendingOrdersCount = orders.filter((o) => o.status === "Pendiente").length;

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F26B5B] text-white shadow-lg animate-pulse">
            <Sparkles size={24} />
          </div>
          <p className="text-xs font-bold text-slate-500">Iniciando panel Colorins...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} loading={loginLoading} error={loginError} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50/80 font-sans text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={(sec) => setCurrentSection(sec)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onLogout={handleLogout}
        onToggleStorefront={() => notify("Puedes vincular este panel con tu frontend de tienda")}
        badgeCounts={{
          lowStock: lowStockCount,
          pendingOrders: pendingOrdersCount,
        }}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 capitalize">
                {currentSection === "dashboard" && "Panel de Control General"}
                {currentSection === "products" && "Catálogo de Productos"}
                {currentSection === "inventory" && "Gestión de Stock e Inventario"}
                {currentSection === "categories" && "Categorías de Tienda"}
                {currentSection === "orders" && "Gestión de Pedidos"}
                {currentSection === "customers" && "Directorio de Clientes"}
                {currentSection === "settings" && "Configuración de Tienda y Envíos"}
                {currentSection === "design" && "Personalización de Diseño y Colores"}
                {currentSection === "seo" && "Posicionamiento SEO & Redes"}
                {currentSection === "legal" && "Textos Legales y Privacidad"}
                {currentSection === "security" && "Seguridad, Supabase & Secretos"}
                {currentSection === "database" && "Base de Datos & Supabase"}
                {currentSection === "logs" && "Historial de Actividad & Auditoría"}
                {currentSection === "integration" && "Pack de Archivos & Rutas de Integración"}
              </h1>
              <p className="hidden sm:block text-[11px] font-semibold text-slate-400">
                Colorins Papelería Creativa • Tienda Online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Supabase status badge */}
            <div
              onClick={() => setCurrentSection("database")}
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
              title="Supabase PostgreSQL Vinculado"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Supabase Activo</span>
            </div>

            <button
              onClick={() => setCurrentSection("integration")}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
              title="Ver Pack de Archivos y Guía para integrar en tu web"
            >
              <FolderTree size={15} />
              <span className="hidden sm:inline">Pack Web</span>
            </button>

            <button
              onClick={loadAllData}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title="Sincronizar y refrescar datos"
            >
              <RefreshCw size={15} />
            </button>

            {/* Current user chip */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-100/80 px-2.5 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F26B5B] text-white font-black text-xs">
                A
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser?.name || "Administrador"}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight">Superadmin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Section View */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentSection === "dashboard" && (
            <DashboardView
              products={products}
              orders={orders}
              customers={customers}
              onNavigate={(sec) => setCurrentSection(sec)}
              onRefresh={loadAllData}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onOpenProductModal={() => {
                setEditingProduct(null);
                setProductModalOpen(true);
              }}
              onOpenOrderModal={() => setOrderModalOpen(true)}
              notify={notify}
            />
          )}

          {currentSection === "products" && (
            <ProductsView
              products={products}
              categories={categories}
              onOpenCreateModal={() => {
                setEditingProduct(null);
                setProductModalOpen(true);
              }}
              onEditProduct={(p) => {
                setEditingProduct(p);
                setProductModalOpen(true);
              }}
              onDeleteProduct={handleDeleteProduct}
              onToggleProduct={handleToggleProduct}
              notify={notify}
            />
          )}

          {currentSection === "inventory" && (
            <InventoryView
              products={products}
              categories={categories}
              onUpdateStock={handleUpdateStock}
              onRefresh={loadAllData}
              notify={notify}
            />
          )}

          {currentSection === "categories" && (
            <CategoriesView
              categories={categories}
              onCreateCategory={handleCreateCategory}
              onUpdateCategory={handleUpdateCategory}
              onToggleCategory={handleToggleCategory}
              onDeleteCategory={handleDeleteCategory}
              notify={notify}
            />
          )}

          {currentSection === "orders" && (
            <OrdersView
              orders={orders}
              onOpenCreateModal={() => setOrderModalOpen(true)}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onDeleteOrder={handleDeleteOrder}
              notify={notify}
            />
          )}

          {currentSection === "customers" && (
            <CustomersView
              customers={customers}
              onCreateCustomer={handleCreateCustomer}
              onToggleCustomer={handleToggleCustomer}
              onDeleteCustomer={handleDeleteCustomer}
              notify={notify}
            />
          )}

          {(currentSection === "settings" ||
            currentSection === "design" ||
            currentSection === "seo" ||
            currentSection === "legal") && (
            <SettingsView
              storeSettings={siteSettings}
              designSettings={designSettings}
              seoSettings={seoSettings}
              legalSettings={legalSettings}
              onSaveStore={handleSaveStore}
              onSaveDesign={handleSaveDesign}
              onSaveSEO={handleSaveSEO}
              onSaveLegal={handleSaveLegal}
              notify={notify}
            />
          )}

          {currentSection === "security" && (
            <SecurityView
              securityStatus={securityStatus}
              onChangePassword={handleChangePassword}
              notify={notify}
            />
          )}

          {currentSection === "database" && (
            <DatabaseView
              dbStatus={databaseStatus}
              onRefreshStatus={loadAllData}
              onRunQuery={handleRunQuery}
              onSeedDatabase={handleSeedDatabase}
              onVacuumDatabase={handleVacuumDatabase}
              onRestoreBackup={handleRestoreBackup}
              notify={notify}
            />
          )}

          {currentSection === "logs" && (
            <LogsView
              logs={logs}
              onRefresh={loadAllData}
              onClearLogs={handleClearLogs}
              notify={notify}
            />
          )}

          {currentSection === "integration" && (
            <IntegrationGuideView notify={notify} />
          )}
        </main>
      </div>

      {/* Product Creation & Editing Modal */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
        loading={productModalLoading}
      />

      {/* Manual Order Creation Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        onSave={handleSaveOrder}
        products={products}
        loading={orderModalLoading}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
