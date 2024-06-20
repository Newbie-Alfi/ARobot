import { useState, useEffect, useMemo } from "react";
import { RunButton } from "../RunBtn";
import { robotAPI } from "./api";
import { RobotConfig } from "./types";
import { Flex, Typography } from "antd";

interface IRunRobotBtnProps {
  robotConfig: RobotConfig;
  onRun?(v: { status: "on" | "off"; config: RobotConfig }): void;
}

function validateConfig(config: RobotConfig) {
  if (config.strategies.length === 0) {
    return { isValid: false, reason: "Необходимо создать хотя бы 1 стратегию" };
  }

  return { isValid: true };
}

export function RunRobotBtn({ robotConfig, onRun }: IRunRobotBtnProps) {
  const [status, setStatus] = useState<"on" | "off">();
  const [error, setError] = useState<string>();

  const handleRun = async () => {
    try {
      const response = await robotAPI.start(robotConfig);

      if (onRun) onRun({ status: response.data.status, config: robotConfig });

      setStatus(response.data.status);
    } catch (e) {
      setError("Не удалось запустить робота");
    }
  };

  const handleStop = async () => {
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
      setError("Не удалось получить статус работы робота");
    }
  };

  const { isValid, reason } = useMemo(() => {
    return validateConfig(robotConfig);
  }, [robotConfig]);

  useEffect(() => {
    fetchStatus();
  }, []);

  const isVisibleError = !!error || !!reason;

  return (
    <Flex vertical gap="large">
      {isVisibleError && (
        <Typography.Title type="danger" level={5}>
          {error || reason}
        </Typography.Title>
      )}
      <RunButton
        disabled={status === undefined || !isValid}
        isTurn={status === "on"}
        onRun={handleRun}
        onStop={handleStop}
      />
    </Flex>
  );
}
