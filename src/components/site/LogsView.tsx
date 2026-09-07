import React, { useState, useMemo } from "react";
import {
  FileText,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Layers,
} from "lucide-react";
import { LogEntry } from "../../types";
import { Card, Button, Empty, formatDate } from "./CommonUI";

interface LogsViewProps {
  logs: LogEntry[];
  onRefresh: () => void;
  onClearLogs: () => Promise<void>;
  notify: (msg: string) => void;
}

export function LogsView({ logs, onRefresh, onClearLogs, notify }: LogsViewProps) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = search.toLowerCase().trim();
      return (
        !q ||
        log.action.toLowerCase().includes(q) ||
        log.description.toLowerCase().includes(q) ||
        (log.table_name && log.table_name.toLowerCase().includes(q)) ||
        (log.user && log.user.toLowerCase().includes(q))
      );
    });
  }, [logs, search]);

  const handleClear = async () => {
    if (!confirm("¿Estás seguro de que deseas vaciar el historial de actividad?")) return;
    setLoading(true);
    try {
      await onClearLogs();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            id="input-search-logs"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por acción, descripción o usuario..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 outline-none transition focus:border-[#F26B5B] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" secondary onClick={onRefresh}>
            <RefreshCw size={14} />
            <span>Refrescar</span>
          </Button>

          <Button
            size="sm"
            secondary
            onClick={handleClear}
            disabled={loading || logs.length === 0}
            className="text-rose-600 hover:bg-rose-50 border-rose-200"
          >
            <Trash2 size={14} />
            <span>Limpiar Logs</span>
          </Button>
        </div>
      </div>

      {/* Logs Card */}
      <Card
        title={`Registro de Actividad y Auditoría (${filteredLogs.length})`}
        subtitle="Historial cronológico de cambios, inicios de sesión y modificaciones en Colorins"
        icon={FileText}
      >
        {filteredLogs.length === 0 ? (
          <Empty
            icon={FileText}
            title="Sin registros de actividad"
            text="Las acciones administrativas aparecerán aquí automáticamente conforme se interactúe con el panel."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3.5 px-2 hover:bg-slate-50/50 rounded-xl transition"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-black text-slate-700">
                      {log.action}
                    </span>
                    {log.table_name && (
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                        {log.table_name}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-medium">
                      por <strong className="text-slate-600">{log.user || "Admin"}</strong>
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-semibold text-slate-800">
                    {log.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0 self-end sm:self-center">
                  <Clock size={13} />
                  <span>{formatDate(log.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
