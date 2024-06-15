import { Signal, SignalParams, SignalResult } from "../base.js";
import { Logger } from "../../../types.js";

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

    let direction: "sell" | undefined;

    if (profit >= takeProfit) direction = "sell";
    if (profit <= -stopLoss) direction = "sell";

    if (!direction) return { direction: undefined, expectedIncome: undefined };

    this.logger.log({ timestamp: Date.now, direction: direction });

    return { direction, expectedIncome: takeProfit };
  }
}
