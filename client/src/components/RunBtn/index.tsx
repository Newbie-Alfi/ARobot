import { Button } from "antd";

interface IRunBtnProps {
  disabled: boolean;
  isTurn: boolean;
  onRun(): void;
  onStop(): void;
}

const style = {
  height: 200,
  width: 200,
};

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
      style={style}
    >
      Остановить
    </Button>
  ) : (
    <Button
      disabled={disabled}
      onClick={onRun}
      type="primary"
      shape="circle"
      style={style}
    >
      Запуск
    </Button>
  );
};
