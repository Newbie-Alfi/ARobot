import { Divider, Flex } from "antd";
import "./App.css";
import { InstrumentPanel } from "./components/InstrumentPanel";
import { MainButton } from "./MainButton";

function App() {
  return (
    <>
      <div style={{ height: "100vh", width: "100%" }}>
        <Flex style={{ height: "80vh" }} align="center" justify="center">
          <MainButton />
        </Flex>

        <InstrumentPanel />
      </div>
    </>
  );
}

export default App;
