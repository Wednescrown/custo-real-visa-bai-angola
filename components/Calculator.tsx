
import React from 'react';
import { CalculatorState, CalculationResults } from '../types';

interface CalculatorProps {
  state: CalculatorState;
  results: CalculationResults;
  onUpdate: (updates: Partial<CalculatorState>) => void;
  isSyncing: boolean;
  onRefresh: () => void;
  sourceUrl: string | null;
}

export const Calculator: React.FC<CalculatorProps> = ({ state, results, onUpdate, isSyncing, onRefresh, sourceUrl }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-AO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handleInputChange = (field: keyof CalculatorState, val: string) => {
    const num = parseFloat(val) || 0;
    onUpdate({ [field]: num });
  };

  const inputStyle = "w-[120px] text-right bg-black/40 text-white border border-white/10 rounded-md px-3 py-2 font-mono text-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-inner";
  const sectionStyle = "bg-black/30 backdrop-blur-md rounded-2xl shadow-xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10";
  const labelStyle = "text-sm font-bold text-slate-300";

  return (
    <div className="space-y-8">
      {/* SECTION 1: CONVERSÃO */}
      <section className={sectionStyle}>
        <div className="bg-[#5d8233]/80 backdrop-blur-sm px-6 py-4 flex justify-between items-center border-b border-white/5">
          <h2 className="text-white font-bold uppercase text-sm tracking-widest">Conversão</h2>
          {sourceUrl && (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/70 hover:text-white flex items-center gap-1 uppercase font-bold">
              Fonte BAI <i className="fas fa-external-link-alt text-[8px]"></i>
            </a>
          )}
        </div>
        <div className="p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-6 w-full">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className={labelStyle}>USD Necessário</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  step="0.01"
                  value={state.usdNeeded}
                  onChange={(e) => handleInputChange('usdNeeded', e.target.value)}
                  className={inputStyle}
                />
                <span className="text-[10px] font-black text-slate-500 w-8">USD</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className={labelStyle}>Câmbio Actual</span>
              <div className="flex items-center gap-2 relative">
                <input 
                  type="number" 
                  step="0.01"
                  value={state.exchangeRate}
                  onChange={(e) => handleInputChange('exchangeRate', e.target.value)}
                  className={`${inputStyle} pr-8`}
                  disabled={isSyncing}
                />
                <button 
                  onClick={onRefresh}
                  disabled={isSyncing}
                  className={`absolute right-10 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-400 ${isSyncing ? 'animate-spin' : ''}`}
                >
                  <i className="fas fa-sync-alt text-[10px]"></i>
                </button>
                <span className="text-[10px] font-black text-slate-500 w-8">Kz</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <div className="bg-white/5 px-10 py-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor em Kwanzas</span>
              <span className="font-mono text-3xl font-black text-white tracking-tight">
                {formatCurrency(results.baseKwanza)} <span className="text-sm">Kz</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CONTA CORRENTE */}
      <section className={sectionStyle}>
        <div className="bg-[#a65e23]/80 backdrop-blur-sm px-6 py-4 border-b border-white/5">
          <h2 className="text-white font-bold uppercase text-sm tracking-widest">Desconto na Conta Corrente</h2>
        </div>
        <div className="p-8 space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-bold text-slate-300 block">Taxa Carregamento {state.loadingFeePct}%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">(Sobre Valor no VISA)</span>
            </div>
            <span className="font-mono text-lg font-black text-white">{formatCurrency(results.loadingFee)} Kz</span>
          </div>
          <div className="flex justify-between items-center border-t border-white/5 pt-5">
            <span className={labelStyle}>Comissão de Taxa de Carregamento {state.commissionPct}%</span>
            <span className="font-mono text-lg font-black text-white">{formatCurrency(results.loadingCommission)} Kz</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: CARTÃO VISA BAI */}
      <section className={sectionStyle}>
        <div className="bg-[#0059a9]/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-white/5">
          <h2 className="text-white font-bold uppercase text-sm tracking-widest">CARTÃO VISA BAI</h2>
          <div className="bg-white/10 px-3 py-1 rounded text-[10px] text-white font-black tracking-tighter uppercase border border-white/10">VISA CLASSIC</div>
        </div>
        <div className="p-8 space-y-5">
          <div className="flex justify-between items-center">
            <span className={labelStyle}>Taxa de Compra {state.purchaseFeePct}%</span>
            <span className="font-mono text-lg font-black text-white">{formatCurrency(results.purchaseFee)} Kz</span>
          </div>
          <div className="flex justify-between items-center border-t border-white/5 pt-5">
            <span className={labelStyle}>Comissão da Taxa de Compra {state.commissionPct}%</span>
            <span className="font-mono text-lg font-black text-white">{formatCurrency(results.purchaseCommission)} Kz</span>
          </div>
          <div className="flex justify-between items-center border-t border-white/5 pt-5">
            <span className={labelStyle}>Taxa de conversão da moeda {state.conversionFeePct}%</span>
            <span className="font-mono text-lg font-black text-white">{formatCurrency(results.conversionFee)} Kz</span>
          </div>
          <div className="mt-8 p-6 bg-blue-500/5 rounded-2xl flex justify-between items-center font-bold border border-blue-500/10 shadow-inner">
            <span className="text-xs text-blue-400 font-black uppercase tracking-widest">Total no VISA BAI</span>
            <span className="font-mono text-2xl text-blue-400 font-black">{formatCurrency(results.totalVisaLoad)} Kz</span>
          </div>
        </div>
      </section>

      {/* MID TOTAL: CUSTO REAL VISA BAI */}
      <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 group transition-all hover:bg-white/10">
        <div className="flex flex-col">
          <span className="text-blue-400 font-black uppercase text-xs tracking-[0.3em] mb-1">CUSTO REAL VISA BAI</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Subtotal Acumulado</span>
        </div>
        <span className="font-mono text-4xl font-black text-white drop-shadow-lg">{formatCurrency(results.totalDeviceExpense)} <span className="text-xl">Kz</span></span>
      </div>

      {/* SECTION 4: LOGÍSTICA E ALFÂNDEGA */}
      <section className={sectionStyle}>
        <div className="bg-[#2d4d1d]/80 backdrop-blur-sm px-6 py-4 border-b border-white/5">
          <h2 className="text-white font-bold uppercase text-sm tracking-widest">Logística e Alfândega</h2>
        </div>
        <div className="p-8 space-y-10">
          {/* Shipping Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="bg-red-500/10 p-6 rounded-3xl text-white shadow-2xl transition-transform hover:scale-[1.02] border border-red-500/20">
              <div className="flex justify-between items-center mb-4">
                <span className="font-black text-xs uppercase tracking-[0.2em] opacity-80 text-red-400">Frete em ($)</span>
                <i className="fas fa-plane-up text-red-400 opacity-50 text-xl"></i>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  step="0.01"
                  value={state.shippingUsd}
                  onChange={(e) => handleInputChange('shippingUsd', e.target.value)}
                  className="flex-1 min-w-0 text-right bg-black/40 text-white placeholder-white/20 border border-white/10 rounded-2xl px-5 py-4 font-mono text-2xl font-black outline-none focus:ring-4 focus:ring-red-500/20 transition-all"
                  placeholder="0.00"
                />
                <span className="font-black text-lg text-red-400 opacity-80">USD</span>
              </div>
            </div>
            
            <div className="bg-white/5 p-8 rounded-3xl border border-white/5 flex flex-col justify-center items-center shadow-inner">
              <span className="font-black text-xs text-slate-500 uppercase tracking-widest mb-3">Frete em Kwanza</span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-black text-3xl text-white">{formatCurrency(results.shippingKwanza)}</span>
                <span className="text-sm font-black text-slate-500 uppercase">Kz</span>
              </div>
            </div>
          </div>
          
          {/* Customs Row */}
          <div className="bg-white/5 p-8 rounded-3xl border-2 border-dashed border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="bg-white/5 p-4 rounded-2xl text-slate-400 border border-white/5 shadow-sm">
                  <i className="fas fa-building-columns text-2xl"></i>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Taxa Aduaneira (16%)</span>
                  <span className="text-sm font-bold text-slate-300">Imposto sobre ${state.usdNeeded}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-3xl font-black text-orange-400">{formatCurrency(state.customsTax)}</span>
                <span className="ml-3 text-xs font-black text-slate-500 uppercase tracking-widest">Kz</span>
              </div>
            </div>
          </div>

          {/* Final Summary Card */}
          <div className="bg-red-600/20 backdrop-blur-xl p-10 rounded-[3rem] flex flex-col md:flex-row justify-between items-center text-white shadow-2xl border border-red-500/20 relative overflow-hidden group">
            <i className="fas fa-receipt absolute -right-6 -bottom-6 text-[10rem] opacity-5 rotate-12 transition-transform group-hover:scale-110"></i>
            <div className="relative z-10 text-center md:text-left space-y-2">
              <span className="font-black uppercase text-xs tracking-[0.5em] text-red-400 block">Custo Total de Importação</span>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Consolidação Final (Câmbio + Taxas + Alfândega)</p>
            </div>
            <div className="relative z-10 mt-6 md:mt-0 flex items-baseline gap-3">
              <span className="font-mono text-5xl font-black tabular-nums text-white drop-shadow-xl">{formatCurrency(results.totalFinalCost)}</span>
              <span className="text-xl font-bold opacity-70 italic tracking-tighter text-slate-400">Kz</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
