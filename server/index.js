const http = require("http");
const express = require("express");
const { Server: SocketServer } = require("socket.io");
const { spawn } = require("child_process");
const os = require("os");

const osShell = os.platform() === "win32" ? "powershell.exe" : "bash";

const shell = spawn(osShell, [], {
  // Start a persistent bash session
  cwd: process.env.INIT_CWD,
});
const app = express();
const server = http.createServer(app);
const io = new SocketServer({
  cors: "*",
});

io.attach(server);

shell.stdout.on("data", (data) => {
  io.emit("terminal:data", data.toString());
});

shell.stderr.on("data", (data) => {
  io.emit("terminal:data", data.toString());
});

shell.on("close", (code) => {
  console.log(`Shell process exited with code ${code}`);
});

server.listen(9000, () => {
  console.log("🐳 Docker Server is running on port 9000");
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("terminal:write", (data) => {
    shell.stdin.write(data);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});
