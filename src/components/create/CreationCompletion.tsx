"use client";

import { useState } from "react";

import type { IdentityArtifactPackage } from "@/lib/motb8/artifacts";
import { downloadMotb8Artifact } from "@/lib/motb8/download";

export interface CreationCompletionProps {
  tag: string;
  artifacts: IdentityArtifactPackage;
}

export default function CreationCompletion({
  tag,
  artifacts
}: CreationCompletionProps) {
  const [controlDownloadInitiated, setControlDownloadInitiated] =
    useState(false);

  const [backupAcknowledged, setBackupAcknowledged] =
    useState(false);

  const [downloadError, setDownloadError] =
    useState<string | null>(null);

  function downloadControlFile() {
    try {
      downloadMotb8Artifact(artifacts.private.controlFile);
      setControlDownloadInitiated(true);
      setDownloadError(null);
    } catch (error) {
      setDownloadError(
        error instanceof Error ? error.message : "Control File download failed"
      );
    }
  }

  function downloadPublicArtifacts() {
    try {
      downloadMotb8Artifact(artifacts.public.tag);
      downloadMotb8Artifact(artifacts.public.genesis);
      downloadMotb8Artifact(artifacts.public.beacon);
      setDownloadError(null);
    } catch (error) {
      setDownloadError(
        error instanceof Error ? error.message : "Public artifact download failed"
      );
    }
  }

  const completionReady =
    controlDownloadInitiated && backupAcknowledged;

  return (
    <section className="mt-8 rounded-2xl border border-[#dce4dc] bg-white p-6 sm:p-10">
      <h2 className="text-2xl font-bold">Secure your machine identity</h2>

      <p className="mt-4 text-sm leading-7 text-[#5e6e64]">
        Your MOTB-8 identity has been generated and cryptographically verified.
        Save your encrypted Control File before leaving this page.
      </p>

      <div className="mt-6 rounded-xl bg-[#f7f8f5] p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-[#40735a]">
          Permanent MOTB-8 Tag
        </p>
        <code className="mt-3 block break-all text-sm">{tag}</code>
      </div>

      <button
        type="button"
        onClick={downloadControlFile}
        className="button mt-6 rounded-lg bg-[#174b3a] px-5 py-3 font-semibold text-white"
      >
        Download Encrypted Control File
      </button>

      <div className="mt-6 rounded-xl border border-[#dce4dc] p-5">
        <h3 className="text-lg font-semibold">Public identity records</h3>

        <p className="mt-2 text-sm leading-6 text-[#5e6e64]">
          Download your permanent Tag, signed Genesis Record, and signed
          Beacon. These records are intended for public discoverability
          and do not contain your private controller key.
        </p>

        <button
          type="button"
          onClick={downloadPublicArtifacts}
          className="button mt-4 rounded-lg border border-[#174b3a] px-5 py-3 font-semibold text-[#174b3a]"
        >
          Download Public Identity Records
        </button>
      </div>

      {downloadError && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {downloadError}
        </p>
      )}

      <label className="mt-6 flex items-start gap-3">
        <input
          type="checkbox"
          checked={backupAcknowledged}
          onChange={(event) => setBackupAcknowledged(event.target.checked)}
          disabled={!controlDownloadInitiated}
          className="mt-1 h-5 w-5 accent-[#174b3a]"
        />
        <span className="text-sm leading-7">
          I confirm that I have located and saved my encrypted Control File,
          understand that the download itself does not guarantee a backup,
          and accept responsibility for securely retaining the file and its
          passphrase.
        </span>
      </label>

      {completionReady && (
        <div className="mt-8 rounded-xl bg-[#eaf1e9] p-6">
          <h3 className="text-2xl font-bold">Your Machine Is Marked</h3>
          <p className="mt-3 text-sm leading-7">
            Your permanent MOTB-8 identity has been created locally.
            Retain your encrypted Control File and passphrase securely.
            Public publication is a separate step. Cryptographic verification
            does not independently establish original ownership of the Tag.
          </p>
        </div>
      )}
    </section>
  );
}
