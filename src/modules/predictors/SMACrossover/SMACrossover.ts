/* eslint-disable max-statements */

// TODO: imports *.js this is ts files
import { crossover, crossunder } from "../utils.js";
import { Signal, SignalParams, SignalResult } from "../base.js";
import { SMA } from "@debut/indicators";

export interface SmaCrossoverSignalConfig {
  fastLength: number;
  slowLength: number;
}

const DEFAULT_CONFIG: SmaCrossoverSignalConfig = {
  fastLength: 7,
  slowLength: 21,
};

export class SmaCrossoverSignal extends Signal<SmaCrossoverSignalConfig> {
  constructor(config: SmaCrossoverSignalConfig = DEFAULT_CONFIG) {
    const logger = { log: console.log };

    super(logger, config);
  }

  get period() {
    return this.config.slowLength + 1;
  }

  calc({ candles, profit }: SignalParams): SignalResult {
    const closePrices = this.getPrices(candles, "close");
    const fastMa = sma(closePrices, this.config.fastLength);
    const slowMa = sma(closePrices, this.config.slowLength);

    let result: "buy" | "sell" | undefined;

    if (crossover(fastMa, slowMa)) result = "buy";
    if (crossunder(fastMa, slowMa) && profit > 0) result = "sell";

    if (!result) return;

    this.logger.log(result);

    return result;
  }
}

function sma(prices: number[], length: number) {
  const sma = new SMA(length);
  return prices.map((price) => sma.nextValue(price));
}
