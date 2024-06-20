import "./App.css";
import { InstrumentPanel } from "./components/InstrumentPanel";
import { MainButton } from "./MainButton";

function App() {
  return (
    <>
      <div className="card">
        <MainButton />
      </div>

      <InstrumentPanel />
    </>
  );
}

export default App;
