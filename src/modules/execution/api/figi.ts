import { Logger } from "@vitalets/logger";
import { SecurityTradingStatus } from "tinkoff-invest-api/dist/generated/common.js";
import {
  Instrument as TBankInstrument,
  InstrumentIdType,
} from "tinkoff-invest-api/dist/generated/instruments.js";
import { HistoricCandle } from "tinkoff-invest-api/dist/generated/marketdata.js";
import { CandlesReqParams } from "tinkoff-invest-api/src/candles-loader/req";
import { T_BANK_API } from "../../../config.js";
import { CandlesLoader, Helpers } from "tinkoff-invest-api";

// TODO: Убрать логер с сделать функции чище?
/** Класс работы с конкретным инструментом по figi. */
export class Instrument {
  logger: Logger;
  candlesLoader: CandlesLoader;
  candles: HistoricCandle[] = [];
  info?: TBankInstrument;

  constructor(public figi: string, private config: { cacheDir: string }) {
    this.candlesLoader = new CandlesLoader(T_BANK_API, {
      cacheDir: this.config.cacheDir,
    });
    this.logger = new Logger({
      prefix: `[instrument_${figi}]:`,
      level: "info",
    });
  }

  async loadInfo() {
    const { instrument } = await T_BANK_API.instruments.getInstrumentBy({
      idType: InstrumentIdType.INSTRUMENT_ID_TYPE_FIGI,
      classCode: "",
      id: this.figi,
    });
    this.info = instrument;
  }

  isTradingAvailable() {
    const status = this.info?.tradingStatus;
    const isAvailable =
      status === SecurityTradingStatus.SECURITY_TRADING_STATUS_NORMAL_TRADING;
    if (!isAvailable) this.logger.log(`Торги недоступны: ${status}`);
    return isAvailable;
  }

  async loadCandles(req: Pick<CandlesReqParams, "interval" | "minCount">) {
    this.logger.log(
      `Загружаю ${req.minCount} свечей для ${this.info?.ticker} ...`
    );
    const { candles } = await this.candlesLoader.getCandles({
      figi: this.figi,
      ...req,
    });
    this.candles = candles;
    this.logger.log(
      `Свечи загружены: ${
        candles.length
      }, текущая цена: ${this.getCurrentPrice()}`
    );
  }

  /*** Текущая цена за 1 шт. */
  getCurrentPrice() {
    const close = this.candles[this.candles.length - 1]?.close;
    return Helpers.toNumber(close) || 0;
  }

  /** Лотность. */
  getLotSize() {
    return this.info?.lot || 0;
  }
}
