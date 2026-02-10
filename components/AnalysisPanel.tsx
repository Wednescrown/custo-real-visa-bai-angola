
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CalculatorState, CalculationResults } from '../types';

interface AnalysisPanelProps {
  state: CalculatorState;
  results: CalculationResults;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ state, results }) => {
  // Data for cost distribution chart
  const data = useMemo(() => [
    { name: 'Taxas Bancárias', value: results.loadingFee + results.loadingCommission + results.purchaseFee + results.purchaseCommission + results.conversionFee, color: '#3b82f6' },
    { name: 'Custo Base (USD)', value: results.baseKwanza, color: '#22c55e' },
    { name: 'Alfândega (16%)', value: state.customsTax, color: '#f59e0b' },
    { name: 'Frete', value: results.shippingKwanza, color: '#ef4444' },
  ], [results, state]);

  const cardStyle = "bg-black/40 backdrop-blur-xl rounded-3xl shadow-sm border border-white/10 p-8";

  return (
    <div className="space-y-8 sticky top-28">
      {/* Cost Distribution Chart */}
      <div className={cardStyle}>
        <h3 className="text-md font-bold text-white mb-6 flex items-center gap-3">
          <i className="fas fa-chart-pie text-blue-400"></i>
          Distribuição de Custos
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => new Intl.NumberFormat('pt-AO').format(value) + ' Kz'}
              />
              <Legend 
                verticalAlign="bottom" 
                height={60} 
                iconType="rect" 
                iconSize={12} 
                wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Operation Indicators */}
      <div className="bg-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-white/5">
        <i className="fas fa-university absolute -right-6 -bottom-6 text-9xl opacity-5"></i>
        <h3 className="text-lg font-bold mb-4 z-10 relative">Indicadores da Operação</h3>
        <div className="space-y-4 z-10 relative">
          <div className="flex justify-between items-center opacity-80 text-xs font-bold uppercase tracking-wider">
            <span className="text-slate-400">Custo Real VISA BAI por $1:</span>
            <span className="font-mono text-sm text-white">{(results.totalDeviceExpense / state.usdNeeded).toFixed(2)} Kz</span>
          </div>
          <div className="flex justify-between items-center opacity-80 text-xs font-bold uppercase tracking-wider">
            <span className="text-slate-400">Eficiência do Frete:</span>
            <span className="font-mono text-sm text-white">{((results.shippingKwanza / results.totalFinalCost) * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center opacity-80 text-xs font-bold uppercase tracking-wider pt-2 border-t border-white/5">
            <span className="text-slate-400 text-[10px]">WEDNESCROWN SALES ANALYTICS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
