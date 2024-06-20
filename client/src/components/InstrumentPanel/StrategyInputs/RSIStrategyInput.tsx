import { useMemo, useState } from "react";
import { InstrumentSelect } from "../select";
import { IRSIConfig, RSIInput } from "../inputs/RSIInput";

export interface IRSIStrategyConfig {
  instruments: string[];
  rsi: IRSIConfig;
}

interface IRSIStrategyInputProps {
  value: IRSIStrategyConfig;
  onChange(v: IRSIStrategyConfig): void;
}

export const RSIStrategyInput = ({
  value,
  onChange,
}: IRSIStrategyInputProps) => {
  const [instruments, setInstruments] = useState<string[]>(value.instruments);
  const [rsi, setRSI] = useState<IRSIConfig>(value.rsi);

  useMemo(() => {
    if (!rsi || !instruments) return;

    onChange({
      rsi,
      instruments,
    });
  }, [rsi, instruments]);

  return (
    <div>
      <div>
        <RSIInput value={rsi} onChange={setRSI} />
      </div>
      <InstrumentSelect value={instruments} onChange={setInstruments} />
    </div>
  );
};
