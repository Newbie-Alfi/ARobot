import { IEqualWeigthsSettings } from "./types.js";
import { FIGI, IPortfolioConstruction, IPosition } from "../types.js";
import { DEFAULT_CONFIG } from "./config.js";
import { InvalidBalance } from "../errors.js";

export class EqualWeigths implements IPortfolioConstruction {
  private _positions: Map<FIGI, IPosition> = new Map();
  private _instruments: FIGI[];
  private _balance?: number;

  constructor(config: IEqualWeigthsSettings = DEFAULT_CONFIG) {
    this._positions = new Map();
    this._instruments = config.instruments;
  }

  private get _positionsCost(): number {
    let value = 0;

    for (let p of this._positions.values()) {
      value += p.totalAmount;
    }

    return value;
  }

  addPosition(position: IPosition) {
    if (!this._instruments.includes(position.figi)) return;

    this._positions.set(position.figi, position);
  }

  removePosition(figi: FIGI) {
    this._positions.delete(figi);
  }

  setPositions(positions: IPosition[]) {
    this._positions = new Map();

    positions.forEach((v) => this.addPosition(v));
  }

  getMaxDealAmountByFigi(figi: FIGI): number {
    if (this._balance === undefined) {
      throw new InvalidBalance(this.constructor.name, this._balance);
    }

    const totalAmount = this._balance + this._positionsCost;
    const maxDealAmount = totalAmount / this._instruments.length;
    const position = this._positions.get(figi);

    if (!position) return maxDealAmount;

    return maxDealAmount - position.totalAmount;
  }

  setBalance(balance: number) {
    this._balance = balance;
  }
}
