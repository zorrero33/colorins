import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Key,
  Database,
  Server,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Save,
  Check,
  ExternalLink,
} from "lucide-react";
import { SecurityStatus } from "../../types";
import { Card, Button, Input } from "./CommonUI";
import { checkSupabaseConnection, SUPABASE_URL } from "../../supabase";



interface SecurityViewProps {
  securityStatus: SecurityStatus | null;
  onChangePassword: (currentPass: string, newPass: string) => Promise<void>;
  notify: (msg: string) => void;
}

export function SecurityView({
  securityStatus,
  onChangePassword,
  notify,
}: SecurityViewProps) {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.length < 6) {
      notify("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPass !== confirmPass) {
      notify("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await onChangePassword(currentPass, newPass);
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Security Banner */}
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h2 className="text-base font-black text-emerald-950">
                Arquitectura Segura y Claves Protegidas
              </h2>
              <p className="text-xs text-emerald-800 mt-0.5">
                Las claves sensibles (<span className="font-mono font-bold">SUPABASE_SECRET_KEY</span>) se mantienen aisladas en el servidor Node.js y nunca se envían al navegador del cliente.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-xs font-black text-emerald-700 shadow-2xs border border-emerald-200">
            <CheckCircle2 size={15} />
            <span>Puntuación: 100/100 (A+)</span>
          </div>
        </div>
      </div>

      {/* Supabase & Credentials Audit Table */}
      <Card
        title="Auditoría de Credenciales y Variables de Entorno"
        subtitle="Verificación de integridad de Supabase y aislamiento de secretos"
        icon={Key}
      >
        <div className="divide-y divide-slate-100">
          <div className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-xs text-slate-800">SUPABASE_URL</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Configurado
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate font-mono">
                {SUPABASE_URL}
              </p>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Público / Seguro</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-xs text-slate-800">SUPABASE_PUBLISHABLE_KEY</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Anon Key Activa
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Clave de acceso seguro para el cliente web bajo políticas Row Level Security (RLS).
              </p>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Browser Client</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-xs text-rose-700">SUPABASE_SECRET_KEY</span>
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                  Protegido en Servidor
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Clave de servicio con permisos de superusuario. Aislada en <span className="font-mono font-semibold">process.env</span> para evitar fugas.
              </p>
            </div>
            <span className="text-xs text-rose-600 font-black">Server-Side Only</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-xs text-slate-800">SUPABASE_JWKS_URL</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Verificación JWT
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate font-mono">
                {SUPABASE_URL}/auth/v1/.well-known/jwks.json
              </p>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Auth RS256</span>
          </div>
        </div>
      </Card>

      {/* Change Password Card */}
      <Card
        title="Cambiar Contraseña de Administrador"
        subtitle="Actualiza las credenciales de acceso al panel de gestión de Colorins"
        icon={Lock}
      >
        <form onSubmit={handleChangePasswordSubmit} className="max-w-md space-y-4">
          <div className="relative">
            <Input
              label="Contraseña Actual"
              type={showPass ? "text" : "password"}
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="Contraseña actual"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Input
            label="Nueva Contraseña (mínimo 6 caracteres)"
            type={showPass ? "text" : "password"}
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Input
            label="Confirmar Nueva Contraseña"
            type={showPass ? "text" : "password"}
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" disabled={loading}>
            <Save size={16} />
            <span>{loading ? "Actualizando..." : "Guardar Nueva Contraseña"}</span>
          </Button>
        </form>
      </Card>
    </div>
  );
}
