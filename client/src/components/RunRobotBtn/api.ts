import axios from "axios";
import { BACKEND_URL } from "../../config";
import { RobotConfig } from "./types";

interface IRobotResponse {
  status: "on" | "off";
}

function initRobotAPI() {
  async function start(config: RobotConfig) {
    return await axios.post<IRobotResponse>(
      BACKEND_URL + "/robot/run/",
      config
    );
  }

  async function stop() {
    return await axios.post<IRobotResponse>(BACKEND_URL + "/robot/stop/");
  }

  async function getStatus() {
    return await axios.get<IRobotResponse>(BACKEND_URL + "/robot/status/");
  }

  async function getConfig() {
    return await axios.get<IRobotResponse>(BACKEND_URL + "/robot/config/");
  }

  return { getStatus, getConfig, stop, start };
}

export const robotAPI = initRobotAPI();
