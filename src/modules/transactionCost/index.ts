import { TransactionCostResponse, BROKER } from "./types.js";

class TransactionCosts {
  calc(current: number, incomePercentage: number): TransactionCostResponse {
    // TODO:
    const brokerFees = [{ broker: BROKER.T_BANK, fee: 0.03 }];
    const bestFee = brokerFees[0];

    if (incomePercentage <= bestFee.fee) {
      throw new Error(
        `Минимальная коммисия больше ожидаемой прибыли. Размер коммисии = ${bestFee.fee}`
      );
    }

    const result: TransactionCostResponse = {
      broker: bestFee.broker,
      breakEvenPoint: current + current * bestFee.fee,
    };

    return result;
  }
}
