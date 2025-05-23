import { Terminal as XTerminal } from "@xterm/xterm";
import { useRef } from "react";
import { useEffect } from "react";
import socket from "../socket";

const Terminal = () => {
  const terminalRef = useRef();
  const isRendered = useRef(false);
  const terminalData = useRef("");

  useEffect(() => {
    if (isRendered.current) return;
    isRendered.current = true;

    const term = new XTerminal({
      rows: 18,
      cols: 143,
      cursorBlink: true,
      theme: {
        background: "#10100e",
        foreground: "#d1d5db",
        cursor: "#d1d5db",
        selection: "#374151",
        black: "#1f201b",
        red: "#ef4444",
        
      }
    });
    term.open(terminalRef.current);

    term.onData((data) => {
      console.log("sending to server", data);
      socket.emit("terminal:write", data);
    });

    socket.emit("terminal:write", "\n");

    function onTerminalData(data) {
      console.log("receiving from server", data);
      if (data === "\x7F") {
        if (
          terminalData.current.lastIndexOf("> ") ===
          terminalData.current.length - 2
        ) {
          term.clear();
          return;
        }
        terminalData.current = terminalData.current.slice(0, -1);
        term.write("\b \b");
        return;
      }
      terminalData.current = terminalData.current + data;
      if (data === "\r") {
        const current = terminalData.current;
        terminalData.current = "";
        term.write(current + "\x1b[2K\r");
      }
      term.write(data);
    }

    socket.on("terminal:data", onTerminalData);

    // return () => {
    //   socket.off("terminal:data", onTerminalData);
    // };
  }, []);

  return <div ref={terminalRef} id="terminal" />;
};

export default Terminal;
