import { Helpers } from "tinkoff-invest-api";
import { Instrument } from "./figi.js";
import { Logger as ILogger } from "../../../types";
import { LimitOrderReq, Orders } from "./orders.js";
import { OrderDirection } from "tinkoff-invest-api/dist/generated/orders";
import { RobotConfig } from "../../../robot";
import { IExection } from "../types.js";

export class TBankExecution implements IExection {
  // TODO: change logger
  private _logger: Required<ILogger>;
  // TODO: change type of _config
  private _config: { brokerFee: number; cacheDir: string };
  orders: Orders;
  currentProfit = 0;

  constructor(config: { brokerFee: number; cacheDir: string } & RobotConfig) {
    this._logger = console;
    this._config = config;
    this.orders = new Orders(this._logger, config);
  }

  async buy(figi: string, price: number, quantity: number) {
    const instrument = new Instrument(figi, this._config);
    await instrument.loadInfo();

    if (!instrument.isTradingAvailable()) return;

    if (quantity < instrument.getLotSize()) {
      this._logger.warn("Лотность больше чем выделенные количество денег");

      return;
    }

    const validatedPrice = Helpers.toQuotation(price);
    const orderReq: LimitOrderReq = {
      figi,
      direction: OrderDirection.ORDER_DIRECTION_BUY,
      quantity,
      price: validatedPrice,
    };

    await this.orders.postLimitOrder(orderReq);
  }

  async sell(figi: string, price: number, quantity: number) {
    const instrument = new Instrument(figi, this._config);
    await instrument.loadInfo();

    if (!instrument.isTradingAvailable()) return;

    const validatedPrice = Helpers.toQuotation(price);

    const orderReq: LimitOrderReq = {
      figi,
      direction: OrderDirection.ORDER_DIRECTION_SELL,
      quantity,
      price: validatedPrice,
    };

    await this.orders.postLimitOrder(orderReq);
  }
}
