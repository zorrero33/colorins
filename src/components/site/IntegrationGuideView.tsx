import React, { useState } from "react";
import {
  FolderTree,
  Copy,
  Check,
  Download,
  FileCode,
  Terminal,
  ExternalLink,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Database,
} from "lucide-react";
import { Card, Button, downloadFile } from "./CommonUI";
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SQL_SCHEMA } from "../../supabase";

interface IntegrationGuideViewProps {
  notify: (msg: string) => void;
}

export function IntegrationGuideView({ notify }: IntegrationGuideViewProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>("env");

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    notify(`¡${key} copiado al portapapeles!`);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  const envFileContent = `# .env para tu proyecto web
# Conexión directa con tu Supabase (Pimbers)

# 1. Variables accesibles en el navegador (Vite / React)
VITE_SUPABASE_URL="${SUPABASE_URL}"
VITE_SUPABASE_PUBLISHABLE_KEY="${SUPABASE_ANON_KEY}"

# 2. Variables para backend o servidor Node / Next.js
SUPABASE_URL="${SUPABASE_URL}"
SUPABASE_PUBLISHABLE_KEY="${SUPABASE_ANON_KEY}"
SUPABASE_SECRET_KEY="${SUPABASE_SECRET_KEY}"
SUPABASE_JWKS_URL="${SUPABASE_URL}/auth/v1/.well-known/jwks.json"

# Credenciales de Administrador por defecto
ADMIN_EMAIL="admin@colorins.com"
ADMIN_PASSWORD="admin123_change_in_production"
`;

  const supabaseClientContent = `import { createClient } from "@supabase/supabase-js";

// Credenciales inyectadas desde tu .env o con fallback a tu Supabase activo
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "${SUPABASE_URL}";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "${SUPABASE_ANON_KEY}";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
`;

  const quickIntegrateSnippet = `// En tu archivo de rutas o en tu App.tsx:
import React, { useState } from "react";
import AdminPanel from "./AdminPanel"; // o la ruta donde coloques el panel

export default function MiWeb() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div>
      {/* Tu tienda actual */}
      {!showAdmin ? (
        <div>
          <header>
            <button onClick={() => setShowAdmin(true)}>
              Acceder al Panel de Control
            </button>
          </header>
          {/* ... El resto de tu web actual ... */}
        </div>
      ) : (
        /* Panel de administración completo */
        <div className="min-h-screen bg-slate-50">
          <button 
            onClick={() => setShowAdmin(false)}
            className="fixed top-4 right-4 z-50 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs"
          >
            ← Volver a la Tienda
          </button>
          <AdminPanel />
        </div>
      )}
    </div>
  );
}
`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[11px] font-black text-emerald-300 border border-emerald-500/30">
              GUÍA DE INSTALACIÓN Y PACK DE ARCHIVOS
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              Cómo integrar este Panel de Control en tu Web ya existente
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Aquí tienes la estructura exacta de carpetas, el archivo <span className="font-mono text-amber-300">.env</span> listo con tus claves de Supabase, y el script SQL para que todo empiece a funcionar de inmediato en tu web.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              id="btn-download-all-pack"
              onClick={() => {
                downloadFile(".env", envFileContent, "text/plain");
                notify("Archivo .env descargado. Puedes descargar el resto de archivos a continuación.");
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white border-0"
            >
              <Download size={15} />
              <span>Descargar .env</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 3-Step Setup Roadmap */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 font-black text-xs text-indigo-600 mb-3">
            01
          </div>
          <h3 className="font-bold text-sm text-slate-900">1. Configura el .env</h3>
          <p className="text-xs text-slate-500 mt-1">
            Coloca el archivo <span className="font-mono font-bold text-slate-700">.env</span> en la raíz de tu proyecto web con tus claves de Supabase.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 font-black text-xs text-indigo-600 mb-3">
            02
          </div>
          <h3 className="font-bold text-sm text-slate-900">2. Ejecuta el SQL en Supabase</h3>
          <p className="text-xs text-slate-500 mt-1">
            Entra en tu <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-[#F26B5B] underline font-bold">Supabase Dashboard</a> &gt; SQL Editor, pega el script y pulsa <strong>Run</strong>.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 font-black text-xs text-indigo-600 mb-3">
            03
          </div>
          <h3 className="font-bold text-sm text-slate-900">3. Copia la carpeta /src</h3>
          <p className="text-xs text-slate-500 mt-1">
            Copia los archivos a <span className="font-mono font-bold text-slate-700">src/components/</span> e importa <span className="font-mono font-bold text-slate-700">&lt;AdminPanel /&gt;</span> en tu ruta elegida.
          </p>
        </div>
      </div>

      {/* Directory Tree Structure Card */}
      <Card
        title="Estructura Exacta de Carpetas y Rutas en tu Web"
        subtitle="Sigue este árbol de directorios al colocar los archivos en tu repositorio"
        icon={FolderTree}
      >
        <div className="rounded-2xl bg-slate-950 p-5 font-mono text-xs text-slate-300 overflow-x-auto shadow-inner">
          <pre>{`tu-proyecto-web/
├── .env                                  # ← Pega aquí las variables de Supabase
├── package.json                          # ← Instala: npm i @supabase/supabase-js lucide-react
├── src/
│   ├── supabase.ts                       # ← Inicialización del cliente Supabase
│   ├── types.ts                          # ← Interfaces TypeScript (Product, Order, etc.)
│   ├── api.ts                            # ← Métodos CRUD y conectores
│   └── components/
│       ├── AdminPanel.tsx                # ← Vista Principal que orquesta todo el Admin
│       ├── CommonUI.tsx                  # ← Botones, Cards, Inputs y formato monetario
│       ├── DashboardView.tsx             # ← Panel de control y métricas
│       ├── ProductsView.tsx              # ← Gestión de catálogo y productos
│       ├── ProductModal.tsx              # ← Modal para crear y editar productos
│       ├── InventoryView.tsx             # ← Control de existencias y stock rápido
│       ├── CategoriesView.tsx            # ← Categorías de la tienda
│       ├── OrdersView.tsx                # ← Pedidos y estados de envío
│       ├── OrderModal.tsx                # ← Registro manual de pedidos
│       ├── CustomersView.tsx             # ← Directorio de clientes y gasto
│       ├── SettingsView.tsx              # ← Ajustes de tienda, diseño, SEO y legal
│       ├── SecurityView.tsx              # ← Auditoría de claves y contraseñas
│       ├── DatabaseView.tsx              # ← Visualizador y copias de seguridad
│       ├── LogsView.tsx                  # ← Registro de auditoría
│       └── Sidebar.tsx                   # ← Barra de navegación lateral del Admin`}</pre>
        </div>
      </Card>

      {/* File Inspector & 1-Click Copy */}
      <Card
        title="Explorador de Archivos para Copiar y Pegar"
        subtitle="Selecciona el archivo que desees y haz clic en copiar para llevarlo a tu proyecto"
        icon={FileCode}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setSelectedFile("env")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                selectedFile === "env" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              .env (Variables de entorno)
            </button>
            <button
              onClick={() => setSelectedFile("../supabase/supabase")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                selectedFile === "../supabase/supabase" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              src/supabase.ts
            </button>
            <button
              onClick={() => setSelectedFile("sql")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                selectedFile === "sql" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              schema.sql (Tablas Supabase)
            </button>
            <button
              onClick={() => setSelectedFile("snippet")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                selectedFile === "snippet" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Integración en App.tsx
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-600">
              {selectedFile === "env" && "Ruta en tu proyecto: /.env"}
              {selectedFile === "../supabase/supabase" && "Ruta en tu proyecto: /src/supabase.ts"}
              {selectedFile === "sql" && "Ejecutar en: Supabase Dashboard > SQL Editor"}
              {selectedFile === "snippet" && "Ejemplo de uso en tu router o página /admin"}
            </span>

            <Button
              size="sm"
              onClick={() => {
                let content = "";
                if (selectedFile === "env") content = envFileContent;
                else if (selectedFile === "../supabase/supabase") content = supabaseClientContent;
                else if (selectedFile === "sql") content = SUPABASE_SQL_SCHEMA;
                else if (selectedFile === "snippet") content = quickIntegrateSnippet;
                copyToClipboard(selectedFile, content);
              }}
            >
              {copiedKey === selectedFile ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedKey === selectedFile ? "¡Copiado!" : "Copiar Contenido"}</span>
            </Button>
          </div>

          <pre className="max-h-72 overflow-y-auto rounded-2xl bg-slate-900 p-4 font-mono text-xs text-emerald-300 shadow-inner">
            {selectedFile === "env" && envFileContent}
            {selectedFile === "../supabase/supabase" && supabaseClientContent}
            {selectedFile === "sql" && SUPABASE_SQL_SCHEMA}
            {selectedFile === "snippet" && quickIntegrateSnippet}
          </pre>
        </div>
      </Card>
    </div>
  );
}
