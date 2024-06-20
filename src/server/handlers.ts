import { CandleInterval } from "tinkoff-invest-api/dist/generated/marketdata.js";
import "dotenv/config";
import { TinkoffInvestApi } from "tinkoff-invest-api";
import { config } from "../config.js";
import { Robot, RobotConfig } from "../robot.js";

const token = process.env.TINKOFF_API_TOKEN;
const appName = "alfi/tinkoff-robot";

if (!token) throw new Error(`Не указан токен.`);

export const api = new TinkoffInvestApi({
  token,
  appName,
});

export const backtestApi = new TinkoffInvestApi({
  token,
  appName,
  endpoint: "localhost:8080",
});

const cliFlags = {
  useRealAccount: process.argv.some((a) => a === "--real"),
  dryRun: process.argv.some((a) => a === "--dry-run"),
  cron: process.argv.some((a) => a === "--cron"),
};
const delay = intervalToMs(config.strategies[0].interval);

let interval: NodeJS.Timer | undefined = undefined;

// TODO: use computed
export let status = !!interval ? "on" : "off";

export function stop() {
  if (!interval) return;

  clearInterval(interval);
  interval = undefined;
  status = !!interval ? "on" : "off";

  console.log("Вызов робота завершён");
}

const finalConfig = { ...config, ...cliFlags, useRealAccount: true };

const robot = new Robot(api, finalConfig);

export async function run({ strategies }: RobotConfig) {
  stop();

  robot.setStrategies(strategies);

  if (cliFlags.cron) {
    await robot.runOnce();
    return;
  }

  robot.strategies;

  robot.runOnce();

  interval = setInterval(() => robot.runOnce(), delay);
  status = !!interval ? "on" : "off";

  // Предохраняемся
  setTimeout(() => {
    stop();
  }, 1800000);
}

function intervalToMs(interval: CandleInterval) {
  switch (interval) {
    case CandleInterval.CANDLE_INTERVAL_1_MIN:
      return 60 * 1000;
    case CandleInterval.CANDLE_INTERVAL_5_MIN:
      return 5 * 60 * 1000;
    case CandleInterval.CANDLE_INTERVAL_15_MIN:
      return 15 * 60 * 1000;
    case CandleInterval.CANDLE_INTERVAL_HOUR:
      return 60 * 60 * 1000;
    case CandleInterval.CANDLE_INTERVAL_DAY:
      return 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Invalid interval`);
  }
}
