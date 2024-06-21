import express from "express";
import cors from "cors";
import { run, stop, status } from "./handlers.js";
import { HARDCODED_INSTRUMENTS } from "./constants.js";

const PORT = 7000;
const server = express();

const corsOptions = {
  // TODO:
  origin: "http://77.91.87.141:4173",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

server.use(cors(corsOptions));
server.use(express.json());

server.get("/", async (req, res) => {
  res.send("Hello trader!");
});

server.get("/instruments/", async (req, res) => {
  res.send(HARDCODED_INSTRUMENTS);
});

server.get("/robot/status/", async (req, res) => {
  res.send({ status: status });
});

server.post("/robot/run/", async (req, res) => {
  const config = req.body;
  const header = req.headers;

  const authorization = header.authorization + "";
  const token = authorization.split(" ")?.[1];

  console.log(
    token,
    header,
    token === process.env.TINKOFF_API_TOKEN,
    process.env.TINKOFF_API_TOKEN
  );

  if (token !== process.env.TINKOFF_API_TOKEN) {
    res.sendStatus(401);
  }

  await run(config);

  if (status !== "on") {
    res.sendStatus(400);
  }

  res.send({ status: status });
});

server.post("/robot/stop/", async (req, res) => {
  await stop();

  if (status !== "off") throw new Error(`Невалидный статус робота - ${status}`);

  res.send({ status: status });
});

server.listen(PORT, function () {
  console.log("server listening on port " + PORT);
});
