import { crossover, crossunder, toSeries } from "../utils.js";
import { Signal, SignalParams, SignalResult } from "../base.js";
import { RSI } from "@debut/indicators";
import { Logger } from "../../../types.js";

export interface RsiCrossoverSignalConfig {
  period: number;
  highLevel: number;
  lowLevel: number;
}

const DEFAULT_CONFIG: RsiCrossoverSignalConfig = {
  period: 14,
  highLevel: 70,
  lowLevel: 30,
};

export class RsiCrossoverSignal extends Signal<RsiCrossoverSignalConfig> {
  constructor(
    logger: Logger,
    config: RsiCrossoverSignalConfig = DEFAULT_CONFIG
  ) {
    super(logger, config);
  }

  get period() {
    return this.config.period + 1;
  }

  calc({ candles, profit }: SignalParams): SignalResult {
    const { period, lowLevel, highLevel } = this.config;
    const closePrices = this.getPrices(candles, "close");

    const rsi = new RSI(period);
    const rsiValue = closePrices.map((price) => rsi.nextValue(price));

    const low = toSeries(lowLevel, period);
    const high = toSeries(highLevel, period);

    let direction: "buy" | "sell" | undefined;

    if (crossunder(rsiValue, low)) direction = "buy";
    if (crossover(rsiValue, high) && profit > 0) direction = "sell";

    if (!direction) return { direction: undefined, expectedIncome: undefined };

    this.logger.log({
      timestamp: Date.now(),
      direction: direction,
      rsiValue,
      prices: closePrices,
    });

    return { direction, expectedIncome: undefined };
  }
}
