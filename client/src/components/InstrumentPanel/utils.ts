import { CandleInterval } from "tinkoff-invest-api/dist/generated/marketdata";
import { IRSIConfig } from "./inputs/RSIInput";
import { ISMAConfig } from "./inputs/SMAInput";

export interface StrategyConfig {
  figi: string;
  orderLots: number;
  brokerFee: number;
  interval: CandleInterval;
  sma?: ISMAConfig;
  rsi?: IRSIConfig;
}

interface IGetStrategyConfigProps {
  figi: string;
  rsi?: IRSIConfig;
  sma?: ISMAConfig;
}

export function getStrategyConfig({
  figi,
  rsi,
  sma,
}: IGetStrategyConfigProps): StrategyConfig {
  return {
    figi,
    orderLots: 1,
    brokerFee: 0.3,
    interval: CandleInterval.CANDLE_INTERVAL_1_MIN,
    sma,
    rsi,
  };
}

export function getIntersections<T>(arr1: T[], arr2: T[]) {
  const onlyInArr1 = arr1.filter((v) => !arr2.includes(v));
  const onlyInArr2 = arr2.filter((v) => !arr1.includes(v));
  const common = arr1.filter((v) => arr2.includes(v));

  return {
    onlyInArr1,
    onlyInArr2,
    common,
  };
}
