import {
  InvalidBalanceError,
  InvalidTransactionValueError,
} from "../errors.js";
import { IRiskModule } from "../types.js";

export class StrictRestriction implements IRiskModule {
  private _balance?: number;

  constructor(private _maxSize: number = 0.03) {
    if (_maxSize >= 1 || _maxSize <= 0) {
      throw new InvalidTransactionValueError(_maxSize);
    }
  }

  calc() {
    if (this._balance === undefined) {
      throw new InvalidBalanceError(this._balance);
    }

    const limit = this._balance * this._maxSize;

    return limit;
  }

  setBalance = (balance: number) => {
    this._balance = balance;
  };
}
