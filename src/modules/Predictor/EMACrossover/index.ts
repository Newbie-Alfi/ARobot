/* eslint-disable max-statements */

// TODO: imports *.js this is ts files
import { crossover, crossunder } from "../utils.js";
import { Signal, SignalParams, SignalResult } from "../base.js";
import { EMA } from "@debut/indicators";
import { Logger } from "../types.js";

export interface EMACrossoverSignalConfig {
  fastLength: number;
  slowLength: number;
}

const DEFAULT_CONFIG: EMACrossoverSignalConfig = {
  fastLength: 7,
  slowLength: 21,
};

export class EMACrossoverSignal extends Signal<EMACrossoverSignalConfig> {
  constructor(
    logger: Logger,
    config: EMACrossoverSignalConfig = DEFAULT_CONFIG
  ) {
    super(logger, config);
  }

  get period() {
    return this.config.slowLength + 1;
  }

  calc({ candles, profit }: SignalParams): SignalResult {
    const closePrices = this.getPrices(candles, "close");
    const fastMa = ema(closePrices, this.config.fastLength);
    const slowMa = ema(closePrices, this.config.slowLength);

    let result: "buy" | "sell" | undefined;

    if (crossover(fastMa, slowMa)) result = "buy";
    // TODO: Убрать profit
    if (crossunder(fastMa, slowMa) && profit > 0) result = "sell";

    if (!result) return;

    this.logger.log({
      timestamp: Date.now(),
      direction: result,
      fastMa,
      slowMa,
      prices: closePrices,
    });

    return result;
  }
}

function ema(prices: number[], length: number) {
  const ema = new EMA(length);
  return prices.map((price) => ema.nextValue(price));
}
