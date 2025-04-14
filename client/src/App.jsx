import { useEffect, useState } from "react";
import "./App.css";
import Terminal from "./components/terminal";
import "@xterm/xterm/css/xterm.css";
import Tree from "./components/sidebar/tree";
import axios from "axios";
import socket from "./socket";

function App() {
  const [fileTree, setFileTree] = useState({});
  const getFileTree = async () => {
    const response = await axios.get("http://localhost:9000/files");
    console.log(response.data);
    setFileTree(response.data.tree);
  };

  useEffect(() => {
    getFileTree();
  }, []);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);

    return () => {
      socket.off("file:refresh", getFileTree);
    };
  }, []);

  return (
    <div className="h-screen w-screen flex flex-row">
      <div className="min-w-fit max-w-max bg-[#28282B] text-white border-r-2 rounded-r-sm border-gray-400">
        <Tree tree={fileTree} />
      </div>
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
