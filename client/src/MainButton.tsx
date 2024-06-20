import { useState } from "react";
import { RunRobotBtn } from "./components/RunRobotBtn";
import { robotSettings } from "./components/RunRobotBtn/RobotSettingsStore";
import { observer } from "mobx-react";
import { RobotConfig } from "./components/RunRobotBtn/types";
import { RestartRobotBtn } from "./components/RestartRobotBtn";

export const MainButton = observer(() => {
  const [currentSettings, setCurrentSettings] = useState<{
    status: "on" | "off";
    config: RobotConfig;
  }>();

  if (
    currentSettings?.status === "on" &&
    currentSettings?.config.strategies !== robotSettings.strategies
  ) {
    return (
      <RestartRobotBtn
        robotConfig={{ strategies: robotSettings.strategies }}
        onRun={setCurrentSettings}
      />
    );
  }

  return (
    <RunRobotBtn
      robotConfig={{ strategies: robotSettings.strategies }}
      onRun={setCurrentSettings}
    />
  );
});
