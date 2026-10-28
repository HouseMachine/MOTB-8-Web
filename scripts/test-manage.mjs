import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const directory = mkdtempSync(join(tmpdir(), "motb8-manage-"));

try {

  await build({
    entryPoints: [
      resolve("tests/motb8-manage-form.test.mts"),
      resolve("tests/motb8-manage-import.test.mts"),
      resolve("tests/motb8-manage-sign.test.mts"),
      resolve("tests/motb8-manage-changes.test.mts")
    ],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node24",
    outdir: directory,
    outbase: resolve("tests"),
    outExtension: { ".js": ".mjs" },
    tsconfig: resolve("tsconfig.json")
  });

  const result = spawnSync(
    process.execPath,
    ["--test",
      join(directory, "motb8-manage-form.test.mjs"),
      join(directory, "motb8-manage-import.test.mjs"),
      join(directory, "motb8-manage-sign.test.mjs"),
      join(directory, "motb8-manage-changes.test.mjs")
    ],
    { stdio: "inherit" }
  );

  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  rmSync(directory, { recursive: true, force: true });
}
