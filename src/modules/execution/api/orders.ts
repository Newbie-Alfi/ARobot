import { randomUUID } from "crypto";
import { Status, ClientError } from "nice-grpc";
import {
  OrderDirection,
  OrderExecutionReportStatus,
  OrderState,
  OrderType,
  PostOrderRequest,
} from "tinkoff-invest-api/dist/generated/orders.js";
import { T_BANK_ACCOUNT } from "../../../config.js";
// TODO: Сделать адаптер. А то слишком часто используется
import { Helpers } from "tinkoff-invest-api";
import { Logger } from "../../../types.js";
import { RobotConfig } from "../../../robot.js";

export type LimitOrderReq = Pick<
  PostOrderRequest,
  "figi" | "direction" | "quantity" | "price"
>;

/** Класс работы с заявками */
export class Orders {
  private _logger: Logger;
  private _config: RobotConfig;
  items: OrderState[];

  constructor(logger: Logger, config: RobotConfig) {
    this._logger = logger;
    this._config = config;
    this.items = [];
  }

  private get dryRunStr() {
    return this._config.dryRun ? "DRY_RUN " : "";
  }

  /**  Загружаем существующие заявки */
  async load() {
    const { orders } = await T_BANK_ACCOUNT.getOrders();
    this.items = orders;
    this.logItems();
  }

  /** Создаем новую лимит-заявку */
  async postLimitOrder({ figi, direction, quantity, price }: LimitOrderReq) {
    const order = this._config.dryRun
      ? null
      : await T_BANK_ACCOUNT.postOrder({
          figi,
          quantity,
          direction,
          price,
          orderType: OrderType.ORDER_TYPE_LIMIT,
          orderId: randomUUID(),
        });
    const action =
      direction === OrderDirection.ORDER_DIRECTION_BUY ? "покупку" : "продажу";
    const priceNum = Helpers.toNumber(price);
    this._logger.warn(
      `${this.dryRunStr}Создана заявка на ${action}: лотов ${quantity}, цена ${priceNum}`
    );
    return order;
  }

  /** Отменяем все существующие заявки для данного figi. */
  async cancelExistingOrders(figi: string) {
    const existingOrders = this.items.filter((order) => order.figi === figi);
    const tasks = existingOrders.map(async (order) => {
      const prevPrice = Helpers.toNumber(order.initialSecurityPrice);
      const { dryRun } = this._config;
      this._logger.warn(
        `${this.dryRunStr}Отмена предыдущей заявки ${order.orderId}, цена ${prevPrice}`
      );
      try {
        if (!dryRun) await T_BANK_ACCOUNT.cancelOrder(order.orderId);
      } catch (e) {
        if (e instanceof ClientError && e.code === Status.NOT_FOUND) {
          this._logger.warn(e.message);
        } else {
          throw e;
        }
      }
    });
    await Promise.all(tasks);
  }

  private logItems() {
    this._logger.log(`Заявки загружены: ${this.items.length}`);
    this.items.forEach((item) => {
      const s = [
        " ".repeat(4),
        formatOrderStatus(item.executionReportStatus),
        item.direction === OrderDirection.ORDER_DIRECTION_BUY
          ? "покупка"
          : "продажа",
        item.lotsRequested,
        Helpers.toMoneyString(item.initialOrderPrice),
        item.figi,
      ].join(" ");
      this._logger.log(s);
    });
  }
}

function formatOrderStatus(status: OrderExecutionReportStatus) {
  switch (status) {
    case OrderExecutionReportStatus.EXECUTION_REPORT_STATUS_NEW:
      return "Новая";
    case OrderExecutionReportStatus.EXECUTION_REPORT_STATUS_FILL:
      return "Исполнена";
    case OrderExecutionReportStatus.EXECUTION_REPORT_STATUS_PARTIALLYFILL:
      return "Частично исполнена";
    case OrderExecutionReportStatus.EXECUTION_REPORT_STATUS_REJECTED:
      return "Отклонена";
    case OrderExecutionReportStatus.EXECUTION_REPORT_STATUS_CANCELLED:
      return "Отменена пользователем";
    default:
      return `Неизвестный статус ${status}`;
  }
}
