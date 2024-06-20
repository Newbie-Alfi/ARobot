import { Button, Typography } from "antd";
import "./style.css";

interface IRunBtnProps {
  disabled: boolean;
  isTurn: boolean;
  onRun(): void;
  onStop(): void;
}

export const RunButton = ({
  isTurn,
  onRun,
  onStop,
  disabled = true,
}: IRunBtnProps) => {
  return isTurn ? (
    <Button
      disabled={disabled}
      onClick={onStop}
      type="primary"
      shape="round"
      className="robot-btn robot-stop-btn"
    >
      <Typography.Title className="robot-btn__title">
        Остановить
      </Typography.Title>
    </Button>
  ) : (
    <Button
      className="robot-btn robot-run-btn"
      disabled={disabled}
      onClick={onRun}
      type="primary"
      shape="circle"
    >
      <Typography.Title className="robot-btn__title">Запуск</Typography.Title>
    </Button>
  );
};
