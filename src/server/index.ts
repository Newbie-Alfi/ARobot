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

const isValidReq = (authorization: string) => {
  const token = authorization.split(" ")?.[1];

  return token === process.env.TINKOFF_API_TOKEN;
};

server.post("/robot/run/", async (req, res) => {
  const config = req.body;
  const header = req.headers;

  if (!isValidReq(header.authorization + "")) {
    return res.send({ status: status });
    // return res.sendStatus(401).send("Неавторизованный пользователь");
  }

  await run(config);

  if (status !== "on") {
    return res.send({ status: status });
    // return res.sendStatus(400).send(`Невалидный статус робота - ${status}`);
  }

  return res.send({ status: status });
});

server.post("/robot/stop/", async (req, res) => {
  const header = req.headers;

  if (!isValidReq(header.authorization + "")) {
    return res.send({ status: status });
    // return res.sendStatus(401).send("Неавторизованный пользователь");
  }

  await stop();

  if (status !== "off") return res.send({ status: status });

  res.send({ status: status });
});

server.listen(PORT, function () {
  console.log("server listening on port " + PORT);
});
