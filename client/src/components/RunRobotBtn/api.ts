import axios from "axios";
import { BACKEND_URL } from "../../config";
import { RobotConfig } from "./types";

interface IRobotResponse {
  status: "on" | "off";
}

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (!token) return config;

  config.headers["Authorization"] = `Bearer ${token}`;

  return config;
});

function initRobotAPI() {
  async function start(config: RobotConfig) {
    return await api.post<IRobotResponse>(BACKEND_URL + "/robot/run/", config);
  }

  async function stop() {
    return await api.post<IRobotResponse>(BACKEND_URL + "/robot/stop/");
  }

  async function getStatus() {
    return await api.get<IRobotResponse>(BACKEND_URL + "/robot/status/");
  }

  async function getConfig() {
    return await api.get<IRobotResponse>(BACKEND_URL + "/robot/config/");
  }

  return { getStatus, getConfig, stop, start };
}

export const robotAPI = initRobotAPI();
