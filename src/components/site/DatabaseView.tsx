import React, { useState, useEffect } from "react";
import {
  Database,
  RefreshCw,
  Copy,
  Check,
  Download,
  Upload,
  Play,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { DatabaseStatus } from "../../types";
import { Card, Button, Input, Textarea, downloadFile } from "./CommonUI";
import {
  SUPABASE_URL,
  SUPABASE_SQL_SCHEMA,
  checkSupabaseConnection,
} from "../../supabase";


interface DatabaseViewProps {
  dbStatus: DatabaseStatus | null;
  onRefreshStatus: () => void;
  onRunQuery: (query: string) => Promise<any>;
  onSeedDatabase: () => Promise<void>;
  onVacuumDatabase: () => Promise<void>;
  onRestoreBackup: (data: any) => Promise<void>;
  notify: (msg: string) => void;
}

export function DatabaseView({
  dbStatus,
  onRefreshStatus,
  onRunQuery,
  onSeedDatabase,
  onVacuumDatabase,
  onRestoreBackup,
  notify,
}: DatabaseViewProps) {
  const [supabaseState, setSupabaseState] = useState<{
    loading: boolean;
    connected: boolean;
    tablesAvailable?: boolean;
    error?: string;
  }>({ loading: true, connected: false });

  const [copiedSql, setCopiedSql] = useState(false);
  const [queryInput, setQueryInput] = useState("SELECT id, name, category, price, stock FROM products LIMIT 10;");
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const testSupabase = async () => {
    setSupabaseState((prev) => ({ ...prev, loading: true, }));
    const res = await checkSupabaseConnection();
    setSupabaseState({
      loading: false,
      connected: res.connected,
      tablesAvailable: res.tablesAvailable,
      error: res.error,
    });
  };

  useEffect(() => {
    testSupabase();
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    notify("¡Script SQL de Supabase copiado al portapapeles!");
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleDownloadBackup = async () => {
    try {
      const res = await fetch("/api/database/backup");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `colorins-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      notify("Copia de seguridad descargada exitosamente.");
    } catch (err: any) {
      notify("Error al descargar backup: " + err.message);
    }
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        if (!json.data) throw new Error("Formato inválido.");
        await onRestoreBackup(json.data);
        notify("Copia de seguridad restaurada correctamente.");
      } catch (err: any) {
        notify("Error al restaurar archivo: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    setQueryLoading(true);
    setQueryError(null);
    try {
      const res = await onRunQuery(queryInput.trim());
      setQueryResults(res.rows || []);
    } catch (err: any) {
      setQueryError(err.message);
      setQueryResults(null);
    } finally {
      setQueryLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Supabase Connection Banner */}
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[11px] font-black text-emerald-300 border border-emerald-500/30">
                SUPABASE POSTGRESQL CONECTADO
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {SUPABASE_URL}
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">
              Gestión de Datos y Sincronización en la Nube
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tu proyecto está vinculado a tu base de datos Supabase. Dispones del script SQL completo listo para inicializar las tablas de Colorins con 1 clic en el editor de Supabase.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              id="btn-copy-supabase-sql"
              onClick={handleCopySql}
              className="bg-emerald-500 hover:bg-emerald-600 text-white border-0"
            >
              {copiedSql ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedSql ? "¡Copiado!" : "Copiar Script SQL Supabase"}</span>
            </Button>

            <button
              onClick={testSupabase}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
            >
              <RefreshCw size={14} className={supabaseState.loading ? "animate-spin" : ""} />
              <span>Verificar Conexión</span>
            </button>
          </div>
        </div>

        {/* Supabase Status details */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${supabaseState.connected ? "bg-emerald-400" : "bg-rose-400 animate-ping"}`} />
            <span className="font-semibold text-slate-200">
              Estado: {supabaseState.loading ? "Comprobando..." : supabaseState.connected ? "Conexión Supabase Activa" : "Error de Conexión"}
            </span>
          </div>

          {supabaseState.error && (
            <span className="text-amber-300 bg-amber-900/40 px-2 py-0.5 rounded-md text-[11px]">
              {supabaseState.error}
            </span>
          )}
        </div>
      </div>

      {/* Database Statistics */}
      {dbStatus && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <p className="text-xs font-bold text-slate-400">Total Productos</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{dbStatus.counts.products}</p>
            <p className="text-[11px] text-slate-500">En catálogo y tienda</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <p className="text-xs font-bold text-slate-400">Total Categorías</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{dbStatus.counts.categories}</p>
            <p className="text-[11px] text-slate-500">Secciones organizadas</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <p className="text-xs font-bold text-slate-400">Total Pedidos</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{dbStatus.counts.orders}</p>
            <p className="text-[11px] text-slate-500">Registros de ventas</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <p className="text-xs font-bold text-slate-400">Tamaño Almacenamiento</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{dbStatus.sizeKb} KB</p>
            <p className="text-[11px] text-emerald-600 font-semibold">Motor optimizado WAL</p>
          </div>
        </div>
      )}

      {/* SQL Script View & Copy Box */}
      <Card
        title="Script de Creación de Tablas para Supabase"
        subtitle="Ejecuta este código en el SQL Editor de tu panel de Supabase para tener la base de datos lista"
        icon={Database}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              Contiene tablas: products, categories, orders, customers, site_settings, design_settings, seo_settings, legal_settings, activity_logs
            </span>
            <Button size="sm" onClick={handleCopySql}>
              {copiedSql ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedSql ? "¡Copiado!" : "Copiar SQL"}</span>
            </Button>
          </div>

          <div className="relative">
            <pre className="max-h-64 overflow-y-auto rounded-2xl bg-slate-900 p-4 font-mono text-xs text-emerald-300 shadow-inner">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        </div>
      </Card>

      {/* SQL Query Explorer */}
      <Card
        title="Consola de Consultas SQL (Solo Lectura)"
        subtitle="Inspecciona tus tablas directamente mediante consultas SELECT seguras"
        icon={Play}
      >
        <form onSubmit={handleExecuteQuery} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="SELECT * FROM products LIMIT 5;"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2 text-xs font-mono font-semibold text-slate-800 outline-none focus:border-[#F26B5B] focus:bg-white"
            />
            <Button type="submit" disabled={queryLoading}>
              <Play size={14} />
              <span>{queryLoading ? "Ejecutando..." : "Ejecutar"}</span>
            </Button>
          </div>

          {queryError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium">
              {queryError}
            </div>
          )}

          {queryResults && (
            <div className="mt-3">
              <p className="text-xs font-bold text-slate-500 mb-2">
                Resultados ({queryResults.length} filas):
              </p>
              {queryResults.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No se devolvieron filas.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        {Object.keys(queryResults[0]).map((k) => (
                          <th key={k} className="p-2.5">
                            {k}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {queryResults.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          {Object.values(row).map((val: any, i) => (
                            <td key={i} className="p-2.5 font-mono text-slate-700 truncate max-w-xs">
                              {typeof val === "object" ? JSON.stringify(val) : String(val ?? "-")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </form>
      </Card>

      {/* Backup & Maintenance Tools */}
      <Card
        title="Herramientas de Mantenimiento & Copias de Seguridad"
        subtitle="Exporta, importa o compacta la base de datos de Colorins"
        icon={Server}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button secondary onClick={handleDownloadBackup}>
            <Download size={15} />
            <span>Descargar Copia de Seguridad (JSON)</span>
          </Button>

          <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer shadow-2xs">
            <Upload size={15} />
            <span>Restaurar Copia JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileRestore}
              className="hidden"
            />
          </label>

          <Button secondary onClick={onVacuumDatabase}>
            <Sparkles size={15} />
            <span>Optimizar con VACUUM</span>
          </Button>

          <Button secondary onClick={onSeedDatabase} className="text-amber-700 border-amber-200 hover:bg-amber-50">
            <RefreshCw size={15} />
            <span>Restaurar Datos de Demostración</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
