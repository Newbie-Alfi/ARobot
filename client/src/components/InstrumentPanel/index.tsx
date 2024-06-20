import { SMAStrategyInput } from "./StrategyInputs/SMAStrategyInput";
import { RSIStrategyInput } from "./StrategyInputs/RSIStrategyInput";
import { RunRobotBtn } from "../RunRobotBtn";
import { observer } from "mobx-react-lite";
import { robotSettings } from "../RunRobotBtn/RobotSettingsStore";

interface IRunBtnProps {}

export const InstrumentPanel = observer(({}: IRunBtnProps) => {
  return (
    <>
      <RSIStrategyInput
        value={robotSettings.rsi}
        onChange={robotSettings.setRSI}
      />
      <SMAStrategyInput
        value={robotSettings.sma}
        onChange={robotSettings.setSMA}
      />
    </>
  );
});
