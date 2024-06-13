import { Signal, SignalParams, SignalResult } from "../base.js";
import { Logger } from "../types.js";

export interface ProfitLossSignalConfig {
  takeProfit: number;
  stopLoss: number;
}

const DEFAULT_CONFIG = {
  takeProfit: 1,
  stopLoss: 0.5,
};

export class ProfitLossSignal extends Signal<ProfitLossSignalConfig> {
  constructor(logger: Logger, config: ProfitLossSignalConfig = DEFAULT_CONFIG) {
    super(logger, config);
  }

  get period() {
    return 1;
  }

  calc({ profit }: SignalParams): SignalResult {
    const { takeProfit, stopLoss } = this.config;

    let result: "sell" | undefined;

    if (profit >= takeProfit) result = "sell";
    if (profit <= -stopLoss) result = "sell";

    this.logger.log({ timestamp: Date.now, direction: result });

    return result;
  }
}
