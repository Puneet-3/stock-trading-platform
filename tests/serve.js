const path = require("node:path");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { createApp } = require("../Backend/app");

async function start() {
  const database = await MongoMemoryServer.create();
  await mongoose.connect(database.getUri());
  const servers = [];
  const api = createApp({
    secret: "browser-test-secret-with-at-least-thirty-two-characters",
  });
  servers.push(api.listen(3002, "127.0.0.1"));
  for (const [directory, port] of [
    ["frontend", 3000],
    ["dashboard", 3001],
  ]) {
    const app = express();
    const build = path.resolve(__dirname, "..", directory, "dist");
    app.use(express.static(build));
    app.get(/.*/, (req, res) => res.sendFile(path.join(build, "index.html")));
    servers.push(app.listen(port, "127.0.0.1"));
  }
  async function stop() {
    await Promise.all(
      servers.map((server) => new Promise((resolve) => server.close(resolve))),
    );
    await mongoose.disconnect();
    await database.stop();
    process.exit(0);
  }
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
}

start().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
