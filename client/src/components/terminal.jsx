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
      rows: 12,
      cols: 300,
    });
    term.open(terminalRef.current);

    term.onData((data) => {
      console.log("sending to server", data);
      socket.emit("terminal:write", data);
    });

    socket.emit("terminal:write", "\n");

    socket.on("terminal:data", (data) => {
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
    });
    // return () => {
    //   socket.off("terminal:data");
    // };
  }, []);

  return <div ref={terminalRef} id="terminal" />;
};

export default Terminal;
