import { ITransactionCostResponse, BROKER, IBrokerInfo } from "./types.js";

export class TransactionCosts {
  private _brokerFees: IBrokerInfo[] = [{ broker: BROKER.T_BANK, fee: 0.03 }];

  calc(
    moneyAmount: number,
    incomePercentage: number
  ): ITransactionCostResponse {
    const bestBroker = this._brokerFees[0];

    if (incomePercentage <= bestBroker.fee) {
      const message = `Минимальная коммисия больше ожидаемой прибыли. Размер коммисии = ${bestBroker.fee}`;

      throw new Error(message);
    }

    const result: ITransactionCostResponse = {
      broker: bestBroker.broker,
      breakEvenPoint: moneyAmount + moneyAmount * bestBroker.fee,
    };

    return result;
  }
}
