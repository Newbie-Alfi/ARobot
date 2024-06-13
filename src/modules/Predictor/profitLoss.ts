/**
 * Сигнал profit-loss.
 * При сильном отклонении текущей цены от начальной происходит продажа актива (takeProfit / stopLoss)
 */
import { Signal, SignalParams, SignalResult } from "./base.js";

const DEFAULT_CONFIG = {
  /** При каком % превышении цены продаем актив, чтобы зафиксировать прибыль */
  takeProfit: 15,
  /** При каком % снижении цены продаем актив, чтобы не потерять еще больше */
  stopLoss: 5,
};

export type ProfitLossSignalConfig = typeof DEFAULT_CONFIG;

export class ProfitLossSignal extends Signal<ProfitLossSignalConfig> {
  constructor(config: ProfitLossSignalConfig) {
    const logger = { log: console.log };

    super(logger, Object.assign({}, DEFAULT_CONFIG, config));
  }

  get period() {
    return 1;
  }

  calc({ profit }: SignalParams): SignalResult {
    const { takeProfit, stopLoss } = this.config;

    if (profit >= takeProfit) {
      return "sell";
    }

    if (profit <= -stopLoss) {
      return "sell";
    }
  }
}
