import { Helpers } from "tinkoff-invest-api";
import { HistoricCandle } from "tinkoff-invest-api/dist/generated/marketdata.js";

export type SignalResult = "buy" | "sell" | void;

export interface SignalParams {
  candles: HistoricCandle[];
  profit: number;
}

interface Logger {
  log(...v: string[]): void;
}

export abstract class Signal<T> {
  charts: Record<string, [Date, number][]> = {};

  constructor(protected logger: Logger, protected config: T) {}

  abstract get period(): number;
  abstract calc(req: SignalParams): SignalResult;

  protected getPrices(
    candles: HistoricCandle[],
    type: "close" | "open" | "low" | "high"
  ): number[] {
    return candles.map((candle) => Helpers.toNumber(candle[type]!));
  }
}
