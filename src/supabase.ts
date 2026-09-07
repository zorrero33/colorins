import { createClient } from "@supabase/supabase-js";

// Client-side Supabase credentials
// Uses environment variables if set, with fallback to the credentials provided by the user
export const SUPABASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  "https://pimbersgnkgwyslpljzn.supabase.co";

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  "sb_publishable_qGInJZbixGnDyIltyfv6rg_iF5EG301";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  error?: string;
  tablesAvailable?: boolean;
}> {
  try {
    const { error } = await supabase.from("products").select("count", { count: "exact", head: true });
    if (error) {
      // If table doesn't exist yet (PGRST204 or 42P01), connection to Supabase itself succeeded
      if (error.code === "PGRST204" || error.code === "42P01" || error.message?.includes("not found") || error.message?.includes("relation")) {
        return { connected: true, tablesAvailable: false, error: "Tablas aún no creadas en Supabase (ejecuta el script SQL)." };
      }
      return { connected: false, error: error.message };
    }
    return { connected: true, tablesAvailable: true };
  } catch (err: any) {
    return { connected: false, error: err.message || "Error conectando con Supabase" };
  }
}

// SQL Script to create all tables in Supabase SQL Editor
export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- SCRIPT DE INICIALIZACIÓN COLORINS PARA SUPABASE SQL EDITOR
-- Copia y pega este script en: Supabase Dashboard > SQL Editor > Run
-- ========================================================

-- 1. Tabla de Productos
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  sku TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  old_price NUMERIC(10,2),
  stock INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  tax NUMERIC(5,2) DEFAULT 21.00,
  weight TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabla de Categorías
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabla de Pedidos
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address TEXT,
  total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'Pendiente',
  payment_method TEXT DEFAULT 'Tarjeta',
  items_json JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabla de Clientes
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  orders_count INTEGER DEFAULT 0,
  total_spent NUMERIC(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Configuración General
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  site_name TEXT DEFAULT 'Colorins Papelería Creativa',
  tagline TEXT DEFAULT 'Papelería bonita, agendas y bullet journal',
  email TEXT DEFAULT 'hola@colorins.com',
  phone TEXT DEFAULT '+34 910 000 000',
  currency TEXT DEFAULT 'EUR (€)',
  tax_rate NUMERIC(5,2) DEFAULT 21.00,
  free_shipping_from NUMERIC(10,2) DEFAULT 45.00,
  maintenance BOOLEAN DEFAULT FALSE,
  logo_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '',
  address TEXT DEFAULT 'Calle Mayor 12, Madrid, España',
  working_hours TEXT DEFAULT 'Lun - Vie: 9:00 - 18:00'
);

-- 6. Configuración de Diseño
CREATE TABLE IF NOT EXISTS public.design_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  primary_color TEXT DEFAULT '#F26B5B',
  secondary_color TEXT DEFAULT '#F9A03F',
  accent_color TEXT DEFAULT '#EE4266',
  background_color TEXT DEFAULT '#FFFBF5',
  text_color TEXT DEFAULT '#2D3142',
  radius TEXT DEFAULT '1rem',
  font TEXT DEFAULT 'Plus Jakarta Sans',
  button_style TEXT DEFAULT 'rounded-2xl'
);

-- 7. Configuración SEO
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  title TEXT DEFAULT 'Colorins Papelería Creativa | Agendas y Washi Tapes',
  description TEXT DEFAULT 'Tienda online de papelería bonita, rotuladores lettering, bullet journal y regalos.',
  keywords TEXT DEFAULT 'papelería, agendas 2026, bullet journal, washi tape, lettering',
  og_image TEXT DEFAULT '',
  twitter_handle TEXT DEFAULT '@colorinspapeleria'
);

-- 8. Textos Legales
CREATE TABLE IF NOT EXISTS public.legal_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  privacy TEXT DEFAULT 'Política de Privacidad de Colorins...',
  terms TEXT DEFAULT 'Términos y Condiciones de Uso...',
  cookies TEXT DEFAULT 'Política de Cookies...',
  returns TEXT DEFAULT 'Política de Devoluciones: 14 días naturales.',
  legal_notice TEXT DEFAULT 'Aviso Legal: Colorins S.L. CIF B-12345678'
);

-- 9. Registro de Actividad
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  table_name TEXT,
  description TEXT NOT NULL,
  "user" TEXT DEFAULT 'Administrador',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insertar configuración inicial por defecto si no existe
INSERT INTO public.site_settings (id, site_name, tagline, email, phone, currency, tax_rate, free_shipping_from, maintenance)
VALUES ('default', 'Colorins Papelería Creativa', 'Papelería bonita, agendas y bullet journal', 'hola@colorins.com', '+34 910 000 000', 'EUR (€)', 21.00, 45.00, FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.design_settings (id, primary_color, secondary_color, accent_color, background_color, text_color, radius, font, button_style)
VALUES ('default', '#F26B5B', '#F9A03F', '#EE4266', '#FFFBF5', '#2D3142', '1rem', 'Plus Jakarta Sans', 'rounded-2xl')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.seo_settings (id, title, description, keywords)
VALUES ('default', 'Colorins Papelería Creativa | Agendas y Washi Tapes', 'Tienda online de papelería bonita, rotuladores lettering, bullet journal y regalos.', 'papelería, agendas 2026, bullet journal, washi tape, lettering')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.legal_settings (id, privacy, terms, cookies, returns)
VALUES ('default', 'En Colorins nos comprometemos a proteger la privacidad y seguridad de tus datos...', 'Los presentes términos regulan la compra y uso de productos en Colorins...', 'Utilizamos cookies técnicas y analíticas para optimizar tu experiencia...', 'Dispones de 14 días naturales para cualquier devolución.')
ON CONFLICT (id) DO NOTHING;

-- Habilitar Políticas RLS públicas para lectura y escritura desde la aplicación
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso para API anon / authenticated
CREATE POLICY "Permitir todo a anon en products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en design_settings" ON public.design_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en seo_settings" ON public.seo_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en legal_settings" ON public.legal_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en activity_logs" ON public.activity_logs FOR ALL USING (true) WITH CHECK (true);
`;
