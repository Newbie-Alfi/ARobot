import { Helpers } from "tinkoff-invest-api";
import { HistoricCandle } from "tinkoff-invest-api/dist/generated/marketdata.js";
import { Logger } from "../../types.js";

export type SignalResult = {
  direction: "buy" | "sell" | undefined;
  expectedIncome: undefined | number;
};

export interface SignalParams {
  candles: HistoricCandle[];
  profit: number;
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
