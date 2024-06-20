import { RunRobotBtn } from "./components/RunRobotBtn";
import { robotSettings } from "./components/RunRobotBtn/RobotSettingsStore";
import { observer } from "mobx-react";

export const MainButton = observer(() => {
  return <RunRobotBtn robotConfig={{ strategies: robotSettings.strategies }} />;
});
