import { crossover, crossunder } from "../utils.js";
import { Signal, SignalParams, SignalResult } from "../base.js";
import { SMA } from "@debut/indicators";
import { Logger } from "../../../types.js";

export interface SMACrossoverSignalConfig {
  fastLength: number;
  slowLength: number;
}

const DEFAULT_CONFIG: SMACrossoverSignalConfig = {
  fastLength: 7,
  slowLength: 21,
};

export class SMACrossoverSignal extends Signal<SMACrossoverSignalConfig> {
  constructor(
    logger: Logger,
    config: SMACrossoverSignalConfig = DEFAULT_CONFIG
  ) {
    super(logger, config);
  }

  get period() {
    return this.config.slowLength + 1;
  }

  calc({ candles, profit }: SignalParams): SignalResult {
    const closePrices = this.getPrices(candles, "close");
    const fastMa = sma(closePrices, this.config.fastLength);
    const slowMa = sma(closePrices, this.config.slowLength);

    let direction: "buy" | "sell" | undefined;

    if (crossover(fastMa, slowMa)) direction = "buy";
    // TODO: Убрать profit
    if (crossunder(fastMa, slowMa) && profit > 0) direction = "sell";

    if (!direction) return { direction: undefined, expectedIncome: undefined };

    this.logger.log({
      timestamp: Date.now(),
      direction: direction,
      fastMa,
      slowMa,
      prices: closePrices,
    });

    return { direction, expectedIncome: undefined };
  }
}

function sma(prices: number[], length: number) {
  const sma = new SMA(length);
  return prices.map((price) => sma.nextValue(price));
}
