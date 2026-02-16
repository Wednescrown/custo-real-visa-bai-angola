
import React, { useState, useEffect, useCallback } from 'react';
import { Calculator } from './components/Calculator';
import { AnalysisPanel } from './components/AnalysisPanel';
import { SummaryView } from './components/SummaryView';
import { CalculatorState, CalculationResults } from './types';
import { Login } from './components/Login';

// Refined SVG for BAI Logo based on "Jumping Figure" reference - kept for section use
export const BAILogo = ({ className = "w-10 h-10" }) => (
  <div className={`${className} bg-[#00a1e4] rounded-lg flex items-center justify-center overflow-hidden shadow-sm`}>
    <svg viewBox="0 0 100 100" className="w-8 h-8 fill-white">
      {/* Stylized Jumping Figure */}
      <circle cx="50" cy="22" r="7" />
      <path d="M50 32 c-5 0 -10 5 -12 12 l-8 20 l5 2 l6 -15 l4 25 l8 0 l-2 -30 l12 -12 l-5 -4 z" />
      <path d="M50 32 l10 -5 l15 15 l-4 4 l-12 -12 z" />
    </svg>
  </div>
);

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('is_auth_wc') === 'true';
  });

  // Set "summary" as the default view (Publicly accessible)
  const [activeView, setActiveView] = useState<'detailed' | 'summary'>('summary');
  const [isSyncing, setIsSyncing] = useState(false);
  const [sourceUrl, setSourceUrl] = useState<string | null>("https://www.bancobai.ao/pt/cambios-e-valores");
  const [currentDate, setCurrentDate] = useState("");
  
  const [state, setState] = useState<CalculatorState>({
    usdNeeded: 120,
    exchangeRate: 974.00,
    shippingUsd: 0.00,
    shippingExchangeRate: 1071.40,
    customsTax: 0,
    loadingFeePct: 2,
    commissionPct: 14,
    purchaseFeePct: 3,
    conversionFeePct: 6,
  });

  const [results, setResults] = useState<CalculationResults>({
    baseKwanza: 0,
    loadingFee: 0,
    loadingCommission: 0,
    purchaseFee: 0,
    purchaseCommission: 0,
    conversionFee: 0,
    totalVisaLoad: 0,
    totalDeviceExpense: 0,
    shippingKwanza: 0,
    totalFinalCost: 0,
  });

  // Set today's date on mount
  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    setCurrentDate(formatted);
  }, []);

  useEffect(() => {
    const baseKwanza = state.usdNeeded * state.exchangeRate;
    const purchaseFee = baseKwanza * (state.purchaseFeePct / 100);
    const purchaseCommission = purchaseFee * (state.commissionPct / 100);
    const conversionFee = baseKwanza * (state.conversionFeePct / 100);
    const totalVisaLoad = baseKwanza + purchaseFee + purchaseCommission + conversionFee;
    const loadingFee = totalVisaLoad * (state.loadingFeePct / 100);
    const loadingCommission = loadingFee * (state.commissionPct / 100);
    const totalDeviceExpense = totalVisaLoad + loadingFee + loadingCommission;
    const shippingKwanza = state.shippingUsd * state.shippingExchangeRate;
    const calculatedCustomsTax = (state.usdNeeded * 0.16) * state.exchangeRate;
    const totalFinalCost = totalDeviceExpense + shippingKwanza + calculatedCustomsTax;

    setResults({
      baseKwanza,
      loadingFee,
      loadingCommission,
      purchaseFee,
      purchaseCommission,
      conversionFee,
      totalVisaLoad,
      totalDeviceExpense,
      shippingKwanza,
      totalFinalCost
    });

    if (state.customsTax !== calculatedCustomsTax) {
      setState(prev => ({ ...prev, customsTax: calculatedCustomsTax }));
    }
  }, [state.usdNeeded, state.exchangeRate, state.shippingUsd, state.shippingExchangeRate, state.loadingFeePct, state.commissionPct, state.purchaseFeePct, state.conversionFeePct]);

  const handleStateChange = (updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('is_auth_wc', 'true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2e1534] via-[#1a1b3a] to-[#0f172a] text-slate-100 font-sans pb-20 animate-in fade-in duration-700">
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10 px-8 py-4 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#10b981] w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white shadow-lg border border-white/20">
                <span className="text-[10px] font-black leading-none">WC</span>
                <i className="fas fa-crown text-xs mt-1 text-yellow-400"></i>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white tracking-tight leading-none uppercase">WEDNESCROWN SALES</h1>
                <p className="text-[9px] text-blue-400 uppercase tracking-[0.2em] font-black mt-1">Custo Real VISA BAI</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-black/40 p-1.5 rounded-2xl border border-white/10 shadow-inner">
            <button 
              onClick={() => setActiveView('detailed')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${activeView === 'detailed' ? 'bg-[#0059a9] text-white shadow-xl ring-2 ring-blue-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              Visão Detalhada
            </button>
            <button 
              onClick={() => setActiveView('summary')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${activeView === 'summary' ? 'bg-[#10b981] text-white shadow-xl ring-2 ring-green-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              Resumo Rápido
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-sm font-medium text-slate-300">
            {/* Dynamic Date */}
            <div className="flex flex-col items-end border-r border-white/10 pr-10">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Data de Referência</span>
              <div className="flex items-center gap-2 text-white font-bold">
                <i className="far fa-calendar-alt text-blue-400"></i>
                <span>{currentDate}</span>
              </div>
            </div>

            <div className="flex items-center flex-col items-end">
              <div className="flex items-center gap-2">
                <i className={`fas fa-money-bill-transfer text-green-400 text-lg`}></i>
                <span className="font-bold text-white">{state.exchangeRate.toFixed(2)} Kz/USD</span>
              </div>
              {sourceUrl && (
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-400 hover:text-blue-300 flex items-center gap-1 uppercase font-bold tracking-tighter mt-1">
                  Fonte Oficial <i className="fas fa-external-link-alt text-[7px]"></i>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto w-full p-6 md:p-10 min-h-[60vh]">
        {activeView === 'detailed' ? (
          !isAuthenticated ? (
            <div className="flex justify-center items-center py-12">
              <Login onLogin={handleLoginSuccess} embedded={true} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">
              <div className="lg:col-span-8 space-y-8">
                <Calculator 
                  state={state} 
                  results={results} 
                  onUpdate={handleStateChange} 
                  isSyncing={false}
                  onRefresh={() => {}}
                  sourceUrl={sourceUrl}
                />
              </div>
              <div className="lg:col-span-4">
                <div className="mb-6 bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex items-center gap-3">
                  <i className="fas fa-shield-halved text-blue-400"></i>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Certificado WEDNESCROWN SALES</span>
                </div>
                <AnalysisPanel state={state} results={results} />
              </div>
            </div>
          )
        ) : (
          <SummaryView 
            state={state} 
            results={results} 
            onUpdate={handleStateChange} 
            isSyncing={false}
            onRefresh={() => {}}
            sourceUrl={sourceUrl}
          />
        )}
      </main>

      <footer className="py-12 text-center border-t border-white/5 bg-black/40 mt-12">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-4 opacity-50">
             <div className="h-[1px] bg-white/20 flex-1"></div>
             <i className="fas fa-crown text-yellow-500/50"></i>
             <div className="h-[1px] bg-white/20 flex-1"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-white font-black uppercase tracking-[0.3em] text-sm">WEDNESCROWN SALES</h3>
            <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">
              &copy; {new Date().getFullYear()} - Todos os Direitos Reservados
            </p>
          </div>
          {sourceUrl && (
            <div>
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500/60 hover:text-blue-400 text-[10px] uppercase font-bold tracking-tighter">Ver câmbio oficial no site do BAI</a>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;
