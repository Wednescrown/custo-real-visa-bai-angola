
import React from 'react';
import { CalculatorState, CalculationResults } from '../types';

interface SummaryViewProps {
  state: CalculatorState;
  results: CalculationResults;
  onUpdate: (updates: Partial<CalculatorState>) => void;
  isSyncing: boolean;
  onRefresh: () => void;
  sourceUrl: string | null;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ state, results, onUpdate, isSyncing, onRefresh, sourceUrl }) => {
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

  // The user requested that in the summary view, the Customs Tax is NOT summed into the total.
  // We sum Acquisition (Device Expense) + Shipping.
  const summaryTotal = results.totalDeviceExpense + results.shippingKwanza;

  const cardBaseStyle = "bg-black/40 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col items-center text-center space-y-6 transform transition-transform hover:scale-[1.02] hover:border-blue-500/30 transition-all duration-300";
  const inputBaseStyle = "w-full text-center text-3xl font-black text-white bg-black/40 border border-white/10 rounded-2xl px-4 py-4 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all";

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Headings */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">
          Resumo de Gastos de Importação
        </h2>
        <p className="text-slate-400 text-lg font-medium">
          Consolidação de gastos no Cartão VISA e Logística.
        </p>
      </div>

      {/* Input Cards Container with Neon Border */}
      <div className="relative p-8 md:p-12 rounded-[3.5rem] border-2 border-blue-500/20 bg-black/20 backdrop-blur-sm shadow-[0_0_60px_-15px_rgba(30,58,138,0.5)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Input Card 1 */}
          <div className={cardBaseStyle}>
            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 border border-green-500/20 shadow-lg">
              <i className="fas fa-dollar-sign text-3xl"></i>
            </div>
            <div className="w-full">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">USD Necessário</label>
              <input 
                type="number"
                value={state.usdNeeded}
                onChange={(e) => handleInputChange('usdNeeded', e.target.value)}
                className={inputBaseStyle}
              />
            </div>
          </div>

          {/* Input Card 2 */}
          <div className={cardBaseStyle}>
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-lg">
              <i className={`fas fa-chart-line text-3xl ${isSyncing ? 'animate-spin' : ''}`}></i>
            </div>
            <div className="w-full">
              <div className="flex justify-center items-center gap-2 mb-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block">Câmbio Atual</label>
                <button 
                  onClick={onRefresh}
                  disabled={isSyncing}
                  className={`text-blue-400 hover:text-blue-300 transition-colors p-1 rounded-full hover:bg-white/5 ${isSyncing ? 'animate-spin' : ''}`}
                  title="Sincronizar com Banco BAI"
                >
                  <i className="fas fa-sync-alt text-xs"></i>
                </button>
              </div>
              <input 
                type="number"
                value={state.exchangeRate}
                disabled={isSyncing}
                onChange={(e) => handleInputChange('exchangeRate', e.target.value)}
                className={inputBaseStyle}
              />
              {sourceUrl && (
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400/70 hover:text-blue-400 uppercase font-bold mt-4 inline-flex items-center gap-1 tracking-tighter transition-colors">
                  Fonte BAI <i className="fas fa-external-link-alt text-[8px]"></i>
                </a>
              )}
            </div>
          </div>

          {/* Input Card 3 */}
          <div className={cardBaseStyle}>
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 border border-red-500/20 shadow-lg">
              <i className="fas fa-box-open text-3xl"></i>
            </div>
            <div className="w-full">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">Frete (USD)</label>
              <input 
                type="number"
                value={state.shippingUsd}
                onChange={(e) => handleInputChange('shippingUsd', e.target.value)}
                className={inputBaseStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Result Hero */}
      <div className="bg-black/40 p-10 md:p-16 rounded-[4rem] text-white shadow-2xl border border-white/10 relative overflow-hidden group backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mr-48 -mt-48 blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full -ml-32 -mb-32 blur-[120px]"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-10">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.5em] text-blue-400 block drop-shadow-sm">Total de Compra & Logística</span>
            <h3 className="text-6xl md:text-8xl font-black tracking-tighter tabular-nums text-white drop-shadow-2xl">
              {formatCurrency(summaryTotal)} <span className="text-2xl md:text-3xl text-slate-500 font-bold italic">Kz</span>
            </h3>
            <p className="text-[12px] text-white/40 uppercase font-black tracking-widest bg-white/5 py-2 px-4 rounded-full inline-block border border-white/5">Exclui Impostos Locais / Alfândega</p>
          </div>

          <div className="w-full h-[1px] bg-white/10"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 w-full">
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Gasto no Cartão</span>
              <p className="font-mono text-lg font-bold text-white tracking-tight">{formatCurrency(results.totalDeviceExpense)} Kz</p>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Total Taxas BAI</span>
              <p className="font-mono text-lg font-bold text-white tracking-tight">{formatCurrency(results.totalDeviceExpense - results.baseKwanza)} Kz</p>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Frete em Kz</span>
              <p className="font-mono text-lg font-bold text-white tracking-tight">{formatCurrency(results.shippingKwanza)} Kz</p>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-orange-400">Alfândega (16%)</span>
                <p className="font-mono text-lg font-bold text-orange-200">{formatCurrency(state.customsTax)} Kz</p>
                <span className="text-[9px] bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full font-black uppercase tracking-tighter border border-orange-500/20">PAGAMENTO LOCAL</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10 text-[11px] font-black uppercase tracking-widest text-slate-400 shadow-xl">
              <i className="fas fa-info-circle text-blue-400"></i>
              Este resumo foca nos fundos necessários para a transação bancária internacional.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
