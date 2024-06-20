import { useState, useEffect, useMemo } from "react";
import { RunButton } from "../RunBtn";
import { robotAPI } from "./api";
import { RobotConfig } from "./types";

interface IRunRobotBtnProps {
  robotConfig: RobotConfig;
}

function validateConfig(config: RobotConfig) {
  if (config.strategies.length === 0) {
    return { isValid: false, reason: "Необходимо создать хотя бы 1 стратегию" };
  }

  return { isValid: true };
}

export function RunRobotBtn({ robotConfig }: IRunRobotBtnProps) {
  const [status, setStatus] = useState<"on" | "off">();
  const [error, setError] = useState<string>();

  const run = async () => {
    try {
      const response = await robotAPI.start(robotConfig);

      setStatus(response.data.status);
    } catch (e) {
      setError("Не удалось запустить робота");
    }
  };

  const stop = async () => {
    try {
      const response = await robotAPI.stop();

      setStatus(response.data.status);
    } catch (e) {
      setError("Не удалось остановить робота");
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await robotAPI.getStatus();

      setStatus(response.data.status);
    } catch (e) {
      setError("Не удалось получить статус роботы робота");
    }
  };

  const { isValid, reason } = useMemo(() => {
    return validateConfig(robotConfig);
  }, [robotConfig]);

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <>
      <RunButton
        disabled={status === undefined || !isValid}
        isTurn={status === "on"}
        onRun={run}
        onStop={stop}
      />
      {reason}
    </>
  );
}
