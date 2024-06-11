import {
  MoneyValue,
  Quotation,
} from "tinkoff-invest-api/dist/generated/common";

interface Position {
  figi: string;
  instrumentType: string;
  quantity?: Quotation;
  price: MoneyValue;
}

export class Portfolio {
  private _positions: Map<string, Position>;

  constructor() {
    this._positions = new Map();
  }

  get positions() {
    return this._positions;
  }

  addPosition(position: Position) {
    this._positions.set(position.figi, position);
  }

  removePosition(figi: string) {
    this._positions.delete(figi);
  }

  getPositionByFigi(figi: string) {
    return this._positions.get(figi);
  }
}
