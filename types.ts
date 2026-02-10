
export interface CalculatorState {
  usdNeeded: number;
  exchangeRate: number;
  shippingUsd: number;
  shippingExchangeRate: number;
  customsTax: number;
  loadingFeePct: number;
  commissionPct: number;
  purchaseFeePct: number;
  conversionFeePct: number;
}

export interface CalculationResults {
  baseKwanza: number;
  loadingFee: number;
  loadingCommission: number;
  purchaseFee: number;
  purchaseCommission: number;
  conversionFee: number;
  totalVisaLoad: number;
  totalDeviceExpense: number;
  shippingKwanza: number;
  totalFinalCost: number;
}
