/**
 * Запуск робота на рыночных данных.
 *
 * В песочнице (по умолчанию):
 * npx ts-node-esm scripts/run-market.ts
 *
 * На реальном счете (без создания заявок):
 * npx ts-node-esm scripts/run-market.ts --real --dry-run
 *
 * На реальном счете (с созданием заявок):
 * npx ts-node-esm scripts/run-market.ts --real
 *
 * Для разового запуска по расписанию можно указать флаг cron:
 * npx ts-node-esm scripts/run-market.ts --real --dry-run --cron
 */

import path from "path";
import express from "express";
import { Robot } from "../src/robot.js";
import { config } from "../src/config.js";
import { CandleInterval } from "tinkoff-invest-api/dist/generated/marketdata.js";
import "dotenv/config";
import { TinkoffInvestApi } from "tinkoff-invest-api";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

function stop() {
  if (!interval) return;

  clearInterval(interval);
  interval = undefined;
}

async function run() {
  const finalConfig = { ...config, ...cliFlags };

  finalConfig.useRealAccount = true;

  const robot = new Robot(api, finalConfig);

  if (cliFlags.cron) {
    await robot.runOnce();
    return;
  }

  interval = setInterval(robot.runOnce, delay);

  // Предохраняемся
  setTimeout(() => {
    stop();
  }, 1800000 * 2);
}

const server = express();

server.get("", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const port = 7000;

server.listen(port, function () {
  console.log("server listening on port " + port);
});

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
