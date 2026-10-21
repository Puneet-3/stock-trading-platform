const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
for (const [client, base] of [
  ["frontend", "/"],
  ["dashboard", "/dashboard/"],
]) {
  execFileSync(
    process.execPath,
    [
      path.join(root, client, "node_modules/vite/bin/vite.js"),
      "build",
      "--base",
      base,
    ],
    {
      cwd: path.join(root, client),
      stdio: "inherit",
      env: {
        ...process.env,
        VITE_API_URL: "/api",
        VITE_DASHBOARD_URL: "/dashboard/",
        VITE_SITE_URL: "",
      },
    },
  );
}
const output = path.join(root, "dist");
fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(path.join(root, "frontend/dist"), output, { recursive: true });
fs.cpSync(path.join(root, "dashboard/dist"), path.join(output, "dashboard"), {
  recursive: true,
});
