import { useState, useEffect, useMemo } from "react";
import { robotAPI } from "../RunRobotBtn/api";
import { RobotConfig } from "../RunRobotBtn/types";
import { Button, Typography } from "antd";

interface IRestartRobotBtnProps {
  robotConfig: RobotConfig;
  onRun?(v: { status: "on" | "off"; config: RobotConfig }): void;
}

function validateConfig(config: RobotConfig) {
  if (config.strategies.length === 0) {
    return { isValid: false, reason: "Необходимо создать хотя бы 1 стратегию" };
  }

  return { isValid: true };
}

export function RestartRobotBtn({ robotConfig, onRun }: IRestartRobotBtnProps) {
  const [status, setStatus] = useState<"on" | "off">();
  const [error, setError] = useState<string>();

  const handleClick = async () => {
    try {
      await robotAPI.stop();

      const response = await robotAPI.start(robotConfig);

      if (onRun) onRun({ status: response.data.status, config: robotConfig });

      setStatus(response.data.status);
    } catch (e) {
      setError("Не удалось запустить робота");
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
      <Button
        className="robot-btn robot-restart-btn"
        disabled={status === undefined || !isValid}
        onClick={handleClick}
        shape="circle"
      >
        <Typography.Title className="robot-btn__title">
          Перезапуск
        </Typography.Title>
      </Button>
      {reason}
    </>
  );
}
