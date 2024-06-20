import { Flex, InputNumber, Tooltip } from "antd";
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
    <Flex gap="small">
      <Tooltip title="Длина медленной скользящей">
        <InputNumber
          style={{ flex: 1 }}
          min={1}
          placeholder="Длина медленной скользящей"
          status={slowLength === null ? "error" : undefined}
          max={1000}
          value={slowLength}
          onChange={handleSlowLengthChange}
        />
      </Tooltip>

      <Tooltip title="Длина быстрой скользящей">
        <InputNumber
          style={{ flex: 1 }}
          min={1}
          placeholder="Длина быстрой скользящей"
          max={1000}
          status={fastLength === null ? "error" : undefined}
          value={fastLength}
          onChange={handleFastLenthChange}
        />
      </Tooltip>
    </Flex>
  );
}
