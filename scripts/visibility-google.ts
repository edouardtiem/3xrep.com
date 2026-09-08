import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatGoogleVisibilityMarkdown,
  notConnectedMessage,
  pullGoogleVisibility,
  readGoogleVisibilityConfig,
} from "../src/lib/visibility-google";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const cfg = readGoogleVisibilityConfig();
  if (!cfg.ok) {
    process.stderr.write(`${notConnectedMessage(cfg.missing)}\n`);
    process.exitCode = 2;
    return;
  }

  const pull = await pullGoogleVisibility(cfg.config);
  const md = formatGoogleVisibilityMarkdown(pull);
  const day = pull.window.current.end;
  const dir = join(root, "docs/visibility/exports");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${day}.md`);
  writeFileSync(file, `${md}\n`, "utf8");
  process.stdout.write(`${md}\n\nécrit ${file}\n`);

  if (pull.gsc.error || pull.ga4.error) {
    process.exitCode = 1;
  }
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : "visibility-google";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
