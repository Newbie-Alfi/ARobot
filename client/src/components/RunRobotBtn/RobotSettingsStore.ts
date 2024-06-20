import { makeAutoObservable } from "mobx";
import { getIntersections, getStrategyConfig } from "../InstrumentPanel/utils";
import { IRSIStrategyConfig } from "../InstrumentPanel/StrategyInputs/RSIStrategyInput";
import { ISMAStrategyConfig } from "../InstrumentPanel/StrategyInputs/SMAStrategyInput";

const DEFAULT_SMA = {
  instruments: [],
  sma: {
    slowLength: 14,
    fastLength: 21,
  },
};

const DEFAULT_RSI = {
  instruments: [],
  rsi: {
    period: 14,
    highLevel: 70,
    lowLevel: 30,
  },
};

class RobotSettings {
  private _sma: ISMAStrategyConfig;
  private _rsi: IRSIStrategyConfig;

  constructor({ rsi = DEFAULT_RSI, sma = DEFAULT_SMA }) {
    this._sma = sma;
    this._rsi = rsi;

    makeAutoObservable(this);
  }

  get sma() {
    return this._sma;
  }

  get rsi() {
    return this._rsi;
  }

  get strategies() {
    return this._buildStrategies({ rsiValue: this.rsi, smaValue: this._sma });
  }

  setRSI = (rsi: IRSIStrategyConfig) => {
    this._rsi = rsi;
  };

  setSMA = (sma: ISMAStrategyConfig) => {
    this._sma = sma;
  };

  private _buildStrategies = ({
    rsiValue,
    smaValue,
  }: {
    rsiValue: IRSIStrategyConfig;
    smaValue: ISMAStrategyConfig;
  }) => {
    const intersections = getIntersections(
      smaValue.instruments,
      rsiValue.instruments
    );

    const result = [
      ...intersections.onlyInArr1.map((figi) =>
        getStrategyConfig({ figi, sma: smaValue.sma })
      ),
      ...intersections.onlyInArr2.map((figi) =>
        getStrategyConfig({ figi, rsi: rsiValue.rsi })
      ),
      ...intersections.common.map((figi) =>
        getStrategyConfig({ figi, rsi: rsiValue.rsi, sma: smaValue.sma })
      ),
    ];

    return result;
  };
}

// TODO: Дать возможность создавать несколько инстенсев
export const robotSettings = new RobotSettings({});
