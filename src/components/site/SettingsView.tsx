import React, { useState } from "react";
import {
  Settings,
  Palette,
  Globe,
  FileText,
  Save,
  CheckCircle2,
  Store,
  Euro,
  Truck,
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { SiteSettings, DesignSettings, SEOSettings, LegalSettings } from "../../types";
import { Card, Button, Input, Textarea } from "./CommonUI";

interface SettingsViewProps {
  storeSettings: SiteSettings;
  designSettings: DesignSettings;
  seoSettings: SEOSettings;
  legalSettings: LegalSettings;
  onSaveStore: (settings: SiteSettings) => Promise<void>;
  onSaveDesign: (design: DesignSettings) => Promise<void>;
  onSaveSEO: (seo: SEOSettings) => Promise<void>;
  onSaveLegal: (legal: LegalSettings) => Promise<void>;
  notify: (msg: string) => void;
}

type SubTab = "store" | "design" | "seo" | "legal";

export function SettingsView({
  storeSettings,
  designSettings,
  seoSettings,
  legalSettings,
  onSaveStore,
  onSaveDesign,
  onSaveSEO,
  onSaveLegal,
  notify,
}: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<SubTab>("store");
  const [loading, setLoading] = useState(false);

  // Local states for editing
  const [store, setStore] = useState<SiteSettings>(storeSettings);
  const [design, setDesign] = useState<DesignSettings>(designSettings);
  const [seo, setSeo] = useState<SEOSettings>(seoSettings);
  const [legal, setLegal] = useState<LegalSettings>(legalSettings);

  const handleSaveCurrentTab = async () => {
    setLoading(true);
    try {
      if (activeTab === "store") {
        await onSaveStore(store);
      } else if (activeTab === "design") {
        await onSaveDesign(design);
      } else if (activeTab === "seo") {
        await onSaveSEO(seo);
      } else if (activeTab === "legal") {
        await onSaveLegal(legal);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap gap-2">
          <button
            id="tab-store-settings"
            onClick={() => setActiveTab("store")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "store"
                ? "bg-[#F26B5B] text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Store size={15} />
            <span>Tienda General</span>
          </button>

          <button
            id="tab-design-settings"
            onClick={() => setActiveTab("design")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "design"
                ? "bg-[#F26B5B] text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Palette size={15} />
            <span>Diseño & Colores</span>
          </button>

          <button
            id="tab-seo-settings"
            onClick={() => setActiveTab("seo")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "seo"
                ? "bg-[#F26B5B] text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Globe size={15} />
            <span>SEO & Metadatos</span>
          </button>

          <button
            id="tab-legal-settings"
            onClick={() => setActiveTab("legal")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "legal"
                ? "bg-[#F26B5B] text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <FileText size={15} />
            <span>Textos Legales</span>
          </button>
        </div>

        <Button id="btn-save-settings" onClick={handleSaveCurrentTab} disabled={loading}>
          <Save size={16} />
          <span>{loading ? "Guardando..." : "Guardar Cambios"}</span>
        </Button>
      </div>

      {/* Tab 1: Store General */}
      {activeTab === "store" && (
        <div className="space-y-6">
          <Card title="Información de la Marca" subtitle="Datos principales visibles para tus clientes" icon={Store}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nombre de la Tienda"
                value={store.site_name}
                onChange={(e) => setStore({ ...store, site_name: e.target.value })}
                placeholder="Colorins Papelería Creativa"
              />
              <Input
                label="Eslogan / Subtítulo"
                value={store.tagline}
                onChange={(e) => setStore({ ...store, tagline: e.target.value })}
                placeholder="Papelería bonita, bullet journal y regalos"
              />
              <Input
                label="URL del Logotipo"
                value={store.logo_url}
                onChange={(e) => setStore({ ...store, logo_url: e.target.value })}
                placeholder="https://tudominio.com/logo.png"
              />
              <Input
                label="URL del Favicon"
                value={store.favicon_url}
                onChange={(e) => setStore({ ...store, favicon_url: e.target.value })}
                placeholder="https://tudominio.com/favicon.ico"
              />
            </div>
          </Card>

          <Card title="Finanzas & Envíos" subtitle="Configuración de moneda e impuestos para el checkout" icon={Euro}>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Moneda"
                value={store.currency}
                onChange={(e) => setStore({ ...store, currency: e.target.value })}
                placeholder="EUR (€)"
              />
              <Input
                label="IVA / Impuestos (%)"
                type="number"
                value={store.tax_rate}
                onChange={(e) => setStore({ ...store, tax_rate: parseFloat(e.target.value) || 0 })}
                placeholder="21"
              />
              <Input
                label="Envío Gratis a partir de (€)"
                type="number"
                value={store.free_shipping_from}
                onChange={(e) => setStore({ ...store, free_shipping_from: parseFloat(e.target.value) || 0 })}
                placeholder="45"
              />
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
              <input
                type="checkbox"
                id="maintenance-mode"
                checked={Boolean(store.maintenance)}
                onChange={(e) => setStore({ ...store, maintenance: e.target.checked })}
                className="h-4 w-4 rounded accent-[#F26B5B]"
              />
              <div>
                <label htmlFor="maintenance-mode" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Modo Mantenimiento
                </label>
                <p className="text-[11px] text-slate-500">
                  Si se activa, los clientes verán un aviso de tienda cerrada temporalmente.
                </p>
              </div>
            </div>
          </Card>

          <Card title="Contacto y Atención al Cliente" subtitle="Canales de soporte expuestos en el pie de página" icon={Mail}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Email de Contacto"
                value={store.email}
                onChange={(e) => setStore({ ...store, email: e.target.value })}
                placeholder="hola@colorins.com"
              />
              <Input
                label="Teléfono / WhatsApp"
                value={store.phone}
                onChange={(e) => setStore({ ...store, phone: e.target.value })}
                placeholder="+34 910 000 000"
              />
              <Input
                label="Dirección Física"
                value={store.address || ""}
                onChange={(e) => setStore({ ...store, address: e.target.value })}
                placeholder="Calle Mayor 12, Madrid, España"
              />
              <Input
                label="Horario de Atención"
                value={store.working_hours || ""}
                onChange={(e) => setStore({ ...store, working_hours: e.target.value })}
                placeholder="Lunes a Viernes de 9:00 a 18:00"
              />
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Design */}
      {activeTab === "design" && (
        <div className="space-y-6">
          <Card title="Paleta de Colores de Colorins" subtitle="Ajusta los tonos distintivos de la marca" icon={Palette}>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Color Primario (Coral)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={design.primary_color}
                    onChange={(e) => setDesign({ ...design, primary_color: e.target.value })}
                    className="h-10 w-12 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                  />
                  <Input
                    value={design.primary_color}
                    onChange={(e) => setDesign({ ...design, primary_color: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Color Secundario (Naranja Pastel)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={design.secondary_color}
                    onChange={(e) => setDesign({ ...design, secondary_color: e.target.value })}
                    className="h-10 w-12 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                  />
                  <Input
                    value={design.secondary_color}
                    onChange={(e) => setDesign({ ...design, secondary_color: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Color Acento (Frambuesa)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={design.accent_color}
                    onChange={(e) => setDesign({ ...design, accent_color: e.target.value })}
                    className="h-10 w-12 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                  />
                  <Input
                    value={design.accent_color}
                    onChange={(e) => setDesign({ ...design, accent_color: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Fondo de Tienda</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={design.background_color}
                    onChange={(e) => setDesign({ ...design, background_color: e.target.value })}
                    className="h-10 w-12 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                  />
                  <Input
                    value={design.background_color}
                    onChange={(e) => setDesign({ ...design, background_color: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Texto Principal</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={design.text_color}
                    onChange={(e) => setDesign({ ...design, text_color: e.target.value })}
                    className="h-10 w-12 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                  />
                  <Input
                    value={design.text_color}
                    onChange={(e) => setDesign({ ...design, text_color: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Radio de Bordes</label>
                <select
                  value={design.radius}
                  onChange={(e) => setDesign({ ...design, radius: e.target.value })}
                  className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#F26B5B]"
                >
                  <option value="0.5rem">Suave (8px)</option>
                  <option value="1rem">Moderno (16px) - Por defecto</option>
                  <option value="1.5rem">Extra redondeado (24px)</option>
                </select>
              </div>
            </div>

            {/* Live Color Preview Bar */}
            <div className="mt-6 rounded-2xl p-5 border border-slate-200/80" style={{ backgroundColor: design.background_color }}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Vista Previa de Estilos</p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition"
                  style={{ backgroundColor: design.primary_color }}
                >
                  Botón Primario
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition"
                  style={{ backgroundColor: design.secondary_color }}
                >
                  Botón Secundario
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition"
                  style={{ backgroundColor: design.accent_color }}
                >
                  Acento Especial
                </button>
                <span className="text-xs font-semibold" style={{ color: design.text_color }}>
                  Texto de muestra con tipografía {design.font}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: SEO */}
      {activeTab === "seo" && (
        <Card title="Posicionamiento en Motores de Búsqueda (SEO)" subtitle="Controla cómo aparece Colorins en Google y redes sociales" icon={Globe}>
          <div className="space-y-4">
            <Input
              label="Título SEO (Meta Title)"
              value={seo.title}
              onChange={(e) => setSeo({ ...seo, title: e.target.value })}
              placeholder="Colorins Papelería Creativa | Agendas y Washi Tapes"
            />
            <Textarea
              label="Descripción SEO (Meta Description)"
              rows={3}
              value={seo.description}
              onChange={(e) => setSeo({ ...seo, description: e.target.value })}
              placeholder="Tienda online de papelería bonita, bullet journal, rotuladores y accesorios de escritorio con envíos en 24/48h."
            />
            <Input
              label="Palabras Clave (Keywords separadas por comas)"
              value={seo.keywords}
              onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
              placeholder="papelería, agendas 2026, bullet journal, washi tape, lettering"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Imagen para Redes Sociales (OpenGraph Image URL)"
                value={seo.og_image}
                onChange={(e) => setSeo({ ...seo, og_image: e.target.value })}
                placeholder="https://tudominio.com/og-banner.jpg"
              />
              <Input
                label="Usuario de Twitter / X"
                value={seo.twitter_handle || ""}
                onChange={(e) => setSeo({ ...seo, twitter_handle: e.target.value })}
                placeholder="@colorinspapeleria"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Legal */}
      {activeTab === "legal" && (
        <div className="space-y-6">
          <Card title="Textos Legales y Normativa RGPD" subtitle="Cumplimiento normativo y condiciones de compraventa" icon={FileText}>
            <div className="space-y-5">
              <Textarea
                label="Política de Privacidad (RGPD / LOPD)"
                rows={4}
                value={legal.privacy}
                onChange={(e) => setLegal({ ...legal, privacy: e.target.value })}
              />
              <Textarea
                label="Términos y Condiciones de Uso y Contratación"
                rows={4}
                value={legal.terms}
                onChange={(e) => setLegal({ ...legal, terms: e.target.value })}
              />
              <Textarea
                label="Política de Cookies"
                rows={3}
                value={legal.cookies}
                onChange={(e) => setLegal({ ...legal, cookies: e.target.value })}
              />
              <Textarea
                label="Política de Envíos y Devoluciones"
                rows={3}
                value={legal.returns}
                onChange={(e) => setLegal({ ...legal, returns: e.target.value })}
              />
              <Textarea
                label="Aviso Legal (Razón Social y CIF)"
                rows={3}
                value={legal.legal_notice || ""}
                onChange={(e) => setLegal({ ...legal, legal_notice: e.target.value })}
                placeholder="Colorins Papelería Creativa S.L., CIF: B-12345678, Registro Mercantil..."
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
