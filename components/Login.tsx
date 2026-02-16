
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
  embedded?: boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin, embedded = false }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(false);

    // Hardcoded password as requested
    if (password === 'Ju@123456789') {
      setTimeout(() => {
        onLogin();
      }, 300);
    } else {
      setTimeout(() => {
        setError(true);
        setIsProcessing(false);
      }, 500);
    }
  };

  const containerClasses = embedded 
    ? "max-w-md w-full" 
    : "min-h-screen bg-gradient-to-b from-[#2e1534] via-[#1a1b3a] to-[#0f172a] flex items-center justify-center p-6";

  return (
    <div className={containerClasses}>
      <div className="w-full">
        {/* Branding - only show if not embedded to avoid duplication with header */}
        {!embedded && (
          <div className="flex flex-col items-center mb-10 space-y-4">
            <div className="bg-[#10b981] w-20 h-20 rounded-3xl flex flex-col items-center justify-center text-white shadow-[0_0_50px_-12px_rgba(16,185,129,0.5)] border border-white/20 transition-transform hover:scale-110 duration-500">
              <span className="text-xl font-black leading-none">WC</span>
              <i className="fas fa-crown text-lg mt-1 text-yellow-400"></i>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">WEDNESCROWN SALES</h1>
              <p className="text-[10px] text-blue-400 uppercase tracking-[0.4em] font-black">Custo Real VISA BAI</p>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-black/40 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
          <div className="text-center">
            <h2 className="text-lg font-bold text-white mb-2">Acesso Restrito</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Introduza a palavra-passe para a Visão Detalhada</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className={`fas fa-lock transition-colors duration-300 ${error ? 'text-red-400' : 'text-slate-500 group-focus-within:text-blue-400'}`}></i>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Palavra-passe"
                className={`w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-mono placeholder:text-slate-600 focus:ring-4 outline-none transition-all ${
                  error 
                    ? 'border-red-500/50 ring-red-500/20 animate-shake' 
                    : 'focus:ring-blue-500/20 focus:border-blue-500'
                }`}
                autoFocus
              />
              {error && (
                <p className="absolute -bottom-6 left-0 right-0 text-center text-red-400 text-[10px] font-black uppercase tracking-tighter">
                  Palavra-passe incorreta. Tente novamente.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden group`}
            >
              {isProcessing ? (
                <i className="fas fa-spinner animate-spin"></i>
              ) : (
                <>
                  <span>Desbloquear Ferramentas</span>
                  <i className="fas fa-chevron-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info - hidden when embedded */}
        {!embedded && (
          <div className="mt-8 text-center space-y-2 opacity-30">
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Sistema de Cálculo de Importação v2.0</p>
            <div className="h-[1px] w-12 bg-white/20 mx-auto"></div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};
