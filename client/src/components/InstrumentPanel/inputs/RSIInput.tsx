import { InputNumber } from "antd";
import { useMemo, useState } from "react";

export interface IRSIConfig {
  period: number;
  highLevel: number;
  lowLevel: number;
}

interface IRSIInputProps {
  onChange(v: IRSIConfig): void;
  value: IRSIConfig;
}

export function RSIInput({ value, onChange }: IRSIInputProps) {
  const [period, setPeriod] = useState<null | number>(value.period);
  const [highLevel, setHighLevel] = useState<null | number>(value.highLevel);
  const [lowLevel, setLowLevel] = useState<null | number>(value.lowLevel);

  const handlePeriodChange = (v: number | null) => {
    setPeriod(v);
  };

  const handleHighLevelChange = (v: number | null) => {
    setHighLevel(v);
  };

  const handleLowLevelChange = (v: number | null) => {
    setLowLevel(v);
  };

  useMemo(() => {
    if (!period || !highLevel || !lowLevel) return;

    onChange({ period, highLevel, lowLevel });
  }, [period, highLevel, lowLevel]);

  return (
    <div>
      <InputNumber
        min={1}
        placeholder="Период"
        status={period === null ? "error" : undefined}
        max={1000}
        value={period}
        onChange={handlePeriodChange}
      />
      <InputNumber
        min={50}
        placeholder="Уровень перекупленности"
        max={100}
        status={highLevel === null ? "error" : undefined}
        value={highLevel}
        onChange={handleHighLevelChange}
      />
      <InputNumber
        min={0}
        placeholder="Уровень перепродонасти"
        max={50}
        status={lowLevel === null ? "error" : undefined}
        value={lowLevel}
        onChange={handleLowLevelChange}
      />
    </div>
  );
}
