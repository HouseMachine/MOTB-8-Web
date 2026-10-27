import { mkdtempSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { buildSync } from "esbuild";

const directory = mkdtempSync(resolve(".motb8-generation-"));
const output = join(directory, "generation-test.mjs");

try {
  buildSync({
    entryPoints: ["tests/motb8-generate-identity.test.mts"],
    outfile: output,
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node24",
    tsconfig: "tsconfig.json",
    external: ["motb-8/browser"]
  });

  const result = spawnSync(
    process.execPath,
    ["--test", output],
    {
      cwd: resolve("."),
      stdio: "inherit"
    }
  );

  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  rmSync(directory, { recursive: true, force: true });
}
