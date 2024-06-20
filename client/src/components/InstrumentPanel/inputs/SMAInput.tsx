import { InputNumber } from "antd";
import { useMemo, useState } from "react";

export interface ISMAConfig {
  slowLength: number;
  fastLength: number;
}

interface ISMAInputProps {
  onChange(v: ISMAConfig): void;
  value: ISMAConfig;
}

export function SMAInput({ value, onChange }: ISMAInputProps) {
  const [slowLength, setSlowLength] = useState<null | number>(value.slowLength);
  const [fastLength, setFastLength] = useState<null | number>(value.fastLength);

  const handleSlowLengthChange = (v: number | null) => {
    setSlowLength(v);
  };

  const handleFastLenthChange = (v: number | null) => {
    setFastLength(v);
  };

  useMemo(() => {
    if (!slowLength || !fastLength) return;

    onChange({ slowLength, fastLength });
  }, [slowLength, fastLength]);

  return (
    <div>
      <InputNumber
        min={1}
        placeholder="Период медленной скользящей"
        status={slowLength === null ? "error" : undefined}
        max={1000}
        value={slowLength}
        onChange={handleSlowLengthChange}
      />
      <InputNumber
        min={1}
        placeholder="Период быстрой скользящей"
        max={1000}
        status={fastLength === null ? "error" : undefined}
        value={fastLength}
        onChange={handleFastLenthChange}
      />
    </div>
  );
}
