import { Helpers, TinkoffAccount, TinkoffInvestApi } from "tinkoff-invest-api";
import {
  PortfolioResponse,
  PositionsResponse,
} from "tinkoff-invest-api/dist/generated/operations.js";

export class Portfolio {
  private portfolio?: PortfolioResponse;
  private positionsWithBlocked?: PositionsResponse;

  constructor(private account: TinkoffAccount, private api: TinkoffInvestApi) {}

  private get positions() {
    return this.portfolio?.positions || [];
  }

  /**
   * Загружаем текущие позиции в портфеле.
   */
  async load() {
    this.portfolio = await this.account.getPortfolio();
    this.logPositions();
  }

  /**
   * Загружаем текущие позиции в портфеле с учетом заблокированных активов.
   */
  async loadPositionsWithBlocked() {
    this.positionsWithBlocked = await this.account.getPositions();
  }

  getBuyPrice(figi: string) {
    const position = this.positions.find((p) => p.figi === figi);
    return Helpers.toNumber(position?.averagePositionPrice) || 0;
  }

  getBalance() {
    const item = this.positionsWithBlocked?.money.find(
      (item) => item.currency === "rub"
    );
    return Helpers.toNumber(item) || 0;
  }

  getAvailableQty(figi: string) {
    const item = this.positionsWithBlocked?.securities.find(
      (item) => item.figi === figi
    );
    return item?.balance || 0;
  }

  private logPositions() {
    console.log(`Позиции загружены: ${this.positions.length}`);
    this.positions.forEach((p) => {
      const expectedYield = this.api.helpers.toNumber(p.expectedYield) || 0;
      const s = [
        " ".repeat(4),
        p.figi,
        `${this.api.helpers.toNumber(p.quantity)}`,
        p.averagePositionPrice &&
          `x ${this.api.helpers.toNumber(p.averagePositionPrice)}`,
        p.expectedYield && `(${expectedYield > 0 ? "+" : ""}${expectedYield})`,
      ]
        .filter(Boolean)
        .join(" ");
      console.log(s);
    });
  }
}
