const express = require("express");
const mongoose = require("mongoose");
const { createApp } = require("../Backend/app");

const application = express();
let connection;

if (!process.env.MONGO_URL || !process.env.JWT_SECRET) {
  application.use((req, res) =>
    res
      .status(503)
      .json({ message: "Trading accounts are temporarily unavailable." }),
  );
} else {
  const origins = [
    process.env.CLIENT_ORIGINS,
    ...[
      process.env.VERCEL_URL,
      process.env.VERCEL_BRANCH_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
    ]
      .filter(Boolean)
      .map((host) => `https://${host}`),
  ]
    .filter(Boolean)
    .join(",");

  application.use(
    "/api",
    async (req, res, next) => {
      try {
        if (!connection) {
          connection = mongoose
            .connect(process.env.MONGO_URL, {
              maxPoolSize: 5,
              serverSelectionTimeoutMS: 8000,
            })
            .catch((error) => {
              connection = undefined;
              throw error;
            });
        }
        await connection;
        next();
      } catch (error) {
        console.error("Hosted database connection failed:", error.name);
        res.status(503).json({
          message:
            "Account services are temporarily unavailable. Please try again later.",
        });
      }
    },
    createApp({ origins, secure: true }),
  );
}

module.exports = application;
