import React, { useState } from "react";
import { Lock, LogIn, Sparkles, ShieldCheck, KeyRound, AlertCircle } from "lucide-react";
import { Button, Input } from "./CommonUI";

interface LoginViewProps {
  onLogin: (credentials: { email: string; password: string }) => Promise<void>;
  loading: boolean;
  error?: string;
}

export function LoginView({ onLogin, loading, error }: LoginViewProps) {
  const [email, setEmail] = useState("admin@colorins.com");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    await onLogin({ email: email.trim(), password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-rose-50/40 to-amber-50/40 p-4">
      <div className="w-full max-w-md">
        {/* Logo and card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#F26B5B] to-[#ff8475] text-white shadow-lg shadow-[#F26B5B]/30">
              <Sparkles size={28} />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              COLORINS ADMIN
            </h1>
            <p className="mt-1 text-xs font-semibold text-slate-400">
              Acceso seguro al panel de gestión y base de datos
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
              <AlertCircle size={16} className="shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form autoComplete="off" onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="input-login-email"
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@colorins.com"
              required
            />

            <Input
              id="input-login-password"
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              id="btn-submit-login"
              type="submit"
              className="w-full py-3"
              disabled={loading}
            >
              {loading ? (
                <>Conectando a SQLite...</>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Entrar al Panel de Control</span>
                </>
              )}
            </Button>
          </form>

          {/* Environment notice and default credentials box */}
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <KeyRound size={14} className="text-[#F26B5B]" />
              <span>Credenciales iniciales configuradas en .env:</span>
            </div>
            <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-600">
              <p>Email: <span className="font-bold text-slate-900">admin@colorins.com</span></p>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 border-t border-slate-200/60 pt-2 text-[10px] text-slate-400">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>Protegido con hashing SHA-256 y base de datos local SQLite.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
