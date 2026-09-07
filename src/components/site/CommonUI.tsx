import React from "react";
import { RefreshCw } from "lucide-react";

export function money(value: number | string | null | undefined, currency = "€"): string {
  const num = Number(value || 0);
  return `${num.toFixed(2)} ${currency}`;
}

export function formatDate(value?: string | null): string {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

export function downloadFile(filename: string, content: string, type = "application/json") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export function Button({
  children,
  danger,
  secondary,
  outline,
  size = "md",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  danger?: boolean;
  secondary?: boolean;
  outline?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3.5 text-base rounded-2xl",
  }[size];

  const variantClasses = danger
    ? "bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700 shadow-sm"
    : secondary
    ? "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300"
    : outline
    ? "border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
    : "bg-[#F26B5B] text-white hover:bg-[#e05848] active:bg-[#cb4c3d] shadow-sm";

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 font-bold transition duration-150 disabled:cursor-not-allowed disabled:opacity-50 select-none cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
}

export function Input({
  label,
  error,
  helper,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helper?: string;
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 ml-0.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full rounded-xl border-2 border-slate-100 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#F26B5B] focus:bg-white focus:ring-2 focus:ring-[#F26B5B]/10 disabled:bg-slate-100 disabled:opacity-60 ${
          error ? "border-rose-400 focus:border-rose-500" : ""
        } ${className}`}
      />
      {error && <p className="mt-1 text-xs font-semibold text-rose-500">{error}</p>}
      {helper && !error && <p className="mt-1 text-xs text-slate-400">{helper}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  helper,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  helper?: string;
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 ml-0.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`w-full rounded-xl border-2 border-slate-100 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#F26B5B] focus:bg-white focus:ring-2 focus:ring-[#F26B5B]/10 disabled:bg-slate-100 disabled:opacity-60 ${
          error ? "border-rose-400 focus:border-rose-500" : ""
        } ${className}`}
      />
      {error && <p className="mt-1 text-xs font-semibold text-rose-500">{error}</p>}
      {helper && !error && <p className="mt-1 text-xs text-slate-400">{helper}</p>}
    </div>
  );
}

export function Card({
  title,
  subtitle,
  icon: Icon,
  children,
  action,
  className = "",
  id,
}: {
  title?: string;
  subtitle?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ${className}`}
    >
      {(title || action) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Icon size={20} />
              </div>
            )}
            <div>
              {title && <h2 className="text-base font-bold text-slate-900">{title}</h2>}
              {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function Stat({
  title,
  value,
  icon: Icon,
  color = "bg-[#F26B5B]",
  subtitle,
  id,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color?: string;
  subtitle?: string;
  id?: string;
}) {
  return (
    <div id={id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-1.5 truncate text-2xl font-black text-slate-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>}
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

export function Loading({ text = "Cargando datos..." }: { text?: string }) {
  return (
    <div className="flex min-h-[300px] items-center justify-center p-8">
      <div className="text-center">
        <RefreshCw size={36} className="mx-auto mb-3 animate-spin text-[#F26B5B]" />
        <p className="text-sm font-bold text-slate-600">{text}</p>
      </div>
    </div>
  );
}

export function Empty({
  title = "Sin resultados",
  text = "No se encontraron elementos disponibles en esta sección.",
  action,
  icon: Icon,
}: {
  title?: string;
  text?: string;
  action?: React.ReactNode;
  icon?: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
      {Icon && (
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
          <Icon size={24} />
        </div>
      )}
      <h3 className="text-sm font-bold text-slate-700">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
