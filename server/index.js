const http = require("http");
const express = require("express");
const { Server: SocketServer } = require("socket.io");
const { spawn } = require("child_process");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const cors = require("cors");
const chokidar = require("chokidar");

const osShell = os.platform() === "win32" ? "powershell.exe" : "bash";

const shell = spawn(osShell, [], {
  // Start a persistent bash session
  cwd: `${process.env.INIT_CWD}/user`,
});
const app = express();
const server = http.createServer(app);
const io = new SocketServer({
  cors: "*",
});

app.use(cors());

app.use(express.json());

io.attach(server);

chokidar.watch(`${process.env.INIT_CWD}/user`).on("all", (event, path) => {
  io.emit("file:refresh", path);
});

shell.stdout.on("data", (data) => {
  console.log("emitting from server", data.toString());
  io.emit("terminal:data", data.toString());
});

shell.stderr.on("data", (data) => {
  console.log("error from server", data.toString());
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
    console.log("received from client", data);
    shell.stdin.write(data);
  });

  socket.on("file:change", async ({ path, content }) => {
    console.log("received from client", path, content);
    await fs.writeFile(`./user${path}`, content);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

app.get("/files", async (req, res) => {
  const fileTree = await generateFileTree(`${process.env.INIT_CWD}/user`);
  res.json({ tree: fileTree });
});

app.get("/files/content", async (req, res) => {
  const { path } = req.query;
  const content = await fs.readFile(`./user${path}`, "utf-8");
  res.json({ content });
});

async function generateFileTree(directory) {
  const tree = {};

  async function buildTree(currentDir, currentTree) {
    const files = await fs.readdir(currentDir);
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        currentTree[file] = {};
        await buildTree(filePath, currentTree[file]);
      } else {
        currentTree[file] = null;
      }
    }
  }
  await buildTree(directory, tree);
  return tree;
}
