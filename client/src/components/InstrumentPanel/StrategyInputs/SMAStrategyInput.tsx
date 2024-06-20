import { useMemo, useState } from "react";
import { InstrumentSelect } from "../select";
import { ISMAConfig, SMAInput } from "../inputs/SMAInput";

export interface ISMAStrategyConfig {
  instruments: string[];
  sma: ISMAConfig;
}

interface ISMAStrategyInputProps {
  value: ISMAStrategyConfig;
  onChange(v: ISMAStrategyConfig): void;
}

export const SMAStrategyInput = ({
  value,
  onChange,
}: ISMAStrategyInputProps) => {
  const [instruments, setInstruments] = useState<string[]>(value.instruments);
  const [sma, setSMA] = useState<ISMAConfig>(value.sma);

  useMemo(() => {
    if (!sma || !instruments) return;

    onChange({
      sma,
      instruments,
    });
  }, [sma, instruments]);

  return (
    <div>
      <div>
        <SMAInput value={sma} onChange={setSMA} />
      </div>
      <InstrumentSelect value={instruments} onChange={setInstruments} />
    </div>
  );
};