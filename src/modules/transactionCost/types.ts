export interface TransactionCostRequest {
  figi: string;
  purchasePrice: number;
  exprectedPrice?: number;
}

export enum BROKER {
  T_BANK = "T_BANK",
}

/** В случае, если издержки больше чем ожидаемый доход, то выбрасывается ошибка */
export interface TransactionCostResponse {
  breakEvenPoint: number;
  broker: BROKER;
}
