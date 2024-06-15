export interface ITransactionCostRequest {
  figi: string;
  purchasePrice: number;
  exprectedPrice?: number;
}

export enum BROKER {
  T_BANK = "T_BANK",
}

export interface IBrokerInfo {
  broker: BROKER;
  fee: number;
}

/** В случае, если издержки больше чем ожидаемый доход, то выбрасывается ошибка */
export interface ITransactionCostResponse {
  breakEvenPoint: number;
  broker: BROKER;
}
