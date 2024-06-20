import { SMAStrategyInput } from "./StrategyInputs/SMAStrategyInput";
import { RSIStrategyInput } from "./StrategyInputs/RSIStrategyInput";
import { observer } from "mobx-react-lite";
import { robotSettings } from "../RunRobotBtn/RobotSettingsStore";
import { Flex } from "antd";
import "./styles.css";

interface IRunBtnProps {}

export const InstrumentPanel = observer(({}: IRunBtnProps) => {
  return (
    <Flex wrap gap="large" className="instument-panel">
      <RSIStrategyInput
        value={robotSettings.rsi}
        onChange={robotSettings.setRSI}
      />
      <SMAStrategyInput
        value={robotSettings.sma}
        onChange={robotSettings.setSMA}
      />
    </Flex>
  );
});
