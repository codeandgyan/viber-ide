import "./App.css";
import Terminal from "./components/terminal";
import "@xterm/xterm/css/xterm.css";

function App() {
  return (
    <div className="h-screen w-screen flex flex-row">
      <div>Side Panel</div>
      <div className="flex-1 flex flex-col">
        <div id="editor-container" className="flex-1"></div>
        <div id="terminal-container" className="py-4">
          <Terminal />
        </div>
      </div>
    </div>
  );
}

export default App;
