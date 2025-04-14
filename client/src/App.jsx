import { useEffect, useState } from "react";
import "./App.css";
import Terminal from "./components/terminal";
import "@xterm/xterm/css/xterm.css";
import Tree from "./components/sidebar/tree";
import axios from "axios";
import socket from "./socket";
import EditorPanel from "./components/editorpanel";

function App() {
  const [fileTree, setFileTree] = useState({});
  const [selectedFile, setSelectedFile] = useState("");

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
      <div className="hidden md:block md:min-w-24 lg:min-w-60 bg-[#1f201b] text-white border-r-2 rounded-r-sm border-gray-400">
        <Tree tree={fileTree} onSelect={(path) => setSelectedFile(path)} />
      </div>
      <div className="flex flex-col">
        <div id="editor-container" className="flex-1 min-h-max">
          <EditorPanel selectedFile={selectedFile} />
        </div>
        <div id="terminal-container" className="border-2 border-gray-400">
          <Terminal />
        </div>
      </div>
    </div>
  );
}

export default App;
