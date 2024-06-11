import {
  MoneyValue,
  Quotation,
} from "tinkoff-invest-api/dist/generated/common";

type FIGI = string;

interface Position {
  figi: string;
  instrumentType: string;
  quantity?: Quotation;
  price: MoneyValue;
}

interface Settings {
  instruments: FIGI[];
  portfolioSize: number;
}

interface PortfolioConstruction {
  addPosition(position: Position): void;
  removePosition(figi: FIGI): void;
  getValueByFigi(figi: FIGI): void;
}

export class EqualWeigths implements PortfolioConstruction {
  private _positions: Map<FIGI, Position> = new Map();
  private _instruments: FIGI[];
  private _portfolioSize: number;

  constructor(settings: Settings) {
    this._positions = new Map();
    this._instruments = settings.instruments;
    this._portfolioSize = settings.portfolioSize;
  }

  addPosition(position: Position) {
    if (!this._instruments.includes(position.figi)) return;

    this._positions.set(position.figi, position);
  }

  removePosition(figi: FIGI) {
    this._positions.delete(figi);
  }

  getValueByFigi(figi: FIGI) {
    const position = this._positions.get(figi);

    if (!position || !position.quantity) return;

    // TODO: calc with nano
    const value = position.price.units * position.quantity.units;

    return value - this._portfolioSize / this._instruments.length;
  }

  setPortfolioSize(portfolioSize: number) {
    this._portfolioSize = portfolioSize;
  }
}
