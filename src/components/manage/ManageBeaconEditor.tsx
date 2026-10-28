"use client";

import { useRef, useState } from "react";
import OptionalBeaconFields from "@/components/beacon/OptionalBeaconFields";
import type { BeaconFormData } from "@/components/beacon/types";
import type { AttachmentDraftState } from "@/components/beacon/attachment-draft";
import { validateBeaconForm } from "@/components/beacon/validation";
import { prepareManageChanges } from "@/lib/motb8/manage-changes";
import { signManageRevision } from "@/lib/motb8/manage-sign";
import type { SignedManageRevision } from "@/lib/motb8/manage-sign";
import { downloadMotb8Artifact } from "@/lib/motb8/download";
import { normalizeBeaconRegistration } from "@/components/beacon/normalize";
import { registrationFingerprint } from "@/lib/motb8/fingerprint";
import type { VerifiedManageIdentity } from "@/lib/motb8/manage-import";

interface ManageBeaconEditorProps {
  identity: VerifiedManageIdentity;
}

export default function ManageBeaconEditor({
  identity
}: ManageBeaconEditorProps) {
  const [formData, setFormData] = useState<BeaconFormData>(
    () => structuredClone(identity.formData)
  );

  const [attachmentDrafts, setAttachmentDrafts] =
    useState<AttachmentDraftState[]>(() =>
      identity.formData.attachments.map((_, index) => ({
        id: `imported-attachment-${index}`,
        valid: true
      }))
    );

  const validation = validateBeaconForm(formData, attachmentDrafts);
  const changes = prepareManageChanges(identity.beacon, formData);
  const changeCount = Object.keys(changes).length;

  const currentFingerprint = registrationFingerprint(
    normalizeBeaconRegistration(formData)
  );

  const [reviewFingerprint, setReviewFingerprint] =
    useState<string | null>(null);

  const signingBusyRef = useRef(false);
  const [signingPassphrase, setSigningPassphrase] = useState("");
  const [signingBusy, setSigningBusy] = useState(false);
  const [signingError, setSigningError] = useState<string | null>(null);
  const [signedRevision, setSignedRevision] =
    useState<SignedManageRevision | null>(null);

  const reviewCurrent =
    reviewFingerprint !== null &&
    reviewFingerprint === currentFingerprint &&
    validation.valid &&
    changeCount > 0;


  async function handleSignRevision() {
    if (signingBusyRef.current || signedRevision !== null) return;

    if (!reviewCurrent || !validation.valid || changeCount === 0) {
      setSigningError("Review the current Beacon changes before signing.");
      return;
    }

    if (!signingPassphrase) {
      setSigningError("Enter your Control File passphrase.");
      return;
    }

    signingBusyRef.current = true;
    setSigningBusy(true);
    setSigningError(null);

    try {
      const result = await signManageRevision(
        identity,
        changes,
        signingPassphrase
      );

      setSignedRevision(result);
      setReviewFingerprint(null);
    } catch (error) {
      setSigningError(
        error instanceof Error
          ? error.message
          : "Beacon revision signing failed."
      );
    } finally {
      setSigningPassphrase("");
      signingBusyRef.current = false;
      setSigningBusy(false);
    }
  }

  return (
    <section className="mt-8 rounded-xl border border-[#dce4dc] bg-white p-6">
      <h3 className="text-xl font-bold">Update your Beacon</h3>
      <p className="mt-3 text-sm text-[#5e6e64]">
        Edit your public machine information. Your permanent Tag,
        Genesis Record, and controller remain unchanged.
      </p>

      <fieldset
        disabled={signingBusy || signedRevision !== null}
        className="min-w-0 disabled:opacity-70 disabled:[&_input]:bg-[#f1f3f0] disabled:[&_input]:text-[#829087] disabled:[&_textarea]:bg-[#f1f3f0] disabled:[&_textarea]:text-[#829087] disabled:[&_select]:bg-[#f1f3f0] disabled:[&_select]:text-[#829087] disabled:[&_input]:cursor-not-allowed disabled:[&_textarea]:cursor-not-allowed disabled:[&_select]:cursor-not-allowed"
      >
      <div className="mt-6 space-y-5">
        <label className="block font-semibold">
          Machine name
          <input
            type="text"
            maxLength={150}
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="mt-2 w-full rounded-lg border border-[#dce4dc] p-3"
          />
        </label>

        <label className="block font-semibold">
          Description
          <textarea
            rows={4}
            minLength={20}
            maxLength={500}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="mt-2 w-full rounded-lg border border-[#dce4dc] p-3"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block font-semibold">
            Presence scope
            <select
              value={formData.presenceScope}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  presenceScope: e.target.value as BeaconFormData["presenceScope"]
                })
              }
              className="mt-2 w-full rounded-lg border border-[#dce4dc] p-3"
            >
              <option value="single">Single</option>
              <option value="composite">Composite</option>
            </select>
          </label>

          <label className="block font-semibold">
            Presence type
            <select
              value={formData.presenceType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  presenceType: e.target.value as BeaconFormData["presenceType"]
                })
              }
              className="mt-2 w-full rounded-lg border border-[#dce4dc] p-3"
            >
              <option value="agent">AI Agent</option>
              <option value="machine">Machine</option>
              <option value="swarm">Swarm</option>
              <option value="gateway">Gateway</option>
              <option value="robot">Robot</option>
              <option value="iot-system">IoT System</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>
        {formData.presenceScope === "composite" && (
          <label className="block font-semibold">
            Number of represented systems
            <input
              type="number"
              min={2}
              step={1}
              value={formData.representedSystemCount ?? 2}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  representedSystemCount: Number(e.target.value)
                })
              }
              className="mt-2 w-full rounded-lg border border-[#dce4dc] p-3"
            />
          </label>
        )}

        {formData.presenceType === "other" && (
          <label className="block font-semibold">
            Describe the presence type
            <input
              type="text"
              minLength={2}
              maxLength={80}
              value={formData.customPresenceType ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customPresenceType: e.target.value
                })
              }
              className="mt-2 w-full rounded-lg border border-[#dce4dc] p-3"
            />
          </label>
        )}
        <OptionalBeaconFields
          value={formData}
          onChange={(next) =>
            setFormData({ ...formData, ...next })
          }
          attachmentDrafts={attachmentDrafts}
          onAttachmentDraftsChange={setAttachmentDrafts}
        />
      </div>
      {!validation.valid && (
        <div className="mt-6 rounded-lg border border-[#e8c9c9] bg-[#fff8f8] p-4">
          <p className="font-semibold text-red-800">
            Complete the required Beacon information
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-red-700">
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.valid && (
        <p className="mt-6 text-sm font-semibold text-[#174b3a]">
          Beacon information is valid and ready for revision review.
        </p>
      )}
      <div className="mt-8 border-t border-[#dce4dc] pt-6">
        <h3 className="text-xl font-bold">Review Beacon changes</h3>

        <p className="mt-2 text-sm text-[#5e6e64]">
          Review your changes before signing a new Beacon revision.
          Your permanent identity and Genesis binding will not change.
        </p>

        <p className="mt-4 text-sm font-semibold">
          {changeCount} Beacon field{changeCount === 1 ? "" : "s"} changed
        </p>

        {changeCount > 0 && (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            {Object.entries(changes).map(([field, value]) => (
              <li key={field}>
                <span className="font-semibold">{field}</span>
                {value === null ? " - Remove existing information" : " - Update information"}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-6">
        <button
          type="button"
          disabled={!validation.valid || changeCount === 0}
          onClick={() => setReviewFingerprint(currentFingerprint)}
          className="button button-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Review Changes
        </button>

        {reviewCurrent && (
          <p className="mt-4 text-sm font-semibold text-[#174b3a]">
            Changes reviewed. Ready for signing authorization.
          </p>
        )}

        {reviewFingerprint !== null && !reviewCurrent && (
          <p className="mt-4 text-sm text-amber-800">
            Your Beacon information changed after review.
            Review the latest changes again before signing.
          </p>
        )}
      </div>
      </fieldset>
      {!signedRevision && reviewCurrent && (
        <div className="mt-8 rounded-xl border border-[#baccc0] p-5">
          <h3 className="text-lg font-bold">Authorize Beacon revision</h3>

          <p className="mt-2 text-sm text-[#5e6e64]">
            Enter your Control File passphrase to sign revision
            {" "}{identity.beacon.revision + 1}.
            Your passphrase is used locally and cleared after signing.
          </p>

          <label className="mt-5 block text-sm font-semibold">
            Control File passphrase
            <input
              type="password"
              autoComplete="off"
              value={signingPassphrase}
              onChange={(event) => setSigningPassphrase(event.target.value)}
              disabled={signingBusy}
              className="mt-2 w-full rounded-lg border border-[#dce4dc] p-3"
            />
          </label>

          <button
            type="button"
            disabled={signingBusy}
            onClick={handleSignRevision}
            className="button button-primary mt-5 disabled:opacity-40"
          >
            {signingBusy ? "Signing revision..." : "Sign and Save Revision"}
          </button>
        </div>
      )}

      {signingError && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {signingError}
        </p>
      )}

      {signedRevision && (
        <div className="mt-8 rounded-xl border border-[#baccc0] bg-[#eaf1e9] p-6">
          <h3 className="text-xl font-bold">Beacon revision signed</h3>

          <p className="mt-3 text-sm">
            Revision {signedRevision.beacon.revision} has been generated
            and cryptographically verified.
          </p>

          <p className="mt-3 text-sm">
            Download your new signed Beacon now. Keep your previous
            Beacon and Genesis Record for revision history.
          </p>

          <button
            type="button"
            onClick={() => downloadMotb8Artifact(signedRevision.artifact)}
            className="button button-primary mt-5"
          >
            Download Signed Revision
          </button>

          <p className="mt-4 text-xs text-[#5e6e64]">
            This revision is held only in this browser session until downloaded.
            It has not been published automatically.
          </p>
        </div>
      )}
    </section>
  );
}
