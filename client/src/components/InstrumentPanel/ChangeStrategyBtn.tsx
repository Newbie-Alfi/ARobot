import { Button } from "antd";

interface StrategyRequest {
  figi: string[];
  
}

interface SmaCrossoverSignalConfig {
  fastLength: number;
  slowLength: number;
}

interface RsiCrossoverSignalConfig {
  period: number;
  highLevel: number;
  lowLevel: number;
}

interface StrategyResponse {
  figi: string;
  orderLots: number;
  brokerFee: number;
  interval: 2;
  sma?: SmaCrossoverSignalConfig;
  rsi?: RsiCrossoverSignalConfig;
}

interface IRunBtnProps {
  value: StrategyRequest;
  disabled: boolean;
}

function validate(from: StrategyRequest): StrategyResponse[] {
  return [];
}

export const ChangeStrategyBtn = ({ value, disabled }: IRunBtnProps) => {
  const handleClick = async () => {
    const data = validate(value);

    await stop();
    await run();
  };

  return (
    <Button disabled={disabled} onClick={handleClick} type="primary">
      Перезапуск
    </Button>
  );
};
