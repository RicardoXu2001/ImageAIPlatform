import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const rootEnvPath = resolve(process.cwd(), "../../.env");
const packagePrismaBin =
  process.platform === "win32"
    ? resolve(process.cwd(), "node_modules/.bin/prisma.cmd")
    : resolve(process.cwd(), "node_modules/.bin/prisma");
const rootPrismaBin =
  process.platform === "win32"
    ? resolve(process.cwd(), "../../node_modules/.bin/prisma.cmd")
    : resolve(process.cwd(), "../../node_modules/.bin/prisma");

if (existsSync(rootEnvPath)) {
  const envText = readFileSync(rootEnvPath, "utf8");

  for (const line of envText.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmed.indexOf("=");

    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    const rawValue = trimmed.slice(equalsIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

const prismaCommand = existsSync(packagePrismaBin)
  ? packagePrismaBin
  : existsSync(rootPrismaBin)
    ? rootPrismaBin
    : "prisma";

const child = spawn(prismaCommand, process.argv.slice(2), {
  stdio: "inherit",
  shell: true,
  env: process.env
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
