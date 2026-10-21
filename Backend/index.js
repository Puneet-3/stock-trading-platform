const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const { createApp } = require("./app");

async function start() {
  if (!process.env.MONGO_URL)
    throw new Error("Set MONGO_URL in the root .env file.");
  const app = createApp();
  await mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 10000,
  });
  const server = app.listen(process.env.PORT || 3002, () => {
    console.log(`Paper trading API listening on port ${server.address().port}`);
  });
  function shutdown() {
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  }
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

start().catch((error) => {
  console.error("Unable to start API:", error.message);
  process.exitCode = 1;
});
