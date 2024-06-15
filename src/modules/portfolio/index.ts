import { tBankAPI } from "./api/tBankAPI.js";
import { IPosition } from "./types.js";

export class Portfolio {
  private _positions: Map<string, IPosition>;
  private _balance: number;

  constructor() {
    this._positions = new Map();
    this._balance = 0;
  }

  get balance(): number {
    return this._balance;
  }

  get positions() {
    return [...this._positions.values()];
  }

  getPositionByFigi = (figi: string) => {
    return this._positions.get(figi);
  };

  load = async () => {
    const response = await tBankAPI.loadPortfolio();

    const { positions, balance } = response;

    this._positions = new Map();
    this._balance = balance;

    positions.forEach((v) => {
      this._positions.set(v.figi, v);
    });
  };
}
