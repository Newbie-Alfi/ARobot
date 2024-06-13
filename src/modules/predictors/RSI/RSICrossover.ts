// TODO: imports *.js this is ts files
import { crossover, crossunder, toSeries } from "../utils.js";
import { Signal, SignalParams, SignalResult } from "../base.js";
import { RSI } from "@debut/indicators";

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
  constructor(config: RsiCrossoverSignalConfig = DEFAULT_CONFIG) {
    const logger = { log: console.log };

    super(logger, config);
  }

  get period() {
    return this.config.period + 1;
  }

  calc({ candles, profit }: SignalParams): SignalResult {
    const { period, lowLevel, highLevel } = this.config;
    const closePrices = this.getPrices(candles, "close");

    const rsi = new RSI(period);

    // TODO: Может вернуть NaN. Может ожидать просто массив цен, а не свечу?
    const rsiValue = closePrices.map((price) => rsi.nextValue(price));

    const low = toSeries(lowLevel, period);
    const high = toSeries(highLevel, period);

    let result: "buy" | "sell" | undefined;

    if (crossunder(rsiValue, low)) result = "buy";
    if (crossover(rsiValue, high) && profit > 0) result = "sell";

    if (!result) return;

    this.logger.log(result);

    return result;
  }
}
