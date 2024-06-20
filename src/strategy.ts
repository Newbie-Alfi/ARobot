/**
 * Стратегия торговли.
 * Используются 3 сигнала:
 * - при сильном отклонении текущей цены от начальной происходит продажа актива (takeProfit / stopLoss)
 * - пересечение скользящих средних
 * - пересечение RSI заданных уровней
 *
 * Особенности:
 * - все заявки выставляются только лимитные
 * - если актив уже куплен, то повторной покупки не происходит
 */

/* eslint-disable max-statements */

import { CandleInterval } from "tinkoff-invest-api/dist/generated/marketdata.js";
import { RobotModule } from "./utils/robot-module.js";
import { LimitOrderReq } from "./account/orders.js";
import { Robot } from "./robot.js";
import {
  ProfitLossSignal,
  ProfitLossSignalConfig,
} from "./modules/predictors/profitLoss.js";
import {
  SmaCrossoverSignal,
  SmaCrossoverSignalConfig,
} from "./modules/predictors/SMACrossover.ts/SMACrossover.js";
import { FigiInstrument } from "./figi.js";
import { OrderDirection } from "tinkoff-invest-api/dist/generated/orders.js";
import {
  RsiCrossoverSignal,
  RsiCrossoverSignalConfig,
} from "./modules/predictors/RSI/RSICrossover.js";
import { Logger } from "@vitalets/logger";
import { SignalResult } from "./modules/predictors/base.js";

export interface StrategyConfig {
  /** ID инструмента */
  figi: string;
  /** Кол-во лотов в заявке на покупку */
  orderLots: number;
  /** Комиссия брокера, % от суммы сделки */
  brokerFee: number;
  /** Интервал свечей */
  interval: CandleInterval;
  /** Конфиг сигнала по отклонению текущей цены */
  profit?: ProfitLossSignalConfig;
  /** Конфиг сигнала по скользящим средним */
  sma?: SmaCrossoverSignalConfig;
  /** Конфиг сигнала по RSI */
  rsi?: RsiCrossoverSignalConfig;
}

export class Strategy extends RobotModule {
  instrument: FigiInstrument;
  currentProfit = 0;

  // используемые сигналы
  profitSignal?: ProfitLossSignal;
  smaSignal?: SmaCrossoverSignal;
  rsiSignal?: RsiCrossoverSignal;

  constructor(robot: Robot, public config: StrategyConfig) {
    super(robot);
    this.logger = new Logger({
      prefix: `[strategy_${config.figi}]:`,
      level: robot.logger.level,
    });
    this.instrument = new FigiInstrument(robot, this.config.figi);
    if (config.profit) this.profitSignal = new ProfitLossSignal(config.profit);
    if (config.sma) this.smaSignal = new SmaCrossoverSignal(config.sma);
    if (config.rsi) this.rsiSignal = new RsiCrossoverSignal(config.rsi);
  }

  /**
   * Входная точка: запуск стратегии.
   */
  async run() {
    await this.instrument.loadInfo();
    if (!this.instrument.isTradingAvailable()) return;
    await this.loadCandles();
    this.calcCurrentProfit();
    const signal = this.calcSignal();
    if (signal) {
      await this.robot.orders.cancelExistingOrders(this.config.figi);
      await this.robot.portfolio.loadPositionsWithBlocked();
      if (signal === "buy") await this.buy();
      if (signal === "sell") await this.sell();
    }
  }

  /**
   * Загрузка свечей.
   */
  protected async loadCandles() {
    await this.instrument.loadCandles({
      interval: this.config.interval,
      minCount: this.calcRequiredCandlesCount(),
    });
  }

  /**
   * Расчет сигнала к покупке или продаже.
   * todo: здесь может быть более сложная логика комбинации нескольких сигналов.
   */
  protected calcSignal() {
    const signalParams = {
      candles: this.instrument.candles,
      profit: this.currentProfit,
    };

    // @ts-ignore
    let signals: Record<"sma" | "rsi" | "profit", SignalResult> = {
      profit: this.profitSignal?.calc(signalParams),
    };

    if (this.rsiSignal) {
      signals["rsi"] = this.rsiSignal.calc(signalParams);
    }

    if (this.smaSignal) {
      signals["sma"] = this.smaSignal?.calc(signalParams);
    }

    this.logSignals(signals);
    // todo: здесь может быть более сложная логика комбинации сигналов.
    return signals.profit || signals?.rsi || signals?.sma;
  }

  /**
   * Покупка.
   */
  protected async buy() {
    const availableLots = this.calcAvailableLots();

    // TODO: Логика контроля содержания в портфеле смешана с определением покупать или не покупать. Необходимо как-то разграничить это
    if (availableLots > 0) {
      this.logger.warn(
        `Позиция уже в портфеле, лотов ${availableLots}. Ждем сигнала к продаже...`
      );
      return;
    }

    const currentPrice = this.instrument.getCurrentPrice();
    const orderReq: LimitOrderReq = {
      figi: this.config.figi,
      direction: OrderDirection.ORDER_DIRECTION_BUY,
      // TODO: количество лотов захордокожено, а должен проводиться анализ портфеля и там уже решаться сколько бумаг должно докупаться.
      quantity: this.config.orderLots,
      price: this.api.helpers.toQuotation(this.instrument.getCurrentPrice()),
    };

    if (this.checkEnoughCurrency(orderReq)) {
      // TODO: сложно отслеживать логи предсказания, логи фильтрации из-за риска и логи исполнения
      this.logger.warn(`Покупаем по цене ${currentPrice}.`);
      await this.robot.orders.postLimitOrder(orderReq);
    }
  }

  /**
   * Продажа.
   */
  protected async sell() {
    const availableLots = this.calcAvailableLots();
    if (availableLots === 0) {
      this.logger.warn(`Позиции в портфеле нет. Ждем сигнала к покупке...`);
      return;
    }

    const currentPrice = this.instrument.getCurrentPrice();
    const orderReq: LimitOrderReq = {
      figi: this.config.figi,
      direction: OrderDirection.ORDER_DIRECTION_SELL,
      // TODO: количество лотов захордокожено, а должен проводиться анализ портфеля и там уже решаться сколько бумаг должно докупаться.
      quantity: availableLots, // продаем все, что есть
      price: this.api.helpers.toQuotation(currentPrice),
    };

    this.logger.warn(
      [
        `Продаем по цене ${currentPrice}.`,
        `Расчетная маржа: ${
          this.currentProfit > 0 ? "+" : ""
        }${this.currentProfit.toFixed(2)}%`,
      ].join(" ")
    );

    await this.robot.orders.postLimitOrder(orderReq);
  }

  /**
   * Кол-во лотов в портфеле.
   */
  protected calcAvailableLots() {
    const availableQty = this.robot.portfolio.getAvailableQty(this.config.figi);
    const lotSize = this.instrument.getLotSize();
    return Math.round(availableQty / lotSize);
  }

  /**
   * Достаточно ли денег для заявки на покупку.
   */
  protected checkEnoughCurrency(orderReq: LimitOrderReq) {
    const price = this.api.helpers.toNumber(orderReq.price!);
    const orderPrice = price * orderReq.quantity * this.instrument.getLotSize();
    const orderPriceWithComission =
      orderPrice * (1 + this.config.brokerFee / 100);
    const balance = this.robot.portfolio.getBalance();
    if (orderPriceWithComission > balance) {
      this.logger.warn(
        `Недостаточно средств для покупки: ${orderPriceWithComission} > ${balance}`
      );
      return false;
    }
    return true;
  }

  /**
   * Расчет профита в % за продажу 1 шт инструмента по текущей цене (с учетом комиссий).
   * Вычисляется относительно цены покупки, которая берется из portfolio.
   */
  protected calcCurrentProfit() {
    const buyPrice = this.robot.portfolio.getBuyPrice(this.config.figi);
    if (!buyPrice) {
      this.currentProfit = 0;
      return;
    }
    const currentPrice = this.instrument.getCurrentPrice();
    const comission = ((buyPrice + currentPrice) * this.config.brokerFee) / 100;
    const profit = currentPrice - buyPrice - comission;
    this.currentProfit = (100 * profit) / buyPrice;
  }

  /**
   * Расчет необходимого кол-ва свечей, чтобы хватило всем сигналам.
   */
  protected calcRequiredCandlesCount() {
    const minCounts = [
      this.profitSignal?.period || 0,
      this.smaSignal?.period || 0,
      this.rsiSignal?.period || 0,
    ];
    return Math.max(...minCounts);
  }

  protected logSignals(signals: Record<string, unknown>) {
    const time =
      this.instrument.candles[
        this.instrument.candles.length - 1
      ].time?.toLocaleString();
    this.logger.warn(
      `Сигналы: ${Object.keys(signals)
        .map((k) => `${k}=${signals[k] || "wait"}`)
        .join(", ")} (${time})`
    );
  }
}
