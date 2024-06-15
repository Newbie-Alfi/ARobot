import { Helpers } from "tinkoff-invest-api";
import {
  PortfolioPosition,
  PortfolioResponse,
} from "tinkoff-invest-api/dist/generated/operations.js";
import { IPortfolio, IPosition } from "../types.js";
import { T_BANK_ACCOUNT } from "../../../config.js";

// Нужно получать список инструментов с ценой их преобретения. И текущий торговый   баланс
export class TBankPortfolioAPI {
  loadPortfolio = async (): Promise<IPortfolio> => {
    // TODO: ограничить количество запросов в минуту
    const response = await T_BANK_ACCOUNT.getPortfolio();

    console.log(response);

    return this._toPortfolio(response);
  };

  private _toPortfolio = (from: PortfolioResponse): IPortfolio => {
    const positions = from.positions.map((v) => this._toPosition(v));

    return {
      positions: positions,
      balance: this._getBalance(positions),
    };
  };

  // TODO: Рассматривать баланс иначе, никак наличие рублей в портфеле.
  private _getBalance = (positions: IPosition[]) => {
    const rubles = positions.find((v) => v.figi === "RUB000UTSTOM");

    if (rubles === undefined) return 0;

    return rubles.quantity * rubles.averagePositionPrice;
  };

  private _toPosition = (from: PortfolioPosition): IPosition => {
    const { figi, quantity, instrumentType } = from;

    // TODO: Когда averagePositionPrice может быть равно undefined?
    if (from.averagePositionPrice === undefined) {
      throw Error(
        `Невалидное значение поля averagePositionPrice - ${from.averagePositionPrice}`
      );
    }

    // TODO: Когда quantity может быть равно undefined?
    if (quantity === undefined) {
      throw Error(`Невалидное значение поля quantity - ${quantity}`);
    }

    const averagePositionPrice = Helpers.toNumber(from.averagePositionPrice);

    return {
      figi,
      instrumentType,
      averagePositionPrice,
      // TODO: У валют ещё есть nano
      quantity: quantity.units,
    };
  };
}

export const tBankAPI = new TBankPortfolioAPI();
