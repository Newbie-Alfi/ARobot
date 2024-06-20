import { useState } from "react";
import { InstrumentSelect } from "../select";

interface IBaseStrategyInput {
  children: React.ReactNode;
}

export const BaseStrategyInput = ({ children }: IBaseStrategyInput) => {
  const [instruments, setInstruments] = useState<string[]>([]);

  return (
    <div>
      <div>{children}</div>
      <InstrumentSelect value={instruments} onChange={setInstruments} />
    </div>
  );
};
