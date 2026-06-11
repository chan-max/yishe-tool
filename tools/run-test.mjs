import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const token = readFileSync(join(__dirname, ".test-token"), "utf-8").trim();
process.env.AGENT_TEST_TOKEN = token;
process.env.AGENT_TEST_URL = "http://localhost:1520";

await import("./agent-test.mjs");
