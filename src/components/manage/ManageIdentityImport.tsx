"use client";

import { useState } from "react";
import ManageBeaconEditor from "./ManageBeaconEditor";
import JsonFilePicker from "./JsonFilePicker";
import { importManageIdentity } from "@/lib/motb8/manage-import";
import type { VerifiedManageIdentity } from "@/lib/motb8/manage-import";

const MAX_FILE_BYTES = 1024 * 1024;

async function readJsonFile(file: File): Promise<unknown> {
  if (file.size === 0 || file.size > MAX_FILE_BYTES) {
    throw new Error("Identity file must be between 1 byte and 1 MB.");
  }

  try {
    return JSON.parse((await file.text()).replace(/^\uFEFF/, ""));
  } catch {
    throw new Error(`Invalid JSON file: ${file.name}`);
  }
}

export default function ManageIdentityImport() {
  const [genesisFile, setGenesisFile] = useState<File | null>(null);
  const [beaconFile, setBeaconFile] = useState<File | null>(null);
  const [controlFile, setControlFile] = useState<File | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [identity, setIdentity] = useState<VerifiedManageIdentity | null>(null);

  async function handleImport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busy || !genesisFile || !beaconFile || !controlFile) return;

    setBusy(true);
    setError(null);
    setIdentity(null);

    try {
      const [genesis, beacon, encryptedControl] = await Promise.all([
        readJsonFile(genesisFile),
        readJsonFile(beaconFile),
        readJsonFile(controlFile)
      ]);

      const verified = await importManageIdentity({
        genesis,
        beacon,
        controlFile: encryptedControl,
        passphrase
      });

      setIdentity(verified);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Identity import failed."
      );
    } finally {
      setPassphrase("");
      setBusy(false);
    }
  }

  return (
    <section className="mt-8 rounded-xl border border-[#dce4dc] p-6">
      <h3 className="text-xl font-semibold">Unlock your machine identity</h3>

      <p className="mt-3 text-sm text-[#5e6e64]">
        Select your Genesis, Beacon, and encrypted Control File.
        All verification and unlocking occur locally in your browser.
      </p>

      <form onSubmit={handleImport} className="mt-6 space-y-5">
        <JsonFilePicker
          label="Genesis Record"
          file={genesisFile}
          onChange={setGenesisFile}
          disabled={busy}
        />

        <JsonFilePicker
          label="Current signed Beacon"
          file={beaconFile}
          onChange={setBeaconFile}
          disabled={busy}
        />

        <JsonFilePicker
          label="Encrypted Control File"
          file={controlFile}
          onChange={setControlFile}
          disabled={busy}
        />

        <label className="block text-sm font-semibold">
          Control File passphrase
          <input type="password" autoComplete="off"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[#dce4dc] p-3"
            required />
        </label>

        <button type="submit" disabled={busy}
          className="button button-primary disabled:opacity-40">
          {busy ? "Verifying identity..." : "Verify and Unlock"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>
      )}

      {identity && (
        <div className="mt-6 rounded-lg bg-[#eaf1e9] p-5">
          <p className="font-semibold">Identity verified</p>
          <p className="mt-2">{identity.beacon.name}</p>
          <p className="mt-2 break-all font-mono text-xs">
            {identity.beacon.motb8Tag}
          </p>
          <p className="mt-2 text-sm">
            Current Beacon revision: {identity.beacon.revision}
          </p>
        </div>
      )}

      {identity && (
        <ManageBeaconEditor
          key={identity.beacon.motb8Tag + ":" + identity.beacon.revision}
          identity={identity}
        />
      )}
    </section>
  );
}
